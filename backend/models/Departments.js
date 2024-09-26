const mongoose = require("mongoose");

const DepartmentSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: { type: String },
  createdAt: { type: Date, default: Date.now },
});

module.exports = Department = mongoose.model("department", DepartmentSchema);
