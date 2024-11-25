const badRequestHandler = (err, req, res, next) => {
  if (err.status === 400) {
    res.status().send({
      message: err.message,
      errors: err.errorsList.map((e) => e.msg),
    });
  } else {
    next(err);
  }
};

module.exports = badRequestHandler;
