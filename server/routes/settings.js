const express = require('express');
const router = express.Router();
const Settings = require('../models/Settings');

router.get('/', async (req, res, next) => {
  try {
    let settings = await Settings.findById('singleton');
    if (!settings) {
      settings = await Settings.create({ _id: 'singleton' });
    }
    res.json(settings);
  } catch (err) {
    next(err);
  }
});

router.put('/', async (req, res, next) => {
  try {
    const { dsuMappings, transcriptPrompt } = req.body;
    const settings = await Settings.findByIdAndUpdate(
      'singleton',
      { $set: { dsuMappings, transcriptPrompt } },
      { upsert: true, new: true, runValidators: true }
    );
    res.json(settings);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
