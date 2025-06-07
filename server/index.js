const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const packagesRouter = require('./routes/packages');
const bookingsRouter = require('./routes/bookings');
const contactRouter = require('./routes/contact');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/wanderwise')
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('MongoDB connection error:', error));

// Routes
app.use('/api/packages', packagesRouter);
app.use('/api/bookings', bookingsRouter);
app.use('/api/contact', contactRouter);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
