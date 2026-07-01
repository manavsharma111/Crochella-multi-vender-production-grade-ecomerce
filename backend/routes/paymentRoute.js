const express = require("express")
const router = express.Router()
const paymentController = require("../controller/payment.controller")
const { authMiddleware } = require("../middleware/auth.middleware")

// Checkout
router.post("/checkout", authMiddleware, paymentController.checkout)

// Verify Payment
router.post("/verify", paymentController.paymentVerification)

module.exports = router
