const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, default: false },
  
  // Experience Preferences - Enum validated
  moodPreference: { 
    type: String, 
    enum: ['Explore', 'Gift', 'Upgrade', 'Essentials', 'Luxury'],
    default: 'Explore'
  },
  viewPreference: { 
    type: String, 
    enum: ['Editorial', '360', 'Spatial'],
    default: 'Editorial'
  },

  wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  
  recentlyViewed: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
    validate: [val => val.length <= 5, '{PATH} exceeds the limit of 5']
  }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
