// controllers/sensorController.js
const SensorData = require('../models/SensorData');


exports.getSensorData = async (req, res) => {
  try {
    // Lấy các tham số từ query string
    const { temperature, humidity, light, gio ,createdAt} = req.query;

    // Xây dựng đối tượng filter dựa trên các tham số có sẵn
    const filter = {};
    if (temperature) {
      // Chuyển đổi thành số để phù hợp với kiểu dữ liệu trong MongoDB
      const tempValue = parseFloat(temperature);
      if (!isNaN(tempValue)) {
        filter.temperature = tempValue;
      }
    }
    if (humidity) {
      const humidityValue = parseInt(humidity);
      if (!isNaN(humidityValue)) {
        filter.humidity = humidityValue;
      }
    }
    if (light) {
      const lightValue = parseInt(light);
      if (!isNaN(lightValue)) {
        filter.light = lightValue;
      }
    }
    if (gio) {
      const gioValue = parseInt(gio);
      if (!isNaN(gioValue)) {
        filter.gio = gioValue;
      }
    }
    if (createdAt) {
      // Giả sử createdAt được truyền dưới dạng YYYY-MM-DDTHH:mm:ssZ
      const dateValue = new Date(createdAt);
      if (!isNaN(dateValue.getTime())) {
        // Tạo thời gian bắt đầu từ thời điểm đó
        const startDate = new Date(dateValue);

        // Tạo thời gian kết thúc một giây sau thời điểm đó
        const endDate = new Date(startDate);
        endDate.setSeconds(startDate.getSeconds() + 1); // Tăng giây lên 1

        filter.createdAt = {
          $gte: startDate,
          $lt: endDate
        };
      }
    }
    // Thực hiện truy vấn với filter và sắp xếp theo createdAt giảm dần
    const data = await SensorData.find(filter).sort({ createdAt: -1 });

    // Gửi dữ liệu về phía client
    res.json(data);
  } catch (error) {
    console.error('Lỗi khi lấy dữ liệu sensor:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};