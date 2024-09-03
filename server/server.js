const express = require("express");
require("dotenv").config();
const cors = require("cors");

const dbConnection = require("./config/connection");
const verifyToken = require("./middleware/auth");
const authRoutes = require("./routes/auth");
const listingRoutes = require("./routes/listing");

const app = express();
const PORT = process.env.PORT || 4040;

//------------------middleware-----------------------------------
app.use(express.json());
app.use(cors());

//------------------DB Connection---------------------------------
dbConnection();

//------------------User Routes---------------------------

app.use("/auth", authRoutes);

//------------------Listing Routes---------------------------

app.use("/listings", listingRoutes);

// Test routes
app.get("/testRoute", verifyToken, async (req, res) => {
  // console.log(req.user)
  return res.send("Welcome!");
});

// ------------------------------server connection-------------------------------------------------------------------

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
