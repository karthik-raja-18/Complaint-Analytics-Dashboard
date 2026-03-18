require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const dashboardRoutes = require('./routes/dashboard');
const uploadRoutes = require('./routes/upload');
const authRoutes = require('./routes/auth');
const syncRoutes = require('./routes/sync');
const authMiddleware = require('./middleware/auth');

const app = express();

app.use(cors({ origin: '*', methods: ['GET', 'POST', 'PUT', 'DELETE'], allowedHeaders: ['Content-Type', 'Authorization'] }));
app.use(express.json());

// Routes
// Public Routes (no auth required)
app.use('/api/auth', authRoutes);
app.use('/api/sync', syncRoutes); // Spring Boot posts here

// Protected Routes
app.use('/api/dashboard', authMiddleware, dashboardRoutes);
app.use('/api/upload', authMiddleware, uploadRoutes);

// GET /api/test
app.get('/api/test', (req, res) => {
  res.json({ message: "Backend is working" });
});

// Connect to MongoDB
// MongoDB Connection
if (!process.env.MONGO_URI) {
  console.error('❌ FATAL: MONGO_URI is missing from .env file!');
}

console.log('Connecting to MongoDB at:', process.env.MONGO_URI?.split('@').pop()); // log cluster only for privacy

mongoose.connect(process.env.MONGO_URI, {
  serverSelectionTimeoutMS: 5000, // fail faster (5s) so you don't wait 30s for the 500 error
})
  .then(() => {
    console.log('✅ Connected to MongoDB Atlas successfully.');
  })
  .catch(err => {
    console.error('❌ MongoDB Connection Error:', err.message);
    if (err.message.includes('whitelisted')) {
      console.error('👉 TIP: Check your MongoDB Atlas "Network Access" and add your current IP.');
    }
  });

// Auth Secret Check
if (!process.env.JWT_SECRET) {
  console.warn('⚠️ WARNING: JWT_SECRET is not set. Authentication will fail.');
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));