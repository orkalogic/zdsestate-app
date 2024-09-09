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
// app.use(express.static('public'))  // when deploying to netlify

// If we are using cookies for the token
// app.use(
//   cors({
//     origin: "http://localhost:5173", // Your frontend URL
//     credentials: true, // Allow credentials (cookies)
//   })
// );

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
