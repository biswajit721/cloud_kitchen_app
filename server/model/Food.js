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
      default: "",
    },
    thumbnail: {
      type: String,
      required: [true, "Thumbnail image is required"],
    },
    images: [{ type: String }],
    category: {
      type: String,
      enum: ["Veg", "Non-Veg", "Dessert", "Drinks", "Snacks", "Beverages"],
      default: "Veg",
    },
    // isVeg: true = vegetarian (green dot), false = non-vegetarian (red dot)
    // IMPORTANT: default is true. ALL existing items without this field
    // get migrated to true via the migrate endpoint.
    isVeg: {
      type: Boolean,
      default: true,
    },
    // isPureVeg: true = Jain/Pure Veg (no onion, no garlic)
    // Only meaningful when isVeg is also true.
    isPureVeg: {
      type: Boolean,
      default: false,
    },
    isTrending: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// NO pre-save hook — caused "next is not a function" on some Mongoose versions.
// isPureVeg → isVeg logic is handled in the controller instead.

module.exports = mongoose.model("Food", foodSchema);