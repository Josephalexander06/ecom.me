const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const { protect, authorize } = require('../middleware/authMiddleware');
const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

const VALID_STATUS = ['pending', 'confirmed', 'packed', 'shipped', 'delivered'];
const COUPONS = {
  SAVE10: 10,
  WELCOME5: 5,
  HESITATE10: 10
};
const HUB_NETWORK = [
  { city: 'Mumbai', pincode: '400001' },
  { city: 'Delhi', pincode: '110001' },
  { city: 'Bengaluru', pincode: '560001' },
  { city: 'Hyderabad', pincode: '500001' },
  { city: 'Chennai', pincode: '600001' },
  { city: 'Pune', pincode: '411001' },
  { city: 'Kolkata', pincode: '700001' },
  { city: 'Ahmedabad', pincode: '380001' }
];

const hashObjectId = (value = '') =>
  String(value)
    .split('')
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);

const pickSellerHub = (seller) => {
  const defaultAddress = seller?.savedAddresses?.find((addr) => addr?.isDefault) || seller?.savedAddresses?.[0];
  if (defaultAddress?.city) {
    return {
      city: defaultAddress.city,
      pincode: defaultAddress.zip || ''
    };
  }
  const index = hashObjectId(seller?._id) % HUB_NETWORK.length;
  return HUB_NETWORK[index];
};

// Initialize Checkout Flow
router.post('/', protect, async (req, res) => {
  try {
    const { items, paymentMethod, paymentId, shippingAddress, couponCode } = req.body;
    const userId = req.user._id;

    // Idempotency check: If paymentId is provided, check if order already exists
    if (paymentId) {
      const existingOrder = await Order.findOne({ paymentId });
      if (existingOrder) {
        return res.status(200).json({ 
          message: 'Order already exists in neural memory', 
          orderId: existingOrder._id,
          totalAmount: existingOrder.totalAmount
        });
      }
    }

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'Neural reservoir empty. Add nodes to sync.' });
    }

    let subtotalAmount = 0;
    const normalizedItems = [];

    const productIds = items.map(item => item.productId);
    const validProductIds = productIds.filter(id => mongoose.Types.ObjectId.isValid(id));
    
    if (validProductIds.length !== productIds.length) {
      return res.status(400).json({ 
        message: 'Invalid product detected in cart. Please clear your cart and try adding the item again.' 
      });
    }

    const products = await Product.find({ _id: { $in: validProductIds } });
    const productMap = new Map(products.map(p => [p._id.toString(), p]));

    for (const item of items) {
      const product = productMap.get(String(item.productId));
      if (!product) {
        throw new Error(`Product not found: ${item.productId}`);
      }

      const unitPrice = Number(item.price ?? (product.isDeal && product.dealPrice ? product.dealPrice : product.price));
      const quantity = Number(item.quantity || 1);
      
      if (product.stock < quantity) {
        throw new Error(`Insufficient stock for product: ${product.name}`);
      }

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

    const uniqueSellerIds = [...new Set(
      normalizedItems
        .map((item) => item.sellerId && item.sellerId.toString())
        .filter(Boolean)
    )];
    const sellers = uniqueSellerIds.length
      ? await User.find({ _id: { $in: uniqueSellerIds } }).select('_id storeName savedAddresses')
      : [];
    const sellerMap = new Map(sellers.map((seller) => [seller._id.toString(), seller]));
    const hubs = uniqueSellerIds.map((sellerId) => {
      const seller = sellerMap.get(sellerId);
      const hub = pickSellerHub(seller);
      return {
        sellerId,
        storeName: seller?.storeName || 'Seller Hub',
        city: hub.city,
        pincode: hub.pincode
      };
    });

    const destination = {
      city: shippingAddress?.city || 'Destination City',
      pincode: shippingAddress?.zip || ''
    };
    const routeSummary = hubs.length <= 1
      ? `${hubs[0]?.city || 'Origin Hub'} Hub -> ${destination.city}`
      : `${hubs.length} Seller Hubs -> ${destination.city}`;

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
      paymentId: paymentId || undefined,
      status: 'pending',
      statusHistory: [{ stage: 'pending' }],
      shipment: {
        hubs,
        destination,
        routeSummary,
        currentHubCity: hubs[0]?.city || destination.city
      }
    });

    const savedOrder = await newOrder.save();

    // 1.5 Auto-Save New Address to User Profile
    let updatedAddresses = [];
    if (shippingAddress && shippingAddress.street && shippingAddress.city && shippingAddress.zip) {
      const dbUser = await User.findById(userId);
      if (dbUser) {
        const addrExists = dbUser.savedAddresses.some(addr => 
          addr.street === shippingAddress.street && addr.zip === shippingAddress.zip
        );
        if (!addrExists) {
          dbUser.savedAddresses.push({
            street: shippingAddress.street,
            city: shippingAddress.city,
            zip: shippingAddress.zip,
            isDefault: dbUser.savedAddresses.length === 0
          });
          await dbUser.save();
        }
        updatedAddresses = dbUser.savedAddresses;
      }
    }

    // 2. Reduce Stock
    const bulkOps = normalizedItems.map(item => ({
      updateOne: {
        filter: { _id: item.productId },
        update: { $inc: { stock: -item.quantity, soldCount: item.quantity } }
      }
    }));
    
    if (bulkOps.length > 0) {
      await Product.bulkWrite(bulkOps);
    }

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
        couponCode: discountPct ? normalizedCoupon : null,
        updatedAddresses
    });
  } catch (err) {
    res.status(500).json({ message: 'Order Sync Failed', error: err.message });
  }
});

