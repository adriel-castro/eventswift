const express = require("express");
const { checkWifiConnection } = require("../controllers/wifiController");
const router = express.Router();

router.get("/check", checkWifiConnection);

module.exports = router;
