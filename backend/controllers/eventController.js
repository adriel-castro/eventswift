const { validationResult } = require("express-validator");
const Event = require("../models/Events");
const User = require("../models/Users");
const moment = require("moment");

const getAllEventsByDepartment = async (req, res) => {
  try {
    let user = await User.findById({
      _id: req.params.userId,
    })
      .select("-password")
      .lean();

    if (!user) {
      return res.status(404).json({
        status: false,
        data: [],
        error: "User not found.",
      });
    }

    let event = await Event.find({
      department: user.department,
    });

    if (!event) {
      return res.status(404).json({
        status: false,
        data: [],
        error: "Event not found.",
      });
    }

    return res.status(200).json({ status: true, data: event, errors: [] });
  } catch (error) {
    return res.status(500).json({
      status: false,
      data: [],
      errors: [{ message: error.message }],
    });
  }
};

const getAllEvents = async (req, res) => {
  try {
    let event = await Event.find();

    return res.status(200).json({ status: true, data: event, errors: [] });
  } catch (error) {
    return res.status(500).json({
      status: false,
      data: [],
      errors: [{ message: error.message }],
    });
  }
};

const addEvent = async (req, res) => {
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

    const user = await User.findById(req.user._id).select("-password").lean();

    if (user.role !== "admin") {
      return res.status(404).json({
        status: false,
        data: [],
        error:
          "User role is not allowed to manage event. Please contact admin.",
      });
    }

    const {
      name,
      department,
      eventDate,
      startTime,
      endTime,
      location,
      description,
      organizer,
      contact,
      isMandatory,
      // status,
    } = req.body;

    // const manilaTime = moment.tz("Asia/Manila");
    // const utcDate = moment.utc(eventDate); // UTC date
    // const manilaDate = utcDate.tz("Asia/Manila").format("YYYY-MM-DD");

    // const start = moment.utc(startTime);
    // const end = moment.utc(endTime);
    // const startManilaTime = start.tz("Asia/Manila").format("h:mm A");
    // const endManilaTime = end.tz("Asia/Manila").format("h:mm A");

    // console.log("UTC DateTime", eventDate, startTime, endTime);

    let event = await Event.findOne({
      $and: [
        { name: name },
        { department: department.toUpperCase() },
        { eventDate: eventDate },
      ],
    });
    if (event) {
      return res.status(400).json({
        status: false,
        data: [],
        errors: { message: "The Event already exists!" },
      });
    }

    event = new Event();
    event.name = name;
    event.department = department.toUpperCase();
    event.eventDate = eventDate;
    event.startTime = startTime;
    event.endTime = endTime;
    event.location = location;
    event.description = description;
    event.organizer.name = organizer;
    event.organizer.contact = contact;
    event.isMandatory = isMandatory ?? false;
    event.createdBy = req.user._id;
    await event.save();

    return res.json({ status: true, data: event, errors: [] });
  } catch (error) {
    return res
      .status(500)
      .json({ status: false, data: [], errors: { message: error.message } });
  }
};

const updateEvent = async (req, res) => {
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

    const user = await User.findById(req.user._id).select("-password").lean();

    if (user.role !== "admin") {
      return res.status(404).json({
        status: false,
        data: [],
        error:
          "User role is not allowed to manage event. Please contact admin.",
      });
    }

    const findEvent = await Event.findById(req.params.id);

    if (!findEvent) {
      return res.status(404).json({
        status: false,
        data: [],
        error: "Event not found.",
      });
    }

    let {
      name,
      department,
      eventDate,
      startTime,
      endTime,
      location,
      description,
      organizer,
      contact,
      isMandatory,
    } = req.body;

    findEvent.name = name;
    findEvent.department = department.toUpperCase();
    findEvent.eventDate = eventDate;
    findEvent.startTime = startTime;
    findEvent.endTime = endTime;
    findEvent.location = location;
    findEvent.description = description;
    findEvent.organizer.name = organizer;
    findEvent.organizer.contact = contact;
    findEvent.isMandatory = isMandatory ?? false;
    findEvent.updatedAt = Date.now();
    findEvent.updatedBy = req.user._id;
    await findEvent.save();

    return res.status(200).json({ status: true, data: findEvent, error: [] });
  } catch (error) {
    return res.status(500).json({
      status: false,
      data: [],
      errors: [{ message: error.message }],
    });
  }
};

const deleteEvent = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password").lean();

    if (user.role !== "admin") {
      return res.status(404).json({
        status: false,
        data: [],
        error:
          "User role is not allowed to manage event. Please contact admin.",
      });
    }

    let event = await Event.findByIdAndDelete(req.params.id);

    if (!event) {
      return res
        .status(404)
        .json({ status: false, data: [], error: "Event not found." });
    }

    return res
      .status(200)
      .json({ status: true, data: "Event deleted successfully!", error: [] });
  } catch (err) {
    return res
      .status(500)
      .json({ status: false, data: [], error: err.message });
  }
};

module.exports = {
  getAllEventsByDepartment,
  getAllEvents,
  addEvent,
  updateEvent,
  deleteEvent,
};
