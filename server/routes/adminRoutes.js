const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { sendSellerStatusEmail } = require('../utils/mailer');

// @desc    Update seller status (Approve/Reject)
// @route   PUT /api/admin/sellers/:id/status
// @access  Admin only (Middleware simplified for demo)
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
    } else {
      user.isSeller = false;
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

module.exports = router;
