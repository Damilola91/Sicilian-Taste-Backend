const express = require("express");
const cors = require("cors");
const path = require("path");
const init = require("./db");
require("dotenv").config();

const PORT = process.env.PORT || 4040;

const server = express();

server.use(express.json());
server.use(cors());

init();

server.listen(PORT, () => console.log(`Server is runnin' on PORT ${PORT}`));
