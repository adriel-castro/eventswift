const express = require("express");
const router = express.Router();
const { check } = require("express-validator");

const {
  getAllUsers,
  updateUser,
  deleteUser,
} = require("../controllers/userController");
const { auth } = require("../middlewares/auth.middleware");

router.get("/", [auth], getAllUsers);

router.put(
  "/:id",
  [
    [check("firstName", "FirstName is required").notEmpty()],
    [check("lastName", "LastName is required").notEmpty()],
    auth,
  ],
  updateUser
);

router.delete("/:id", [auth], deleteUser);

module.exports = router;
