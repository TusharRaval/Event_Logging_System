// models/EventLog.js
const mongoose = require('mongoose');

// EventLog schema
const EventLogSchema = new mongoose.Schema({
  eventType: { type: String, required: true },
  timestamp: { type: String, required: true },
  sourceAppId: { type: String, required: true },
  data: { type: Object, required: true },
  previousHash: { type: String, required: false },
  hash: { type: String, required: true },
});

const EventLog = mongoose.model('EventLog', EventLogSchema);
module.exports = EventLog;
