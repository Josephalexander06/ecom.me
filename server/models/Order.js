const mongoose = require('mongoose');

const statusHistorySchema = new mongoose.Schema({
  stage: { 
    type: String, 
    enum: ['Order Placed', 'Neural Syncing', 'Packaging', 'Dispatched', 'Delivered'],
    default: 'Order Placed'
  },
  timestamp: { type: Date, default: Date.now }
});

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    name: String,
    price: Number,
    quantity: Number
  }],
  totalAmount: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['Order Placed', 'Neural Syncing', 'Packaging', 'Dispatched', 'Delivered'],
    default: 'Order Placed'
  },
  statusHistory: [statusHistorySchema],
  paymentMethod: { type: String, default: 'NeuralPay' }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
