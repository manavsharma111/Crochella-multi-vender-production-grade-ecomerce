const express = require('express')
const userController = require('../controller/user.controller')
const { authMiddleware, adminMiddleware } = require('../middleware/auth.middleware')
const router = express.Router()


// protected routes 
router.get('/profile',authMiddleware,userController.getProfile)
router.post('/update-profile',authMiddleware,userController.updateProfile)
router.post('/change-password',authMiddleware,userController.changePassword)
router.get('/get-delivery-address',authMiddleware,userController.getDeliveryAddress)
router.post('/update-delivery-address',authMiddleware,userController.updateDeliveryAddress)
router.post('/add-delivery-address',authMiddleware,userController.addDeliveryAddress)
router.post('/delete-delivery-address',authMiddleware,userController.deleteDeliveryAddress)
router.get('/admin/users',authMiddleware, adminMiddleware, userController.getAllUsers)
router.get('/admin/delivery-boys',authMiddleware, adminMiddleware, userController.getAllDeliveryBoys)
router.patch('/admin/assign-role/:userId',authMiddleware, adminMiddleware, userController.assignRole)
router.post('/track-view/:productId', authMiddleware, userController.trackProductView)
router.get('/recommendations', authMiddleware, userController.getRecommendations)
module.exports = router