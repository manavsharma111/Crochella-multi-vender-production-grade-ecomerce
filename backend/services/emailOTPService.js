const nodemailer = require("nodemailer")

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_ID,
        pass: process.env.EMAIL_PASS
    }
})

const sendEmail = async ({ to, subject, otp, html }) => {
    try {
        const mailOptions = {
            from: `"My App" <${process.env.EMAIL_ID}>`,
            to: to,
            subject: subject || "Your OTP Verification Code",
            html: html || `
                <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee;">
                    <h2>Verification Code</h2>
                    <p>Use the following OTP to complete your registration:</p>
                    <h1 style="color: #4CAF50;">${otp}</h1>
                    <p>This code is valid for 10 minutes.</p>
                </div>
            `
        }

        const info = await transporter.sendMail(mailOptions)
        console.log("Email sent: " + info.messageId)
        return true
    } catch (error) {
        console.error("Email Error:", error)
        return false
    }
}

module.exports = sendEmail