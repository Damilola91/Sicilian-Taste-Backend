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
    .isURL({ protocols: ["http", "https"], require_tld: true })
    .withMessage("Image URL is not valid, must be a valid URL")
    .notEmpty()
    .withMessage("Image URL is required")
    .custom((value) => {
      if (!value.startsWith("https://res.cloudinary.com/")) {
        throw new Error("Image URL must be a Cloudinary URL.");
      }
      return true;
    }),

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

  body("nutritionFacts")
    .isObject()
    .withMessage("Nutrition facts must be an object")
    .bail()
    .custom((value) => {
      const requiredFields = ["calories", "carbs", "fat", "protein", "sugar"];
      const missingFields = requiredFields.filter((field) => !value[field]);
      if (missingFields.length) {
        throw new Error(`Missing nutrition facts: ${missingFields.join(", ")}`);
      }
      return true;
    })
    .bail()
    .custom((value) => {
      const validPattern = /^[0-9]+(\.[0-9]+)?\s*(kcal|g)$/;
      const fields = ["calories", "carbs", "fat", "protein", "sugar"];
      for (let field of fields) {
        if (!validPattern.test(value[field])) {
          throw new Error(
            `Invalid format for ${field}. Expected a string like '250 kcal' or '50 g'.`
          );
        }
      }
      return true;
    }),

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
