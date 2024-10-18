const express = require("express");
const router = express.Router();
const { check } = require("express-validator");

const { signup, getMe, login } = require("../controllers/authController");
const { auth } = require("../middlewares/auth.middleware");

router.post(
  "/signup",
  [
    check("email", "Email should be valid").isEmail(),
    check(
      "password",
      "Password is required and should be greater than or equals to 8 characters, composed of upper case, lower case, numbers and special characters."
    )
      .matches(/^[a-zA-Z0-9!@#$%^&*()_+{}\[\]:;<>,.?~\/\\-]*$/, "i")
      .isLength(8),
    check("studentID", "Student ID is required").notEmpty(),
    check("firstName", "Firstname is required").notEmpty(),
    check("lastName", "Lastname is required").notEmpty(),
    check("department", "Department is required").notEmpty(),
    check("year", "Year level is required").notEmpty(),
    // check("birthDate", "BirthDate is required").notEmpty(),
  ],
  signup
);

router.post(
  "/login",
  [
    check("username", "Username is required").notEmpty(),
    check("password", "Password is required").notEmpty(),
  ],
  login
);

router.get("/me", [auth], getMe);

module.exports = router;
