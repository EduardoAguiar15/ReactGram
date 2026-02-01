const jwt = require("jsonwebtoken")
const jwtSecret = process.env.JWT_SECRET;

const authGuard = async (req, res, next) => {
    const authHeader = req.headers["authorization"];

    if (!authHeader) {
        return res.status(401).json({ errors: ["Acesso negado!"] });
    }

    const parts = authHeader.split(" ");
    if (parts.length !== 2 || parts[0] !== "Bearer") {
        return res.status(401).json({ errors: ["Formato de token inválido."] });
    }

    const token = parts[1];

    try {
        const verified = jwt.verify(token, jwtSecret)
        req.user = { _id: verified.id };

        next();
    } catch (error) {
        return res.status(401).json({ errors: ["Token inválido."] });

    }
};

module.exports = authGuard;