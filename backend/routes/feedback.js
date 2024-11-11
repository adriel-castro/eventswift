const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const { auth } = require("../middlewares/auth.middleware");
const {
  getAllEventFeedback,
  getEventFeedback,
  createFeedback,
} = require("../controllers/feedbackController");

router.get("/", [auth], getAllEventFeedback);

router.get("/:eventId", [auth], getEventFeedback);

router.post(
  "/:eventId",
  [check("rating", "Rating is required").notEmpty(), auth],
  createFeedback
);

module.exports = router;
