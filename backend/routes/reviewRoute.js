const express = require("express")
const router = express.Router()
const reviewController = require("../controller/review.controller")
const {
  authMiddleware,
  adminMiddleware,
} = require("../middleware/auth.middleware")

// Get all reviews for admin
router.get(
  "/all/admin",
  authMiddleware,
  adminMiddleware,
  reviewController.getAllReviews,
)

// Add a review
router.post("/:productId", authMiddleware, reviewController.addReview)
// Get reviews for a product
router.get("/:productId", reviewController.getProductReviews)
// edit review
router.put("/:reviewId", authMiddleware, reviewController.editReview)
// delete review
router.delete("/:reviewId", authMiddleware, reviewController.deleteReview)

module.exports = router
