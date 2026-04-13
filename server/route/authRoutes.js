const express = require('express');
const router  = express.Router();

const {
  registerUser,
  loginUser,
  logoutUser,
  getMe,
  // ── NEW ──
  forgotPassword,
  verifyOtp,
  resetPassword,
} = require('../controller/authController');

const { protect } = require('../middleware/authMiddleware');

// ── Original routes (unchanged) ────────────────────────────────────────────
router.post('/register', registerUser);
router.post('/login',    loginUser);
router.post('/logout',   logoutUser);
router.get('/me',        protect, getMe);

// ── NEW: Forgot-password flow (3 steps) ────────────────────────────────────
//
//  Step 1 — User enters email or phone → OTP is generated and sent
router.post('/forgot-password', forgotPassword);

//  Step 2 — User enters the 6-digit OTP → verified, short-lived resetToken returned
router.post('/verify-otp',      verifyOtp);

//  Step 3 — User enters new password + the resetToken from step 2
router.post('/reset-password',  resetPassword);

module.exports = router;