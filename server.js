const app = require('./app');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const PORT = process.env.PORT || 4000;

// Start the server
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// ✅ Add these timeout configurations
server.keepAliveTimeout = 120000; // 120 seconds
server.headersTimeout = 120000;   // 120 seconds