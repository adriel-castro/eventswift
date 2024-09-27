//require Mongoose for this model
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
//additional package for mongoose validator (example, length of username should be 3 to 12 chars)
var validate = require("mongoose-validator");
//additional package for mongoose unique validator (example, username should be unique)
var uniqueValidator = require("mongoose-unique-validator");

//////////////MY VALIDATOR FUNCTIONS///////////////
var emailValidator = [
  validate({
    validator: "isEmail",
    message: "Email address is not valid",
  }),
];

//User schema
const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: emailValidator,
  },
  password: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  birthDate: { type: Date, required: true },
  address: { type: String },
  role: { type: String, default: "user", ref: "roles" },
  address: { type: String },
  // accessToken: { type: String, required: true },
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

UserSchema.plugin(uniqueValidator);

//Exports
module.exports = User = mongoose.model("user", UserSchema);
