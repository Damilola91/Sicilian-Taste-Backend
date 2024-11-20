const requestedTimeMiddleware = (req, res, next) => {
  const day = new Date();
  res.on("finish", () => {
    const duration = new Date() - day;
    console.log(`la richiesta ${req.method} ha impiegato ${duration} `);
  });

  next();
};

module.exports = requestedTimeMiddleware;
