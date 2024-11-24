const express = require("express");
const orders = express.Router();
const OrderModel = require("../models/OrderModel");
const stripe = require("stripe")(process.env.VITE_STRIPE_SECRET_KEY);

orders.post("/orders", async (req, res, next) => {
  const { user, items, shippingAddress } = req.body;

  try {
    const totalAmount = items.reduce(
      (acc, item) =>
        acc +
        item.products.reduce(
          (subAcc, product) =>
            subAcc + parseFloat(product.price) * product.quantity,
          0
        ),
      0
    );

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(totalAmount * 100),
      currency: "eur",
      payment_method_types: ["card"],
    });

    const newOrder = new OrderModel({
      user: user || null,
      items,
      totalAmount,
      paymentId: paymentIntent.id,
      shippingAddress,
    });

    const savedOrder = await newOrder.save();

    res.status(201).send({
      statusCode: 201,
      message: "Ordine creato con successo",
      order: savedOrder,
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error("Errore durante la creazione dell'ordine:", error);
    next(error);
  }
});

orders.get("/orders", async (req, res, next) => {
  try {
    const { userId } = req.query;

    const filter = userId ? { user: userId } : {};

    const orders = await OrderModel.find(filter).populate("user", "name email");

    res.status(200).send({
      statusCode: 200,
      message: "Orders successfully recovered",
      orders,
    });
  } catch (error) {
    next(error);
  }
});

orders.patch("/orders/:orderId/status", async (req, res, next) => {
  const { orderId } = req.params;
  const { status } = req.body;

  try {
    if (!["Pending", "Shipped", "Delivered", "Canceled"].includes(status)) {
      return res.status(400).send({
        statusCode: 400,
        message: "Invalid status",
      });
    }

    const updatedOrder = await OrderModel.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).send({
        statusCode: 404,
        message: "Order non found",
      });
    }

    res.status(200).send({
      statusCode: 200,
      message: "Oreder status updated successfully",
      order: updatedOrder,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = orders;
