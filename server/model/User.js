const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },

  phone: {
    type: String,
    trim: true,
    default: null
  },

  password: {
    type: String,
    required: true
  },

  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },

  // ── Profile avatar (base64 or URL) ──────────────────────────────────────
  avatar: {
    type: String,
    default: null
  },

  // ── Delivery address ─────────────────────────────────────────────────────
  address: {
    street:     { type: String, default: "" },
    city:       { type: String, default: "" },
    state:      { type: String, default: "" },
    postalCode: { type: String, default: "" },
    country:    { type: String, default: "India" },
  },

  // ── Forgot-password fields ───────────────────────────────────────────────
  resetOtp:          { type: String, default: null },
  resetOtpExpires:   { type: Date,   default: null },
  resetToken:        { type: String, default: null },
  resetTokenExpires: { type: Date,   default: null },

}, { timestamps: true });

// Sparse unique index → phone unique but multiple nulls allowed
userSchema.index({ phone: 1 }, { unique: true, sparse: true });

module.exports = mongoose.model('User', userSchema);