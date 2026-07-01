const express = require("express")
const router = express.Router()
const {
  authMiddleware,
  deliveryBoyMiddleware,
  adminMiddleware,
} = require("../middleware/auth.middleware")
const {
  getAvailableOrders,
  acceptForDelivery,
  updateDeliveryStatus,
  getAvailableReturns,
  acceptReturnPickup,
  confirmReturnCollected,
  getMyDeliveries,
  rateDeliveryBoy,
  getDeliveryStaffStats,
} = require("../controller/delivery.controller")

router.get(
  "/available",
  authMiddleware,
  deliveryBoyMiddleware,
  getAvailableOrders,
)
router.post(
  "/accept/:orderId",
  authMiddleware,
  deliveryBoyMiddleware,
  acceptForDelivery,
)
router.put(
  "/update/:orderId",
  authMiddleware,
  deliveryBoyMiddleware,
  updateDeliveryStatus,
)
router.get(
  "/returns",
  authMiddleware,
  deliveryBoyMiddleware,
  getAvailableReturns,
)
router.post(
  "/returns/accept/:orderId",
  authMiddleware,
  deliveryBoyMiddleware,
  acceptReturnPickup,
)
router.put(
  "/returns/collected/:orderId",
  authMiddleware,
  deliveryBoyMiddleware,
  confirmReturnCollected,
)
router.get("/my-orders", authMiddleware, deliveryBoyMiddleware, getMyDeliveries)

// Rate delivery boy route (used by buyer)
router.post("/rate/:deliveryBoyId", authMiddleware, rateDeliveryBoy)

// Admin stats route
router.get(
  "/admin/staff-stats",
  authMiddleware,
  adminMiddleware,
  getDeliveryStaffStats,
)

module.exports = router
