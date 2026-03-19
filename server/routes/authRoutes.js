const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Product = require('../models/Product');
const { protect, getRoleFromUser } = require('../middleware/authMiddleware');

const JWT_SECRET = process.env.JWT_SECRET || 'ecomme_secret_key_2035';
const signToken = (user) =>
  jwt.sign({ id: user._id, role: getRoleFromUser(user) }, JWT_SECRET, { expiresIn: '30d' });

const buildAuthPayload = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  role: getRoleFromUser(user),
  isAdmin: user.isAdmin,
  isSeller: user.isSeller,
  sellerStatus: user.sellerStatus,
  storeName: user.storeName,
  isBlocked: user.isBlocked,
  savedAddresses: user.savedAddresses || [],
  wishlist: user.wishlist || []
});

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: 'user'
    });

    if (user) {
      const token = signToken(user);
      
      res.status(201).json({ ...buildAuthPayload(user), token });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (user?.isBlocked) {
      return res.status(403).json({ message: 'Account blocked. Please contact support.' });
    }

    if (user && (await bcrypt.compare(password, user.password))) {
      const token = signToken(user);
      res.json({ ...buildAuthPayload(user), token });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
router.get('/me', protect, async (req, res) => {
  res.json(req.user);
});

// @desc    Logout user (JWT invalidation handled client-side)
// @route   POST /api/auth/logout
// @access  Private
router.post('/logout', protect, async (req, res) => {
  res.json({ message: 'Logged out successfully' });
});

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
router.put('/profile', protect, async (req, res) => {
  try {
    const { name, email, password, savedAddresses } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (name) user.name = name;
    if (email) user.email = email.toLowerCase().trim();
    if (Array.isArray(savedAddresses)) user.savedAddresses = savedAddresses;
    if (password) {
      user.password = await bcrypt.hash(password, 10);
    }

    await user.save();
    res.json(buildAuthPayload(user));
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// @desc    Upgrade User to Seller
// @route   POST /api/auth/upgrade-to-seller
// @access  Private
router.post('/upgrade-to-seller', protect, async (req, res) => {
  try {
    const { storeName, bankAccount } = req.body;

    if (!storeName || !bankAccount) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      {
        isSeller: false,
        role: 'user',
        sellerStatus: 'Pending',
        storeName,
        bankAccount
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      ...buildAuthPayload(updatedUser),
      message: 'Seller application submitted for admin approval'
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// @desc    Get wishlist
// @route   GET /api/auth/wishlist
// @access  Private
router.get('/wishlist', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('wishlist');
    res.json(user?.wishlist || []);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// @desc    Toggle wishlist item
// @route   POST /api/auth/wishlist/:productId
// @access  Private
router.post('/wishlist/:productId', protect, async (req, res) => {
  try {
    const { productId } = req.params;
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const user = await User.findById(req.user._id);
    const exists = user.wishlist.some((id) => id.toString() === productId);

    if (exists) {
      user.wishlist = user.wishlist.filter((id) => id.toString() !== productId);
    } else {
      user.wishlist.push(productId);
    }

    await user.save();
    res.json({
      message: exists ? 'Removed from wishlist' : 'Added to wishlist',
      wishlist: user.wishlist
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

module.exports = router;
