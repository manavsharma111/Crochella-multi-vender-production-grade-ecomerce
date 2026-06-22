const express = require('express')
const router = express.Router()
const { authMiddleware, adminOrSellerMiddleware } = require('../middleware/auth.middleware')
const aiController = require('../controller/ai.controller')

router.post('/askAI', authMiddleware, aiController.aiCustomerSupport)
router.get('/recommendations/:productId', aiController.getSmartRecommendations)
module.exports = router