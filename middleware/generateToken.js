const jwt = require("jsonwebtoken");

const generateToken = (user) => {
  return jwt.sign(
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
};

module.exports = generateToken;
