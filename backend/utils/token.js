const jwt = require("jsonwebtoken");
const jwtSecret = process.env.JWT_SECRET;

function generateToken(id) {
    return jwt.sign({ id }, jwtSecret, { expiresIn: "7d" });
}

module.exports = { generateToken };