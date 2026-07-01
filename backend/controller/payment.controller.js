const crypto = require("crypto")
const razorpayInstance = require("../config/payment")
const Order = require("../models/Order")
const Cart = require("../models/Cart")
const dotenv = require("dotenv")
dotenv.config()

// check COD or ONLINE PAY
const checkout = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id

    const { paymentMethod = "Razorpay", shippingAddress } = req.body

    const cart = await Cart.findOne({ userId }).populate("products.productId")
    if (!cart || cart.products.length === 0) {
      return res.status(400).json({ message: "Cart is empty" })
    }

    let totalPrice = 0
    cart.products.forEach((item) => {
      totalPrice += item.price * item.quantity
    })

    if (paymentMethod === "COD") {
      const newOrder = new Order({
        userId,
        products: cart.products,
        totalPrice,
        paymentMethod: "COD",
        paymentStatus: "pending",
        shippingAddress,
      })
      await newOrder.save()

      await Cart.findOneAndDelete({ $or: [{ userId }, { user: userId }] })

      return res.status(200).json({
        success: true,
        message: "Order placed successfully via Cash on Delivery",
        dbOrderId: newOrder._id,
      })
    } else if (paymentMethod === "Razorpay") {
      const options = {
        amount: Math.round(totalPrice * 100),
        currency: "INR",
        receipt: `receipt_order_${Date.now()}`,
      }

      const razorpayOrder = await razorpayInstance.orders.create(options)

      if (!razorpayOrder) {
        return res
          .status(500)
          .json({ message: "Failed to create Razorpay order" })
      }

      const newOrder = new Order({
        userId,
        products: cart.products,
        totalPrice,
        paymentMethod: "Razorpay",
        paymentStatus: "pending",
        razorpayOrderId: razorpayOrder.id,
        shippingAddress,
      })
      await newOrder.save()

      return res.status(200).json({
        success: true,
        message: "Razorpay Order created successfully",
        order: razorpayOrder,
        dbOrderId: newOrder._id,
      })
    } else {
      return res.status(400).json({ message: "Invalid payment method" })
    }
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Internal server error during checkout" })
  }
}

// verification
const paymentVerification = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body
    const body = razorpay_order_id + "|" + razorpay_payment_id
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex")

    const isAuthentic = expectedSignature === razorpay_signature

    if (isAuthentic) {
      //  match signature
      await Order.findOneAndUpdate(
        { razorpayOrderId: razorpay_order_id },
        {
          paymentStatus: "completed",
          razorpayPaymentId: razorpay_payment_id,
          razorpaySignature: razorpay_signature,
          paidAt: new Date(),
        },
      )

      //  empty user cart
      const order = await Order.findOne({ razorpayOrderId: razorpay_order_id })
      if (order) {
        await Cart.findOneAndDelete({
          $or: [{ userId: order.userId }, { user: order.userId }],
        })
      }

      // redirect to success page
      res.redirect(
        `${process.env.CLIENT_URL}/payment-success?reference=${razorpay_payment_id}`,
      )
    } else {
      res
        .status(400)
        .json({
          success: false,
          message: "Payment verification failed (Invalid signature)",
        })
    }
  } catch (error) {
    console.error(error)
    res
      .status(500)
      .json({ message: "Internal server error during payment verification" })
  }
}
module.exports = {
  checkout,
  paymentVerification,
}
