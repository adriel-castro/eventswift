const { validationResult } = require("express-validator");
const Department = require("../models/Departments");

const getAllDepartments = async (req, res) => {
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
};

const addDepartment = async (req, res) => {
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
};

const updateDepartment = async (req, res) => {
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

    const findDepartment = await Department.findById(req.params.id);

    if (!findDepartment) {
      return res.status(404).json({
        status: false,
        data: [],
        error: "Department not found.",
      });
    }

    let { name } = req.body;
    findDepartment.name = name.toUpperCase();
    await findDepartment.save();

    return res
      .status(200)
      .json({ status: true, data: findDepartment, error: [] });
  } catch (error) {
    return res.status(500).json({
      status: false,
      data: [],
      errors: [{ message: error.message }],
    });
  }
};

const deleteDepartment = async (req, res) => {
  try {
    let department = await Department.findByIdAndDelete(req.params.id);

    if (!department) {
      return res
        .status(404)
        .json({ status: false, data: [], error: "Department not found." });
    }

    return res.json({
      status: true,
      data: "Department deleted successfully!",
      error: [],
    });
  } catch (err) {
    return res
      .status(500)
      .json({ status: false, data: [], error: err.message });
  }
};

module.exports = {
  addDepartment,
  getAllDepartments,
  updateDepartment,
  deleteDepartment,
};
