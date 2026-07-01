const Order = require("../models/Order")
const sendEmail = require("./emailOTPService")

const orderUpdates = async (req, res) => {
  try {
    const { orderStatus, lat, lng, addressString } = req.body

    const order = await Order.findById(req.params.id).populate(
      "userId",
      "name email",
    )

    if (!order) return res.status(404).json({ message: "Order not found" })

    order.orderStatus = orderStatus

    // Update live map coordinates
    if (lat && lng) {
      order.currentLocation = { lat, lng, addressString }
    }
    await order.save()

    //TRIGGER PUSH NOTIFICATION
    const { sendPushAlert } = require("../controller/notification.controller")
    await sendPushAlert(
      order.userId._id,
      `Order ${orderStatus}`,
      `Your order is now ${orderStatus}. ${addressString ? "Location: " + addressString : ""}`,
    )

    // AUTOMATIC EMAIL ALERT LOGIC
    let emailSubject = `Order Update: ${orderStatus}`
    let emailBody = `Hi ${order.userId.name},<br><br>Your order #${order._id} status has been updated to: <b>${orderStatus}</b>.<br><br>Track your live handloom product location on our app dashboard.`

    if (orderStatus === "Shipped") {
      emailBody += `<br><br>Your beautiful handwoven product has left our facility!`
    } else if (orderStatus === "Delivered") {
      emailSubject = `🥳 Order Delivered Successfully!`
      emailBody = `Hi ${order.userId.name},<br><br>Your handloom item has been safely delivered. We hope you love the craft! Share your feedback with photos to support local weavers.`
    }

    // Send email
    await sendEmail({
      to: order.userId.email,
      subject: emailSubject,
      html: emailBody,
    })

    res
      .status(200)
      .json({ success: true, message: "Status updated and email sent", order })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Error updating status" })
  }
}

module.exports = { orderUpdates }
