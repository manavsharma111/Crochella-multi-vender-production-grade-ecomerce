const express = require('express')
const router = express.Router()
const { authMiddleware } = require('../middleware/auth.middleware')
const CartController = require('../controller/cart.controller')


// add to cart
router.post('/add',authMiddleware,CartController.addToCart)

// remove from cart
router.post('/remove',authMiddleware,CartController.removeFromCart)

// update cart
router.put('/update-cart', authMiddleware, CartController.updateCart)
router.get('/get-cart', authMiddleware, CartController.getCart)
router.post('/apply-coupon', authMiddleware, CartController.applyCoupon)
router.post('/remove-coupon', authMiddleware, CartController.removeCoupon)
router.delete('/clear', authMiddleware, CartController.clearCart)

module.exports = router