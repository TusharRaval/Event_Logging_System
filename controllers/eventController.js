const Event = require("../models/eventModel");
const { generateHash } = require("../utils/hashUtils");

// Create an event log
exports.createEvent = async (req, res) => {
  try {
    const { eventType, sourceAppId, dataPayload } = req.body;

    if (!eventType || !sourceAppId || !dataPayload) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Get the latest event to calculate the previous hash
    const lastEvent = await Event.findOne().sort({ timestamp: -1 });
    const previousHash = lastEvent ? lastEvent.hash : null;

    // Generate hash for the current event
    const hash = generateHash(
      JSON.stringify({ eventType, sourceAppId, dataPayload, previousHash })
    );

    const newEvent = new Event({
      eventType,
      sourceAppId,
      dataPayload,
      previousHash,
      hash,
    });

    await newEvent.save();
    res.status(201).json({ message: "Event created successfully", newEvent });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Query events
exports.queryEvents = async (req, res) => {
  try {
    const { eventType, sourceAppId, startDate, endDate, page = 1, limit = 10 } = req.query;

    const filters = {};
    if (eventType) filters.eventType = eventType;
    if (sourceAppId) filters.sourceAppId = sourceAppId;
    if (startDate || endDate) {
      filters.timestamp = {};
      if (startDate) filters.timestamp.$gte = new Date(startDate);
      if (endDate) filters.timestamp.$lte = new Date(endDate);
    }

    const events = await Event.find(filters)
      .sort({ timestamp: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Event.countDocuments(filters);

    res.status(200).json({
      events,
      pagination: { page, limit, totalPages: Math.ceil(total / limit), total },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
