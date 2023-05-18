const { Router } = require('express');
const router = Router();
const Administration = require('../models/administration.js');

// Get all records
router.get('/', async (req, res) => {
  try {
    const records = await Administration.find().limit(50).exec();
    res.send(records);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Create a new record
router.post('/', async (req, res) => {
  try {
    const record = Administration.create(req.body);
    res.send(record);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Get record By ID
router.get('/:id', async (req, res) => {
  try {
    const record = await Administration.findById(req.params.id);
    res.send(record);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Update record By ID
router.put('/:id', async (req, res) => {
  try {
    const record = await Administration.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.send(record);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Delete record By ID
router.delete('/:id', async (req, res) => {
  try {
    const record = await Administration.findByIdAndDelete(req.params.id);
    res.send(record);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = router;
