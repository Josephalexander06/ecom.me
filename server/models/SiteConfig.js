const mongoose = require('mongoose');

const siteConfigSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true, default: 'global' },
    config: {
      showDealsSection: { type: Boolean, default: true },
      showRecommended: { type: Boolean, default: true },
      showCategoryPanels: { type: Boolean, default: true },
      showWideBanner: { type: Boolean, default: true },
      showBestsellers: { type: Boolean, default: true },
      showNewArrivals: { type: Boolean, default: true },
      showSellerSpotlight: { type: Boolean, default: true },
      showRecentlyViewed: { type: Boolean, default: true },
      globalAnnouncementEnabled: { type: Boolean, default: false },
      globalAnnouncementText: { type: String, default: 'Welcome to ecom.me' },
      freeShippingThreshold: { type: Number, default: 5000 },
      defaultShippingCharge: { type: Number, default: 499 }
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('SiteConfig', siteConfigSchema);

