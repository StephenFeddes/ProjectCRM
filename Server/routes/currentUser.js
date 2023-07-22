const router = require("express").Router();
const conn = require("../db.js");
const bcrypt = require("bcrypt");
const jwtGenerator = require("../utils/jwtGenerator.js");
const authorization = require("../middleware/authorization.js");

router.get("/", authorization, async (req, res) => {
    try {
        const employee = await conn.query( `SELECT username
        FROM employee WHERE employee_id = $1`, [req.employee]);

        res.json(employee.rows[0]);
    } catch (err) {
        console.error(err.message);
        return res.status(500).json("Server error");
    }
});

module.exports = router;