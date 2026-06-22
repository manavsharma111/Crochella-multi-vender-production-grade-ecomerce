const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_ID,
        pass: process.env.EMAIL_PASS
    }
})

const sendOrderStatusEmail = async ({ to, userName, order, newStatus }) => {
    try {
        let statusMessage = ""
        let colorCode = "#ff007f"

        switch (newStatus) {
            case "Shipped":
                statusMessage = "Good news! Your order has been shipped and is on its way."
                colorCode = "#007bff"
                break
            case "Delivered":
                statusMessage = "Yay! Your order has been successfully delivered."
                colorCode = "#28a745"
                break
            case "Cancelled":
                statusMessage = "Your order has been cancelled."
                colorCode = "#dc3545"
                break
            case "Returned":
                statusMessage = "Your return request has been processed."
                colorCode = "#ffc107"
                break
            case "Refunded":
                statusMessage = "Your refund has been initiated successfully."
                colorCode = "#17a2b8"
                break
            default:
                statusMessage = `Your order status has been updated to: ${newStatus}`
                break
        }

        const html = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eeeeee; border-radius: 10px;">
                <div style="text-align: center; margin-bottom: 20px;">
                    <h1 style="color: ${colorCode}; margin: 0;">Order ${newStatus}</h1>
                    <p style="color: #666;">Status Update for Order #${order._id.toString().slice(-6)}</p>
                </div>
                
                <p>Hi <strong>${userName}</strong>,</p>
                <p>${statusMessage}</p>
                
                <div style="background-color: #f9f9f9; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                    <p style="margin: 5px 0;"><strong>Order ID:</strong> #${order._id.toString()}</p>
                    <p style="margin: 5px 0;"><strong>Current Status:</strong> <span style="color: ${colorCode}; font-weight: bold;">${newStatus}</span></p>
                </div>

                <div style="margin-top: 40px; text-align: center; color: #888; font-size: 0.9em;">
                    <p>Track your order live on your Neo Handlooms dashboard.</p>
                    <p>If you have any questions, reply to this email or contact our support team.</p>
                </div>
            </div>
        `

        const mailOptions = {
            from: `"Neo Handlooms" <${process.env.EMAIL_ID}>`,
            to: to,
            subject: `Order Update: ${newStatus} - #${order._id.toString().slice(-6)}`,
            html: html
        }

        const info = await transporter.sendMail(mailOptions)
        console.log("Order Status Email sent: " + info.messageId)
        return true
    } catch (error) {
        console.error("Order Status Email Error:", error)
        return false
    }
}

module.exports = sendOrderStatusEmail
