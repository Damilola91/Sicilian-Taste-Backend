const express = require("express");
const users = express.Router();
const UserModel = require("../models/UserModel");
const validateUserMiddleware = require("../middleware/validateUserMiddleware");
const authenticationToken = require("../middleware/authenticationToken");

users.get("/users", [authenticationToken], async (req, res, next) => {
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

users.patch("/users/update/:userId", async (req, res, next) => {
  const { userId } = req.params;
  if (!userId) {
    return res.status(400).send({
      statusCode: 400,
      message: "User ID is required",
    });
  }
  const userExist = await UserModel.findById(userId);
  if (!userExist) {
    return res.status(400).send({
      statusCode: 400,
      message: "User not found with the given User Id",
    });
  }
  try {
    const updateUserData = req.body;
    const options = { new: true };
    const result = await UserModel.findByIdAndUpdate(
      userId,
      updateUserData,
      options
    );

    res.status(200).send(result);
  } catch (error) {
    next(error);
  }
});

users.delete("/users/delete/:userId", async (req, res, next) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).send({
      statusCode: 400,
      message: "User ID is required",
    });
  }

  try {
    const user = await UserModel.findByIdAndDelete(userId);

    if (!user) {
      return res.status(404).send({
        statusCode: 404,
        message: "User not found with the given User Id",
      });
    }

    res.status(200).send({
      statusCode: 200,
      message: "User deleted successfully",
    });
  } catch (error) {
    next(error);
  }
});

module.exports = users;
