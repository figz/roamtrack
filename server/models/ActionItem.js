const mongoose = require('mongoose');

const actionItemSchema = new mongoose.Schema({
  standupId: { type: mongoose.Schema.Types.ObjectId, ref: 'Standup', required: true },
  text: { type: String, required: true },
  assignee: String,
  source: { type: String, enum: ['roam', 'manual'], default: 'roam' },
  autoMatched: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('ActionItem', actionItemSchema);
