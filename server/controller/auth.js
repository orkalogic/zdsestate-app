const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const User = require("../Model/user");
const JWT_SECRET = process.env.JWT_SECRET;

//--------------------User Controllers------------------------

// Register a user / Signup
const register = async (req, res) => {
  try {
    let { fullName, email, password } = req.body;
    if (!fullName || !email || !password) {
      return res.status(400).send({ msg: "All fields are required!" });
    }

    // look for a user with the same email has been registered before
    let oldUser = await User.findOne({ email });
    if (oldUser) {
      return res.status(404).send({
        msg: "User already exist, please login!",
      });
    }

    // Create a hashed password using bcrypt.hash and also add a salt for better security
    let hashedPassword = await bcrypt.hash(password, 10);
    let newUser = await User.create({
      fullName,
      email,
      password: hashedPassword,
    });
    return res
      .status(200)
      .send({ msg: "User registered successfully.", newUser });
  } catch (error) {
    return res
      .status(500)
      .send({ msg: "Internal server error", error: error.message });
  }
};

// Login Users
const login = async (req, res) => {
  try {
    let { email, password } = req.body;
    if (!email || !password) {
      return res.send({ msg: "Both email and password are required!" });
    }

    // Search a user with the provided information
    let oldUser = await User.findOne({ email: email }).select("+password");
    console.log(oldUser);
    if (!oldUser) {
      return res.status(400).send({
        msg: "User not found please register first!",
      });
    }

    //   Compare the hashed password with the entered password
    let isPasswordValid = await bcrypt.compare(password, oldUser.password);
    if (!isPasswordValid)
      return res.send({ msg: "Wrong password please try again!" });

    // Generate the token using JWT
    let payload = {
      id: oldUser._id,
      email: oldUser.email,
    };

    // sign
    // secrete key
    let token = await jwt.sign(payload, JWT_SECRET); // we can also add expiration time {expiresIn: "1hr"}

    res.send({ msg: "Login Successfully, Welcome.", token });
  } catch (error) {
    return res
      .status(500)
      .send({ msg: "Internal server error", error: error.message });
  }
};

module.exports = {
  register,
  login,
};
