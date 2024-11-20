const validateUserMiddleware = (req, res, next) => {
  const errors = [];

  const { name, surname, email, address, password, role } = req.body;

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.push("The Email is Not Valid");
  }

  if (typeof role !== "string") {
    errors.push("Username must be a string");
  }

  if (typeof password !== "string" || password.length < 8) {
    errors.push("Password must be at least 8 char");
  }

  if (typeof name !== "string" || name.length < 3) {
    errors.push("Name must be a string and at least 3 char");
  }

  if (typeof surname !== "string" || surname.length < 3) {
    errors.push("Surname must be a string and at least 3 char");
  }

  if (typeof address !== "string") {
    errors.push("Insert a valid Address");
  }

  if (errors.length > 0) {
    res.status(400).send({ errors });
  } else {
    next();
  }
};

module.exports = validateUserMiddleware;
