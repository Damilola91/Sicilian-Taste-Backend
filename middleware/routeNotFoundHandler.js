const routeNotFoundMiddleWare = (req, res, next) => {
  res.status(404).send({
    statusCode: 404,
    message: "Ooops the requested route doesn't exist",
  });
};

module.exports = routeNotFoundMiddleWare;
