const express = require("express")
const router = express.Router()
const orderController = require("../controller/order.controller")
const {
  authMiddleware,
  adminMiddleware,
} = require("../middleware/auth.middleware")

// Place order
router.post("/place-order", authMiddleware, orderController.placeOrder)

// Get all orders for a user
router.get("/my-orders", authMiddleware, orderController.getUserOrders)

// Get all orders for admin (seller) view
router.get(
  "/all-orders",
  authMiddleware,
  adminMiddleware,
  orderController.getAllOrdersAdmin,
)

// Get single order
router.get("/:id", authMiddleware, orderController.getOrder)

// Handle refund and stock update
router.put(
  "/:id/refund",
  authMiddleware,
  adminMiddleware,
  orderController.handleRefundAndStock,
)

// Get live tracking details for a user
router.get("/:id/track", authMiddleware, orderController.getLiveTracking)

// Admin: Manually update order status (to "Out for Delivery", etc.)
router.put(
  "/:id/status",
  authMiddleware,
  adminMiddleware,
  orderController.updateOrderStatus,
)
// order return request
router.put("/:id/return", authMiddleware, orderController.requestOrderReturn)
// cancel not deliver order
router.put(
  "/:id/cancel-not-deliver",
  authMiddleware,
  orderController.cancelOrderNotDeliver,
)

// download invoice
router.get("/invoice/:id", authMiddleware, orderController.downloadInvoice)

module.exports = router
