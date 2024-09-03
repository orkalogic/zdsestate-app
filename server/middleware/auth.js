const jwt = require("jsonwebtoken");
require("dotenv").config();

const JWT_SECRET = process.env.JWT_SECRET;

const verifyToken = async (req, res, next) => {
  // Getting token from the header
  const token = req.headers.authorization;

  // Check if
  if (!token) {
    return res.status(401).send({ msg: "No token, authorization denied" });
  }

  // Verify the token
  try {
    const clientToken = token.split(" ")[1];
    const verifiedToken = await jwt.verify(clientToken, JWT_SECRET);
    req.user = verifiedToken;
    next();
  } catch (err) {
    res.status(401).send({ msg: "Token is not valid" });
  }
};

module.exports = verifyToken;
