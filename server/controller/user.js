const bcrypt = require("bcrypt");
require("dotenv").config();

const User = require("../Model/user");

// Update a user
const updateUser = async (req, res) => {
  // check if the user is authorized
  if (req.user.id !== req.params.id) {
    return res
      .status(401)
      .send({ msg: "You can only update your own account!" });
  }

  try {
    if (req.body.password) {
      req.body.password = await bcrypt.hash(req.body.password, 10);
    }

    let updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      {
        $set: {
          fullName: req.body.fullName,
          email: req.body.email,
          password: req.body.password,
          avatar: req.body.avatar,
        },
      },
      { new: true, select: "-password" }
    );
    // send updatedUser without password
    return res.status(200).send({ msg: "User updated successfully.", updatedUser });
  } catch (err) {
    return res
      .status(500)
      .send({ msg: "Internal server error", error: err.message });
  }
};

// Delete a user
const deleteUser = async (req, res) => {
  if (req.user.id !== req.params.id)
    return res
      .status(401)
      .send({ msg: "You can only delete your own account!" });
  try {
    // If user is found in the DB
    await User.findByIdAndDelete(req.params.id);
    return res.status(200).send({ msg: "User deleted successfully." });
  } catch (err) {
    return res
      .status(500)
      .send({ msg: "Internal error couldn't delete!", Error: err.message });
  }
};

module.exports = { updateUser, deleteUser };
