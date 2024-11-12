const { validationResult } = require("express-validator");
const User = require("../models/Users");
const Department = require("../models/Departments");
const Role = require("../models/Roles");
const bcrypt = require("bcryptjs");
const fs = require("fs");
const csv = require("csv-parser");

const getAllUsers = async (req, res) => {
  try {
    let users = await User.find({ isActive: true })
      .select("-createdAt -password")
      .lean();

    if (!users) {
      return res.status(404).json({
        status: false,
        data: [],
        error: "Users not found!",
      });
    }

    return res.status(200).json({ status: true, data: users, errors: [] });
  } catch (error) {
    return res.status(500).json({
      status: false,
      data: [],
      errors: [{ message: error.message }],
    });
  }
};

const getUserById = async (req, res) => {
  try {
    let user = await User.findOne({ _id: req.user._id, isActive: true })
      .select("-createdAt -password")
      .lean();

    if (!user) {
      return res.status(404).json({
        status: false,
        data: [],
        error: "User not found.",
      });
    }

    return res.status(200).json({ status: true, data: user, errors: [] });
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

const importUsers = async (req, res) => {
  try {
    const errors = [];
    const importedUsers = [];

    const defaultPassword = "TempPassword!"; // Default password

    // Open and read the CSV file
    const fileRows = [];
    fs.createReadStream(req.file.path)
      .pipe(csv())
      .on("data", (row) => fileRows.push(row))
      .on("end", async () => {
        for (const userData of fileRows) {
          const {
            email,
            studentID,
            firstName,
            lastName,
            birthDate,
            address,
            department,
            year,
            role,
          } = userData;

          // Validate required fields
          if (
            !email ||
            !studentID ||
            !firstName ||
            !lastName ||
            !department ||
            !year
          ) {
            errors.push({ email, error: "Missing required fields." });
            continue;
          }

          // Check for duplicate email or studentID
          const existingEmail = await User.findOne({
            email: email.toLowerCase(),
          });
          const existingStudentID = await User.findOne({ studentID });

          if (existingEmail || existingStudentID) {
            errors.push({ email, error: "Duplicate email or studentID." });
            continue;
          }

          // Check if department exists
          const findDepartment = await Department.findOne({
            name: department.toUpperCase(),
          });
          if (!findDepartment) {
            errors.push({ email, error: "Department does not exist." });
            continue;
          }

          // Optional: Check if role exists
          if (role) {
            const findRole = await Role.findOne({ name: role.toLowerCase() });
            if (!findRole) {
              errors.push({ email, error: "Role does not exist." });
              continue;
            }
          }

          // Hash default password
          const salt = await bcrypt.genSalt(10);
          const hashedPassword = await bcrypt.hash(defaultPassword, salt);

          // Create new user with default password
          const newUser = new User({
            email: email.toLowerCase(),
            studentID,
            password: hashedPassword,
            firstName,
            lastName,
            birthDate,
            address,
            department,
            year,
            role: role || "user",
          });

          await newUser.save();
          importedUsers.push(newUser);
        }

        // Delete the CSV file after processing
        fs.unlinkSync(req.file.path);

        // Return results
        res.status(201).json({
          status: true,
          data: importedUsers,
          errors,
        });
      });
  } catch (error) {
    res.status(500).json({
      status: false,
      data: [],
      errors: [{ message: error.message }],
    });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  importUsers,
};
