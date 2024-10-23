// services/mqttService.js
const mqtt = require('mqtt');
const dotenv = require('dotenv');
const EventEmitter = require('events');

dotenv.config();

class MQTTService extends EventEmitter {
  constructor() {
    super();
    this.ioInstance = null;
    this.client = mqtt.connect({
      host: process.env.MQTT_HOST,
      port: process.env.MQTT_PORT,
      username: process.env.MQTT_USERNAME,
      password: process.env.MQTT_PASSWORD,
    });

    // Biến lưu trạng thái thiết bị hiện tại
    this.currentDeviceStatus = {
      led1: "OFF",
      fan: "OFF",
      ac: "OFF"
    };

    this.client.on('connect', () => {
      console.log('Kết nối MQTT thành công');
      // Đăng ký các topic cần thiết
      this.client.subscribe('home/sensor', (err) => {
        if (err) {
          console.error('Lỗi khi subscribe home/sensor:', err);
        }
      });
      this.client.subscribe('home/status', (err) => {
        if (err) {
          console.error('Lỗi khi subscribe home/status:', err);
        }
      });
    });

    this.client.on('message', (topic, message) => {
      try {
        const data = JSON.parse(message.toString());

        if (topic === 'home/sensor') {
          const formattedData = {
            temperature: data.temperature,
            humidity: data.humidity,
            light: data.lighting, // Đổi từ 'lighting' thành 'light'
            gio: data.gio,
            createdAt: new Date(),
          };

          // Phát dữ liệu tới frontend qua Socket.io nếu đã thiết lập
          if (this.ioInstance) {
            this.ioInstance.emit('newSensorData', formattedData);
          }

          // Phát sự kiện 'newSensorData' cho các listeners khác (như dataAggregator)
          this.emit('newSensorData', formattedData);
        } else if (topic === 'home/status') {
          // Cập nhật trạng thái thiết bị hiện tại
          this.currentDeviceStatus = {
            led1: data.led1,
            fan: data.fan,
            ac: data.ac
          };

          // Phát sự kiện tới frontend
          if (this.ioInstance) {
            this.ioInstance.emit('deviceStatusUpdate', this.currentDeviceStatus);
          }

          // Phát sự kiện 'deviceStatusUpdate' cho các listeners khác
          this.emit('deviceStatusUpdate', this.currentDeviceStatus);
        }

      } catch (e) {
        console.error('Lỗi phân tích JSON:', e);
      }
    });
  }

  setIO(io) {
    this.ioInstance = io;
    // Khi một client mới kết nối, gửi trạng thái thiết bị hiện tại
    io.on('connection', (socket) => {
      console.log('Một client đã kết nối');
      socket.emit('deviceStatusUpdate', this.currentDeviceStatus);
    });
  }

  // Hàm để lấy trạng thái thiết bị hiện tại
  getCurrentDeviceStatus() {
    return this.currentDeviceStatus;
  }
}

// Tạo một instance của MQTTService
const mqttService = new MQTTService();

module.exports = mqttService;
