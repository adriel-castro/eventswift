const { validationResult } = require("express-validator");
const Event = require("../models/Events");
const Feedback = require("../models/Feedback");
const Attendance = require("../models/Attendance");

const getAllEventFeedback = async (req, res) => {
  try {
    let feedback = await Feedback.find();

    if (!feedback) {
      return res.status(404).json({
        status: false,
        data: [],
        error: "Feedback not found.",
      });
    }

    return res.status(200).json({ status: true, data: feedback, errors: [] });
  } catch (error) {
    return res.status(500).json({
      status: false,
      data: [],
      errors: [{ message: error.message }],
    });
  }
};

const getEventFeedback = async (req, res) => {
  try {
    const eventId = req.params.eventId;

    let findEvent = await Event.findOne({ _id: eventId });

    if (!findEvent) {
      return res.status(404).json({
        status: false,
        data: [],
        error: "Event or Feedback not found.",
      });
    }

    let feedback = await Feedback.find({ event: eventId }).populate({
      path: "attendee",
      select: "-password -createdAt",
    });

    return res.status(200).json({ status: true, data: feedback, errors: [] });
  } catch (error) {
    return res.status(500).json({
      status: false,
      data: [],
      errors: [{ message: error.message }],
    });
  }
};

const createFeedback = async (req, res) => {
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

    let feedback = await Feedback.findOne({
      $and: [{ event: req.params.eventId }, { attendee: req.user._id }],
    });

    if (feedback) {
      return res.status(401).json({
        status: false,
        data: [],
        error: "You already submitted your feedback to the event.",
      });
    }

    const { rating, comment } = req.body;

    let attendance = await Attendance.findOne({
      $and: [{ event: req.params.eventId }, { attendee: req.user._id }],
    });

    if (!attendance) {
      return res.status(404).json({
        status: false,
        data: [],
        error: "You did not attend to this event.",
      });
    }

    const isPresent = attendance.timestamps.length > 3 ? true : false;

    if (!isPresent) {
      return res.status(404).json({
        status: false,
        data: [],
        error:
          "Attendee is not found in the event or does not have 5 or more timestamps.",
      });
    }

    feedback = new Feedback();
    feedback.event = req.params.eventId;
    feedback.attendee = req.user._id;
    feedback.attendanceLogs = attendance._id;
    feedback.isPresent = isPresent;
    feedback.feedback.rating = rating;
    feedback.feedback.comment = comment ?? "";
    feedback.createdBy = req.user._id;
    await feedback.save();

    return res.status(200).json({ status: true, data: feedback, errors: [] });
  } catch (error) {
    return res.status(500).json({
      status: false,
      data: [],
      errors: [{ message: error.message }],
    });
  }
};

module.exports = { getAllEventFeedback, getEventFeedback, createFeedback };
