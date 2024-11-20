const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "userModel",
      required: false,
    },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        price: {
          type: mongoose.Types.Decimal128,
          required: true,
        },
      },
    ],
    totalAmount: {
      type: mongoose.Types.Decimal128,
      required: true,
    },
    paymentId: {
      type: String,
      required: false,
      default: null,
    },
    status: {
      type: String,
      enum: ["Pending", "Shipped", "Delivered", "Canceled"],
      default: "Pending",
    },
  },
  {
    timestamps: true,
    strict: true,
  }
);

module.exports = mongoose.model("Order", OrderSchema, "orders");
