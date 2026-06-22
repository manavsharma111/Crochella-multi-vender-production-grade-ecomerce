const nodemailer = require("nodemailer")

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_ID,
        pass: process.env.EMAIL_PASS
    }
})

const sendOrderConfirmationEmail = async ({ to, userName, order }) => {
    try {
        const productRows = order.products.map(item => `
            <tr>
                <td style="padding: 10px; border-bottom: 1px solid #ddd;">
                    ${item.productId.productName || 'Product'} 
                </td>
                <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: center;">
                    ${item.quantity}
                </td>
                <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: right;">
                    ₹${item.price}
                </td>
            </tr>
        `).join('')

        const html = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eeeeee; border-radius: 10px;">
                <div style="text-align: center; margin-bottom: 20px;">
                    <h1 style="color: #ff007f; margin: 0;">Order Confirmed!</h1>
                    <p style="color: #666;">Thank you for your purchase.</p>
                </div>
                
                <p>Hi <strong>${userName}</strong>,</p>
                <p>We've received your order and are getting it ready to be shipped. Here are your order details:</p>
                
                <div style="background-color: #f9f9f9; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                    <p style="margin: 5px 0;"><strong>Order ID:</strong> #${order._id.toString()}</p>
                    <p style="margin: 5px 0;"><strong>Payment Method:</strong> ${order.paymentMethod}</p>
                    <p style="margin: 5px 0;"><strong>Payment Status:</strong> ${order.paymentStatus}</p>
                    <p style="margin: 5px 0;"><strong>Expected Delivery:</strong> 3-5 Business Days</p>
                </div>

                <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                    <thead>
                        <tr style="background-color: #f1f1f1;">
                            <th style="padding: 10px; text-align: left; border-bottom: 2px solid #ddd;">Item</th>
                            <th style="padding: 10px; text-align: center; border-bottom: 2px solid #ddd;">Qty</th>
                            <th style="padding: 10px; text-align: right; border-bottom: 2px solid #ddd;">Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${productRows}
                    </tbody>
                    <tfoot>
                        <tr>
                            <td colspan="2" style="padding: 10px; text-align: right; font-weight: bold;">Subtotal:</td>
                            <td style="padding: 10px; text-align: right;">₹${order.totalPrice + order.discountAmount}</td>
                        </tr>
                        <tr>
                            <td colspan="2" style="padding: 10px; text-align: right; font-weight: bold; color: green;">Discount:</td>
                            <td style="padding: 10px; text-align: right; color: green;">-₹${order.discountAmount}</td>
                        </tr>
                        <tr>
                            <td colspan="2" style="padding: 10px; text-align: right; font-weight: bold; font-size: 1.1em; border-top: 2px solid #ddd;">Total:</td>
                            <td style="padding: 10px; text-align: right; font-weight: bold; font-size: 1.1em; border-top: 2px solid #ddd;">₹${order.totalPrice}</td>
                        </tr>
                    </tfoot>
                </table>

                <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eeeeee;">
                    <h3 style="margin-top: 0;">Shipping Address</h3>
                    <p style="margin: 5px 0; color: #555;">
                        ${order.shippingAddress.addressLine1}<br>
                        ${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.pincode}<br>
                        Phone: ${order.shippingAddress.phone}
                    </p>
                </div>

                <div style="margin-top: 40px; text-align: center; color: #888; font-size: 0.9em;">
                    <p>If you have any questions, reply to this email or contact our support team.</p>
                </div>
            </div>
        `

        const mailOptions = {
            from: `"Crochella Store" <${process.env.EMAIL_ID}>`,
            to: to,
            subject: `Order Confirmation - #${order._id.toString().slice(-6)}`,
            html: html
        }

        const info = await transporter.sendMail(mailOptions)
        console.log("Order Confirmation Email sent: " + info.messageId)
        return true
    } catch (error) {
        console.error("Order Confirmation Email Error:", error)
        return false
    }
}

module.exports = sendOrderConfirmationEmail
