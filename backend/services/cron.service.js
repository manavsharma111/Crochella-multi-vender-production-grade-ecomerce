const cron = require("node-cron")
const Cart = require("../models/Cart")
const User = require("../models/User")
const { sendPushAlert } = require("../controller/notification.controller")
const sendEmail = require("./emailOTPService")

const startCronJobs = () => {
  cron.schedule("0 21 * * *", async () => {
    console.log("Its 9 pm checking abandoned carts")

    try {
      const abandonedCarts = await Cart.find({
        $where: "this.products.length > 0",
      }).populate("userId")
      if (abandonedCarts.length === 0) {
        console.log("All clear no abandoned carts")
        return
      }

      console.log(
        `Total ${abandonedCarts.length} carts found in which items are left. Sending reminders`,
      )
      for (const cart of abandonedCarts) {
        const user = cart.userId
        if (!user) continue
        await sendPushAlert(
          user._id,
          "Your Saree is waiting! ",
          "Hey " +
            user.name +
            ", your handloom saree is waiting in your cart. Order it before someone else grabs it!",
        )
        const emailSubject = "Your Cart Misses You! 🛒"
        const emailHtml = `
                    <h3>Hi ${user.name},</h3>
                    <p>You selected some beautiful handloom sarees, but it looks like you forgot to complete the order!</p>
                    <p>Your cart has <b>${cart.products.length}</b> beautiful items waiting for you.</p>
                    <p>Stock is running out fast, so hurry up and complete your order.</p>
                    <br>
                    <p>Thanks & Regards,<br>Your Handloom Store</p>
                `

        await sendEmail({
          to: user.email,
          subject: emailSubject,
          html: emailHtml,
        })

        console.log(`Reminder successfully sent to: ${user.email}`)
      }

      console.log("Cron job finished")
    } catch (error) {
      console.error("Cron Job failed:", error)
    }
  })

  console.log(
    "Cron job set to run at 9 pm everyday to send reminders for abandoned carts",
  )
}

module.exports = { startCronJobs }
