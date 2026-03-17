const mongoose = require('mongoose');

const DEFAULT_PROMPT = 'From this standup transcript, return ONLY valid JSON in this exact format: { "actionItems": [{"text": "...", "assignee": "..."}], "decisions": [{"text": "..."}] }. IMPORTANT: If any ticket IDs are mentioned (e.g. LFG-4172, PROJ-123), preserve them exactly as spoken including the prefix in the text field. No other text.';

const settingsSchema = new mongoose.Schema({
  _id: { type: String, default: 'singleton' },
  dsuMappings: {
    type: [{ name: String, youtrackProject: String }],
    default: []
  },
  transcriptPrompt: { type: String, default: DEFAULT_PROMPT }
}, { _id: false });

module.exports = mongoose.model('Settings', settingsSchema);
