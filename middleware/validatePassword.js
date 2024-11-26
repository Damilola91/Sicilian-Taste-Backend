const bcrypt = require("bcrypt");
const UserModel = require("../models/UserModel");

const validatePassword = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).send({
        statusCode: 400,
        message: "Email and password are required",
      });
    }

    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).send({
        statusCode: 404,
        message: "User not found with the email provided",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).send({
        statusCode: 401,
        message: "Password or email not valid",
      });
    }

    req.user = user;

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = validatePassword;
