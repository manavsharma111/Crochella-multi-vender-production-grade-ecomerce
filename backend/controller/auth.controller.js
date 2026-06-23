const { emailQueue } = require('../services/queue.service');
const User = require('../models/User');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Otp = require('../models/Otp');
const redisClient = require('../config/redis');

// registration
const signUpUser = async (req, res) => {
    try {
        const { name, email, password, confirmPassword, userOtp, role } = req.body

        // sirf buyer and deilvery boy hii apna role decide kre admin locally bana hai
        const allowedRoles = ['buyer', 'delivery_boy']
        const assignedRole = allowedRoles.includes(role) ? role : 'buyer'

        if (email === process.env.ADMIN_EMAIL || email === process.env.SELLER_EMAIL) {
            return res.status(400).json({ message: "Invalid email domain or registration restricted." })
        }

        // check user exists 
        const userExists = await User.findOne({ email })
        if (userExists) {
            return res.status(400).json({ message: "User already    exists" })
        }

        // Passwords validation
        if (password !== confirmPassword) {
            return res.status(400).json({ message: "Passwords do not match" })
        }

        // min 8 char-1small,1capital,1special,1number
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(password)) {
            return res.status(400).json({ message: "Password must contain at least 8 characters, one uppercase, one lowercase, one number and one special character" })
        }

        //  OTP Verification 
        const otpRecord = await Otp.findOne({ email }).sort({ createdAt: -1 })
        if (!otpRecord || otpRecord.otp !== userOtp) {
            return res.status(400).json({ message: "Invalid or expired OTP" })
        }

        // Hash password and save 
        const hashedPassword = await bcryptjs.hash(password, 10)
        await User.create({
            name,
            email,
            password: hashedPassword,
            role: assignedRole
        })
        // delete otp after verification 
        await Otp.deleteMany({ email })

        // Send Success Email via BullMQ Queue
        await emailQueue.add('sendRegistrationSuccess', {
            to: email,
            subject: "Registration Successful",
            html: `<p>Hi ${name}, welcome to Our Handloom Store!</p>`
        });

        res.status(201).json({ message: "User registered successfully" })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Internal server error" })
    }
}

// registration otp
const sendRegistrationOtp = async (req, res) => {
    try {
        const { email } = req.body
        const otp = Math.floor(100000 + Math.random() * 900000)
        await Otp.create({ email, otp, expiresAt: new Date(Date.now() + 10 * 60 * 1000) })
        await emailQueue.add('sendOTP', {
            to: email,
            subject: "🔒 Verify Your Account - OTP Verification",
            html: `
<div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f6f9; padding: 40px 0; width: 100%; margin: 0;">
  <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 500px; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05); overflow: hidden; border-collapse: collapse;">
    
    <!-- Header/Branding -->
    <tr>
      <td style="background-color: #4f46e5; padding: 30px 20px; text-align: center;">
        <h2 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 600; letter-spacing: 0.5px;">Security Verification</h2>
      </td>
    </tr>
    
    <!-- Body Content -->
    <tr>
      <td style="padding: 40px 30px; text-align: center;">
        <p style="color: #334155; font-size: 16px; line-height: 1.6; margin: 0 0 25px 0;">
          Hello, <br> Please use the following One-Time Password (OTP) to complete your verification. This code is valid for <strong>10 minutes</strong>.
        </p>
        
        <!-- OTP Display Box -->
        <div style="background-color: #f1f5f9; border-radius: 8px; padding: 15px 25px; display: inline-block; letter-spacing: 6px; font-size: 32px; font-weight: 700; color: #1e1b4b; border: 1px dashed #cbd5e1; margin-bottom: 25px;">
          ${otp}
        </div>
        
        <p style="color: #64748b; font-size: 13px; line-height: 1.5; margin: 0;">
          If you did not request this code, please ignore this email or secure your account.
        </p>
      </td>
    </tr>
    
    <!-- Footer -->
    <tr>
      <td style="background-color: #f8fafc; padding: 20px 30px; text-align: center; border-top: 1px solid #e2e8f0;">
        <p style="color: #94a3b8; font-size: 12px; margin: 0;">
          © ${new Date().getFullYear()} Your App Name. All rights reserved.
        </p>
      </td>
    </tr>
    
  </table>
</div>
`       });
        res.status(200).json({ message: "OTP sent successfully" })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Internal server error" })
    }
}

