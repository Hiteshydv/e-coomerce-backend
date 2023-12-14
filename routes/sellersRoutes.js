const express = require('express');
const jwt = require('jsonwebtoken');

const { Catalog, Order, User } = require('../models/models'); // Adjust the path based on your file structure

const router = express.Router();
const JWT_SECRET = 'your_jwt_secret';

// Middleware to verify JWT
const authenticateJWT = (req, res, next) => {
  const token = req.header('Authorization') ? req.header('Authorization').split(' ')[1] : null;

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

router.post('/create-catalog', authenticateJWT, async (req, res) => {
  const sellerData = await User.findOne({ user_type: 'seller', _id: req.user.userId });

  if (!sellerData) {
    return res.status(404).json({ error: 'Seller not found' });
  }

  const catalogData = req.body;
  const catalog = new Catalog({ seller_id: sellerData._id, products: catalogData.products });
  await catalog.save();

  return res.status(201).json({ message: 'Catalog created successfully' });
});

router.get('/orders', authenticateJWT, async (req, res) => {
  const sellerData = await User.findOne({ user_type: 'seller', _id: req.user.userId });

  if (!sellerData) {
    return res.status(404).json({ error: 'Seller not found' });
  }

  const sellerOrders = await Order.find({ seller_id: sellerData._id });
  return res.status(200).json({ orders: sellerOrders });
});

module.exports = router;
