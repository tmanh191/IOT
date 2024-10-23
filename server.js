// server.js
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cors = require('cors'); // Import cors

// Load biến môi trường
dotenv.config();

// Khởi tạo ứng dụng Express
const app = express();

// Cấu hình CORS
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'], // Cho phép cả hai origin
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware để parse JSON
app.use(express.json());

// Phục vụ các file tĩnh
app.use(express.static(path.join(__dirname, 'public')));

// Tạo HTTP server
const server = http.createServer(app);

// Khởi tạo Socket.io với CORS đã cấu hình
const io = socketIo(server, {
  cors: {
    origin: "*", // Bạn có thể thay đổi theo nhu cầu bảo mật
    methods: ["GET", "POST"]
  }
});

// Kết nối tới MongoDB
connectDB();

// Import các routes
const statusRoutes = require('./routes/statusRoutes');
const sensorRoutes = require('./routes/sensorRoutes');
const controlRoutes = require('./routes/controlRoutes');
const actionRoutes = require('./routes/actionRoutes');



// Sử dụng các routes
app.use('/api/status-data', statusRoutes);  // Cập nhật status cho các device ở index.html
app.use('/api/sensor-data', sensorRoutes); // lấy dữ liệu cảm biến
app.use('/api/control', controlRoutes); // Gửi post api gửi cho hardware điều kiển thiết bị
app.use('/api/action',actionRoutes); // Lấy dữ liệu trạng thái của thiết bị


// Import router cho gio
const gioRoutes = require('./routes/gioRoutes');
// Sử dụng router cho gio
app.use('/api/gio', gioRoutes);

// Import và cấu hình MQTT Service
const mqttService = require('./services/mqttService');
mqttService.setIO(io);

// Khởi chạy Data Aggregation
const { startDataAggregation } = require('./utils/dataAggregator');
const ActionData = require('./models/ActionData');


startDataAggregation(mqttService);

// Bắt đầu server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server đang chạy trên cổng ${PORT}`);
});
