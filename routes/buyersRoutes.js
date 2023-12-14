const express = require('express');
const jwt = require('jsonwebtoken');

const { Catalog, Order, User } = require('../models'); // Adjust the path based on your file structure

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

router.get('/list-of-sellers', authenticateJWT, async (req, res) => {
  const sellers = await User.find({ user_type: 'seller' }, { username: 1, user_type: 1 });
  return res.status(200).json({ sellers });
});

router.get('/seller-catalog/:seller_id', authenticateJWT, async (req, res) => {
  const sellerId = req.params.seller_id;

  const catalog = await Catalog.findOne({ seller_id: sellerId });

  if (!catalog) {
    return res.status(200).json({ message: 'Seller has no catalog' });
  } else {
    return res.status(200).json({ catalog: catalog.products });
  }
});

router.post('/create-order/:seller_id', authenticateJWT, async (req, res) => {
  const buyerData = await User.findOne({ user_type: 'buyer', _id: req.user.userId });

  if (!buyerData) {
    return res.status(404).json({ error: 'Buyer not found' });
  }

  const sellerData = await User.findOne({ user_type: 'seller', _id: req.params.seller_id });

  if (!sellerData) {
    return res.status(404).json({ error: 'Seller not found' });
  }

  const catalog = await Catalog.findOne({ seller_id: req.params.seller_id });

  if (!catalog) {
    return res.status(404).json({ error: 'Seller has no catalog' });
  }

  const orderData = req.body;
  const order = new Order({ buyer_id: buyerData._id, seller_id: req.params.seller_id, products: orderData.products });
  await order.save();

  return res.status(201).json({ message: 'Order created successfully' });
});

module.exports = router;
