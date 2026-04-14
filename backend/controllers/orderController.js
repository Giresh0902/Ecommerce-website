const Order = require('../models/Order');
const Product = require('../models/Product');

// @desc Create order
const createOrder = async (req, res) => {
  try {
    const { orderItems, shippingAddress, paymentMethod, itemsPrice, shippingPrice, taxPrice, totalPrice } = req.body;
    if (!orderItems || orderItems.length === 0)
      return res.status(400).json({ message: 'No order items' });

    const order = await Order.create({
      user: req.user._id, orderItems, shippingAddress,
      paymentMethod, itemsPrice, shippingPrice, taxPrice, totalPrice,
    });

    // Decrement stock
    for (const item of orderItems) {
      await Product.findByIdAndUpdate(item.product, { $inc: { stock: -item.quantity } });
    }

    res.status(201).json(order);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// @desc Get order by ID
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email');
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (order.user._id.toString() !== req.user._id.toString() && !req.user.isAdmin)
      return res.status(403).json({ message: 'Not authorized' });
    res.json(order);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// @desc Get logged in user orders
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort('-createdAt');
    res.json(orders);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// @desc Update order to paid
const updateOrderToPaid = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    order.isPaid = true;
    order.paidAt = Date.now();
    order.status = 'processing';
    order.paymentResult = {
      id: req.body.id, status: req.body.status,
      update_time: req.body.update_time, email_address: req.body.email_address,
    };
    const updated = await order.save();
    res.json(updated);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// @desc Admin: Get all orders
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).populate('user', 'name email').sort('-createdAt');
    res.json(orders);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// @desc Admin: Update order status
const updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    order.status = req.body.status;
    if (req.body.status === 'delivered') {
      order.isDelivered = true;
      order.deliveredAt = Date.now();
    }
    const updated = await order.save();
    res.json(updated);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

module.exports = { createOrder, getOrderById, getMyOrders, updateOrderToPaid, getAllOrders, updateOrderStatus };
