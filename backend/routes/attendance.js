const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const { auth } = require("../middlewares/auth.middleware");
const {
  getAllUserEventAttendance,
  checkInToEvent,
  logTimeStamps,
} = require("../controllers/attendanceController");

router.get("/:eventId", [auth], getAllUserEventAttendance);

router.post("/checkin/:eventId", [auth], checkInToEvent);

router.put("/timestamp-logs/:eventId", [auth], logTimeStamps);

module.exports = router;
