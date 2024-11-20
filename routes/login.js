const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const login = express.Router();
const UserModel = require("../models/UserModel");

login.post("/login", async (req, res, next) => {
  try {
    const user = await UserModel.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).send({
        statusCode: 404,
        message: "Utente non trovato con l'email fornita",
      });
    }

    const isPasswordValid = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!isPasswordValid) {
      return res.status(401).send({
        statusCode: 401,
        message: "Password or Email not valid",
      });
    }

    const userToken = jwt.sign(
      {
        name: user.name,
        surname: user.surname,
        email: user.email,
        role: user.role,
        _id: user._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "120m",
      }
    );

    res
      .header("Authorization", userToken)
      .status(200)
      .send({
        statusCode: 200,
        message: "Ok sei loggato correttamente",
        token: userToken,
        user: {
          name: user.name,
          surname: user.surname,
          email: user.email,
          role: user.role,
          _id: user._id,
        },
      });
  } catch (error) {
    next(error);
  }
});

login.post("/logout", (req, res) => {
  res.status(200).send({
    statusCode: 200,
    message: "Logout eseguito con successo",
  });
});

module.exports = login;
