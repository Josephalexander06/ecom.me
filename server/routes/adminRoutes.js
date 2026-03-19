const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const { sendSellerStatusEmail } = require('../utils/mailer');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect, authorize('admin'));

// @desc    Admin dashboard metrics
// @route   GET /api/admin/dashboard
router.get('/dashboard', async (req, res) => {
  try {
    const [totalUsers, totalOrders, revenueResult, pendingSellers, topProducts] = await Promise.all([
      User.countDocuments(),
      Order.countDocuments(),
      Order.aggregate([{ $group: { _id: null, revenue: { $sum: '$totalAmount' } } }]),
      User.countDocuments({ sellerStatus: 'Pending' }),
      Product.find().sort({ soldCount: -1 }).limit(5).select('name soldCount price')
    ]);

    res.json({
      totalUsers,
      totalOrders,
      totalRevenue: revenueResult[0]?.revenue || 0,
      pendingSellerApprovals: pendingSellers,
      topProducts
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    List all users
// @route   GET /api/admin/users
router.get('/users', async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Block/Unblock user
// @route   PUT /api/admin/users/:id/block
router.put('/users/:id/block', async (req, res) => {
  try {
    const { blocked } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.isBlocked = Boolean(blocked);
    await user.save();

    res.json({
      message: `User ${user.isBlocked ? 'blocked' : 'unblocked'}`,
      user: { id: user._id, email: user.email, isBlocked: user.isBlocked }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    List sellers
// @route   GET /api/admin/sellers
router.get('/sellers', async (req, res) => {
  try {
    const sellers = await User.find({
      $or: [{ isSeller: true }, { sellerStatus: 'Pending' }, { role: 'seller' }]
    })
      .select('-password')
      .sort({ updatedAt: -1 });
    res.json(sellers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Update seller status (Approve/Reject)
// @route   PUT /api/admin/sellers/:id/status
// @access  Admin only
router.put('/sellers/:id/status', async (req, res) => {
  const { status } = req.body;
  
  if (!['Approved', 'Rejected'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status' });
  }

  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.sellerStatus = status;
    if (status === 'Approved') {
      user.isSeller = true;
      user.role = 'seller';
    } else {
      user.isSeller = false;
      if (!user.isAdmin) user.role = 'user';
    }

    await user.save();

    // Send Status Email
    await sendSellerStatusEmail(user.email, user.name, status);

    res.json({ 
      message: `Seller status updated to ${status}`,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        status: user.sellerStatus
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Product moderation delete
// @route   DELETE /api/admin/products/:id
router.delete('/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    await product.deleteOne();
    res.json({ message: 'Product removed by admin' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Order monitoring
// @route   GET /api/admin/orders
router.get('/orders', async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
