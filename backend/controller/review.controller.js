const Review = require("../models/Review")
const Product = require("../models/Product")

// add review
const addReview = async (req, res) => {
  try {
    if (req.user.role === "admin" || req.user.role === "seller") {
      return res
        .status(403)
        .json({
          message:
            "Admins and Sellers cannot post reviews. Please login as a customer.",
        })
    }

    const { rating, comment, media } = req.body
    const productId = req.params.productId
    const review = await Review.create({
      product: productId,
      rating: Number(rating),
      comment,
      media,
      buyer: req.user.id,
    })

    // calculte aveerage rating
    const reviews = await Review.find({ product: productId })
    const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0)
    const averageRating = totalRating / reviews.length

    // Broadcast real-time update
    if (req.io) {
      req.io.to(`product_${productId}`).emit("newReview", review)
    }

    await Product.findByIdAndUpdate(productId, {
      rating: Number(averageRating.toFixed(1)),
      numReviews: reviews.length,
    })

    res.status(200).json({
      success: true,
      message: "Review added successfully",
      data: review,
    })
  } catch (error) {
    console.error("ADD_REVIEW_ERROR:", error)
    res.status(500).json({ message: error.message || "Internal server error" })
  }
}

// get product reviews
const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params
    const reviews = await Review.find({ product: productId }).populate(
      "buyer",
      "name email profileImage",
    )
    res.status(200).json({
      success: true,
      message: "Reviews fetched successfully",
      data: reviews,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Internal server error" })
  }
}

// edit review
const editReview = async (req, res) => {
  try {
    const { reviewId } = req.params
    const { rating, comment, media } = req.body
    const review = await Review.findByIdAndUpdate(
      reviewId,
      {
        rating: Number(rating),
        comment,
        media,
      },
      { new: true },
    )
    if (!review) {
      return res.status(404).json({ message: "Review not found" })
    }

    // recalculate average rating
    const reviews = await Review.find({ product: review.product })
    const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0)
    const averageRating = totalRating / reviews.length

    // Broadcast real-time update
    if (req.io) {
      req.io.to(`product_${review.product}`).emit("updateReview", review)
    }

    await Product.findByIdAndUpdate(review.product, {
      rating: Number(averageRating.toFixed(1)),
      numReviews: reviews.length,
    })

    res.status(200).json({
      success: true,
      message: "Review updated successfully",
      data: review,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Internal server error" })
  }
}

// delete review
const deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params

    const reviewCheck = await Review.findById(reviewId)
    if (!reviewCheck) {
      return res.status(404).json({ message: "Review not found" })
    }

    // Check if user is owner OR admin
    if (
      req.user.id !== reviewCheck.buyer.toString() &&
      req.user.role !== "admin"
    ) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this review" })
    }

    const review = await Review.findByIdAndDelete(reviewId)

    // recalculate average rating after deletion
    const reviews = await Review.find({ product: review.product })
    const totalRating = reviews.reduce((acc, rev) => acc + rev.rating, 0)
    const averageRating = reviews.length > 0 ? totalRating / reviews.length : 0

    // Broadcast real-time update
    if (req.io) {
      req.io.to(`product_${review.product}`).emit("deleteReview", reviewId)
    }

    await Product.findByIdAndUpdate(review.product, {
      rating: Number(averageRating.toFixed(1)),
      numReviews: reviews.length,
    })

    res.status(200).json({
      success: true,
      message: "Review deleted successfully",
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Internal server error" })
  }
}

// get all reviews for admin
const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate("product", "productName media category")
      .populate("buyer", "name email")
      .sort({ createdAt: -1 })

    res.status(200).json({
      success: true,
      data: reviews,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Internal server error" })
  }
}

module.exports = {
  addReview,
  getProductReviews,
  deleteReview,
  editReview,
  getAllReviews,
}
