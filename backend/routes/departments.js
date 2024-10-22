const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const {
  getAllDepartments,
  addDepartment,
  updateDepartment,
  deleteDepartment,
} = require("../controllers/departmentController");
const { auth } = require("../middlewares/auth.middleware");

router.get("/", getAllDepartments);

router.post(
  "/add",
  [check("name", "Department is required").notEmpty(), auth],
  addDepartment
);

router.put(
  "/:id",
  [check("name", "Department is required").notEmpty(), auth],
  updateDepartment
);

router.delete("/:id", [auth], deleteDepartment);

module.exports = router;
