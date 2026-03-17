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
mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/complaints")
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Error connecting to MongoDB:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));