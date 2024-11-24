const mongoose = require("mongoose");
const allowedCategories = ["dolci", "conserve", "vini", "olio", "altro"];

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
    ratings: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }],
  },
  {
    timestamps: true,
    strict: true,
  }
);

module.exports = mongoose.model("Product", ProductSchema, "products");
