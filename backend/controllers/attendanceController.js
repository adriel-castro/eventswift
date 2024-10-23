const { validationResult } = require("express-validator");
const Event = require("../models/Events");
const Attendance = require("../models/Attendance");

const getAllUserEventAttendance = async (req, res) => {
  try {
    let attendance = await Attendance.find({
      event: req.params.eventId,
      attendee: req.user._id,
    });

    return res.status(200).json({ status: true, data: attendance, errors: [] });
  } catch (error) {
    return res.status(500).json({
      status: false,
      data: [],
      errors: [{ message: error.message }],
    });
  }
};

const checkInToEvent = async (req, res) => {
  try {
    const event = req.params.eventId;

    let findEvent = await Event.findOne({ _id: event });

    if (!findEvent) {
      return res.status(400).json({
        status: false,
        data: [],
        errors: { message: "No event was found!" },
      });
    }

    let attendance = await Attendance.findOne({
      $and: [{ event }, { attendee: req.user._id }],
    });

    if (attendance) {
      return res.status(400).json({
        status: false,
        data: [],
        errors: { message: "You already checked in to the event!" },
      });
    }

    attendance = new Attendance();
    attendance.event = event;
    attendance.attendee = req.user._id;
    attendance.timestamps = Date.now();
    // attendance.duration = findEvent.startTime;
    attendance.createdBy = req.user._id;
    await attendance.save();

    // Populate the event field in the attendance document
    const populatedAttendance = await Attendance.findById(attendance._id)
      .populate("event")
      .exec();

    return res
      .status(200)
      .json({ status: true, data: populatedAttendance, errors: [] });
  } catch (error) {
    return res.status(500).json({
      status: false,
      data: [],
      errors: [{ message: error.message }],
    });
  }
};

const logTimeStamps = async (req, res) => {
  try {
    const event = req.params.eventId;

    let attendance = await Attendance.findOne({
      event,
      attendee: req.user._id,
    });

    if (!attendance) {
      return res.status(404).json({
        status: false,
        data: [],
        error: "Event or Attendee is not found in Attendance Logs.",
      });
    }

    // Add new timestamps (assuming it's an array you're adding to)
    // attendance.timestamps.push(...req.body.timestamps);
    attendance.timestamps.push(new Date());
    attendance.updatedAt = Date.now();
    attendance.updatedBy = req.user._id;
    await attendance.save();

    return res.status(200).json({ status: true, data: attendance, errors: [] });
  } catch (error) {
    return res.status(500).json({
      status: false,
      data: [],
      errors: [{ message: error.message }],
    });
  }
};

module.exports = { getAllUserEventAttendance, checkInToEvent, logTimeStamps };
