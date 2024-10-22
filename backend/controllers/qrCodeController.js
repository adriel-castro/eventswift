const { validationResult } = require("express-validator");
const QRCode = require("qrcode");
const Event = require("../models/Events");

const generateQRCode = async (req, res) => {
  try {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      let returnErrors = errors.errors.map((error) => {
        return {
          param: error.path,
          message: error.msg,
        };
      });
      return res
        .status(400)
        .json({ status: false, data: [], errors: returnErrors });
    }
    if (errors.length > 0) {
      return res.status(400).json({ status: false, data: [], errors: errors });
    }

    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        status: false,
        data: [],
        error: "Event not found.",
      });
    }

    // Convert JSON data to a string
    const jsonString = JSON.stringify(event);

    // Generate the QR code
    const qrCodeUrl = await QRCode.toDataURL(jsonString);

    // Save the data and the QR code URL in MongoDB
    // const newQRCode = new QRCodeModel({ screenshot: jsonData, qrCodeUrl });
    // await newQRCode.save();

    return res.status(200).json({ status: true, data: qrCodeUrl, errors: [] });
  } catch (error) {
    return res.status(500).json({
      status: false,
      data: [],
      errors: [{ message: error.message }],
    });
  }
};

module.exports = {
  generateQRCode,
};
