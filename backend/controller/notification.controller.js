const User = require('../models/User')
const webPush = require('web-push')

webPush.setVapidDetails(
    'mailto:[EMAIL_ADDRESS]',
    process.env.WEB_PUSH_PUBLIC_KEY,
    process.env.WEB_PUSH_PRIVATE_KEY
)
const subscribeUser = async (req, res) => {
    try {
        const { subscription } = req.body
        const userId = req.user.id
        await User.findByIdAndUpdate(userId, { pushSubscription: subscription })
        const message = subscription ? "Subscribed to push notifications" : "Unsubscribed from push notifications"
        res.status(201).json({ success: true, message })
    } catch (error) {
        console.error("Subscription Error:", error)
        res.status(500).json({ message: "Failed to subscribe" })
    }
}
const sendPushAlert = async (userId, title, bodyMessage) => {
    try {
        const user = await User.findById(userId)
        if (!user || !user.pushSubscription) return

        const payload = JSON.stringify({
            title: title,
            body: bodyMessage,
            icon: 'https://cdn-icons-png.flaticon.com/512/3144/3144456.png'
        })

        await webPush.sendNotification(user.pushSubscription, payload)
    } catch (error) {
        console.error("Push Notification Error:", error)
    }
}

const broadcastAlert = async (req, res) => {
    try {
        const { title, message } = req.body
        const usersWithPush = await User.find({ pushSubscription: { $ne: null } })

        if (usersWithPush.length === 0) {
            return res.status(400).json({ message: "No customer has subscribed to push notifications yet." })
        }

        const payload = JSON.stringify({
            title: title || "Exclusive Offer!",
            body: message || "Sale is live",
            icon: 'https://cdn-icons-png.flaticon.com/512/3144/3144456.png'
        })

        let successCount = 0
        for (const user of usersWithPush) {
            try {
                await webPush.sendNotification(user.pushSubscription, payload)
                successCount++
            } catch (err) {
                console.log(`Failed to send to user ${user._id}`)
            }
        }

        res.status(200).json({ 
            success: true, 
            message: `Total ${successCount} customers got alert.` 
        })

    } catch (error) {
        console.error("Broadcast failed:", error)
        res.status(500).json({ message: "Failed to broadcast the message" })
    }
}

module.exports = { subscribeUser, sendPushAlert, broadcastAlert }