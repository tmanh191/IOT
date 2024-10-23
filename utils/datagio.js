
// const Gio = require('../models/gio'); // Thêm mô hình Gio

// let latestData = null;

// const startDataAggregation = (mqttService) => {
//   // Lắng nghe sự kiện 'newSensorData'
//   mqttService.on('newSensorData', async (data) => {
//     latestData = data;

//     // Kiểm tra gio và lưu thời gian vào bảng Gio khi gió > 60
//     if (latestData.gio > 60) {
//       const gioDataToSave = {
//         createdAt: new Date(), // Lưu thời gian hiện tại
//       };
//       try {
//         await Gio.create(gioDataToSave);
//        // console.log('Thời gian gió > 60 đã được lưu vào MongoDB:', gioDataToSave);
//       } catch (error) {
//         console.error('Lỗi khi lưu thời gian gió vào MongoDB:', error);
//       }
//     }
//   });

  
// };

// // Hàm để lấy số lần gió > 60 từ MongoDB
// const getGioCount = async (req, res) => {
//   try {
//     // Đếm số bản ghi trong bảng Gio
//     const gioCount = await Gio.countDocuments();
//     res.json({ count: gioCount });
//   } catch (error) {
//     res.status(500).json({ message: 'Lỗi khi lấy dữ liệu gió', error });
//   }
// };


// module.exports = { startDataAggregation, getGioCount };

