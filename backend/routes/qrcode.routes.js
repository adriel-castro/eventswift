const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const { generateQRCode } = require("../controllers/qrCodeController");
const { auth } = require("../middlewares/auth.middleware");

router.get("/generate/:id", [auth], generateQRCode);

module.exports = router;
