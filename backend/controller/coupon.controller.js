const Coupon = require('../models/Coupon')

// CREATE COUPON 
const createCoupon = async (req, res) => {
    try {
        const { couponName, couponCode, discountType, discountValue, expiryDate, couponLimit } = req.body

        if (!couponName || !couponCode || !discountType || !discountValue || !expiryDate || !couponLimit) {
            return res.status(400).json({ message: "All fields are required" })
        }

        const existingCoupon = await Coupon.findOne({ couponCode })
        if (existingCoupon) {
            return res.status(400).json({ message: "Coupon code already exists" })
        }

        const newCoupon = new Coupon({
            couponName,
            couponCode: couponCode.toUpperCase(),
            discountType,
            discountValue,
            expiryDate,
            couponLimit
        })

        await newCoupon.save()
        res.status(201).json({ success: true, message: "Coupon created successfully", data: newCoupon })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Server error while creating coupon" })
    }
}

// GET ALL COUPONS
const getAllCoupons = async (req, res) => {
    try {
        const coupons = await Coupon.find().sort({ createdAt: -1 })
        res.status(200).json({ success: true, data: coupons })
    } catch (error) {
        res.status(500).json({ message: "Error fetching coupons" })
    }
}

// GET ACTIVE COUPONS 
const getActiveCoupons = async (req, res) => {
    try {
        const coupons = await Coupon.find().sort({createdAt: -1})
        res.status(200).json({ success: true, data: coupons })
    } catch (error) {
        res.status(500).json({ message: "Error fetching active coupons" })
    }
}

// DELETE/DEACTIVATE COUPON
const deleteCoupon = async (req, res) => {
    try {
        const { id } = req.params
        const coupon = await Coupon.findByIdAndDelete(id)
        if (!coupon) return res.status(404).json({ message: "Coupon not found" })

        res.status(200).json({ success: true, message: "Coupon deleted successfully" })
    } catch (error) {
        res.status(500).json({ message: "Server error while deleting coupon" })
    }
}

module.exports = {
    createCoupon,
    getAllCoupons,
    getActiveCoupons,
    deleteCoupon
}
