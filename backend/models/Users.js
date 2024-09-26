//require Mongoose for this model
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//User schema
const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    // validate: emailValidator,
  },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  birthDate: { type: Date, required: true },
  address: { type: String },
  role: { type: String, default: "" },
  address: { type: String },
  isActive: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
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
  deletedAt: {
    type: Date,
  },
  deletedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
});

//Exports
module.exports = User = mongoose.model("user", UserSchema);
