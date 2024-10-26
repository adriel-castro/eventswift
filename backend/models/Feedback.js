const mongoose = require("mongoose");

const FeedbackSchema = mongoose.Schema({
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "events",
    required: true,
  },
  attendee: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "user",
  },
  attendanceLogs: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "attendance",
  },
  isPresent: { type: Boolean, required: true },
  feedback: {
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String },
  },
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

const Feedback = mongoose.model("feedback", FeedbackSchema);

module.exports = Feedback;
