const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');

// @desc Get dashboard stats
const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();
    const revenueResult = await Order.aggregate([
      { $match: { isPaid: true } },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } },
    ]);
    const revenue = revenueResult[0]?.total || 0;

    const recentOrders = await Order.find({})
      .populate('user', 'name email').sort('-createdAt').limit(5);

    const monthlySales = await Order.aggregate([
      { $match: { isPaid: true } },
      {
        $group: {
          _id: { month: { $month: '$createdAt' }, year: { $year: '$createdAt' } },
          sales: { $sum: '$totalPrice' }, count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
      { $limit: 12 },
    ]);

    res.json({ totalUsers, totalProducts, totalOrders, revenue, recentOrders, monthlySales });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// @desc Get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password').sort('-createdAt');
    res.json(users);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// @desc Delete user
const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (user) res.json({ message: 'User removed' });
    else res.status(404).json({ message: 'User not found' });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// @desc Toggle admin role
const toggleAdminRole = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    user.isAdmin = !user.isAdmin;
    await user.save();
    res.json({ message: `User is now ${user.isAdmin ? 'admin' : 'regular user'}` });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

module.exports = { getDashboardStats, getAllUsers, deleteUser, toggleAdminRole };
