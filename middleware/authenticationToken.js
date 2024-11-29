const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
  const userToken = req.header("Authorization");

  if (!userToken) {
    return res.status(401).send({
      statusCode: 401,
      message: "Token not valid or not passed",
    });
  }

  try {
    const token = userToken.replace("Bearer ", "");
    const verifiedToken = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verifiedToken;

    next();
  } catch (error) {
    res.status(403).send({
      statusCode: 403,
      message: "Token expired or not valid",
    });
  }
};

module.exports = authenticateToken;
