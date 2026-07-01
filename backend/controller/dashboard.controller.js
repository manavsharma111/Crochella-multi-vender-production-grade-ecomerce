const Order = require("../models/Order")
const Product = require("../models/Product")
const User = require("../models/User")

//  ADMIN DASHBOARD STATS
const getDashboardStats = async (req, res) => {
  try {
    const [totalProducts, totalUsers] = await Promise.all([
      Product.countDocuments({}),
      User.countDocuments({}),
    ])

    //  Revenue & Orders Analysis
    const orderStats = await Order.aggregate([
      {
        $facet: {
          revenueData: [
            { $match: { paymentStatus: "completed" } },
            {
              $group: {
                _id: null,
                totalRevenue: { $sum: "$totalPrice" },
                totalPaidOrders: { $sum: 1 },
              },
            },
          ],
          // Status Wise Breakdown Count
          statusCounts: [
            {
              $group: {
                _id: "$orderStatus",
                count: { $sum: 1 },
              },
            },
          ],
          totalOrdersData: [
            {
              $group: {
                _id: null,
                count: { $sum: 1 },
              },
            },
          ],
        },
      },
    ])

    // Clean up Aggregation response formatting
    const revenueMetrics = orderStats[0].revenueData[0] || {
      totalRevenue: 0,
      totalPaidOrders: 0,
    }
    const statusBreakdown = orderStats[0].statusCounts
    const totalOrders = orderStats[0].totalOrdersData[0]
      ? orderStats[0].totalOrdersData[0].count
      : 0

    // Low Stock Check Alert Logic
    const lowStockProducts = await Product.find({ stock: { $lte: 3 } }).select(
      "productName stock price",
    )

    res.status(200).json({
      success: true,
      metrics: {
        totalRevenue: revenueMetrics.totalRevenue,
        totalPaidOrders: revenueMetrics.totalPaidOrders,
        totalOrders,
        totalProducts,
        totalCustomers: totalUsers,
        lowStockAlertCount: lowStockProducts.length,
      },
      statusBreakdown,
      lowStockProducts,
    })
  } catch (error) {
    console.error("Dashboard engine failed:", error)
    res.status(500).json({ message: "Dashboard internal server data error" })
  }
}

// SELLER DASHBOARD STATS
const getSellerDashboardStats = async (req, res) => {
  try {
    const sellerId = req.user.id

    const totalOrders = await Order.countDocuments({
      "products.sellerId": sellerId,
    })
    const totalProducts = await Product.countDocuments({
      sellerId: sellerId,
    })
    const totalRevenue = await Order.aggregate([
      {
        $match: {
          "products.sellerId": sellerId,
          paymentStatus: "completed",
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$totalPrice" },
        },
      },
    ])
    const data = {
      totalOrders,
      totalProducts,
      totalRevenue: totalRevenue[0] ? totalRevenue[0].totalRevenue : 0,
    }
    return res.status(200).json({ success: true, data })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server Error" })
  }
}

module.exports = {
  getDashboardStats,
  getSellerDashboardStats,
}
