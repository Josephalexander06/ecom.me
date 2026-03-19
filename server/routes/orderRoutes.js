const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');
const { protect, authorize } = require('../middleware/authMiddleware');

const VALID_STATUS = ['pending', 'confirmed', 'packed', 'shipped', 'delivered'];
const COUPONS = {
  SAVE10: 10,
  WELCOME5: 5
};

// Initialize Checkout Flow
router.post('/', protect, async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { items, paymentMethod, shippingAddress, couponCode } = req.body;
    const userId = req.user._id;

    if (!items || items.length === 0) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: 'Neural reservoir empty. Add nodes to sync.' });
    }

    let subtotalAmount = 0;
    const normalizedItems = [];

    for (const item of items) {
      const product = await Product.findById(item.productId).session(session);
      if (!product) {
        throw new Error(`Product not found: ${item.productId}`);
      }

      if (product.stock < Number(item.quantity || 0)) {
        throw new Error(`Insufficient stock for product: ${item.productId}`);
      }

      const unitPrice = Number(item.price ?? (product.isDeal && product.dealPrice ? product.dealPrice : product.price));
      const quantity = Number(item.quantity || 1);
      subtotalAmount += unitPrice * quantity;

      normalizedItems.push({
        productId: product._id,
        sellerId: product.sellerId,
        name: item.name || product.name,
        price: unitPrice,
        quantity,
        image: item.image || product.images?.[0] || ''
      });
    }

    const normalizedCoupon = couponCode ? String(couponCode).toUpperCase().trim() : '';
    const discountPct = COUPONS[normalizedCoupon] || 0;
    const discountAmount = Number(((subtotalAmount * discountPct) / 100).toFixed(2));
    const totalAmount = Number((subtotalAmount - discountAmount).toFixed(2));

    // 1. Create Order
    const newOrder = new Order({
      userId,
      items: normalizedItems,
      shippingAddress,
      totalAmount,
      subtotalAmount,
      discountAmount,
      couponCode: discountPct ? normalizedCoupon : undefined,
      paymentMethod: paymentMethod || 'UPI',
      status: 'pending',
      statusHistory: [{ stage: 'pending' }]
    });

    const savedOrder = await newOrder.save({ session });

    // 2. Reduce Stock (Atomic updates with session)
    for (const item of normalizedItems) {
      const product = await Product.findByIdAndUpdate(
        item.productId, 
        { $inc: { stock: -item.quantity, soldCount: item.quantity } },
        { session, new: true }
      );
      
      if (!product || product.stock < 0) {
        throw new Error(`Insufficient stock for product: ${item.productId}`);
      }
    }

    await session.commitTransaction();
    session.endSession();

    // 3. Broadcast to Socket.io
    if (req.app.get('io')) {
        req.app.get('io').emit('neural-activity', {
            id: Date.now(),
            message: `New Synaptic Order: ₹${totalAmount.toLocaleString('en-IN')}`,
            timestamp: new Date().toISOString()
        });
    }

    res.status(201).json({ 
        message: 'Order Transmission Successful', 
        orderId: savedOrder._id,
        totalAmount,
        subtotalAmount,
        discountAmount,
        couponCode: discountPct ? normalizedCoupon : null
    });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ message: 'Order Sync Failed', error: err.message });
  }
});

// Get user orders
router.get('/user/:userId', protect, async (req, res) => {
  try {
    if (req.user.role !== 'admin' && req.user._id.toString() !== req.params.userId) {
      return res.status(403).json({ message: 'Forbidden: cannot view other user orders' });
    }
    const orders = await Order.find({ userId: req.params.userId }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Fetch Failed', error: err.message });
  }
});

// Get seller orders (orders that contain seller's products)
router.get('/seller', protect, authorize('seller', 'admin'), async (req, res) => {
  try {
    const match = req.user.role === 'admin' ? {} : { 'items.sellerId': req.user._id };
    const orders = await Order.find(match).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Seller order fetch failed', error: err.message });
  }
});

// Update order status
router.put('/:id/status', protect, authorize('seller', 'admin'), async (req, res) => {
  try {
    const { status } = req.body;
    const nextStatus = String(status || '').toLowerCase();

    if (!VALID_STATUS.includes(nextStatus)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (req.user.role === 'seller') {
      const hasSellerItem = order.items.some(
        (item) => item.sellerId && item.sellerId.toString() === req.user._id.toString()
      );
      if (!hasSellerItem) {
        return res.status(403).json({ message: 'Forbidden: not your order item' });
      }
    }

    order.status = nextStatus;
    order.statusHistory.push({ stage: nextStatus });
    await order.save();

    res.json({ message: 'Order status updated', order });
  } catch (err) {
    res.status(500).json({ message: 'Order update failed', error: err.message });
  }
});

// Admin monitoring endpoint
router.get('/admin/all', protect, authorize('admin'), async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Order monitoring fetch failed', error: err.message });
  }
});

module.exports = router;
