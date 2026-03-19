const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'ecomme_secret_key_2035';

const getRoleFromUser = (user) => {
  if (user.isAdmin) return 'admin';
  if (user.isSeller) return 'seller';
  if (user.role) return user.role;
  return 'user';
};

const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || '';
    const [scheme, token] = authHeader.split(' ');

    if (scheme !== 'Bearer' || !token) {
      return res.status(401).json({ message: 'Unauthorized: token missing' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(401).json({ message: 'Unauthorized: user not found' });
    }

    if (user.isBlocked) {
      return res.status(403).json({ message: 'Account blocked. Please contact support.' });
    }

    req.user = {
      ...user.toObject(),
      role: getRoleFromUser(user)
    };

    return next();
  } catch (error) {
    return res.status(401).json({ message: 'Unauthorized: invalid token' });
  }
};

const authorize = (...roles) => (req, res, next) => {
  const userRole = req.user?.role;
  if (!userRole || !roles.includes(userRole)) {
    return res.status(403).json({ message: 'Forbidden: insufficient role' });
  }
  return next();
};

module.exports = {
  protect,
  authorize,
  getRoleFromUser
};
