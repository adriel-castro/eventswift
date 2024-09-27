const mongoose = require("mongoose");
const EventLogsSchema = new mongoose.Schema({
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "event_monitoring",
  },
  screenshot: {
    type: Object,
    required: true,
  },
  createdOn: {
    type: Date,
    default: Date.now,
  },
});

const EventLogs = mongoose.model("events_logs", EventLogsSchema);

module.exports = EventLogs;
