const mongoose = require('mongoose');

const statusHistorySchema = new mongoose.Schema({
  stage: { 
    type: String, 
    enum: ['pending', 'confirmed', 'packed', 'shipped', 'delivered'],
    default: 'pending'
  },
  timestamp: { type: Date, default: Date.now }
});

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    name: String,
    price: Number,
    quantity: Number,
    image: String
  }],
  shippingAddress: {
    street: String,
    city: String,
    zip: String
  },
  totalAmount: { type: Number, required: true },
  subtotalAmount: { type: Number, default: 0 },
  discountAmount: { type: Number, default: 0 },
  couponCode: { type: String },
  status: { 
    type: String, 
    enum: ['pending', 'confirmed', 'packed', 'shipped', 'delivered'],
    default: 'pending'
  },
  statusHistory: [statusHistorySchema],
  paymentMethod: { type: String, default: 'UPI' },
  shipment: {
    hubs: [{
      sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      storeName: String,
      city: String,
      pincode: String
    }],
    destination: {
      city: String,
      pincode: String
    },
    routeSummary: String,
    currentHubCity: String
  }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
