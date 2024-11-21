// server.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const EventLog = require('./models/eventModel');
const { generateHash } = require('./utils/hashUtils');

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // Replaces bodyParser.json()

// MongoDB connection
mongoose.connect('mongodb://127.0.0.1:27017/event-logging', {
/*  useNewUrlParser: true,
  useUnifiedTopology: true,*/
})
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// POST: Log a new event
app.post('/api/event-logs', async (req, res) => {
  const { eventType, timestamp, sourceAppId, data } = req.body;

  try {
    const lastEvent = await EventLog.findOne().sort({ timestamp: -1 });
    const previousHash = lastEvent ? lastEvent.hash : null;

    const newEvent = new EventLog({
      eventType,
      timestamp,
      sourceAppId,
      data,
      previousHash,
      hash: generateHash({ eventType, timestamp, sourceAppId, data, previousHash }),
    });

    const savedEvent = await newEvent.save();
    res.status(201).json({ message: 'Event logged successfully', logId: savedEvent._id });
  } catch (err) {
    res.status(500).json({ error: 'Failed to log event', details: err.message });
  }
});

// GET: Fetch event logs with optional filters and pagination
app.get('/api/event-logs', async (req, res) => {
  const { page = 1, limit = 10, eventType, startDate, endDate } = req.query;
  const filters = {};

  if (eventType) filters.eventType = eventType;
  if (startDate || endDate) {
    filters.timestamp = {};
    if (startDate) filters.timestamp.$gte = new Date(startDate);
    if (endDate) filters.timestamp.$lte = new Date(endDate);
  }

  try {
    const logs = await EventLog.find(filters)
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({ logs, page: Number(page), limit: Number(limit) });
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve logs', details: err.message });
  }
});

// SSE: Stream real-time logs
app.get('/api/event-logs/stream', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  const sendLatestLog = async () => {
    const latestLog = await EventLog.findOne().sort({ timestamp: -1 });
    if (latestLog) {
      res.write(`data: ${JSON.stringify(latestLog)}\n\n`);
    }
  };

  sendLatestLog();
  const interval = setInterval(sendLatestLog, 5000);

  req.on('close', () => clearInterval(interval));
});

// Start the server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));