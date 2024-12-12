const express = require("express");
const email = express.Router();
const sgMail = require("@sendgrid/mail");
const validateEmail = require("../middleware/validateEmailMiddleware");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

email.post("/send", validateEmail, async (req, res, next) => {
  const { from, subject, text, html } = req.body;

  try {
    const msg = {
      to: process.env.SENDER_EMAIL,
      from: process.env.SENDER_EMAIL,
      "reply-to": from,
      subject,
      text,
      html,
    };

    await sgMail.send(msg);

    res.status(201).send({
      statusCode: 201,
      message: "Email sent successfully",
      msg,
    });
  } catch (error) {
    console.error("Error sending email:", error);

    if (error.response) {
      console.error("SendGrid error details:", error.response.body);
    }

    next(error);
  }
});

module.exports = email;
