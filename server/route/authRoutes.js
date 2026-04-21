const express = require('express');
const router  = express.Router();

const {
  registerUser,
  loginUser,
  logoutUser,
  getMe,
  // ── Profile management ──
  updateProfile,
  updateAvatar,
  changePassword,
  // ── Forgot-password flow ──
  forgotPassword,
  verifyOtp,
  resetPassword,
} = require('../controller/authController');

const { protect } = require('../middleware/authMiddleware');

// ── Auth ──────────────────────────────────────────────────────────────────
router.post('/register', registerUser);
router.post('/login',    loginUser);
router.post('/logout',   logoutUser);
router.get('/me',        protect, getMe);

// ── Profile (Protected — must be logged in) ───────────────────────────────
// Update name, phone, address
router.put('/update-profile', protect, updateProfile);

// Update profile photo (base64)
router.put('/update-avatar',  protect, updateAvatar);

// Change password (needs current password)
router.put('/change-password', protect, changePassword);

// ── Forgot-password flow (3 steps, no auth required) ─────────────────────
// Step 1 — Enter email → OTP sent
router.post('/forgot-password', forgotPassword);

// Step 2 — Enter OTP → resetToken returned
router.post('/verify-otp',      verifyOtp);

// Step 3 — Enter new password + resetToken
router.post('/reset-password',  resetPassword);

module.exports = router;