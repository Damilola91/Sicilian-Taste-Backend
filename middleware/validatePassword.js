const bcrypt = require("bcrypt");
const UserModel = require("../models/UserModel");

const validatePassword = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).send({
        statusCode: 400,
        message: "Email e password sono obbligatori",
      });
    }

    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).send({
        statusCode: 404,
        message: "Utente non trovato con l'email fornita",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).send({
        statusCode: 401,
        message: "Password o email non validi",
      });
    }

    req.user = user;

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = validatePassword;
