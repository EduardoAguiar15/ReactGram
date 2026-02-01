const { body } = require("express-validator");
const mongoose = require("mongoose");

const conversationValidation = () => {
    return [
        body("receiverId")
            .notEmpty()
            .withMessage("receiverId é obrigatório.")
            .custom((value) => {
                if (!mongoose.Types.ObjectId.isValid(value)) {
                    throw new Error("receiverId inválido.");
                }
                return true;
            }),
    ];
};

module.exports = { conversationValidation };