const express = require("express");
const mongoose = require("mongoose");

const cors = require("cors");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 3000;

// Connect to MongoDB database
const mongoDBConnection = require("./config/db.connection");
 mongoDBConnection()
// app.use()
// Middleware
app.use(express.json());
app.use(cors());
// app.use(express.urlencoded({ extended: true }));

// Routes
const router = require("./router");
app.use("/api", router);
app.get("", (req, res) => {res.send("Hello World!")});
// Start the server
app.listen(port, () => console.log(`Server running on port ${port}`));
