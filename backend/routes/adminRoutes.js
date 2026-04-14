const express = require('express');
const router = express.Router();
const { getDashboardStats, getAllUsers, deleteUser, toggleAdminRole } = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/dashboard', protect, admin, getDashboardStats);
router.get('/users', protect, admin, getAllUsers);
router.delete('/users/:id', protect, admin, deleteUser);
router.put('/users/:id/toggle-admin', protect, admin, toggleAdminRole);

module.exports = router;
