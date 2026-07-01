const Order = require("../models/Order")
const Cart = require("../models/Cart")
const Product = require("../models/Product")
const razorpayInstance = require("../config/payment")
const User = require("../models/User")
const { sendPushAlert } = require("./notification.controller")
const Coupon = require("../models/Coupon")
const sendOrderConfirmationEmail = require("../services/emailOrderConfirmationService")
const { generateInvoice } = require("../services/invoice.service")

// BUYER PLACE ORDER
const placeOrder = async (req, res) => {
  try {
    const { shippingAddress, paymentMethod } = req.body
    const userId = req.user.id

    // Populate appliedCoupon to calculate final price
    const cart = await Cart.findOne({ userId })
      .populate("products.productId")
      .populate("appliedCoupon")
    if (!cart || cart.products.length === 0) {
      return res.status(400).json({ message: "Cart is empty" })
    }

    const { calculateDynamicPrice } = require("../services/pricing.service")

    let totalPrice = 0
    cart.products.forEach((item) => {
      const currentDynamicPrice = calculateDynamicPrice(item.productId)
      totalPrice += currentDynamicPrice * item.quantity
      item.price = currentDynamicPrice // Update item price for order record
    })

    let discountAmount = 0
    let appliedCouponCode = null

    if (cart.appliedCoupon) {
      const coupon = cart.appliedCoupon
      appliedCouponCode = coupon.couponCode
      if (coupon.discountType === "Percentage") {
        discountAmount = (totalPrice * coupon.discountValue) / 100
      } else if (coupon.discountType === "Flat") {
        discountAmount = coupon.discountValue
      }
      if (discountAmount > totalPrice) discountAmount = totalPrice

      // Decrease coupon limit
      coupon.couponLimit -= 1
      await coupon.save()
    }

    const finalPrice = totalPrice - discountAmount

    const estimatedDeliveryDate = new Date()
    estimatedDeliveryDate.setDate(estimatedDeliveryDate.getDate() + 5)

    // Create Order
    const order = await Order.create({
      userId,
      products: cart.products,
      totalPrice: finalPrice, // Important: save the final discounted price
      discountAmount,
      appliedCoupon: appliedCouponCode,
      paymentMethod,
      shippingAddress,
      estimatedDeliveryDate,
      orderStatus: "Processing",
      paymentStatus: paymentMethod === "COD" ? "pending" : "pending",
    })

    if (paymentMethod === "COD") {
      await Cart.findOneAndDelete({ userId })
    }

    // Notify all delivery boys about new order
    try {
      const deliveryBoys = await User.find({
        role: "delivery_boy",
        pushSubscription: { $ne: null },
      })
      for (const boy of deliveryBoys) {
        await sendPushAlert(
          boy._id,
          "🛵 New Order!",
          `Order #${order._id.toString().slice(-6)} is ready for pickup`,
        )
      }
    } catch (notifErr) {
      console.error("Delivery notification error:", notifErr)
    }

    // Send Order Confirmation Email to the Buyer
    try {
      const user = await User.findById(userId)
      if (user && user.email) {
        // populate the order to get productName for the email
        const populatedOrder = await Order.findById(order._id).populate(
          "products.productId",
        )
        await sendOrderConfirmationEmail({
          to: user.email,
          userName: user.name,
          order: populatedOrder,
        })
      }
    } catch (emailErr) {
      console.error("Order confirmation email error:", emailErr)
    }

    res
      .status(201)
      .json({
        success: true,
        message: "Order created successfully",
        data: order,
      })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server Error" })
  }
}

// BUYER CANCEL ORDER (Before Delivery)
const cancelOrderNotDeliver = async (req, res) => {
  try {
    const { id } = req.params
    const order = await Order.findById(id)

    if (!order) return res.status(404).json({ message: "Order not found" })

    if (order.orderStatus === "Delivered" || order.orderStatus === "Shipped") {
      return res
        .status(400)
        .json({
          message: "Cannot cancel order. Product already shipped or delivered.",
        })
    }

    order.orderStatus = "Cancelled"
    if (
      order.paymentMethod === "Razorpay" &&
      order.paymentStatus === "completed"
    ) {
      await razorpayInstance.payments.refund(order.razorpayPaymentId, {
        amount: Math.round(order.totalPrice * 100),
        notes: { reason: "User cancelled order before delivery" },
      })
      order.paymentStatus = "refunded"
    }

    await order.save()
    res
      .status(200)
      .json({
        success: true,
        message: "Order cancelled & refund initiated if online paid.",
        data: order,
      })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server Error" })
  }
}

