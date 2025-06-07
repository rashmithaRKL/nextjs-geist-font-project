const express = require('express');
const router = express.Router();
const Package = require('../models/Package');

// Get all packages
router.get('/', async (req, res) => {
  try {
    const { type, minPrice, maxPrice, minRating } = req.query;
    
    // Build filter object
    const filter = {};
    if (type) filter.type = type;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    if (minRating) filter.rating = { $gte: Number(minRating) };

    const packages = await Package.find(filter);
    res.json(packages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a single package
router.get('/:id', async (req, res) => {
  try {
    const package = await Package.findById(req.params.id);
    if (!package) {
      return res.status(404).json({ message: 'Package not found' });
    }
    res.json(package);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new package
router.post('/', async (req, res) => {
  try {
    const package = new Package(req.body);
    const newPackage = await package.save();
    res.status(201).json(newPackage);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update a package
router.patch('/:id', async (req, res) => {
  try {
    const package = await Package.findById(req.params.id);
    if (!package) {
      return res.status(404).json({ message: 'Package not found' });
    }

    Object.keys(req.body).forEach(key => {
      package[key] = req.body[key];
    });

    const updatedPackage = await package.save();
    res.json(updatedPackage);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a package
router.delete('/:id', async (req, res) => {
  try {
    const package = await Package.findById(req.params.id);
    if (!package) {
      return res.status(404).json({ message: 'Package not found' });
    }

    await package.remove();
    res.json({ message: 'Package deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add a review to a package
router.post('/:id/reviews', async (req, res) => {
  try {
    const package = await Package.findById(req.params.id);
    if (!package) {
      return res.status(404).json({ message: 'Package not found' });
    }

    package.reviews.push(req.body);
    
    // Recalculate average rating
    const totalRating = package.reviews.reduce((sum, review) => sum + review.rating, 0);
    package.rating = totalRating / package.reviews.length;

    const updatedPackage = await package.save();
    res.status(201).json(updatedPackage);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
