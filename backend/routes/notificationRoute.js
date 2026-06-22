const express = require('express')
const router = express.Router()
const notificationController = require('../controller/notification.controller')
const { authMiddleware, adminMiddleware } = require('../middleware/auth.middleware')

// Route to save push subscription token from frontend
router.post('/subscribe', authMiddleware, notificationController.subscribeUser)

// Admin-only route to broadcast messages to everyone
router.post('/broadcast', authMiddleware, adminMiddleware, notificationController.broadcastAlert)

module.exports = router
