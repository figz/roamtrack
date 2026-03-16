const express = require('express');
const router = express.Router();
const TicketLink = require('../models/TicketLink');
const Standup = require('../models/Standup');
const ActionItem = require('../models/ActionItem');
const Decision = require('../models/Decision');
const ytService = require('../services/youtrackService');
const Settings = require('../models/Settings');

// GET /api/youtrack/issues
router.get('/issues', async (req, res, next) => {
  try {
    const { boardId } = req.query;
    if (!boardId) return res.status(400).json({ error: 'boardId is required' });
    const issues = await ytService.getIssuesByBoard(boardId);
    res.json(issues);
  } catch (err) {
    next(err);
  }
});

// POST /api/youtrack/ticket-links (create manual link)
router.post('/ticket-links', async (req, res, next) => {
  try {
    const { itemId, itemType, ticketId } = req.body;
    if (!itemId || !itemType || !ticketId) {
      return res.status(400).json({ error: 'itemId, itemType, ticketId are required' });
    }

    // Validate ticket exists
    let ticket;
    try {
      ticket = await ytService.getIssue(ticketId);
    } catch (_) {
      return res.status(404).json({ error: `Ticket ${ticketId} not found in YouTrack` });
    }

    const link = await TicketLink.findOneAndUpdate(
      { itemId, ticketId },
      {
        itemId,
        itemType,
        ticketId,
        ticketUrl: `${process.env.YOUTRACK_BASE_URL}/issue/${ticketId}`,
        linkType: 'manual'
      },
      { upsert: true, new: true }
    );
    res.status(201).json(link);
  } catch (err) {
    next(err);
  }
});

// DELETE /api/youtrack/ticket-links/:linkId
router.delete('/ticket-links/:linkId', async (req, res, next) => {
  try {
    await TicketLink.findByIdAndDelete(req.params.linkId);
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

// POST /api/youtrack/update (post comments for standup)
router.post('/update', async (req, res, next) => {
  try {
    const { standupId } = req.body;
    const standup = await Standup.findById(standupId);
    if (!standup) return res.status(404).json({ error: 'Standup not found' });

    const actionItems = await ActionItem.find({ standupId });
    const decisions = await Decision.find({ standupId });

    const allItems = [
      ...actionItems.map(i => ({ item: i, type: 'ActionItem' })),
      ...decisions.map(i => ({ item: i, type: 'Decision' }))
    ];

    const unpostedLinks = await TicketLink.find({
      itemId: { $in: allItems.map(i => i.item._id) },
      postedAt: null
    });

    const results = [];
    for (const link of unpostedLinks) {
      const itemEntry = allItems.find(i => i.item._id.toString() === link.itemId.toString());
      if (!itemEntry) continue;

      const label = link.itemType === 'ActionItem' ? 'Action Item' : 'Decision';
      const assigneePart = link.itemType === 'ActionItem' && itemEntry.item.assignee
        ? `\nAssignee: ${itemEntry.item.assignee}` : '';
      const text = `[RoamTrack] ${label}: ${itemEntry.item.text}${assigneePart}\nSource: ${standup.eventName}, ${standup.date ? standup.date.toISOString().split('T')[0] : 'unknown date'}`;

      try {
        await ytService.postComment(link.ticketId, text);
        await TicketLink.findByIdAndUpdate(link._id, { postedAt: new Date() });
        results.push({ ticketId: link.ticketId, success: true });
      } catch (err) {
        results.push({ ticketId: link.ticketId, success: false, error: err.message });
      }
    }

    await Standup.findByIdAndUpdate(standupId, { status: 'updated' });

    res.json({ updated: results.length, results });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
