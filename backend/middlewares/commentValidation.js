const { body } = require("express-validator");

const commentValidation = () => {
  return [
    body("comment")
      .isString()
      .withMessage("O comentário é obrigatório."),
    body("replyTo")
      .optional()
      .isMongoId()
      .withMessage("O ID do comentário pai é inválido"),
  ];
};

module.exports = { commentValidation };