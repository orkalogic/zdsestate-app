const mongoose = require("mongoose");
require("dotenv").config();

const MONGO_URI = process.env.MONGO_URI;

// Database Connection

async function dbConnection() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Database Connected successfully.");
  } catch (err) {
    console.log({ msg: "Error while connecting to database!", error: err.msg });
  }
}

module.exports = dbConnection;
