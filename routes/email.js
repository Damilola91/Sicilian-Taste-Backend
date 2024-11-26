const express = require("express");
const email = express.Router();
const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

email.post("/send", async (req, res, next) => {
  const { to, subject, text, html } = req.body;

  try {
    if (!to || !subject || (!text && !html)) {
      return res.status(400).send({
        statusCode: 400,
        message: "Missing required fields: 'to', 'subject', or email content",
      });
    }

    const msg = {
      to,
      from: process.env.SENDER_EMAIL,
      subject,
      text,
      html,
    };

    await sgMail.send(msg);

    res.status(200).send({
      statusCode: 200,
      message: "Email inviata con successo",
    });
  } catch (error) {
    console.error(
      "Errore durante l'invio dell'email:",
      error.response?.body || error
    );

    res.status(500).send({
      statusCode: 500,
      message: "Errore durante l'invio dell'email",
      error: error.response?.body || error.message,
    });
  }
});

module.exports = email;
