const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });

// @desc Register user
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ message: 'Please fill all fields' });

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'User already exists' });

    const user = await User.create({ name, email, password });
    res.status(201).json({
      _id: user._id, name: user.name, email: user.email,
      isAdmin: user.isAdmin, token: generateToken(user._id),
    });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// @desc Login user
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user && await user.matchPassword(password)) {
      res.json({
        _id: user._id, name: user.name, email: user.email,
        isAdmin: user.isAdmin, token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// @desc Get profile
const getProfile = async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');
  if (user) res.json(user);
  else res.status(404).json({ message: 'User not found' });
};

// @desc Update profile
const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    if (req.body.address) user.address = { ...user.address, ...req.body.address };
    if (req.body.password) user.password = req.body.password;
    const updated = await user.save();
    res.json({
      _id: updated._id, name: updated.name, email: updated.email,
      isAdmin: updated.isAdmin, token: generateToken(updated._id),
    });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

module.exports = { registerUser, loginUser, getProfile, updateProfile };