// login
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body

        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            const token = jwt.sign({ id: "admin", role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '15m' });
            const refreshToken = jwt.sign({ id: "admin", role: 'admin' }, process.env.JWT_SECRET + '_refresh', { expiresIn: '7d' });
            res.cookie('refreshToken', refreshToken, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 })
            return res.status(200).json({
                message: "Welcome Wolf",
                token,
                user: { name: "Manav (WOLF) ", email, role: "admin" }
            })
        }

        if (email === process.env.SELLER_EMAIL && password === process.env.SELLER_PASSWORD) {
            const token = jwt.sign({ id: "seller", role: 'seller' }, process.env.JWT_SECRET, { expiresIn: '15m' });
            const refreshToken = jwt.sign({ id: "seller", role: 'seller' }, process.env.JWT_SECRET + '_refresh', { expiresIn: '7d' });
            res.cookie('refreshToken', refreshToken, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 })
            return res.status(200).json({
                message: "Welcome Seller",
                token,
                user: { name: "Chinki Didi (Seller)", email, role: "seller" }
            })
        }

        // check Normal Buyer
        const buyer = await User.findOne({ email }).select('+password');
        if (!buyer) {
            return res.status(400).json({ message: "Invalid email or password" });
        }
        if (!buyer.password) {
            return res.status(400).json({ message: "Please login using Google" });
        }
        const isMatch = await bcryptjs.compare(password, buyer.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        // Token: use role from DB so delivery_boy gets correct role
        const token = jwt.sign({ id: buyer._id, role: buyer.role || 'buyer' }, process.env.JWT_SECRET, { expiresIn: '15m' });
        const refreshToken = jwt.sign({ id: buyer._id, role: buyer.role || 'buyer' }, process.env.JWT_SECRET + '_refresh', { expiresIn: '7d' });

        res.cookie('refreshToken', refreshToken, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 })
        res.status(200).json({
            message: "Login successful",
            token,
            user: { id: buyer._id, name: buyer.name, email: buyer.email, role: buyer.role || 'buyer' }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" })
    }
}
// verify otp
const verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body
        const otpRecord = await Otp.findOne({ email }).sort({ createdAt: -1 })
        if (!otpRecord || otpRecord.otp !== otp) {
            return res.status(400).json({ message: "Invalid or expired OTP" })
        }
        await Otp.deleteMany({ email })
        await User.updateOne({ email }, { $set: { isOtpVerified: true } })
        res.status(200).json({ message: "OTP verified successfully" })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Internal server error" })
    }
}
// reset password 
const resetPassword = async (req, res) => {
    try {
        const { email, password } = req.body

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(password)) {
            return res.status(400).json({ message: "Password must contain at least 8 characters, one uppercase, one lowercase, one number and one special character" })
        }

        const user = await User.findOne({ email })
        if (!user || !user.isOtpVerified) {
            return res.status(400).json({ message: "otp verification required" })
        }

        const hashedPassword = await bcryptjs.hash(password, 10)
        user.password = hashedPassword
        user.isOtpVerified = false
        await user.save()
        return res.status(200).json({ message: "password reset successfully" })

    } catch (error) {
        return res.status(500).json({ message: `reset otp error ${error}` })
    }
}
// logout
const logOut = async (req, res) => {
    try {
        const token = req.cookies.token || (req.headers.authorization && req.headers.authorization.split(" ")[1]);
        const refreshToken = req.cookies.refreshToken;

        if (redisClient.isOpen) {
            const expiry = 7 * 24 * 60 * 60; // 7 days in seconds
            if (token) {
                await redisClient.setEx(`bl_${token}`, expiry, 'true').catch(err => console.error(err));
            }
            if (refreshToken) {
                await redisClient.setEx(`bl_${refreshToken}`, expiry, 'true').catch(err => console.error(err));
            }
        }

        res.clearCookie("token")
        res.clearCookie("refreshToken")
        res.json({ message: "Logout successful" })
    }
    catch (error) {
        console.error("Logout error:", error);
        res.status(500).json({ message: "Internal server error" })
    }
}

// Handle Social Login Callback
const handleSocialLogin = (req, res) => {
    try {
        if (!req.user) {
            return res.redirect(`${process.env.CLIENT_URL}/login?error=auth_failed`);
        }

        const token = jwt.sign(
            {
                id: req.user._id,
                role: req.user.role || 'buyer',
                email: req.user.email
            },
            process.env.JWT_SECRET,
            { expiresIn: '15m' }
        );

        const refreshToken = jwt.sign(
            {
                id: req.user._id,
                role: req.user.role || 'buyer',
                email: req.user.email
            },
            process.env.JWT_SECRET + '_refresh',
            { expiresIn: '7d' }
        );

        res.cookie('refreshToken', refreshToken, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 })
        res.redirect(`${process.env.CLIENT_URL}?token=${token}&role=${req.user.role || 'buyer'}`);
    } catch (error) {
        console.error("Social login error:", error);
        res.redirect(`${process.env.CLIENT_URL}/login?error=server_error`);
    }
}

// Refresh Token Handler
const refreshTokenHandler = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
            return res.status(401).json({ message: "No refresh token provided" });
        }

        const secret = process.env.JWT_SECRET + '_refresh';
        const decoded = jwt.verify(refreshToken, secret);

        // Generate new short-lived access token
        const newAccessToken = jwt.sign(
            { id: decoded.id, role: decoded.role, email: decoded.email },
            process.env.JWT_SECRET,
            { expiresIn: '15m' }
        );

        res.status(200).json({ token: newAccessToken });
    } catch (error) {
        console.error("Refresh token error:", error);
        res.status(403).json({ message: "Invalid or expired refresh token" });
    }
}

module.exports = {
    signUpUser,
    loginUser,
    logOut,
    sendRegistrationOtp,
    verifyOtp,
    resetPassword,
    handleSocialLogin,
    refreshTokenHandler
}