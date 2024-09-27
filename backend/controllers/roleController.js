const { validationResult } = require("express-validator");
const Role = require("../models/Roles");

const getAllRoles = async (req, res) => {
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
};

const createRole = async (req, res) => {
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
};

const updateRole = async (req, res) => {
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

    const findRole = await Role.findById(req.params.id);

    if (!findRole) {
      return res.status(404).json({
        status: false,
        data: [],
        error: "Role not found.",
      });
    }

    let { name } = req.body;
    findRole.name = name;
    await findRole.save();

    return res.status(200).json({ status: true, data: findRole, error: [] });
  } catch (error) {
    return res.status(500).json({
      status: false,
      data: [],
      errors: [{ message: error.message }],
    });
  }
};

const deleteRole = async (req, res) => {
  try {
    let role = await Role.findByIdAndDelete(req.params.id);

    if (!role) {
      return res
        .status(404)
        .json({ status: false, data: [], error: "Role not found." });
    }

    return res.json({
      status: true,
      data: "Role deleted successfully!",
      error: [],
    });
  } catch (err) {
    return res
      .status(500)
      .json({ status: false, data: [], error: err.message });
  }
};

module.exports = {
  getAllRoles,
  createRole,
  updateRole,
  deleteRole,
};
