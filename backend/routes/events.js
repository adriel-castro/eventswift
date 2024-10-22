const express = require("express");
const router = express.Router();
const { check } = require("express-validator");

const {
  getAllEvents,
  addEvent,
  updateEvent,
  deleteEvent,
} = require("../controllers/eventController");
const { auth } = require("../middlewares/auth.middleware");

router.get("/", [auth], getAllEvents);

router.post(
  "/add",
  [
    check("name", "Event name is required").notEmpty(),
    check("department", "Department is required").notEmpty(),
    check("eventDate", "Date is required").notEmpty(),
    check("startTime", "Start Time is required").notEmpty(),
    check("endTime", "End Time is required").notEmpty(),
    check("location", "Location is required").notEmpty(),
    auth,
  ],
  addEvent
);

router.put("/:id", [auth], updateEvent);

router.delete("/:id", [auth], deleteEvent);

module.exports = router;
