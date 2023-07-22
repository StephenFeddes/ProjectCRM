const router = require("express").Router();
const conn = require("../db.js");
const bcrypt = require("bcrypt");
const jwtGenerator = require("../utils/jwtGenerator.js");
const authorization = require("../middleware/authorization.js");

router.post("/register", async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      username,
      password,
      emailAddress,
      mobileNumber,
      salaryYearly,
      hireDate,
      departmentId,
      homeAddressId,
    } = req.body;

    const employees = await conn.query("SELECT * FROM employee WHERE email_address = $1", [
      emailAddress
    ]);

    if (employees.rows.length !== 0) {
      return res.status(401).send("Employee already exists");
    }

    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);

    const bcryptPassword = await bcrypt.hash(password, salt);

    const newEmployee = await conn.query(
        `INSERT INTO employee 
          (first_name, last_name, username, 
            password, email_address, mobile_number,
            salary_yearly, hire_date, department_id, home_address_id)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
        [
          firstName, lastName, username, bcryptPassword,
          emailAddress, mobileNumber, salaryYearly,
          hireDate, departmentId, homeAddressId
        ]
      );
      
    const token = jwtGenerator(newEmployee.rows[0].user_id);

    res.json({ token });

  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

//Login route
router.post("/login", async (req, res) => 
{
    try {
        const { username, password } = req.body;

        const employee = await conn.query("SELECT * FROM employee WHERE username = $1", [
            username
        ]);

        if (employee.rows.length === 0 ) {
            return res.status(401).json("Username or password is incorrect");
        }

        const isValidPassword = await bcrypt.compare(password, employee.rows[0].password);

        if (!isValidPassword) {
            return res.status(401).json("Password or username is incorrect");
        }

        const token = jwtGenerator(employee.rows[0].employee_id);

    res.json({ token });    
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});

router.get("/is-authenticated", authorization, async (req, res) => {
    try {
        res.json(true);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
})

module.exports = router;