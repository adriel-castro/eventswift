const mongoose = require("mongoose");

const EventMonitoringSchema = mongoose.Schema({
  event: { type: mongoose.Schema.Types.ObjectId, ref: "events" },
  attendee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  createdAt: { type: Date, default: Date.now },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
});

const EventMonitoring = mongoose.model(
  "event_monitoring",
  EventMonitoringSchema
);

module.exports = EventMonitoring;
