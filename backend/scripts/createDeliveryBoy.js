const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
require('dotenv').config()

const MONGODB_URI = process.env.MONGODB_URI

const UserSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    password: String,
    role: { type: String, default: 'buyer' }
}, { strict: false })

const User = mongoose.model('User', UserSchema)

async function createDeliveryBoy() {
    try {
        await mongoose.connect(MONGODB_URI)
        console.log('✅ Connected to MongoDB')

        const email = 'delivery@demo.com'
        const existing = await User.findOne({ email })

        if (existing) {
            console.log(`⚠️  Account already exists!`)
            console.log(`📧 Email   : ${email}`)
            console.log(`🔑 Password: delivery123`)
            console.log(`👤 Role    : ${existing.role}`)
            await mongoose.disconnect()
            return
        }

        const hashedPassword = await bcrypt.hash('delivery123', 10)
        const deliveryBoy = await User.create({
            name: 'Demo Delivery Boy',
            email,
            password: hashedPassword,
            role: 'delivery_boy'
        })

        console.log('🛵 Demo Delivery Boy Created Successfully!')
        console.log('─────────────────────────────────')
        console.log(`📧 Email   : ${email}`)
        console.log(`🔑 Password: delivery123`)
        console.log(`👤 Role    : delivery_boy`)
        console.log(`🆔 ID      : ${deliveryBoy._id}`)
        console.log('─────────────────────────────────')
        await mongoose.disconnect()
    } catch (err) {
        console.error('❌ Error:', err.message)
        process.exit(1)
    }
}

createDeliveryBoy()
