const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");

const Department = require("../models/Departments");

router.get("/", async (req, res) => {
  try {
    let department = await Department.find();

    return res.status(200).json({ status: true, data: department, errors: [] });
  } catch (error) {
    return res.status(500).json({
      status: false,
      data: [],
      errors: [{ message: error.message }],
    });
  }
});

router.post(
  "/add",
  [check("name", "Department name is required").notEmpty()],
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

      const { name, description } = req.body;

      let department = await Department.findOne({ name: name });
      if (department) {
        return res.status(400).json({
          status: false,
          data: [],
          errors: { message: "The department already exists!" },
        });
      }

      department = new Department();
      department.name = name.toUpperCase();
      department.description = description;
      await department.save();

      return res.json({ status: true, data: department, errors: [] });
    } catch (err) {
      return res
        .status(500)
        .json({ status: false, data: [], errors: { message: err.message } });
    }
  }
);

module.exports = router;
