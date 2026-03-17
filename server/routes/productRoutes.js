const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// Advanced AI Search using MongoDB Text Index
router.get('/ai-search', async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) return res.json([]);

    // We use the $text operator for semantic-like search powered by MongoDB
    const results = await Product.find(
      { $text: { $search: query } },
      { score: { $meta: 'textScore' } }
    )
    .sort({ score: { $meta: 'textScore' } })
    .limit(5);

    res.json(results);
  } catch (err) {
    res.status(500).json({ message: 'AI Search Sync Failed', error: err.message });
  }
});

// Advanced Analytics Aggregation Pipeline
router.get('/analytics', async (req, res) => {
  try {
    const stats = await Product.aggregate([
      {
        $group: {
          _id: null,
          totalProducts: { $sum: 1 },
          totalStock: { $sum: '$stock' },
          averagePrice: { $avg: '$price' },
          totalSold: { $sum: '$soldCount' },
          categories: { $addToSet: '$category' }
        }
      },
      {
        $project: {
          _id: 0,
          totalProducts: 1,
          totalStock: 1,
          averagePrice: { $round: ['$averagePrice', 2] },
          totalSold: 1,
          categoryCount: { $size: '$categories' }
        }
      }
    ]);

    const categoryDistribution = await Product.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      summary: stats[0] || {},
      distribution: categoryDistribution
    });
  } catch (err) {
    res.status(500).json({ message: 'Analytics Sync Failed', error: err.message });
  }
});

// Get all products with filters
router.get('/', async (req, res) => {
  try {
    const { category, minPrice, maxPrice, sort } = req.query;
    let query = {};

    if (category) query.category = category;
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    let sortOptions = { createdAt: -1 };
    if (sort === 'price-low') sortOptions = { price: 1 };
    if (sort === 'price-high') sortOptions = { price: -1 };

    const products = await Product.find(query).sort(sortOptions);
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Sync Error', error: err.message });
  }
});

// Get single product
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Node not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: 'Sync Error', error: err.message });
  }
});

module.exports = router;
