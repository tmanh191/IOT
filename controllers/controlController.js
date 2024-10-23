// controllers/controlController.js
const mqttService = require('../services/mqttService');
const ActionData = require('../models/ActionData'); // Thêm dòng này

exports.controlDevice = async (req, res) => {
  const { device, action } = req.body;

  let topic = '';
  let message = '';

  // Xác định topic và message dựa trên thiết bị và hành động
  switch (device) {
    case 'quạt':
      topic = 'home/fan';
      message = action === 'on' ? 'ON' : 'OFF';
      break;
    case 'điều hòa':
      topic = 'home/ac';
      message = action === 'on' ? 'ON' : 'OFF';
      break;
    case 'đèn':
      topic = 'home/led1';
      message = action === 'on' ? 'ON' : 'OFF';
      break;
    case 'đèn cảnh báo':
      topic = 'home/all';
      message = action === 'on' ? 'ON' : 'OFF';
      break;
    default:
      return res.status(400).json({ message: 'Thiết bị không hợp lệ' });
  }

  // Gửi lệnh tới MQTT broker sử dụng MQTT client đã kết nối
  mqttService.client.publish(topic, message, { qos: 1 }, (err) => {
    if (err) {
      console.error('Lỗi khi gửi lệnh MQTT:', err);
      return res.status(500).json({ message: 'Lỗi khi gửi lệnh đến MQTT' });
    }

    console.log(`Đã gửi lệnh tới ${topic}: ${message}`);
    res.json({ message: `${device} đã được ${action === 'on' ? 'bật' : 'tắt'}` });
  });
  const actionData = new ActionData({
    device,   // Sử dụng đúng tên biến
    status: action,
    // 'time' sẽ tự động được đặt bởi default trong schema
  });
  await actionData.save();
};

// controllers/ActionData.js

exports.getActionData = async (req, res) => {
  try {
    //Lấy các tham số từ query string
    const { device, status, time } = req.query;
    //Xây dựng qua filter
    const filter = {};
    if (device) {
      filter.device = device;
    }
    if (status) {
      filter.status = status;
    }
    if (time) {
      // Giả sử time được truyền dưới dạng YYYY-MM-DDTHH:mm:ssZ
      const dateValue = new Date(time);
      if (!isNaN(dateValue.getTime())) {
        // Tạo thời gian bắt đầu từ thời điểm đó
        const startDate = new Date(dateValue);

        // Tạo thời gian kết thúc một giây sau thời điểm đó
        const endDate = new Date(startDate);
        endDate.setSeconds(startDate.getSeconds() + 1); // Tăng giây lên 1

        filter.time = {
          $gte: startDate,
          $lt: endDate
        };
      }
    }
    // Fetch the latest 100 sensor data entries
    const data = await ActionData.find(filter).sort({ createdAt: -1 });
  
    res.json(data);
  } catch (error) {
    console.error('Lỗi khi lấy dữ liệu ensor:', error);
    res.status(500).json({ message: 'Lỗi khsi lấy dữ liệu sensor' });
  }
};

