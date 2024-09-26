const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");

const Role = require("../models/Roles");

router.get("/", async (req, res) => {
  try {
    let role = await Role.find();

    return res.json({ status: true, data: role, errors: [] });
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
  [check("name", "Role is required").notEmpty()],
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

      let role = await Role.findOne({ name: name });
      if (role) {
        return res.status(400).json({
          status: false,
          data: [],
          errors: { message: "The role already exists!" },
        });
      }

      role = new Role();
      role.name = name;
      role.description = description;
      await role.save();

      return res.json({ status: true, data: role, errors: [] });
    } catch (err) {
      return res
        .status(500)
        .json({ status: false, data: [], errors: { message: err.message } });
    }
  }
);

module.exports = router;
