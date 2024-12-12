const { body, validationResult } = require("express-validator");

const validateEmail = [
  body("from")
    .isEmail()
    .withMessage("Invalid email address provided in 'from'"),
  body("subject").notEmpty().withMessage("'subject' is required"),
  body("text").optional().notEmpty().withMessage("'text' cannot be empty"),
  body("html").optional().isString().withMessage("'html' must be a string"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        statusCode: 400,
        errors: errors
          .array()
          .map((err) => ({ field: err.param, message: err.msg })),
      });
    }
    next();
  },
];

module.exports = validateEmail;
