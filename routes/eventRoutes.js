const express = require("express");
const { createEvent, queryEvents } = require("../controllers/eventController");

const router = express.Router();

// Create an event log
router.post("/", createEvent);

// Query event logs
router.get("/", queryEvents);

module.exports = router;
