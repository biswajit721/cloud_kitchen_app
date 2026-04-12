const mongoose = require("mongoose");

/*
  Order Model
  ───────────
  Each order belongs to a user and contains an array of food items.
  orderStatus and paymentStatus have strict enums so invalid values
  are rejected at the DB level.
*/

const orderItemSchema = new mongoose.Schema({
  food:     { type: mongoose.Schema.Types.ObjectId, ref: "Food", required: true },
  quantity: { type: Number, required: true, min: 1, default: 1 },
}, { _id: false });

const shippingAddressSchema = new mongoose.Schema({
  fullName:   { type: String, required: true },
  phone:      { type: String },
  address:    { type: String, required: true },
  city:       { type: String, required: true },
  postalCode: { type: String },
  country:    { type: String, default: "India" },
}, { _id: false });

const orderSchema = new mongoose.Schema({
  user: {
    type:     mongoose.Schema.Types.ObjectId,
    ref:      "User",
    required: true,
  },

  items: {
    type:     [orderItemSchema],
    required: true,
    validate: {
      validator: arr => arr.length > 0,
      message:   "Order must have at least one item",
    },
  },

  totalAmount: {
    type:     Number,
    required: true,
    min:      [0, "Total amount cannot be negative"],
  },

  shippingAddress: {
    type:     shippingAddressSchema,
    required: true,
  },

  paymentMethod: {
    type:    String,
    enum:    ["cod", "upi", "card", "wallet", "netbanking"],
    default: "cod",
  },

  /* ── Status fields with strict enums ── */
  orderStatus: {
    type:    String,
    enum:    ["pending", "confirmed", "preparing", "out_for_delivery", "delivered", "cancelled"],
    default: "pending",
  },

  paymentStatus: {
    type:    String,
    enum:    ["pending", "paid", "failed"],
    default: "pending",
  },

  /* Optional notes from customer */
  notes: { type: String },

}, { timestamps: true });

module.exports = mongoose.model("Order", orderSchema);