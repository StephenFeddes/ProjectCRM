const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = async(req, res, next) => {
    try {

        const jwtToken = req.header("token");

        if (!jwtToken) {
            return res.status(403).json("Not authorized");
        }

        const payload = jwt.verify(jwtToken, process.env.jwtSecret);

        req.employee = payload.employee;

        next()
    } catch (err) {
        console.error(err.message);
        return res.status(403).json("Not authorized");
    }
}