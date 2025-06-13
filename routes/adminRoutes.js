const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  getAllGuests,
  approveGuest,
  rejectGuest,
  getAllUsers,
  getUserById
} = require('../controllers/adminController');

const { protect, authorize } = require('../middleware/auth');

// Basic dashboard and guest control routes
router.get('/dashboard', protect, authorize('admin'), getDashboardStats);
router.get('/guests', protect, authorize('admin'), getAllGuests);
router.post('/guests/:guestId/approve', protect, authorize('admin'), approveGuest);
router.get('/users', protect, authorize('admin'), getAllUsers);
router.get('/users/:id', protect, authorize('admin'), getUserById);

// router.post('/guests/:guestId/reject', rejectGuest);

module.exports = router;
// This file defines the admin routes for the Wedding Management System.