// BUYER RETURN REQUEST (After Delivery)
const requestOrderReturn = async (req, res) => {
  try {
    const { id } = req.params
    const { reason, refundMethod, upiId, bankDetails, images } = req.body
    const order = await Order.findById(id)

    if (!order) return res.status(404).json({ message: "Order not found" })
    if (order.orderStatus !== "Delivered") {
      return res
        .status(400)
        .json({ message: "Can only return products that are delivered." })
    }
    // Set status for Seller & Delivery Boy
    order.orderStatus = "Returned"
    order.deliveryStatus = "Available" // Crucial: Make it available for delivery boys to pick up
    order.deliveryBoyId = null // Unassign the previous delivery boy

    order.returnDetails = {
      reason: reason || "Customer requested return",
      refundMethod: refundMethod || "UPI",
      upiId: upiId,
      bankDetails: bankDetails,
      images: images || [], // Array of up to 5 image URLs
    }

    await order.save()

    // Notify all delivery boys about return pickup
    try {
      const deliveryBoys = await User.find({
        role: "delivery_boy",
        pushSubscription: { $ne: null },
      })
      for (const boy of deliveryBoys) {
        await sendPushAlert(
          boy._id,
          "↩️ Return Pickup!",
          `Order #${order._id.toString().slice(-6)} needs return pickup`,
        )
      }
    } catch (notifErr) {
      console.error("Return notification error:", notifErr)
    }

    res
      .status(200)
      .json({
        success: true,
        message: "Return request registered. Waiting for Seller approval.",
        data: order,
      })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server Error" })
  }
}

// LIVE TRACKING DATA ENDPOINT
const getLiveTracking = async (req, res) => {
  try {
    const { id } = req.params
    const order = await Order.findById(id)

    if (!order) return res.status(404).json({ message: "Order not found" })

    // Calculate progress percentage for front-end progress bar
    let progressPercent = 0
    if (order.orderStatus === "Processing") progressPercent = 25
    if (order.orderStatus === "Shipped") progressPercent = 65
    if (order.orderStatus === "Delivered") progressPercent = 100

    res.status(200).json({
      success: true,
      orderStatus: order.orderStatus,
      deliveryStatus: order.deliveryStatus,
      deliveryOtp: order.deliveryOtp,
      progressPercent,
      currentLocation: order.currentLocation, // Lat and Lng for Google Map
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Tracking system error" })
  }
}

// SELLER UPDATE STATUS & MAP COORDINATES
const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params
    const { status, lat, lng, addressString } = req.body

    // Populate userId to get email and name
    const order = await Order.findById(id).populate("userId", "name email")
    if (!order) return res.status(404).json({ message: "Order not found" })

    let isStatusChanged = false

    if (status && order.orderStatus !== status) {
      order.orderStatus = status
      isStatusChanged = true
    }

    if (lat && lng) {
      order.currentLocation = { lat, lng, addressString }
      try {
        const { getIo } = require("../services/socket.service")
        getIo()
          .to(`order_${id}`)
          .emit("locationUpdate", { lat, lng, addressString, status })
      } catch (err) {
        console.error("Socket emit error:", err)
      }
    }
    await order.save()

    // Send email to user if status changed
    if (isStatusChanged && order.userId && order.userId.email) {
      const sendOrderStatusEmail = require("../services/emailOrderStatusService")
      await sendOrderStatusEmail({
        to: order.userId.email,
        userName: order.userId.name,
        order: order,
        newStatus: status,
      })
    }

    res
      .status(200)
      .json({
        success: true,
        message: "Order updated by seller successfully",
        data: order,
      })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server Error" })
  }
}

// get single order
const getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      "products.productId",
    )
    if (!order) return res.status(404).json({ message: "Order not found" })
    res.status(200).json({ success: true, data: order })
  } catch (error) {
    res.status(500).json({ message: "Error fetching order" })
  }
}

