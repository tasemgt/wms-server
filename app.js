const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const adminRoutes = require('./routes/adminRoutes');
const guestRoutes = require('./routes/guestRoutes');
const authRoutes = require('./routes/authRoutes');
const bouncerRoutes = require('./routes/bouncerRoutes');
const giftItemRoutes = require('./routes/giftItemRoutes');


const app = express();
app.use(cors({
  origin: process.env.FRONT_END_URL, // allow requests from the frontend URL
  credentials: true,                // allow cookies and credentials
}));
app.use(express.json());
app.use(cookieParser());


app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/guests', guestRoutes);
app.use('/api/bouncer', bouncerRoutes);
app.use('/api/giftitem', giftItemRoutes);

app.get('/', (req, res) => {
  res.send('Wedding Management System is here!');
});

module.exports = app;
