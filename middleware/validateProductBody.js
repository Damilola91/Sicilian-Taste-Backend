const { body, validationResult } = require("express-validator");

const validateProductBody = [
  body("name")
    .isString()
    .notEmpty()
    .withMessage("Name is not valid, must be a non-empty string"),

  body("description")
    .isString()
    .notEmpty()
    .withMessage("Description is not valid, must be a non-empty string"),

  body("img")
    .isString()
    .notEmpty()
    .withMessage("Image URL is not valid, must be a non-empty string"),

  body("price")
    .isFloat({ min: 0 })
    .withMessage("Price is not valid, must be a non-negative number"),

  body("category")
    .isString()
    .notEmpty()
    .withMessage("Category is not valid, must be a non-empty string"),

  body("ingredients")
    .isArray({ min: 1 })
    .withMessage("Ingredients must be an array with at least one item"),

  body("recipe")
    .isString()
    .notEmpty()
    .withMessage("Recipe is not valid, must be a non-empty string"),

  body("availableInStock")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Available in stock must be a positive integer"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).send({
        statusCode: 400,
        message: "Validation failed",
        errors: errors.array(),
      });
    }
    next();
  },
];

module.exports = validateProductBody;
