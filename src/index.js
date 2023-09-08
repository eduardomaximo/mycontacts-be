const express = require("express");
require("express-async-errors");

const routes = require("./routes");
const errorHandler = require("./app/middlewares/errorHandler");
const cors = require("./app/middlewares/cors");

const app = express();

app.use(express.json());

// CORS middleware
app.use(cors);

app.use(routes);

app.use(errorHandler);

app.listen(3001, console.log("Server started at http://localhost:3001"));
