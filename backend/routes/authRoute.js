const express = require('express')
const passport = require('passport')
const jwt = require('jsonwebtoken')
const authController = require('../controller/auth.controller')
const userController = require('../controller/user.controller')
const { authMiddleware } = require('../middleware/auth.middleware')
const router = express.Router()


// Normal Routes
router.post('/signup',authController.signUpUser)
router.post('/send-otp',authController.sendRegistrationOtp)
router.post('/login',authController.loginUser)
router.post('/verify-otp',authController.verifyOtp)
router.post('/reset-password',authController.resetPassword)
router.post('/refresh-token', authController.refreshTokenHandler)
router.post('/logout',authController.logOut)

// Protected Routes
router.put('/update-profile',authMiddleware,userController.updateProfile)
router.get('/profile',authMiddleware,userController.getProfile)

// Google Login
router.get('/google', (req, res, next) => {
    console.log("Hit /google route. Initiating Passport auth...")
    next()
}, passport.authenticate('google', { scope: ['profile', 'email'], session: false }))
router.get('/google/callback', (req, res, next) => {
    passport.authenticate('google', { session: false }, (err, user, info) => {
        if (err) {
            console.error("Passport Error:", err)
            return res.redirect(`${process.env.CLIENT_URL}/login?error=auth_failed_bad_request`)
        }
        if (!user) {
            return res.redirect(`${process.env.CLIENT_URL}/login?error=no_user`)
        }
        req.user = user
        return authController.handleSocialLogin(req, res, next)
    })(req, res, next)
})

module.exports = router
