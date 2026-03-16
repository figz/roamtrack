const express = require('express');
const router = express.Router();
const ActionItem = require('../models/ActionItem');
const TicketLink = require('../models/TicketLink');

// PUT /api/action-items/:itemId
router.put('/:itemId', async (req, res, next) => {
  try {
    const item = await ActionItem.findByIdAndUpdate(
      req.params.itemId,
      { text: req.body.text, assignee: req.body.assignee },
      { new: true, runValidators: true }
    );
    if (!item) return res.status(404).json({ error: 'Action item not found' });
    res.json(item);
  } catch (err) {
    next(err);
  }
});

// DELETE /api/action-items/:itemId
router.delete('/:itemId', async (req, res, next) => {
  try {
    await ActionItem.findByIdAndDelete(req.params.itemId);
    await TicketLink.deleteMany({ itemId: req.params.itemId });
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
