const { validationResult } = require("express-validator");
const User = require("../models/Users");

const getAllUsers = async (req, res) => {
  try {
    let users = await User.find({ isActive: true })
      .select("-createdAt -password")
      .lean();

    return res.status(200).json({ status: true, data: users, errors: [] });
  } catch (error) {
    return res.status(500).json({
      status: false,
      data: [],
      errors: [{ message: error.message }],
    });
  }
};

const updateUser = async (req, res) => {
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

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        status: false,
        data: [],
        error: "User not found.",
      });
    }

    let {
      email,
      studentID,
      firstName,
      lastName,
      birthDate,
      address,
      department,
      year,
      role,
    } = req.body;

    user.email = email;
    user.studentID = studentID;
    user.firstName = firstName;
    user.lastName = lastName;
    user.birthDate = birthDate;
    user.address = address;
    user.department = department;
    user.year = year;
    user.role = role;
    await user.save();

    return res.status(200).json({ status: true, data: user, error: [] });
  } catch (error) {
    return res.status(500).json({
      status: false,
      data: [],
      errors: [{ message: error.message }],
    });
  }
};

const deleteUser = async (req, res) => {
  try {
    let user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res
        .status(404)
        .json({ status: false, data: [], error: "User not found." });
    }

    return res.json({
      status: true,
      data: "User deleted successfully!",
      error: [],
    });
  } catch (err) {
    return res
      .status(500)
      .json({ status: false, data: [], error: err.message });
  }
};

module.exports = {
  getAllUsers,
  updateUser,
  deleteUser,
};
