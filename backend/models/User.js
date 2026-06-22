const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name: {
        type: String
    },
    role: {
        type: String,
        enum: ['buyer', 'admin', 'seller', 'delivery_boy'],
        default: 'buyer'
    },
    phone: {
        type: String
    },
    recentlyViewed: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    }],
    isOtpVerified: {
        type: Boolean,
        default: false
    },
    username: {
      type: String,
      unique: true,
      sparse: true
    },
    avatar: {
        type: String,
        default: ""
    },
    pushSubscription: {
        type: Object,
        default: null
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true,
      sparse: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    googleId: {
        type: String
    },
    profileImage: {
        type: String
    },
    password: {
      type: String,
      minlength: 8,
      select: false
    },
    confirmPassword: {
      type: String,
      minlength: 8,
      select: false
    },
    emailOtp: {
      type: String
    },
    emailOtpExpiry: {
      type: Date
    },
    forgetPassword: {
      type: String
    },
    forgetPasswordOtp: {
      type: String
    },
    forgetPasswordOtpExpiry: {
      type: Date
    },
    resetPasswordOtp: {
      type: String
    },
    resetPasswordOtpExpiry: {
      type: Date
    },
    Delivery_address: [{
        Area: {
            type: String
        },
        city: {
            type: String
        },

        state: {
            type: String
        },
        country: {
            type: String
        },
        pinCode: {
            type: String
        }
    }],
    deliveryRating: {
        average: { type: Number, default: 0 },
        count: { type: Number, default: 0 }
    }
  }
)

module.exports = mongoose.model('User', userSchema)