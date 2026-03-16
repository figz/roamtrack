const mongoose = require('mongoose');

const ticketLinkSchema = new mongoose.Schema({
  itemId: { type: mongoose.Schema.Types.ObjectId, required: true },
  itemType: { type: String, enum: ['ActionItem', 'Decision'], required: true },
  ticketId: { type: String, required: true },
  ticketUrl: String,
  linkType: { type: String, enum: ['auto', 'manual'], default: 'manual' },
  postedAt: Date
}, { timestamps: true });

module.exports = mongoose.model('TicketLink', ticketLinkSchema);
