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

  // ── NEW: optional phone number ──────────────────────────────────────────
  phone: {
    type: String,
    trim: true,
    default: null
    // sparse unique index is added below so multiple null values are allowed
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

  // ── NEW: forgot-password fields ─────────────────────────────────────────
  //
  // Flow:
  //   1. User requests OTP  → resetOtp (hashed) + resetOtpExpires stored
  //   2. User verifies OTP  → resetOtp cleared, resetToken (hashed) + resetTokenExpires stored
  //   3. User sets new pwd  → resetToken cleared, password updated
  //
  resetOtp: {
    type: String,
    default: null          // bcrypt-hashed 6-digit OTP
  },
  resetOtpExpires: {
    type: Date,
    default: null          // OTP valid for 10 minutes
  },
  resetToken: {
    type: String,
    default: null          // sha256-hashed random token issued after OTP passes
  },
  resetTokenExpires: {
    type: Date,
    default: null          // token valid for 15 minutes
  }

}, { timestamps: true });

// Sparse unique index → phone must be unique BUT multiple documents can have null
userSchema.index({ phone: 1 }, { unique: true, sparse: true });

module.exports = mongoose.model('User', userSchema);