const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const multer = require("multer");

const {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  importUsers,
} = require("../controllers/userController");
const { auth } = require("../middlewares/auth.middleware");

// Multer setup for file uploads
const upload = multer({ dest: "uploads/" });

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

router.post("/import", [auth, upload.single("file")], importUsers);

module.exports = router;
