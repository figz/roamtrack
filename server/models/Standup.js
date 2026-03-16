const mongoose = require('mongoose');

const standupSchema = new mongoose.Schema({
  roamTranscriptId: { type: String, required: true, unique: true },
  meetingId: String,
  eventName: String,
  date: Date,
  participants: [{ name: String, email: String, user: String }],
  pulledAt: Date,
  status: { type: String, enum: ['pending', 'pulled', 'updated'], default: 'pending' }
}, { timestamps: true });

module.exports = mongoose.model('Standup', standupSchema);
