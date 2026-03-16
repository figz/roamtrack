const express = require('express');
const router = express.Router();
const Standup = require('../models/Standup');
const ActionItem = require('../models/ActionItem');
const Decision = require('../models/Decision');
const TicketLink = require('../models/TicketLink');
const Settings = require('../models/Settings');
const roamService = require('../services/roamService');

const TICKET_PATTERN = /\b[A-Za-z]{2,10}-\d+\b/g;

async function autoLinkTickets(itemId, itemType, text) {
  const rawMatches = (text || '').match(TICKET_PATTERN) || [];
  const matches = rawMatches.map(m => m.toUpperCase());
  for (const ticketId of matches) {
    await TicketLink.findOneAndUpdate(
      { itemId, ticketId },
      { $set: { itemId, itemType, ticketId, linkType: 'auto' } },
      { upsert: true, new: true }
    );
  }
  if (matches.length > 0 && itemType === 'ActionItem') {
    await ActionItem.findByIdAndUpdate(itemId, { autoMatched: true });
  }
  return matches;
}

// GET /api/standups/debug — shows raw Roam API response for troubleshooting
router.get('/debug', async (req, res, next) => {
  try {
    let settings = await Settings.findById('singleton');
    const dsuNames = (settings?.dsuMappings || []).map(m => m.name);
    const transcripts = await roamService.listTodayTranscripts();
    const filtered = roamService.filterByDsuNames(transcripts, dsuNames);
    res.json({
      configuredDsuNames: dsuNames,
      totalTranscriptsFromRoam: transcripts.length,
      matchedTranscripts: filtered.length,
      transcripts: transcripts.map(t => ({
        id: t.id,
        eventName: t.eventName,
        start: t.start,
        participants: t.participants
      }))
    });
  } catch (err) {
    res.status(500).json({ error: err.message, stack: err.stack });
  }
});

// POST /api/standups/sync
router.post('/sync', async (req, res, next) => {
  try {
    let settings = await Settings.findById('singleton');
    if (!settings) settings = await Settings.create({ _id: 'singleton' });

    const dsuNames = (settings.dsuMappings || []).map(m => m.name);
    console.log('[sync] configured DSU names:', dsuNames);
    const transcripts = await roamService.listTodayTranscripts();
    console.log('[sync] transcripts from Roam:', transcripts.length, transcripts.map(t => t.eventName));
    const filtered = roamService.filterByDsuNames(transcripts, dsuNames);
    console.log('[sync] matched:', filtered.length);

    const upserted = [];
    for (const t of filtered) {
      const standup = await Standup.findOneAndUpdate(
        { roamTranscriptId: t.id },
        {
          roamTranscriptId: t.id,
          meetingId: t.meetingId,
          eventName: t.eventName,
          date: t.start ? new Date(t.start) : new Date(),
          participants: t.participants || []
        },
        { upsert: true, new: true, runValidators: true }
      );
      upserted.push(standup);
    }

    res.json({ synced: upserted.length, standups: upserted });
  } catch (err) {
    next(err);
  }
});

// GET /api/standups
router.get('/', async (req, res, next) => {
  try {
    const standups = await Standup.find().sort({ date: -1 });
    res.json(standups);
  } catch (err) {
    next(err);
  }
});

// GET /api/standups/:id
router.get('/:id', async (req, res, next) => {
  try {
    const standup = await Standup.findById(req.params.id);
    if (!standup) return res.status(404).json({ error: 'Standup not found' });

    const actionItems = await ActionItem.find({ standupId: req.params.id });
    const decisions = await Decision.find({ standupId: req.params.id });

    const allItemIds = [...actionItems, ...decisions].map(i => i._id);
    const ticketLinks = await TicketLink.find({ itemId: { $in: allItemIds } });

    res.json({ standup, actionItems, decisions, ticketLinks });
  } catch (err) {
    next(err);
  }
});

// POST /api/standups/:id/pull
router.post('/:id/pull', async (req, res, next) => {
  try {
    const standup = await Standup.findById(req.params.id);
    if (!standup) return res.status(404).json({ error: 'Standup not found' });

    let settings = await Settings.findById('singleton');
    if (!settings) settings = await Settings.create({ _id: 'singleton' });

    const { actionItems: aiItems, decisions: decItems } = await roamService.extractItems(
      standup.roamTranscriptId,
      settings.transcriptPrompt
    );

    // Clear existing roam-sourced items and their links
    const oldItems = await ActionItem.find({ standupId: standup._id, source: 'roam' });
    const oldDecisions = await Decision.find({ standupId: standup._id, source: 'roam' });
    const oldIds = [...oldItems, ...oldDecisions].map(i => i._id);
    if (oldIds.length) await TicketLink.deleteMany({ itemId: { $in: oldIds } });
    await ActionItem.deleteMany({ standupId: standup._id, source: 'roam' });
    await Decision.deleteMany({ standupId: standup._id, source: 'roam' });

    const createdActionItems = [];
    const createdDecisions = [];

    for (const ai of aiItems) {
      const item = await ActionItem.create({
        standupId: standup._id,
        text: ai.text || '',
        assignee: ai.assignee || '',
        source: 'roam'
      });
      await autoLinkTickets(item._id, 'ActionItem', item.text);
      createdActionItems.push(item);
    }

    for (const d of decItems) {
      const item = await Decision.create({
        standupId: standup._id,
        text: d.text || '',
        source: 'roam'
      });
      await autoLinkTickets(item._id, 'Decision', item.text);
      createdDecisions.push(item);
    }

    await Standup.findByIdAndUpdate(standup._id, { status: 'pulled', pulledAt: new Date() });

    res.json({ actionItems: createdActionItems, decisions: createdDecisions });
  } catch (err) {
    next(err);
  }
});

// GET /api/standups/:id/action-items
router.get('/:id/action-items', async (req, res, next) => {
  try {
    const items = await ActionItem.find({ standupId: req.params.id });
    res.json(items);
  } catch (err) {
    next(err);
  }
});

// POST /api/standups/:id/action-items
router.post('/:id/action-items', async (req, res, next) => {
  try {
    const item = await ActionItem.create({
      standupId: req.params.id,
      text: req.body.text,
      assignee: req.body.assignee || '',
      source: 'manual'
    });
    await autoLinkTickets(item._id, 'ActionItem', item.text);
    const links = await TicketLink.find({ itemId: item._id });
    res.status(201).json({ item, links });
  } catch (err) {
    next(err);
  }
});

// GET /api/standups/:id/decisions
router.get('/:id/decisions', async (req, res, next) => {
  try {
    const items = await Decision.find({ standupId: req.params.id });
    res.json(items);
  } catch (err) {
    next(err);
  }
});

// POST /api/standups/:id/decisions
router.post('/:id/decisions', async (req, res, next) => {
  try {
    const item = await Decision.create({
      standupId: req.params.id,
      text: req.body.text,
      source: 'manual'
    });
    await autoLinkTickets(item._id, 'Decision', item.text);
    const links = await TicketLink.find({ itemId: item._id });
    res.status(201).json({ item, links });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
