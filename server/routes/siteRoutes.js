const express = require('express');
const router = express.Router();
const SiteConfig = require('../models/SiteConfig');
const { protect, authorize } = require('../middleware/authMiddleware');

const defaultConfig = {
  showDealsSection: true,
  showRecommended: true,
  showCategoryPanels: true,
  showWideBanner: true,
  showBestsellers: true,
  showNewArrivals: true,
  showSellerSpotlight: true,
  showRecentlyViewed: true,
  globalAnnouncementEnabled: false,
  globalAnnouncementText: 'Welcome to ecom.me'
};

const ensureConfig = async () => {
  let doc = await SiteConfig.findOne({ key: 'global' });
  if (!doc) {
    doc = await SiteConfig.create({ key: 'global', config: defaultConfig });
  }
  return doc;
};

// Public: read site config
router.get('/', async (req, res) => {
  try {
    const doc = await ensureConfig();
    res.json(doc.config);
  } catch (error) {
    res.status(500).json({ message: 'Failed to load site config', error: error.message });
  }
});

// Admin: update site config
router.put('/', protect, authorize('admin'), async (req, res) => {
  try {
    const doc = await ensureConfig();
    doc.config = { ...doc.config.toObject(), ...req.body };
    await doc.save();
    res.json(doc.config);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update site config', error: error.message });
  }
});

module.exports = router;

