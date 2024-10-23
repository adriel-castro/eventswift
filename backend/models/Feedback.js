const mongoose = require("mongoose");

const FeedbackSchema = mongoose.Schema({
  event: { type: mongoose.Schema.Types.ObjectId, ref: "events" },
  attendance: {
    attendee: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "user",
    },
    logs: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "attendance",
    },
    isPresent: { type: Boolean },
  },
  feedback: {
    rating: { type: Number, min: 1, max: 5 },
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
