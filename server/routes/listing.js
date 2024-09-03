const express = require("express");
const verifyToken = require("../middleware/auth");

const {
  createListing,
  deleteListing,
  updateListing,
  getListing,
  getListings,
} = require("../controller/listing");

const router = express.Router();

// Creating a new listing createListing
router.post("/create", verifyToken, createListing);

// Delete listing deleteListing
router.delete("/delete/:id", verifyToken, deleteListing);

// Updating a listing updateListing
router.put("/update/:id", verifyToken, updateListing);

// Get a single Listing by id getListing
router.get("/get/:id", getListing);

// Get all listings getListings
router.get("/get", getListings);

module.exports = router;
