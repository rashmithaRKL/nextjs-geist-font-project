const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');

// Submit a new contact message
router.post('/', async (req, res) => {
  try {
    const contact = new Contact(req.body);
    const newContact = await contact.save();
    res.status(201).json({
      message: 'Thank you for your message. We will get back to you soon.',
      contact: newContact
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all contact messages (protected route - should be admin only)
router.get('/', async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update contact message status
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    if (!['new', 'read', 'replied'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const contact = await Contact.findById(req.params.id);
    if (!contact) {
      return res.status(404).json({ message: 'Contact message not found' });
    }

    contact.status = status;
    const updatedContact = await contact.save();
    
    res.json(updatedContact);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a contact message (admin only)
router.delete('/:id', async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
      return res.status(404).json({ message: 'Contact message not found' });
    }

    await contact.remove();
    res.json({ message: 'Contact message deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get unread contact messages count (admin only)
router.get('/unread/count', async (req, res) => {
  try {
    const count = await Contact.countDocuments({ status: 'new' });
    res.json({ count });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
