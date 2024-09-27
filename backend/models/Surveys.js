const mongoose = require("mongoose");

const SurveySchema = mongoose.Schema({
  event: { type: mongoose.Schema.Types.ObjectId, ref: "events" },
  // event: {
  //   name: {
  //     type: String,
  //     required: true,
  //   },
  //   date: { type: Date },
  //   startTime: { type: String },
  //   endTime: { type: String },
  //   location: { type: String },
  // },
  rating: {
    type: Number,
    required: true,
    enum: [1, 2, 3, 4, 5],
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  createdAt: { type: Date, default: Date.now },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
});

module.exports = Survey = mongoose.model("surveys", SurveySchema);
