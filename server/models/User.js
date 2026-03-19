const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'seller', 'admin'], default: 'user' },
  isAdmin: { type: Boolean, default: false },
  isSeller: { type: Boolean, default: false },
  isBlocked: { type: Boolean, default: false },
  sellerStatus: { 
    type: String, 
    enum: ['None', 'Pending', 'Approved', 'Rejected'], 
    default: 'None' 
  },
  
  // Seller specific fields
  storeName: { type: String },
  bankAccount: { type: String },
  
  wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  recentlyViewed: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  
  savedAddresses: [{
    street: String,
    city: String,
    state: String,
    zipCode: String,
    isDefault: { type: Boolean, default: false }
  }]
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
