const express = require("express");
const router = express.Router();

const { updateUser, deleteUser } = require("../controller/user");
const verifyToken = require("../middleware/auth");

// router.get("/test", test);
router.post("/update/:id", verifyToken, updateUser);
router.delete("/delete/:id", verifyToken, deleteUser);
// router.get("/listings/:id", verifyToken, getUserListings);
// router.get("/:id", verifyToken, getUser);

module.exports = router;
