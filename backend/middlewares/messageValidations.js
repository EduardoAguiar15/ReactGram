const { body } = require("express-validator");
const mongoose = require("mongoose");

const messageValidation = () => {
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

    body("text")
      .notEmpty()
      .withMessage("O texto da mensagem é obrigatório.")
      .isString()
      .withMessage("O texto deve ser uma string."),
  ];
};

module.exports = { messageValidation };