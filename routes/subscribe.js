const express = require("express");
const Subscriber = require("../models/SubscribeModel");
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const newsletter = express.Router();

newsletter.post("/subscribe", async (req, res, next) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    const existingSubscriber = await Subscriber.findOne({ email });
    if (existingSubscriber) {
      return res.status(400).json({ message: "Email already subscribed" });
    }

    const newSubscriber = new Subscriber({ email });
    await newSubscriber.save();

    res.status(201).send({
      statusCode: 201,
      message: "Subscription successful",
      newSubscriber,
    });

    const msg = {
      to: email,
      from: process.env.SENDER_EMAIL,
      subject: "Welcome to Our Newsletter!",
      html: "<p>Thank you for subscribing to our newsletter!</p>",
    };
    await sgMail.send(msg);
  } catch (error) {
    next(error);
  }
});

newsletter.post("/send-newsletter", async (req, res, next) => {
  const { subject, text, html } = req.body;

  if (!subject || (!text && !html)) {
    return res.status(400).send({
      statusCode: 400,
      message: "Missing required fields: 'subject' or email content",
    });
  }

  try {
    const subscribers = await Subscriber.find();
    if (subscribers.length === 0) {
      return res.status(400).send({
        statusCode: 400,
        message: "No subscribers found",
      });
    }

    const emails = subscribers.map((subscriber) => subscriber.email);

    const msg = {
      to: emails,
      from: process.env.SENDER_EMAIL,
      subject,
      text,
      html,
    };

    await sgMail.sendMultiple(msg);

    res.status(201).send({
      statusCode: 201,
      message: "Newsletter sent successfully",
      result: {
        sentTo: emails.length,
        recipients: emails,
      },
    });
  } catch (error) {
    next(error);
  }
});

module.exports = newsletter;
