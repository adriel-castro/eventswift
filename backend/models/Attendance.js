const mongoose = require("mongoose");

const AttendanceSchema = mongoose.Schema({
  event: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "events",
  },
  attendee: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "user",
  },
  timestamps: [{ type: Date, required: true }],
  // duration: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  updatedAt: {
    type: Date,
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
});

const Attendance = mongoose.model("attendance", AttendanceSchema);

module.exports = Attendance;
