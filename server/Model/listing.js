const mongoose = require("mongoose");

const ListingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  propertyType: {
    type: String,
    required: true,
    enum: ["Apartment", "House", "Condo", "Townhouse", "Land"], // You can add more types
  },
  regularPrice: {
    type: Number,
    required: true,
  },
  discountPrice: {
    type: Number,
    required: true,
    validate: {
      validator: function (value) {
        return value < this.regularPrice;
      },
      message: "Discount price should be less than the regular price",
    },
  },
  images: {
    type: [String], // Array of image URLs
    validate: [arrayLimit, "{PATH} exceeds the limit of 4"],
  },
  location: {
    address: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    zipCode: {
      type: String,
      required: true,
    },
    coordinates: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true,
      },
    },
  },
  amenities: {
    type: [String], // Array of strings (e.g., 'Pool', 'Gym', 'Parking', 'Wi-Fi')
  },
  bedrooms: {
    type: Number,
    required: true,
  },
  bathrooms: {
    type: Number,
    required: true,
  },
  area: {
    type: Number, // Square footage or square meters
    required: true,
  },
  datePosted: {
    type: Date,
    default: Date.now,
  },
  listedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  isAvailable: {
    type: Boolean,
    default: true,
  },
},{timestamps:true});

// Custom validator to limit the number of images
function arrayLimit(val) {
  return val.length <= 4;
}

const Listing = mongoose.model("Listing", ListingSchema);

module.exports = Listing;
