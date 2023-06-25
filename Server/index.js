const express = require('express');
const app = express();
const cors = require('cors');
const conn = require('./db');
const { validateUnique } = require('./validate.js');

// Middleware
app.use(cors());
app.use(express.json());

// Routes

// Create an employee
app.post("/employees", async (req, res) => {
    try {
        const employee = req.body;
        const newEmployee = await conn.query(
            `INSERT INTO employee 
            (first_name, last_name, department_name, email_address, mobile_number)
            VALUES($1, $2, $3, $4, $5)
            RETURNING *`,
            [employee.firstName, employee.lastName, employee.departmentName, employee.emailAddress, employee.mobileNumber]);
        
        res.json(newEmployee.rows[0]);
    } catch (err) {
        console.error(err.message);
    }
});

app.post("/test", async (req, res) => {
    try {
        const employee = req.body;
        const table = 'employee';
        const column = 'email_address';
        const value = employee.emailAddress;

        const fetchDuplicateRowsCount = await validateUnique({table: table, column: column, value: value});
        
        res.json(fetchDuplicateRowsCount);
    } catch (err) {
        console.error(err.message);
    }
});

// Get all employees
app.get("/employees", async (req, res) => {
    try {
        const allEmployees = await conn.query("SELECT * FROM employee");
        res.json(allEmployees.rows);
    } catch (err) {
        console.error(err.message);
    }
});

// Get an employee
app.get("/employees/:id", async (req, res) => {
    try {
        const {id} = req.params;
        const employee = await conn.query("SELECT * FROM employee WHERE employee_id = $1", [id]);
        console.log(req.params);
        res.json(employee.rows[0]);
    } catch (err) {
        console.error(err.message);
    }
});

// Update an employee
app.put("/employees/:id", async (req, res) => {
    try {
        const {id} = req.params;
        const employee = req.body;
        const updateEmployee = await conn.query(
            `UPDATE employee 
            SET first_name = $1, 
            last_name = $2, 
            department_name = $3, 
            email_address = $4, 
            phone_number = $5
            WHERE employee_id = $6;`, 
            [employee.firstName, employee.lastName, employee.departmentName, employee.emailAddress, employee.mobileNumber, id]);
        
        res.json("Employee was updated");
    } catch (err) {
        console.error(err.message);
    }
});

// Update an employee
app.delete("/employees/:id", async (req, res) => {
    try {
        const {id} = req.params;
        const deleteEmployee = await conn.query("DELETE FROM employee WHERE employee_id = $1", [id])
        res.json("Employee was deleted");
    } catch (err) {
        console.error(err.message);
    }
});

app.listen(5000, () => {
    console.log("Server has started on port 5000");
});