const express = require("express");
const router = express.Router();
const { check } = require("express-validator");

const {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} = require("../controllers/userController");
const { auth } = require("../middlewares/auth.middleware");

router.get("/", [auth], getAllUsers);

router.get("/:id", [auth], getUserById);

router.put(
  "/:id",
  [
    check("email", "Email should be valid").isEmail(),
    check("studentID", "Student ID is required").notEmpty(),
    check("firstName", "Firstname is required").notEmpty(),
    check("lastName", "Lastname is required").notEmpty(),
    check("department", "Department is required").notEmpty(),
    check("year", "Year level is required").notEmpty(),
    auth,
  ],
  updateUser
);

router.delete("/:id", [auth], deleteUser);

module.exports = router;
