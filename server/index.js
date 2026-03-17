const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require('cookie-parser');

dotenv.config();

const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true
  }
});

app.set('io', io);

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));

// Socket.io Real-time Logic
io.on('connection', (socket) => {
  console.log('Neural Link Established:', socket.id);
  
  socket.on('disconnect', () => {
    console.log('Neural Link Decoupled:', socket.id);
  });
});

// Simulation: Live Neural Activity (Broadcast every 10s)
setInterval(() => {
  const activities = [
    'Neural sync from Neo-Tokyo node',
    'Cognitive expansion packet received',
    'Inventory shift in Sector-4',
    'Uplink verification successful'
  ];
  const activity = activities[Math.floor(Math.random() * activities.length)];
  io.emit('neural-activity', {
    id: Date.now(),
    message: activity,
    timestamp: new Date().toISOString()
  });
}, 10000);

// Routes
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');

app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

// Basic Route
app.get('/', (req, res) => {
  res.json({ message: 'AETHER Neural-API Active' });
});

const PORT = process.env.PORT || 5000;

// Database Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to AETHER Neural-Core (MongoDB)'))
  .catch((err) => console.error('Connection Error:', err));

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
