const mongoose = require("mongoose");

const allowedCategories = [
  "dolci",
  "conserve",
  "vini",
  "olio",
  "primi piatti",
  "secondi piatti",
  "street food",
  "contorni",
  "antipasti",
  "salumi",
  "formaggi",
];

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: mongoose.Types.Decimal128,
      required: true,
      min: 0,
    },
    category: {
      type: String,
      required: true,
      enum: allowedCategories,
    },
    img: {
      type: String,
      required: true,
    },
    ingredients: {
      type: [String],
      required: true,
    },
    recipe: {
      type: String,
      required: true,
    },
    availableInStock: {
      type: mongoose.Types.Decimal128,
      required: false,
      min: 1,
    },
    nutritionFacts: {
      calories: {
        type: String,
        required: true,
      },
      carbs: {
        type: String,
        required: true,
      },
      fat: {
        type: String,
        required: true,
      },
      protein: {
        type: String,
        required: true,
      },
      sugar: {
        type: String,
        required: true,
      },
    },

    ratings: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }],
  },
  {
    timestamps: true,
    strict: true,
  }
);

module.exports = mongoose.model("Product", ProductSchema, "products");
