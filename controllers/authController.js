// controllers/authController.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

exports.registerUser = async (req, res) => {
  const { name, email, phone, password, role } = req.body;

  if (!['admin', 'bouncer'].includes(role)) {
    return res.status(400).json({ error: 'Invalid role' });
  }

  try {
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ error: 'Email already exists' });

    const user = await User.create({ name, email, phone, password, role });
    res.status(201).json({ message: 'User created', user: { id: user._id, name: user.name, role: user.role } });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = generateToken(user);

    // POST /api/login
    res.cookie("token", token, {
      httpOnly: true,
      secure: true, //process.env.NODE_ENV === "production",
      sameSite: 'none', // or "strict"
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    })

    
    res.json({ token, user: { id: user._id, name: user.name, role: user.role } }); 

  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};