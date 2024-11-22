const express = require("express");
const cors = require("cors");
const path = require("path");
const init = require("./db");
require("dotenv").config();
const usersRoute = require("./routes/user");
const productsRoute = require("./routes/products");
const ordersRoute = require("./routes/orders");
const loginRoute = require("./routes/login");
const requestedTimeMiddleware = require("./middleware/requestedTimeMiddleware");

const PORT = process.env.PORT || 4040;

const server = express();

server.use(express.json());
server.use(cors());
server.use(requestedTimeMiddleware);
server.use("/", usersRoute);
server.use("/", productsRoute);
server.use("/", loginRoute);
server.use("/", ordersRoute);

init();

server.listen(PORT, () => console.log(`Server is runnin' on PORT ${PORT}`));
