const express = require("express");
const router = express.Router();
const { check } = require("express-validator");

const { register, login } = require("../controller/auth");

//-----------------USER CRUD Operations----------------------

// Register a User / Signup
router.post(  "/register",   [
  check("fullName", "Full name is required").not().isEmpty(),
  check("email", "Please provide a valid email").isEmail(),
  check("password", "Password must be at least 6 character").isLength({
    min: 6,
  }),
], register);

// Login a user / authenticate
router.post(
  "/login",
  [
    check("email", "Please include a valid email").isEmail(),
    check("password", "Password is required").exists(),
  ],
  login
);

module.exports = router;
