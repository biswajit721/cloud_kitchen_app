const User       = require('../model/User');
const bcrypt     = require('bcrypt');
const jwt        = require('jsonwebtoken');
const crypto     = require('crypto');
const nodemailer = require('nodemailer');

// ─────────────────────────────────────────────────────────────────────────────
// Gmail transporter
// Setup: https://myaccount.google.com/apppasswords
// ─────────────────────────────────────────────────────────────────────────────
const mailer = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────
const generateToken = (id, role) =>
  jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '30d' });

const generateOtp = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

// ─────────────────────────────────────────────────────────────────────────────
// Professional HTML OTP Email
// ─────────────────────────────────────────────────────────────────────────────
const sendOtpEmail = async (toEmail, otp) => {
  await mailer.sendMail({
    from:    `"MyApp 🍔" <${process.env.EMAIL_USER}>`,
    to:      toEmail,
    subject: 'Your Password Reset OTP - MyApp',
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
</head>
<body style="margin:0;padding:0;background:#FFF9F2;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#FFF9F2;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="480" cellpadding="0" cellspacing="0"
          style="background:#ffffff;border-radius:20px;overflow:hidden;
                 border:1.5px solid #F0ECE6;box-shadow:0 4px 24px rgba(0,0,0,0.07);">

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#FF7A00,#FF9A3C);
                       padding:32px 40px;text-align:center;">
              <div style="font-size:40px;margin-bottom:6px;">🍔</div>
              <h1 style="margin:0;color:#ffffff;font-size:24px;
                         font-weight:800;letter-spacing:-0.5px;">MyApp</h1>
              <p style="margin:6px 0 0;color:rgba(255,255,255,0.82);font-size:13px;">
                Password Reset Request
              </p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:36px 40px;">
              <p style="margin:0 0 6px;color:#5C5C6E;font-size:14px;">Hello,</p>
              <p style="margin:0 0 28px;color:#5C5C6E;font-size:14px;line-height:1.7;">
                We received a request to reset your
                <strong style="color:#2C2C2C;">MyApp</strong> account password.
                Enter the OTP below in the app to continue.
                It expires in <strong style="color:#FF7A00;">10 minutes</strong>.
              </p>

              <!-- OTP Box -->
              <div style="background:#FFF3E8;border:2px dashed #FF7A00;
                          border-radius:16px;padding:30px;text-align:center;
                          margin-bottom:28px;">
                <p style="margin:0 0 10px;color:#9CA3AF;font-size:11px;font-weight:700;
                           letter-spacing:0.12em;text-transform:uppercase;">
                  Your One-Time Password
                </p>
                <div style="font-size:48px;font-weight:900;letter-spacing:14px;
                            color:#FF7A00;font-family:'Courier New',Courier,monospace;
                            line-height:1;">
                  ${otp}
                </div>
                <p style="margin:12px 0 0;color:#9CA3AF;font-size:12px;">
                  ⏱️ Expires in 10 minutes
                </p>
              </div>

              <!-- Security Warning -->
              <div style="background:#FEF2F2;border-left:4px solid #EF4444;
                          border-radius:0 8px 8px 0;padding:14px 16px;
                          margin-bottom:28px;">
                <p style="margin:0;color:#DC2626;font-size:13px;line-height:1.6;">
                  🔐 <strong>Security Notice:</strong> Never share this OTP with anyone.
                  MyApp will <u>never</u> ask for your OTP via call or message.
                  If you didn't request this, you can safely ignore this email.
                </p>
              </div>

              <p style="margin:0;color:#9CA3AF;font-size:12.5px;line-height:1.7;">
                Can't find this email? Check your
                <strong style="color:#5C5C6E;">spam or junk folder</strong>.
              </p>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding:0 40px;">
              <div style="height:1px;background:#F0ECE6;"></div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#F8F6F3;padding:22px 40px;text-align:center;">
              <p style="margin:0 0 4px;color:#9CA3AF;font-size:12px;font-weight:600;">
                MyApp — Hot food, your door 🍔
              </p>
              <p style="margin:0;color:#C4BAB1;font-size:11px;line-height:1.6;">
                © 2025 MyApp. All rights reserved.<br/>
                You received this because a password reset was requested for your account.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`,
  });
};

// ═════════════════════════════════════════════════════════════════════════════
// REGISTER
// @route POST /api/auth/register
// ═════════════════════════════════════════════════════════════════════════════
const registerUser = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ message: 'Name, email and password are required' });

    const emailExists = await User.findOne({ email: email.toLowerCase().trim() });
    if (emailExists)
      return res.status(400).json({ message: 'User already exists with this email' });

    if (phone) {
      const phoneExists = await User.findOne({ phone: phone.trim() });
      if (phoneExists)
        return res.status(400).json({ message: 'Phone number is already registered' });
    }

    const salt           = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      phone:    phone ? phone.trim() : null,
    });

    if (user) {
      res.status(201).json({
        _id:   user.id,
        name:  user.name,
        email: user.email,
        phone: user.phone,
        role:  user.role,
        token: generateToken(user.id, user.role),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ═════════════════════════════════════════════════════════════════════════════
// LOGIN (email OR phone)
// @route POST /api/auth/login
// ═════════════════════════════════════════════════════════════════════════════
const loginUser = async (req, res) => {
  try {
    const { email, phone, password, method } = req.body;

    let user;
    if (method === 'phone' && phone) {
      user = await User.findOne({ phone: phone.trim() });
    } else if (email) {
      user = await User.findOne({ email: email.toLowerCase().trim() });
    } else {
      return res.status(400).json({ message: 'Email or phone is required' });
    }

    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        _id:   user.id,
        name:  user.name,
        email: user.email,
        phone: user.phone,
        role:  user.role,
        token: generateToken(user.id, user.role),
      });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ═════════════════════════════════════════════════════════════════════════════
// LOGOUT
// @route POST /api/auth/logout
// ═════════════════════════════════════════════════════════════════════════════
const logoutUser = (req, res) => {
  res.status(200).json({ message: 'Logged out successfully' });
};

// ═════════════════════════════════════════════════════════════════════════════
// GET ME
// @route GET /api/auth/me
// ═════════════════════════════════════════════════════════════════════════════
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select('-password -resetOtp -resetOtpExpires -resetToken -resetTokenExpires');
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ═════════════════════════════════════════════════════════════════════════════
// STEP 1 — Send OTP to Email only
// @route POST /api/auth/forgot-password
// @body  { method: "email", identifier: "email@example.com" }
// ═════════════════════════════════════════════════════════════════════════════
const forgotPassword = async (req, res) => {
  try {
    const { method, identifier } = req.body;

    if (!identifier)
      return res.status(400).json({ message: 'Email address is required' });

    // Only email is supported now
    if (method && method !== 'email')
      return res.status(400).json({ message: 'Only email reset is supported' });

    const user = await User.findOne({ email: identifier.toLowerCase().trim() });

    // Same message whether user exists or not — prevents user enumeration
    const genericMsg = 'If that email is registered, an OTP has been sent.';

    if (!user) return res.status(200).json({ message: genericMsg });

    // Generate OTP → hash → save
    const otp       = generateOtp();
    const salt      = await bcrypt.genSalt(10);
    const hashedOtp = await bcrypt.hash(otp, salt);

    user.resetOtp        = hashedOtp;
    user.resetOtpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 min
    await user.save();

    // Send professional HTML email
    await sendOtpEmail(user.email, otp);

    res.status(200).json({ message: genericMsg });

  } catch (error) {
    console.error('forgotPassword error:', error.message);

    // Friendly error if Gmail App Password not configured
    if (error.code === 'EAUTH' || error.responseCode === 535) {
      return res.status(500).json({
        message: 'Email service error. Check EMAIL_USER and EMAIL_PASS in your .env file.'
      });
    }

    res.status(500).json({ message: error.message });
  }
};

// ═════════════════════════════════════════════════════════════════════════════
// STEP 2 — Verify OTP → return resetToken
// @route POST /api/auth/verify-otp
// @body  { method: "email", identifier, otp }
// ═════════════════════════════════════════════════════════════════════════════
const verifyOtp = async (req, res) => {
  try {
    const { identifier, otp } = req.body;

    if (!identifier || !otp)
      return res.status(400).json({ message: 'Email and OTP are required' });

    const user = await User.findOne({ email: identifier.toLowerCase().trim() });

    if (!user || !user.resetOtp || !user.resetOtpExpires)
      return res.status(400).json({ message: 'OTP not requested or already used. Please start again.' });

    if (new Date() > user.resetOtpExpires) {
      user.resetOtp        = null;
      user.resetOtpExpires = null;
      await user.save();
      return res.status(400).json({ message: 'OTP has expired. Please request a new one.' });
    }

    const otpMatch = await bcrypt.compare(otp.toString().trim(), user.resetOtp);
    if (!otpMatch)
      return res.status(400).json({ message: 'Invalid OTP. Please try again.' });

    // OTP correct — issue 15-min reset token
    const plainResetToken  = crypto.randomBytes(32).toString('hex');
    const hashedResetToken = crypto.createHash('sha256').update(plainResetToken).digest('hex');

    user.resetOtp          = null;
    user.resetOtpExpires   = null;
    user.resetToken        = hashedResetToken;
    user.resetTokenExpires = new Date(Date.now() + 15 * 60 * 1000);
    await user.save();

    res.status(200).json({ resetToken: plainResetToken });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ═════════════════════════════════════════════════════════════════════════════
// STEP 3 — Reset Password
// @route POST /api/auth/reset-password
// @body  { resetToken, newPassword }
// ═════════════════════════════════════════════════════════════════════════════
const resetPassword = async (req, res) => {
  try {
    const { resetToken, newPassword } = req.body;

    if (!resetToken || !newPassword)
      return res.status(400).json({ message: 'Reset token and new password are required' });

    if (newPassword.length < 6)
      return res.status(400).json({ message: 'Password must be at least 6 characters' });

    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    const user = await User.findOne({
      resetToken:        hashedToken,
      resetTokenExpires: { $gt: new Date() },
    });

    if (!user)
      return res.status(400).json({ message: 'Reset link is invalid or has expired. Please start again.' });

    const salt    = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    user.resetToken        = null;
    user.resetTokenExpires = null;
    await user.save();

    res.status(200).json({ message: 'Password reset successfully. You can now log in.' });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  getMe,
  forgotPassword,
  verifyOtp,
  resetPassword,
};