const mongoose = require("mongoose");

const QRCodeSchema = mongoose.Schema({
  screenshot: {
    type: Object,
    required: true,
  },
  qrCodeUrl: {
    type: String,
    required: true,
  },
  createdOn: {
    type: Date,
    default: Date.now,
  },
});

module.exports = QRCodeModel = mongoose.model("qrcodes", QRCodeSchema);
