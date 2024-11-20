const express = require("express");
const users = express.Router();
const UserModel = require("../models/UserModel");
const validateUserMiddleware = require("../middleware/validateUserMiddleware");

users.get("/users", async (req, res, next) => {
  try {
    const users = await UserModel.find();
    if (users.length === 0) {
      return res.status(404).send({
        statusCode: 404,
        message: "User not found",
      });
    }
    res.status(200).send({
      statusCode: 200,
      users,
    });
  } catch (error) {
    next(error);
  }
});

users.post(
  "/users/create",
  [validateUserMiddleware],
  async (req, res, next) => {
    const { name, surname, email, password, address, role } = req.body;

    const newUser = new UserModel({
      name,
      surname,
      email,
      password,
      address,
      role,
    });

    try {
      const user = await newUser.save();
      res.status(201).send({
        statusCode: 201,
        message: "User saved successfulluy",
        user,
      });
    } catch (error) {
      next(error);
    }
  }
);
