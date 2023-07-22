const router = require("express").Router();
const conn = require("../db.js");
const bcrypt = require("bcrypt");
const pageFilter = require("../utils/pageFilter.js");
const validateEmployeeForm = require("../middleware/formValidation/validateEmployee.js");

router.get("/pages", async (req, res) => {
    try {
        const pageSize = req.body.pageSize;
        const employees = pageFilter({
            pageSize: pageSize,
            tableName: "employee",
            filters: req.filters
        });
    } catch (error) {
        
    }
});

router.post("/", validateEmployeeForm, async (req, res) => {
  try {

    const employee = req.body;

    const employees = await conn.query("SELECT * FROM employee WHERE email_address = $1", [
      employee.email_address
    ]);

    if (employees.rows.length !== 0) {
      return res.status(401).send("Employee already exists");
    }

    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);

    const bcryptPassword = await bcrypt.hash(employee.password, salt);

    const newEmployee = await conn.query(
        `INSERT INTO employee 
          (first_name, last_name, username, 
            password, email_address, mobile_number,
            salary_yearly, hire_date, job_title, department_id, home_address_id)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *`,
        [
          employee.first_name, employee.last_name, employee.username, bcryptPassword,
          employee.email_address, employee.mobile_number, employee.salary_yearly,
          employee.hire_date, employee.job_title, employee.department_id, employee.home_address_id
        ]
      );
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;