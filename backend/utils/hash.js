const bcrypt = require("bcryptjs");

async function hashPassword(password) {
    const salt = await bcrypt.genSalt();
    return bcrypt.hash(password, salt);
}

async function comparePassword(password, hashedPassword) {
    return bcrypt.compare(password, hashedPassword);
}

module.exports = { 
    hashPassword,
    comparePassword
};
