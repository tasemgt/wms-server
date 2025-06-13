// routes/auth.js
const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/authController');
const { authorize, protect } = require('../middleware/auth');

router.post('/register', protect, authorize('admin'), registerUser); // restrict in prod
router.post('/login', loginUser);

module.exports = router;