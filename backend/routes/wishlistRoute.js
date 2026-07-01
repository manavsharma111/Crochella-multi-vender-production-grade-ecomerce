const express = require("express")
const router = express.Router()
const wishlistController = require("../controller/wishlist.controller")
const { authMiddleware } = require("../middleware/auth.middleware")

// toggle wishlist
router.post("/toggle", authMiddleware, wishlistController.toggleWishlist)

// get default wishlist
router.get("/", authMiddleware, wishlistController.getWishlist)

// create custom wishlist (Flipkart style 'Collections')
router.post("/custom", authMiddleware, wishlistController.createCustomWishlist)

// toggle product in custom wishlist
router.post(
  "/custom/toggle",
  authMiddleware,
  wishlistController.toggleProductInCustomWishlist,
)

// get all custom wishlists
router.get("/custom", authMiddleware, wishlistController.getCustomWishlists)

// delete custom wishlist
router.delete(
  "/custom/:customWishlistId",
  authMiddleware,
  wishlistController.deleteCustomWishlist,
)

// update custom wishlist
router.put(
  "/custom/:customWishlistId",
  authMiddleware,
  wishlistController.updateCustomWishlist,
)

module.exports = router
