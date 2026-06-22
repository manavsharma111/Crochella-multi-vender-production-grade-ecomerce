const mongoose = require ('mongoose')

const couponSchema = new mongoose.Schema({
    couponName:{
        type:String,
        required:true,
    },
    couponCode:{
        type:String,
        required:true,
    },
    discountType:{
        type:String,
        required:true,
    },
    discountValue:{
        type:Number,
        required:true,
    },

    expiryDate:{
        type:Date,
        required:true,
    },
    isActive:{
        type:Boolean,
        default:true,
    },
    couponLimit:{
        type:Number,
        required:true,
    }
})

module.exports = mongoose.model('Coupon', couponSchema)