const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    products: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                required: true
            },
            quantity: {
                type: Number,
                required: true,
                default: 1
            },
            price: {
                type: Number,
                required: true
            }
        }
    ],
    totalPrice: {
        type: Number,
        required: true
    },
    appliedCoupon: {
        type: String,
        default: null
    },
    discountAmount: {
        type: Number,
        default: 0
    },
    paymentMethod:{
        type: String,
        required: true,
        enum: ['COD','Razorpay']
    },
    paymentStatus: {
        type: String,
        required: true,
        enum: ['pending', 'completed', 'failed', 'refunded'],
        default: 'pending'
    },
    shippingAddress: {
        name: String,
        email: String,
        phone: String,
        address: String,
        city: String,
        state: String,
        zip: String,
        country: String
    },
    orderStatus: {
        type: String,
        required: true,
        enum: ['Processing', 'Shipped', 'Delivered', 'Cancelled', 'Returned', 'Collected', 'Refunded'],
        default: 'Processing'
    },
    razorpayOrderId:String,
    razorpayPaymentId:String,
    razorpaySignature:String,
    deliveryBoyId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    deliveryStatus: { 
        type: String, 
        enum: ['Available', 'Accepted', 'Out_for_Delivery', 'Delivered', 'Return_Pickup', 'Return_Collected'], 
        default: 'Available' 
    },
    deliveryOtp: {
        type: String,
        default: null
    },
    currentLocation:{
        lat: { type: Number, default: 27.8800 }, 
        lng: { type: Number, default: 78.0800 },
        addressString: { type: String, default: "Handloom Store"
        }
    },
    paidAt: {type:Date},
    refundedAt: {type:Date},
    deliveredAt: {type:Date},
    shippedAt: {type:Date},
    cancelledAt: {type:Date},
    orderPlacedAt: {type:Date},
    orderReceivedAt: {type:Date},
    orderDeliveredAt: {type:Date},
    orderCancelledAt: {type:Date},
    estimatedDeliveryDate: {type:Date},
    outForDeliveryAt: {type:Date},
    returnDetails: {
        reason: { type: String },
        images: [{ type: String }], // Cloudinary URLs of return proof
        refundMethod: { type: String, enum: ['UPI', 'BANK'], default: 'UPI' },
        upiId: { type: String }, 
        bankDetails: {
            accountNumber: { type: String },
            ifscCode: { type: String },
            accountHolderName: { type: String }
        },
        refundedAt: { type: Date }
    },
}, { timestamps: true })

module.exports = mongoose.model('Order', orderSchema)