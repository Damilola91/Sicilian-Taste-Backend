const jwt = require("jsonwebtoken");

const authenticateAdminOrCompany = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      statusCode: 401,
      message: "Authorization header missing",
    });
  }

  if (!authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      statusCode: 401,
      message: "Authorization must be Bearer token",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!["admin", "company"].includes(decoded.role)) {
      return res.status(403).json({
        statusCode: 403,
        message: "Access denied: admin or company only",
      });
    }

    // 🔑 utente disponibile alle rotte
    req.user = decoded;

    next();
  } catch (error) {
    return res.status(403).json({
      statusCode: 403,
      message: "Token expired or invalid",
    });
  }
};

module.exports = authenticateAdminOrCompany;
