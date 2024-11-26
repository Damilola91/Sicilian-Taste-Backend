const express = require("express");
const orders = express.Router();
const OrderModel = require("../models/OrderModel");
const stripe = require("stripe")(process.env.VITE_STRIPE_SECRET_KEY);
const UserModel = require("../models/UserModel");

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

    if (user) {
      const updatedUser = await UserModel.findByIdAndUpdate(
        user,
        { $push: { orders: savedOrder._id } },
        { new: true }
      );

      if (!updatedUser) {
        return res.status(404).send({
          statusCode: 404,
          message: "Utente non trovato, ma l'ordine è stato creato",
          order: savedOrder,
        });
      }
    }

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
      message: "Order status updated successfully",
      order: updatedOrder,
    });
  } catch (error) {
    next(error);
  }
});

orders.get("/orders/:orderId", async (req, res, next) => {
  const { orderId } = req.params;

  try {
    const order = await OrderModel.findById(orderId).populate(
      "user",
      "name email"
    );

    if (!order) {
      return res.status(404).send({
        statusCode: 404,
        message: "Order not found",
      });
    }

    res.status(200).send({
      statusCode: 200,
      message: "Order successfully retrieved",
      order,
    });
  } catch (error) {
    console.error("Error retrieving order:", error);
    next(error);
  }
});

orders.get("/orders/all", async (req, res, next) => {
  try {
    const allOrders = await OrderModel.find().populate("user", "name email");

    res.status(200).send({
      statusCode: 200,
      message: "All orders successfully retrieved",
      orders: allOrders,
    });
  } catch (error) {
    console.error("Error retrieving all orders:", error);
    next(error);
  }
});

orders.delete("/orders/delete/:orderId", async (req, res, next) => {
  const { orderId } = req.params;

  try {
    const deletedOrder = await OrderModel.findByIdAndDelete(orderId);

    if (!deletedOrder) {
      return res.status(404).send({
        statusCode: 404,
        message: "Order not found",
      });
    }

    res.status(200).send({
      statusCode: 200,
      message: "Order deleted successfully",
      order: deletedOrder,
    });
  } catch (error) {
    console.error("Error deleting order:", error);
    next(error);
  }
});

module.exports = orders;
