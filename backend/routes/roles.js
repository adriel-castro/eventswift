const express = require("express");
const router = express.Router();
const { check } = require("express-validator");

const {
  getAllRoles,
  createRole,
  updateRole,
  deleteRole,
} = require("../controllers/roleController");
const { auth } = require("../middlewares/auth.middleware");

router.get("/", [auth], getAllRoles);

router.post(
  "/add",
  [check("name", "Role is required").notEmpty()],
  [auth],
  createRole
);

router.put(
  "/:id",
  [[check("name", "Role is required").notEmpty()], auth],
  updateRole
);

router.delete("/:id", [auth], deleteRole);

module.exports = router;
