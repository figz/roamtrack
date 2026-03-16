const express = require('express');
const router = express.Router();
const Decision = require('../models/Decision');
const TicketLink = require('../models/TicketLink');

// PUT /api/decisions/:itemId
router.put('/:itemId', async (req, res, next) => {
  try {
    const item = await Decision.findByIdAndUpdate(
      req.params.itemId,
      { text: req.body.text },
      { new: true, runValidators: true }
    );
    if (!item) return res.status(404).json({ error: 'Decision not found' });
    res.json(item);
  } catch (err) {
    next(err);
  }
});

// DELETE /api/decisions/:itemId
router.delete('/:itemId', async (req, res, next) => {
  try {
    await Decision.findByIdAndDelete(req.params.itemId);
    await TicketLink.deleteMany({ itemId: req.params.itemId });
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
