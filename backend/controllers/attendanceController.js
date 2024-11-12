const { validationResult } = require("express-validator");
const Event = require("../models/Events");
const Attendance = require("../models/Attendance");
const fs = require("fs");
const csv = require("csv-parser");

const getAllUserAttendance = async (req, res) => {
  try {
    let attendance = await Attendance.find({
      attendee: req.user._id,
    });

    if (!attendance) {
      return res.status(400).json({
        status: false,
        data: [],
        errors: { message: "No Attendance was found!" },
      });
    }

    return res.status(200).json({ status: true, data: attendance, errors: [] });
  } catch (error) {
    return res.status(500).json({
      status: false,
      data: [],
      errors: [{ message: error.message }],
    });
  }
};

const getAllUserEventAttendance = async (req, res) => {
  try {
    let attendance = await Attendance.find({
      event: req.params.eventId,
      // attendee: req.user._id,
    })
      .populate("event")
      .populate({
        path: "attendee",
        select: "-password -createdAt",
      });

    if (!attendance) {
      return res.status(400).json({
        status: false,
        data: [],
        errors: { message: "No Attendance was found!" },
      });
    }

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
        errors: { message: "You cannot joined the event again!" },
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

const importAttendance = async (req, res) => {
  try {
    const event = req.params.eventId;

    // Verify the event exists
    const findEvent = await Event.findOne({ _id: event });
    if (!findEvent) {
      return res.status(400).json({
        status: false,
        data: [],
        errors: { message: "No event was found!" },
      });
    }

    const studentIDs = [];

    // Read the CSV file and collect student IDs
    fs.createReadStream(req.file.path)
      .pipe(csv())
      .on("data", (row) => {
        if (row.studentID) {
          studentIDs.push(row.studentID);
        }
      })
      .on("end", async () => {
        const checkedInAttendees = [];
        const errors = [];

        for (const studentID of studentIDs) {
          try {
            // Find user by studentID to get attendeeId (_id)
            const attendee = await User.findOne({ studentID });
            if (!attendee) {
              errors.push({ studentID, message: "User not found" });
              continue;
            }

            // Check if the attendee has already checked in for the event
            const existingAttendance = await Attendance.findOne({
              event,
              attendee: attendee._id,
            });

            if (existingAttendance) {
              errors.push({ studentID, message: "Already checked in" });
            } else {
              // Create a new attendance record
              const attendance = new Attendance({
                event,
                attendee: attendee._id,
                timestamps: [Date.now()],
                createdBy: req.user._id,
              });

              await attendance.save();
              checkedInAttendees.push(attendance);
            }
          } catch (err) {
            errors.push({ studentID, message: "Error processing attendee" });
            console.error(`Error checking in studentID ${studentID}:`, err);
          }
        }

        // Delete the file after processing
        fs.unlinkSync(req.file.path);

        // console.log("checkedInAttendees", checkedInAttendees);
        // console.log("errors", errors);

        return res.status(201).json({
          status: true,
          data: checkedInAttendees,
          errors,
        });
      });
  } catch (error) {
    return res.status(500).json({
      status: false,
      data: [],
      errors: [{ message: error.message }],
    });
  }
};

module.exports = {
  getAllUserAttendance,
  getAllUserEventAttendance,
  checkInToEvent,
  logTimeStamps,
  importAttendance,
};
