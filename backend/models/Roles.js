const mongoose = require("mongoose");

const RoleSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    enum: ["user", "admin", "facilitator"],
  },
  description: { type: String },
  createdAt: { type: Date, default: Date.now },
});

module.exports = Role = mongoose.model("roles", RoleSchema);
