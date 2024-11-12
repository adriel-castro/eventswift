const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const multer = require("multer");

const {
  getAllUserAttendance,
  getAllUserEventAttendance,
  checkInToEvent,
  logTimeStamps,
  importAttendance,
} = require("../controllers/attendanceController");
const { auth } = require("../middlewares/auth.middleware");

const upload = multer({ dest: "uploads/" });

router.get("/", [auth], getAllUserAttendance);

router.get("/:eventId", [auth], getAllUserEventAttendance);

router.post("/checkin/:eventId", [auth], checkInToEvent);

router.put("/timestamp-logs/:eventId", [auth], logTimeStamps);

router.post("/import/:eventId", [auth, upload.single("file")], importAttendance);

module.exports = router;