// get all orders for logged in user
const getUserOrders = async (req, res) => {
  try {
    const userId = req.user.id
    const orders = await Order.find({ userId })
      .populate("products.productId")
      .sort({ createdAt: -1 })
    res.status(200).json({ success: true, data: orders })
  } catch (error) {
    res.status(500).json({ message: "Error fetching orders" })
  }
}

// get all orders for admin
const getAllOrdersAdmin = async (req, res) => {
  try {
    const limit = Number(req.query.limit) || 10
    const page = Number(req.query.page) || 1
    const skip = (page - 1) * limit
    const { search } = req.query

    let query = {}

    if (search) {
      // Check if search term is a valid ObjectId (for order _id search)
      const mongoose = require("mongoose")
      if (mongoose.Types.ObjectId.isValid(search)) {
        query._id = search
      } else {
        // If it's not an ID, we'll need to search by customer name
        // To do this properly, we first find matching users, then find orders for those users
        const User = require("../models/User")
        const matchingUsers = await User.find({
          name: { $regex: search, $options: "i" },
        }).select("_id")
        const userIds = matchingUsers.map((u) => u._id)
        if (userIds.length > 0) {
          query.userId = { $in: userIds }
        }
      }
    }

    const total = await Order.countDocuments(query)
    const orders = await Order.find(query)
      .populate("products.productId")
      .populate("userId", "name email")
      .populate("deliveryBoyId", "name email phone")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)

    res.status(200).json({
      success: true,
      data: orders,
      pagination: { total, page, limit },
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Error fetching all orders" })
  }
}

// Handler for online and COD refunds and stock update

const handleRefundAndStock = async (req, res) => {
  try {
    const { id } = req.params
    const order = await Order.findById(id)

    if (!order) return res.status(404).json({ message: "Order not found" })

    if (order.paymentStatus !== "completed" && order.paymentMethod !== "COD") {
      return res
        .status(400)
        .json({ message: "Order is not eligible for refund" })
    }

    // Online Razorpay Payment Refund
    if (order.paymentMethod === "Razorpay") {
      await razorpayInstance.payments.refund(order.razorpayPaymentId, {
        amount: Math.round(order.totalPrice * 100),
        notes: { reason: "Return approved by seller" },
      })
      order.paymentStatus = "refunded"
    }

    // COD Order Refund
    else if (order.paymentMethod === "COD") {
      if (order.returnDetails.refundMethod === "UPI") {
        console.log(
          `Automated Payout Triggered to UPI: ${order.returnDetails.upiId}`,
        )
      } else {
        console.log(
          `Automated IMPS Transfer Triggered to Bank A/C: ${order.returnDetails.bankDetails.accountNumber}`,
        )
      }
      order.paymentStatus = "refunded"
    }

    // Stock Rollback
    for (const item of order.products) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { stock: item.quantity },
      })
    }

    order.orderStatus = "Refunded"
    await order.save()

    res.status(200).json({
      success: true,
      message: `Return approved! Refund initiated via ${order.paymentMethod === "COD" ? order.returnDetails.refundMethod : "Razorpay Gateway"}.`,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Refund implementation crash error" })
  }
}

// Download PDF Invoice
const downloadInvoice = async (req, res) => {
  try {
    const { id } = req.params
    const order = await Order.findById(id)
      .populate("products.productId")
      .populate("userId", "name email")

    if (!order) {
      return res.status(404).json({ message: "Order not found" })
    }

    // Ensure only the buyer or an admin can download the invoice
    if (
      order.userId._id.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res
        .status(403)
        .json({ message: "Unauthorized to view this invoice" })
    }

    // Generate and stream PDF to response
    generateInvoice(order, res)
  } catch (error) {
    console.error("Invoice generation error:", error)
    if (!res.headersSent) {
      res.status(500).json({ message: "Failed to generate invoice" })
    }
  }
}

module.exports = {
  placeOrder,
  getOrder,
  getUserOrders,
  getAllOrdersAdmin,
  cancelOrderNotDeliver,
  requestOrderReturn,
  handleRefundAndStock,
  getLiveTracking,
  updateOrderStatus,
  downloadInvoice,
}
