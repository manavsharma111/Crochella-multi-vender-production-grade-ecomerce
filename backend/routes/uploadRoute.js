const express = require('express')
const router = express.Router()
const { upload } = require('../config/cloudinary')
const { authMiddleware, adminOrSellerMiddleware } = require('../middleware/auth.middleware')
const { uploadBulkMedia, deleteMedia, singleMedia } = require('../controller/upload.controller')

// using auth
router.post('/bulk', authMiddleware, adminOrSellerMiddleware, upload.array('media', 10), uploadBulkMedia)
router.post('/single', authMiddleware, adminOrSellerMiddleware, upload.single('media'), singleMedia)
router.delete('/delete', authMiddleware, adminOrSellerMiddleware, deleteMedia)

// For user return requests (no admin required)
router.post('/return', authMiddleware, upload.array('media', 5), uploadBulkMedia)

module.exports = router
