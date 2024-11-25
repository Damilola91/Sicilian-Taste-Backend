const genericErrorHandler = (err, req, res, next) => {
  const errorStatus = err.statusCode || 500;
  const errorMessage = err.message || "Oops somethings went wrong";

  res.status(errorStatus).json({
    status: errorStatus,
    message: errorMessage,
    stack: err.stack,
  });
};

module.exports = genericErrorHandler;
