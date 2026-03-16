const mongoose = require('mongoose');

const DEFAULT_PROMPT = 'From this standup transcript, return ONLY valid JSON in this exact format: { "actionItems": [{"text": "...", "assignee": "..."}], "decisions": [{"text": "..."}] }. No other text.';

const settingsSchema = new mongoose.Schema({
  _id: { type: String, default: 'singleton' },
  dsuMappings: {
    type: [{ name: String, youtrackProject: String }],
    default: []
  },
  transcriptPrompt: { type: String, default: DEFAULT_PROMPT }
}, { _id: false });

module.exports = mongoose.model('Settings', settingsSchema);
