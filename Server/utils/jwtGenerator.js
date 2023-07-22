const jwt = require("jsonwebtoken");
require("dotenv").config();


function jwtGenerator(employee_id) {
    const payload = {
        employee: employee_id
    }

    return jwt.sign(payload, process.env.jwtSecret, {expiresIn: "2hr"})
}

module.exports = jwtGenerator;