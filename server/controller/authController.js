const User       = require('../model/User');
const bcrypt     = require('bcrypt');
const jwt        = require('jsonwebtoken');
const crypto     = require('crypto');
const nodemailer = require('nodemailer');

// ─────────────────────────────────────────────────────────────────────────────
// Gmail transporter
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
// Professional HTML OTP Email — SnapBite branding
// ─────────────────────────────────────────────────────────────────────────────
const sendOtpEmail = async (toEmail, otp) => {
  await mailer.sendMail({
    from:    `"SnapBite" <${process.env.EMAIL_USER}>`,
    to:      toEmail,
    subject: 'Your Password Reset OTP — SnapBite',
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

          <tr>
            <td style="background:linear-gradient(135deg,#FF7A00,#FF9A3C);
                       padding:32px 40px;text-align:center;">
              
              <div style="margin-bottom:12px;">
                <img src="https://your-live-website.com/snapbite-logo.png" alt="SnapBite Logo" style="width: 56px; height: 56px; object-fit: contain; border-radius: 12px; background: #ffffff; padding: 4px; display: inline-block;" />
              </div>

              <h1 style="margin:0;color:#ffffff;font-size:26px;
                         font-weight:800;letter-spacing:-0.5px;">SnapBite</h1>
              <p style="margin:6px 0 0;color:rgba(255,255,255,0.82);font-size:13px;">
                Hot food, your door — Password Reset Request
              </p>
            </td>
          </tr>

          <tr>
            <td style="padding:36px 40px;">
              <p style="margin:0 0 6px;color:#5C5C6E;font-size:14px;">Hello,</p>
              <p style="margin:0 0 28px;color:#5C5C6E;font-size:14px;line-height:1.7;">
                We received a request to reset your
                <strong style="color:#2C2C2C;">SnapBite</strong> account password.
                Enter the OTP below to continue.
                It expires in <strong style="color:#FF7A00;">10 minutes</strong>.
              </p>

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

              <div style="background:#FEF2F2;border-left:4px solid #EF4444;
                          border-radius:0 8px 8px 0;padding:14px 16px;
                          margin-bottom:28px;">
                <p style="margin:0;color:#DC2626;font-size:13px;line-height:1.6;">
                  🔐 <strong>Security Notice:</strong> Never share this OTP with anyone.
                  SnapBite will <u>never</u> ask for your OTP via call or message.
                  If you didn't request this, you can safely ignore this email.
                </p>
              </div>

              <p style="margin:0;color:#9CA3AF;font-size:12.5px;line-height:1.7;">
                Can't find this email? Check your
                <strong style="color:#5C5C6E;">spam or junk folder</strong>.
              </p>
            </td>
          </tr>

          <tr>
            <td style="padding:0 40px;">
              <div style="height:1px;background:#F0ECE6;"></div>
            </td>
          </tr>

          <tr>
            <td style="background:#F8F6F3;padding:22px 40px;text-align:center;">
              <p style="margin:0 0 4px;color:#9CA3AF;font-size:12px;font-weight:600;">
                SnapBite — Hot food, your door
              </p>
              <p style="margin:0;color:#C4BAB1;font-size:11px;line-height:1.6;">
                © 2026 SnapBite. All rights reserved.<br/>
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
        _id:    user.id,
        name:   user.name,
        email:  user.email,
        phone:  user.phone,
        role:   user.role,
        avatar: user.avatar,
        address: user.address,
        token:  generateToken(user.id, user.role),
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
        _id:    user.id,
        name:   user.name,
        email:  user.email,
        phone:  user.phone,
        role:   user.role,
        avatar: user.avatar,
        address: user.address,
        token:  generateToken(user.id, user.role),
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
// UPDATE PROFILE — name, phone, address
// @route PUT /api/auth/update-profile
// @access Private (requires JWT)
// ═════════════════════════════════════════════════════════════════════════════
const updateProfile = async (req, res) => {
  try {
    const { name, phone, address } = req.body;

    if (!name || !name.trim())
      return res.status(400).json({ message: 'Name is required' });

    const user = await User.findById(req.user.id);
    if (!user)
      return res.status(404).json({ message: 'User not found' });

    // Check phone uniqueness if changing
    if (phone && phone.trim() !== user.phone) {
      const phoneExists = await User.findOne({
        phone: phone.trim(),
        _id:   { $ne: req.user.id },
      });
      if (phoneExists)
        return res.status(400).json({ message: 'Phone number is already registered to another account' });
    }

    user.name  = name.trim();
    user.phone = phone ? phone.trim() : user.phone;

    // Update address fields if provided
    if (address && typeof address === 'object') {
      user.address = {
        street:     address.street     || user.address?.street     || "",
        city:       address.city       || user.address?.city       || "",
        state:      address.state      || user.address?.state      || "",
        postalCode: address.postalCode || user.address?.postalCode || "",
        country:    address.country    || user.address?.country    || "India",
      };
    }

    await user.save();

    res.status(200).json({
      _id:     user.id,
      name:    user.name,
      email:   user.email,
      phone:   user.phone,
      role:    user.role,
      avatar:  user.avatar,
      address: user.address,
      message: 'Profile updated successfully',
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ═════════════════════════════════════════════════════════════════════════════
// UPDATE AVATAR — base64 image string
// @route PUT /api/auth/update-avatar
// @access Private (requires JWT)
// ═════════════════════════════════════════════════════════════════════════════
const updateAvatar = async (req, res) => {
  try {
    const { avatar } = req.body;

    if (!avatar)
      return res.status(400).json({ message: 'Avatar image is required' });

    // Validate it's a base64 image (starts with data:image/)
    if (!avatar.startsWith('data:image/'))
      return res.status(400).json({ message: 'Invalid image format. Must be a base64 image.' });

    // Rough size check: base64 string → ~75% of original, limit to ~2MB
    const sizeInBytes = Buffer.byteLength(avatar, 'utf8');
    if (sizeInBytes > 2.8 * 1024 * 1024)
      return res.status(400).json({ message: 'Image is too large. Max 2MB allowed.' });

    const user = await User.findById(req.user.id);
    if (!user)
      return res.status(404).json({ message: 'User not found' });

    user.avatar = avatar;
    await user.save();

    res.status(200).json({
      _id:    user.id,
      name:   user.name,
      email:  user.email,
      phone:  user.phone,
      role:   user.role,
      avatar: user.avatar,
      message: 'Profile photo updated successfully',
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ═════════════════════════════════════════════════════════════════════════════
// CHANGE PASSWORD (logged-in user, knows current password)
// @route PUT /api/auth/change-password
// @access Private (requires JWT)
// ═════════════════════════════════════════════════════════════════════════════
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword)
      return res.status(400).json({ message: 'Current password and new password are required' });

    if (newPassword.length < 6)
      return res.status(400).json({ message: 'New password must be at least 6 characters' });

    if (currentPassword === newPassword)
      return res.status(400).json({ message: 'New password must be different from current password' });

    // Must fetch password field explicitly (it's excluded by default in getMe)
    const user = await User.findById(req.user.id).select('+password');
    if (!user)
      return res.status(404).json({ message: 'User not found' });

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch)
      return res.status(401).json({ message: 'Current password is incorrect' });

    // Hash and save new password
    const salt    = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.status(200).json({ message: 'Password changed successfully' });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ═════════════════════════════════════════════════════════════════════════════
// FORGOT PASSWORD — Step 1: Send OTP
// @route POST /api/auth/forgot-password
// ═════════════════════════════════════════════════════════════════════════════
const forgotPassword = async (req, res) => {
  try {
    const { method, identifier } = req.body;

    if (!identifier)
      return res.status(400).json({ message: 'Email address is required' });

    if (method && method !== 'email')
      return res.status(400).json({ message: 'Only email reset is supported' });

    const user = await User.findOne({ email: identifier.toLowerCase().trim() });

    const genericMsg = 'If that email is registered, an OTP has been sent.';
    if (!user) return res.status(200).json({ message: genericMsg });

    const otp       = generateOtp();
    const salt      = await bcrypt.genSalt(10);
    const hashedOtp = await bcrypt.hash(otp, salt);

    user.resetOtp        = hashedOtp;
    user.resetOtpExpires = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    await sendOtpEmail(user.email, otp);

    res.status(200).json({ message: genericMsg });

  } catch (error) {
    console.error('forgotPassword error:', error.message);
    if (error.code === 'EAUTH' || error.responseCode === 535) {
      return res.status(500).json({
        message: 'Email service error. Check EMAIL_USER and EMAIL_PASS in your .env file.'
      });
    }
    res.status(500).json({ message: error.message });
  }
};

// ═════════════════════════════════════════════════════════════════════════════
// VERIFY OTP — Step 2
// @route POST /api/auth/verify-otp
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
// RESET PASSWORD — Step 3
// @route POST /api/auth/reset-password
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
  updateProfile,
  updateAvatar,
  changePassword,
  forgotPassword,
  verifyOtp,
  resetPassword,
};