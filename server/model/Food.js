const mongoose = require("mongoose");

const foodSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Food name is required"],
      trim: true,
    },

    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },

    description: {
      type: String,
      trim: true,
    },

    thumbnail: {
      type: String,
      required: [true, "Thumbnail image is required"],
    },

    images: [
      {
        type: String,
      },
    ],

    category: {
      type: String,
      enum: ["Veg", "Non-Veg", "Dessert", "Drinks"],
      default: "Veg",
    },

    // ✅ NEW — Admin toggles this to feature food in Trending strip
    isTrending: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Food", foodSchema);