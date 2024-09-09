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
    if (!oldUser) {
      return res.status(400).send({
        msg: "User not found, please register first!",
      });
    }

    //   Compare the hashed password with the entered password
    let isPasswordValid = await bcrypt.compare(password, oldUser.password);
    if (!isPasswordValid)
      return res.status(400).send({ msg: "Wrong password please try again!" });

    // Retrieve user details without the password
    let currentUser = await User.findById(oldUser._id).select("-password");
    // console.log(currentUser);
    let payload = { currentUser };

    // Generate the token using JWT by signing
    // secrete key
    let token = jwt.sign(payload, JWT_SECRET); // we can also add expiration time {expiresIn: "1hr"}

    res.status(200).send({
      msg: `Login Successfully, Welcome ${oldUser.fullName}.`,
      userInfo: {
        token,
        payload: payload.currentUser,
      },
    });

    // // OR Set the token as an HTTP-only cookie / but we also need to modify our server.js app.use(cors({}))
    // res.cookie("access_token", token, {
    //   httpOnly: true,
    //   secure: false, //process.env.NODE_ENV === 'production', // Set this to false in development if you're not using HTTPS locally
    //   sameSite: "lax", // Allow cross-site cookies for navigation (use "strict" in production)
    //   maxAge: 60 * 60 * 1000, // 1 hour in milliseconds
    // });

    // // After sending the cookie Send response to the front end
    // res.status(200).send({
    //   msg: `Login Successfully, Welcome ${oldUser.fullName}.`,
    //   user: {
    //     id: oldUser._id,
    //     fullName: oldUser.fullName,
    //     email: oldUser.email,
    //   },
    // });
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
