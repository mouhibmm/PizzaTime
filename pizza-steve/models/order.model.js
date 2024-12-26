const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true },
  method: { type: String, required: true },
  size: { type: String, required: true },
  crust: { type: String, required: true },
  quantity: { type: Number, required: true },
  toppings: { type: [String], required: true },
  price: { type: Number, required: true }
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;