const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, default: false },
  isSeller: { type: Boolean, default: false },
  sellerStatus: { 
    type: String, 
    enum: ['None', 'Pending', 'Approved', 'Rejected'], 
    default: 'None' 
  },
  
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
