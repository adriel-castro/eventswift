const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");

const User = require("../models/Users");

router.get("/", async (req, res) => {
  try {
    let users = await User.find({ isActive: true });

    return res.status(200).json({ status: true, data: users, errors: [] });
  } catch (error) {
    return res.status(500).json({
      status: false,
      data: [],
      errors: [{ message: error.message }],
    });
  }
});

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
    check("firstName", "Firstname is required").notEmpty(),
    check("lastName", "Lastname is required").notEmpty(),
    check("birthDate", "BirthDate is required").notEmpty(),
  ],
  async (req, res) => {
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
        return res
          .status(400)
          .json({ status: false, data: [], errors: errors });
      }

      const { email, firstName, lastName, password, address, birthDate } =
        req.body;

      let user = await User.findOne({ email: email });
      if (user) {
        return res.status(400).json({
          status: false,
          data: [],
          errors: { message: "User already exists" },
        });
      }

      user = new User();
      user.email = email;
      user.firstName = firstName;
      user.lastName = lastName;
      user.password = password;
      user.address = address;
      user.birthDate = birthDate;
      await user.save();

      if (user.hasOwnProperty("password")) {
        delete user.password;
      }
      return res.json({ status: true, data: user, errors: [] });
    } catch (err) {
      return res
        .status(500)
        .json({ status: false, data: [], errors: { message: err.message } });
    }
  }
);

module.exports = router;