// Create Stripe Checkout Session
router.post('/create-stripe-session', protect, async (req, res) => {
  try {
    const { items, totalAmount, couponCode } = req.body;
    
    const normalizedCoupon = couponCode ? String(couponCode).toUpperCase().trim() : '';
    const discountPct = COUPONS[normalizedCoupon] || 0;
    const discountMultiplier = 1 - (discountPct / 100);

    const lineItems = items.map(item => ({
      price_data: {
        currency: 'inr',
        product_data: {
          name: item.name,
          images: [item.image]
        },
        unit_amount: Math.round((item.price * discountMultiplier) * 100),
      },
      quantity: item.quantity,
    }));

    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const discountedSubtotal = subtotal * discountMultiplier;
    const shipping = discountedSubtotal >= 5000 ? 0 : 499;
    const tax = discountedSubtotal * 0.18;
    const backendDerivedTotal = discountedSubtotal + shipping + tax;

    const sumOfLineItems = lineItems.reduce((acc, item) => acc + (item.price_data.unit_amount * item.quantity), 0);
    const expectedTotalPaise = Math.round(backendDerivedTotal * 100);
    const difference = expectedTotalPaise - sumOfLineItems;

    if (difference > 0) {
      lineItems.push({
        price_data: {
          currency: 'inr',
          product_data: { name: 'Taxes and Shipping' },
          unit_amount: difference
        },
        quantity: 1
      });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.CLIENT_URL}/checkout?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/checkout?canceled=true`,
      customer_email: req.user.email,
      metadata: {
        userId: req.user._id.toString()
      }
    });

    res.json({ id: session.id, url: session.url });
  } catch (err) {
    res.status(500).json({ message: 'Failed to create Stripe session', error: err.message });
  }
});

// Verify Stripe Session (Simple fallback for webhooks)
router.get('/verify-stripe-session/:sessionId', protect, async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.retrieve(req.params.sessionId, {
      expand: ['payment_intent.payment_method']
    });

    if (session.payment_status === 'paid') {
      const paymentMethod = session.payment_intent?.payment_method;
      const cardDetails = paymentMethod?.card ? {
        brand: paymentMethod.card.brand,
        last4: paymentMethod.card.last4
      } : null;

      res.json({ verified: true, session, cardDetails });
    } else {
      res.json({ verified: false });
    }
  } catch (err) {
    res.status(500).json({ message: 'Session verification failed', error: err.message });
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
