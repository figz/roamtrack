const mongoose = require('mongoose');

const decisionSchema = new mongoose.Schema({
  standupId: { type: mongoose.Schema.Types.ObjectId, ref: 'Standup', required: true },
  text: { type: String, required: true },
  source: { type: String, enum: ['roam', 'manual'], default: 'roam' }
}, { timestamps: true });

module.exports = mongoose.model('Decision', decisionSchema);
