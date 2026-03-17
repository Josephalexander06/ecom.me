const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  brand: { type: String, required: true },
  category: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  stock: { type: Number, required: true, default: 0 },
  images: [String],
  dominantColor: { type: String, default: '#00f2ff' },
  
  // Variants for detail page
  variants: [{
    color: String,
    size: String,
    priceDelta: { type: Number, default: 0 }
  }],
  
  // Hotspots for 360/3D view
  features: [{
    name: String,
    description: String,
    position: { x: Number, y: Number, z: Number }
  }],
  
  // Analytics & Aggregations
  averageRating: { type: Number, default: 0 },
  soldCount: { type: Number, default: 0 },
  
  // Deals
  isDeal: { type: Boolean, default: false },
  dealPrice: Number,
  dealExpiresAt: Date,

  tags: [String]
}, { timestamps: true });

// Explicit text index for futuristic AI search
productSchema.index({ 
  name: 'text', 
  brand: 'text', 
  description: 'text', 
  tags: 'text' 
});

module.exports = mongoose.model('Product', productSchema);
