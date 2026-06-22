const express = require('express')
const router = express.Router()
const couponController = require('../controller/coupon.controller')
const { authMiddleware, adminMiddleware } = require('../middleware/auth.middleware')

// Admin Routes
router.post('/create', authMiddleware, adminMiddleware, couponController.createCoupon)
router.get('/all', authMiddleware, adminMiddleware, couponController.getAllCoupons)
router.delete('/:id', authMiddleware, adminMiddleware, couponController.deleteCoupon)

// User Routes
router.get('/active', couponController.getActiveCoupons)

module.exports = router
