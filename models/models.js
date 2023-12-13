const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  user_type: String,
});

const catalogSchema = new mongoose.Schema({
  seller_id: String,
  products: [{
    name: String,
    price: Number,
  }],
});

const orderSchema = new mongoose.Schema({
  buyer_id: String,
  seller_id: String,
  products: [{
    name: String,
    price: Number,
  }],
});

const User = mongoose.model('User', userSchema);
const Catalog = mongoose.model('Catalog', catalogSchema);
const Order = mongoose.model('Order', orderSchema);

module.exports = { User, Catalog, Order };
