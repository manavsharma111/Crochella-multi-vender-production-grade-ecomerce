const express = require("express")
const router = express.Router()
const {
  getDashboardStats,
  getSellerDashboardStats,
} = require("../controller/dashboard.controller")
const {
  authMiddleware,
  adminOrSellerMiddleware,
} = require("../middleware/auth.middleware")

router.get("/admin", authMiddleware, adminOrSellerMiddleware, getDashboardStats)
router.get(
  "/seller",
  authMiddleware,
  adminOrSellerMiddleware,
  getSellerDashboardStats,
)

module.exports = router
