const express = require("express");
const cors = require("cors");
const path = require("path");
const init = require("./db");
require("dotenv").config();
const usersRoute = require("./routes/user");
const productsRoute = require("./routes/products");
const ordersRoute = require("./routes/orders");
const loginRoute = require("./routes/login");
const reviewsRoute = require("./routes/reviews");
const emailRoute = require("./routes/email");
const requestedTimeMiddleware = require("./middleware/requestedTimeMiddleware");
const routeNotFoundMiddleWare = require("./middleware/routeNotFoundHandler");
const genericErrorHandler = require("./middleware/genericErrorHandler");
const badRequestHandler = require("./middleware/badRequestHandler");

const PORT = process.env.PORT || 4040;

const server = express();

server.use(express.json());
server.use(cors());
server.use(requestedTimeMiddleware);

server.use("/", usersRoute);
server.use("/", productsRoute);
server.use("/", reviewsRoute);
server.use("/", loginRoute);
server.use("/", ordersRoute);
server.use("/", emailRoute);

server.use(badRequestHandler);
server.use(genericErrorHandler);
server.use(routeNotFoundMiddleWare);

init();

server.listen(PORT, () => console.log(`Server is runnin' on PORT ${PORT}`));
