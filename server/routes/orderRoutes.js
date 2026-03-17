const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');

// Initialize Checkout Flow
router.post('/', async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { items, totalAmount, userId, paymentMethod, shippingAddress } = req.body;

    if (!items || items.length === 0) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: 'Neural reservoir empty. Add nodes to sync.' });
    }

    if (!userId) {
      await session.abortTransaction();
      session.endSession();
      return res.status(401).json({ message: 'Unauthorized: You must log in to checkout.' });
    }

    // 1. Create Order
    const newOrder = new Order({
      userId,
      items,
      shippingAddress,
      totalAmount,
      paymentMethod: paymentMethod || 'UPI',
      status: 'Order Placed',
      statusHistory: [{ stage: 'Order Placed' }]
    });

    const savedOrder = await newOrder.save({ session });

    // 2. Reduce Stock (Atomic updates with session)
    for (const item of items) {
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
        orderId: savedOrder._id 
    });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ message: 'Order Sync Failed', error: err.message });
  }
});

// Get user orders
router.get('/user/:userId', async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Fetch Failed', error: err.message });
  }
});

module.exports = router;
