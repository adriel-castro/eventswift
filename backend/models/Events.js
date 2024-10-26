const mongoose = require("mongoose");

const EventSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  department: { type: String, required: true },
  eventDate: { type: Date, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  location: { type: String, required: true },
  description: { type: String },
  organizer: {
    name: {
      type: String,
    },
    contact: { type: String },
  },
  isMandatory: { type: Boolean, default: false },
  // status: {
  //   type: String,
  //   default: "Not Started",
  //   enum: ["Not Started", "Already Started", "Event Finished"],
  // },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
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

module.exports = Event = mongoose.model("events", EventSchema);
