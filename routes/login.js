const express = require("express");
const generateToken = require("../middleware/generateToken");
const validatePassword = require("../middleware/validatePassword");
const login = express.Router();

login.post("/login", validatePassword, (req, res) => {
  const user = req.user;

  const userToken = generateToken(user);

  res
    .header("Authorization", userToken)
    .status(200)
    .send({
      statusCode: 200,
      message: "You are successfully logged in",
      token: userToken,
      user: {
        name: user.name,
        surname: user.surname,
        email: user.email,
        role: user.role,
        _id: user._id,
      },
    });
});

login.post("/logout", (req, res) => {
  res.clearCookie("token");

  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (token) {
    console.log(`Token invalidato: ${token}`);
  }

  res.status(200).send({
    statusCode: 200,
    message: "Logout successful",
  });
});

module.exports = login;
