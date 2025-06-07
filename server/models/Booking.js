const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
  },
  phone: {
    type: String,
    required: true,
  },
  destination: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Package',
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  duration: {
    type: String,
    required: true,
  },
  travelers: {
    type: Number,
    required: true,
    min: 1,
  },
  notes: {
    type: String,
    trim: true,
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled'],
    default: 'pending',
  },
  totalPrice: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update timestamp on save
bookingSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Calculate total price before saving
bookingSchema.pre('save', async function(next) {
  if (this.isNew || this.isModified('travelers')) {
    try {
      const Package = mongoose.model('Package');
      const package = await Package.findById(this.destination);
      if (package) {
        this.totalPrice = package.price * this.travelers;
      }
    } catch (error) {
      next(error);
    }
  }
  next();
});

module.exports = mongoose.model('Booking', bookingSchema);
