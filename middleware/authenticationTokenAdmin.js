const jwt = require("jsonwebtoken");

const authenticationTokenAdmin = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) {
    return res.status(401).send({
      statusCode: 401,
      message: "Access denied. No token provided.",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "admin" && decoded.role !== "company") {
      return res.status(403).send({
        statusCode: 403,
        message: "Access denied. Admins only.",
      });
    }

    req.user = decoded;
    next();
  } catch (error) {
    res.status(400).send({
      statusCode: 400,
      message: "Invalid token.",
    });
  }
};

module.exports = authenticationTokenAdmin;
