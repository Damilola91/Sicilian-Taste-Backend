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

module.exports = orders;
