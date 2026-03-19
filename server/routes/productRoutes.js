const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { protect, authorize } = require('../middleware/authMiddleware');

// Create product (seller flow)
router.post('/', protect, authorize('seller', 'admin'), async (req, res) => {
  try {
    const {
      name,
      brand,
      category,
      description,
      price,
      stock,
      images,
      tags,
      variants,
      features,
      isDeal,
      dealPrice,
      dealExpiresAt
    } = req.body;

    if (!name || !brand || !category || !description || price === undefined) {
      return res.status(400).json({ message: 'Missing required product fields' });
    }

    const product = await Product.create({
      sellerId: req.user._id,
      name,
      brand,
      category,
      description,
      price: Number(price),
      stock: Number(stock || 0),
      images: Array.isArray(images) ? images : [],
      tags: Array.isArray(tags) ? tags : [],
      variants: Array.isArray(variants) ? variants : [],
      features: Array.isArray(features) ? features : [],
      isDeal: Boolean(isDeal),
      dealPrice: dealPrice !== undefined && dealPrice !== '' ? Number(dealPrice) : undefined,
      dealExpiresAt: dealExpiresAt || undefined
    });

    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ message: 'Product creation failed', error: err.message });
  }
});

// Update product (seller/admin flow)
router.put('/:id', protect, authorize('seller', 'admin'), async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const isOwner = product.sellerId && product.sellerId.toString() === req.user._id.toString();
    if (req.user.role === 'seller' && !isOwner) {
      return res.status(403).json({ message: 'Forbidden: cannot edit another seller product' });
    }

    const updatableFields = [
      'name',
      'brand',
      'category',
      'description',
      'price',
      'stock',
      'images',
      'tags',
      'variants',
      'features',
      'isDeal',
      'dealPrice',
      'dealExpiresAt'
    ];

    updatableFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        product[field] = req.body[field];
      }
    });

    await product.save();
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: 'Product update failed', error: err.message });
  }
});

// Delete product (seller/admin flow)
router.delete('/:id', protect, authorize('seller', 'admin'), async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const isOwner = product.sellerId && product.sellerId.toString() === req.user._id.toString();
    if (req.user.role === 'seller' && !isOwner) {
      return res.status(403).json({ message: 'Forbidden: cannot delete another seller product' });
    }

    await product.deleteOne();
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Product deletion failed', error: err.message });
  }
});

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

// Get all products with filters and facet counts
router.get('/', async (req, res) => {
  try {
    const { category, brand, minPrice, maxPrice, sort, query: searchQuery } = req.query;
    
    // Build Match Stage
    let matchStage = {};
    if (category && category !== 'All') matchStage.category = category;
    if (brand && brand !== 'All') matchStage.brand = brand;
    if (minPrice || maxPrice) {
      matchStage.price = {};
      if (minPrice) matchStage.price.$gte = Number(minPrice);
      if (maxPrice) matchStage.price.$lte = Number(maxPrice);
    }
    if (searchQuery) {
      matchStage.$or = [
        { name: { $regex: searchQuery, $options: 'i' } },
        { brand: { $regex: searchQuery, $options: 'i' } },
        { category: { $regex: searchQuery, $options: 'i' } }
      ];
    }

    // Build Sort Stage
    let sortStage = { createdAt: -1 };
    if (sort === 'price-low') sortStage = { price: 1 };
    if (sort === 'price-high') sortStage = { price: -1 };
    if (sort === 'rating') sortStage = { averageRating: -1 };

    const results = await Product.aggregate([
      { $match: matchStage },
      {
        $facet: {
          products: [
            { $sort: sortStage },
            { $limit: 50 } // Limit for results
          ],
          categories: [
             { $group: { _id: '$category', count: { $sum: 1 } } }
          ],
          brands: [
             { $group: { _id: '$brand', count: { $sum: 1 } } }
          ],
          stats: [
            {
              $group: {
                _id: null,
                min: { $min: '$price' },
                max: { $max: '$price' },
                avg: { $avg: '$price' }
              }
            }
          ]
        }
      }
    ]);

    const finalResult = {
      products: results[0].products,
      facets: {
        categories: results[0].categories,
        brands: results[0].brands,
        priceRange: results[0].stats[0] || { min: 0, max: 0 }
      }
    };

    res.json(finalResult);
  } catch (err) {
    res.status(500).json({ message: 'Aggregation Failed', error: err.message });
  }
});

// Get products for logged-in seller
router.get('/seller/my-products', protect, authorize('seller', 'admin'), async (req, res) => {
  try {
    const match = req.user.role === 'admin' ? {} : { sellerId: req.user._id };
    const products = await Product.find(match).sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Seller products fetch failed', error: err.message });
  }
});

// Get single product (with view increment and smart pricing)
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    
    // Increment views
    product.views = (product.views || 0) + 1;

    // Smart Pricing Engine (Simple Rule-based)
    // 1. Demand Spike: views > 100 and low stock -> +5% price
    if (product.views > 100 && product.stock < 10 && product.stock > 0) {
       // We don't save the price change to DB permanently here for MVP, 
       // but we send the 'dynamic' price to frontend
       product.price = Math.round(product.price * 1.05);
       if (product.dealPrice) product.dealPrice = Math.round(product.dealPrice * 1.05);
    }
    
    // 2. Slow Mover: views < 20 and plenty of stock -> -10% price
    // (Only if it's not already a deal)
    if (product.views < 20 && product.stock > 50 && !product.isDeal) {
       product.price = Math.round(product.price * 0.90);
    }

    await product.save();
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: 'Sync Error', error: err.message });
  }
});

// Add review and update rating aggregate
router.post('/:id/reviews', protect, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const ratingValue = Number(rating);

    if (!ratingValue || ratingValue < 1 || ratingValue > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const existingReview = product.reviews.find(
      (review) => review.userId.toString() === req.user._id.toString()
    );

    if (existingReview) {
      existingReview.rating = ratingValue;
      existingReview.comment = comment || '';
      existingReview.createdAt = new Date();
    } else {
      product.reviews.push({
        userId: req.user._id,
        name: req.user.name,
        rating: ratingValue,
        comment: comment || ''
      });
    }

    product.reviewCount = product.reviews.length;
    product.averageRating =
      product.reviews.reduce((sum, review) => sum + review.rating, 0) /
      (product.reviewCount || 1);

    await product.save();
    res.status(201).json({ message: 'Review saved', averageRating: product.averageRating });
  } catch (err) {
    res.status(500).json({ message: 'Review save failed', error: err.message });
  }
});

module.exports = router;
