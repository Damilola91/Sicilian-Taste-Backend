const { body, validationResult } = require("express-validator");

const validateProductBody = [
  body("name")
    .isString()
    .notEmpty()
    .withMessage("Asin is not valid, must be a string"),

  body("description")
    .isString()
    .notEmpty()
    .withMessage("Title is not valid, must be a string"),

  body("img")
    .isString()
    .notEmpty()
    .withMessage("Img is not valid, must be a string "),

  body("price")
    .isDecimal()
    .notEmpty()
    .withMessage("price is snot valid, must be a number"),

  body("category")
    .isString()
    .notEmpty()
    .withMessage("category is not valid, must be a string"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).send({
        stauscode: 400,
        message: "validation failed",
        errors: errors.array(),
      });
    }
    next();
  },
];

module.exports = validateProductBody;
