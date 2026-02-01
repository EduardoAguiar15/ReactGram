// app.js
const { swaggerUi, swaggerSpec } = require("./swagger");
//const cleanLikes = require('./utils/cleanLikes.js');
require("dotenv").config();

const express = require("express");
const path = require("path");
const cors = require("cors");

const app = express();

// config JSON and form data response
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Solve CORS
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use(cors({ credentials: true, origin: "http://localhost:3000" }));

// cleanLikes();

// Upload directory
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

// DB connection
if (process.env.NODE_ENV !== "test") {
  const conn = require("./config/db.js");
  conn();
}

// routes
const router = require("./routes/Router.js");
app.use(router);

module.exports = app;