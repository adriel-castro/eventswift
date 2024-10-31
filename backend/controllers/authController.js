const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/Users");
const Department = require("../models/Departments");
const Role = require("../models/Roles");

const signup = async (req, res) => {
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

    const {
      email,
      studentID,
      firstName,
      lastName,
      password,
      address,
      birthDate,
      department,
      year,
      role,
    } = req.body;

    let user = await User.findOne({ email: email.toLowerCase() });
    if (user) {
      return res.status(400).json({
        status: false,
        data: [],
        errors: { message: "User already exists!" },
      });
    }

    // Check if studentID already exists
    let findStudentID = await User.findOne({ studentID });
    if (findStudentID) {
      return res.status(400).json({
        status: false,
        data: [],
        errors: { message: "User already exists with this Student ID!" },
      });
    }

    let findDepartment = await Department.findOne({
      name: department.toUpperCase(),
    });

    if (!findDepartment) {
      return res.status(400).json({
        status: false,
        data: [],
        errors: { message: "Department does not exists!" },
      });
    }

    if (role) {
      let findRole = await Role.findOne({
        name: role.toLowerCase(),
      });

      if (!findRole) {
        return res.status(400).json({
          status: false,
          data: [],
          errors: { message: "Role does not exists!" },
        });
      }
    }

    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new User();
    user.email = email.toLowerCase();
    user.studentID = studentID;
    user.password = hashedPassword;
    user.firstName = firstName;
    user.lastName = lastName;
    user.address = address;
    user.birthDate = birthDate;
    user.department = department;
    user.year = year;
    user.role = role ?? "user";
    await user.save();

    const accessToken = generateToken(user._id, password);
    // if (user.hasOwnProperty("password")) {
    //   delete user.password;
    // }
    const newUser = {
      _id: user._id,
      email: user.email,
      studentID: user.studentID,
      firstName: user.firstName,
      lastName: user.lastName,
      address: user.address,
      birthDate: user.birthDate,
      department: user.department,
      year: user.year,
      role: user.role,
      isActive: user.isActive,
      accessToken,
    };

    return res.status(201).json({ status: true, data: newUser, errors: [] });
  } catch (err) {
    return res
      .status(500)
      .json({ status: false, data: [], errors: { message: err.message } });
  }
};

const login = async (req, res) => {
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
    const { username, password } = req.body;

    // let findUser = await User.findOne({
    //   email: username.toLowerCase(),
    // });

    // Check if the username is an email or studentID
    let findUser = await User.findOne({
      $or: [{ email: username.toLowerCase() }, { studentID: username }],
    });

    const isValid =
      findUser && (await bcrypt.compare(password, findUser.password));

    if (!findUser || !isValid) {
      return res.status(404).json({
        status: false,
        data: [],
        errors: [
          {
            message: "Invalid username and password combination!",
          },
        ],
      });
    }
    if (
      !findUser.isActive ||
      (findUser.hasOwnProperty("deletedAt") && findUser.deletedAt !== null)
    ) {
      return res.status(400).json({
        status: false,
        data: [],
        errors: [
          {
            message: "Account deactivated or deleted, please contact admin!",
          },
        ],
      });
    }
    findUser.save();

    const accessToken = generateToken(findUser._id, password);

    const loginUser = {
      _id: findUser._id,
      email: findUser.email,
      firstName: findUser.firstName,
      lastName: findUser.lastName,
      accessToken,
    };

    return res.status(200).json({ status: true, data: loginUser, errors: [] });
  } catch (error) {
    return res
      .status(500)
      .json({ status: false, data: [], errors: { message: error.message } });
  }
};

const getMe = async (req, res) => {
  try {
    let request = req.user;
    if (request) {
      let user = await User.findOne({
        email: request.email,
        isActive: true,
      })
        .select("-createdAt -password")
        .lean();

      res.status(200).json({ status: true, data: user, error: [] });
    }
  } catch (error) {
    res.status(500).json({
      status: false,
      data: [],
      error: { message: error.message },
    });
  }
};

const resetPassword = async (req, res) => {
  try {
    let user = await User.findById({ _id: req.body.userId });

    if (!user) {
      return res.status(404).json({
        status: false,
        data: [],
        errors: [
          {
            message: "User not found!",
          },
        ],
      });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.newPassword, salt);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ status: true, data: user, error: [] });
  } catch (error) {
    res.status(500).json({
      status: false,
      data: [],
      error: { message: error.message },
    });
  }
};

const generateToken = (id, pass) => {
  return jwt.sign({ user: { id, password: pass } }, process.env.JWT_SECRET, {
    expiresIn: "10d",
  });
};

module.exports = {
  signup,
  getMe,
  login,
  resetPassword,
};
