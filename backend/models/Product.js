const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    productName: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    discountPrice: {
        type: Number,
        default: 0
    },
    isFlashSale: {
        type: Boolean,
        default: false
    },
    flashSalePrice: {
        type: Number
    },
    flashSaleEndTime: {
        type: Date
    },
    stock: {
        type: Number,
        required: true,
        default: 0
    },
    media: [
        {
            url: { type: String, required: true },
            type: { type: String, enum: ['image', 'video'], required: true }
        }
    ],
    category: {
        type: String,
        required: true,
    },
    material: {
        type: String,
        required: true,
    },
    weaveType: {
        type: String,
        default: 'Handwoven'
    },
    rating: {
        type: Number,
        default: 0,
    },
    numReviews: {
        type: Number,
        default: 0,
    },
}, { timestamps: true })

module.exports = mongoose.model('Product',productSchema)