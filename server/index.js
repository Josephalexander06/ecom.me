const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const isProduction = process.env.NODE_ENV === 'production';
const allowedOrigins = (process.env.CLIENT_URL || 'http://localhost:5173')
  .split(',')
  .map((origin) => origin.trim())
  .map((origin) => origin.replace(/\/+$/, ''))
  .filter(Boolean);

const wildcardToRegex = (pattern) => {
  const escaped = pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(`^${escaped.replace(/\\\*/g, '.*')}$`);
};

const allowedOriginRegexes = allowedOrigins
  .filter((origin) => origin.includes('*'))
  .map(wildcardToRegex);

const allowedOriginExact = allowedOrigins.filter((origin) => !origin.includes('*'));

const isAllowedOrigin = (origin = '') => {
  const normalizedOrigin = origin.replace(/\/+$/, '');
  return (
    allowedOriginExact.includes(normalizedOrigin) ||
    allowedOriginRegexes.some((regex) => regex.test(normalizedOrigin)) ||
    /^https?:\/\/localhost:\d+$/.test(normalizedOrigin) ||
    /^https?:\/\/127\.0\.0\.1:\d+$/.test(normalizedOrigin)
  );
};

const corsOptions = {
  origin: (origin, callback) => {
    if (!isProduction) {
      return callback(null, true);
    }
    if (!origin || isAllowedOrigin(origin)) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true
};

const io = new Server(server, {
  cors: corsOptions
});

app.set('io', io);

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));

// Socket.io Real-time Logic
io.on('connection', (socket) => {
  console.log('ecom.me User Connection:', socket.id);
  
  socket.on('disconnect', () => {
    console.log('ecom.me User Disconnected:', socket.id);
  });
});

// Broadcast trending activity
setInterval(() => {
  const activities = [
    'New order for Wireless Headphones',
    'Someone in New York just joined as a Seller',
    'Flash Deal starting in 5 minutes',
    'Premium Member discount active'
  ];
  const activity = activities[Math.floor(Math.random() * activities.length)];
  io.emit('activity-stream', {
    id: Date.now(),
    message: activity,
    timestamp: new Date().toISOString()
  });
}, 10000);

// Routes
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const siteRoutes = require('./routes/siteRoutes');

app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/site-config', siteRoutes);
app.get('/api/health', (req, res) => {
  res.json({ ok: true, service: 'ecom.me-api', time: new Date().toISOString() });
});

// Basic Route
app.get('/', (req, res) => {
  res.json({ message: 'ecom.me API Core Active' });
});

const PORT = process.env.PORT || 5000;

// Database Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to ecom.me Core (MongoDB)'))
  .catch((err) => console.error('Connection Error:', err));

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
