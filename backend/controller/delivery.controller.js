const Order = require('../models/Order')

// Get new orders which need delivery boy 
const getAvailableOrders = async (req, res) => {
    try {
        const orders = await Order.find({
            orderStatus: 'Processing',
            deliveryStatus: 'Available',
            $or: [
                { paymentMethod: 'COD', paymentStatus: 'pending' },
                { paymentMethod: 'Razorpay', paymentStatus: 'completed' }
            ]
        })
        .populate('userId', 'name email phone')
        .populate('products.productId', 'name price image') 
        .select('_id createdAt totalPrice products deliveryStatus currentLocation shippingAddress paymentMethod')

        res.status(200).json({ success: true, count: orders.length, orders })
    } catch (error) {
        console.error("Pool query crash:", error)
        res.status(500).json({ success: false, message: 'Failed to fetch pool orders', error: error.message })
    }
}

// Delivery boy accept the orders 
const acceptForDelivery = async (req, res) => {
    try {
        const { orderId } = req.params
        const deliveryBoyId = req.user.id 

        const order = await Order.findOneAndUpdate(
            {
                _id: orderId,
                deliveryStatus: 'Available',
                deliveryBoyId: null
            },
            {
                deliveryStatus: 'Accepted',
                deliveryBoyId: deliveryBoyId,
                orderStatus: 'Shipped' 
            },
            { new: true } 
        )
     if (!order) {
            return res.status(400).json({ 
                success: false, 
                message: 'Too Late! someone else already accepted.' 
            })
        }

        res.status(200).json({ success: true, message: 'Order successfully allocated to your profile', data: order })
    } catch (error) {
        console.error("Acceptance query crash:", error)
        res.status(500).json({ success: false, message: 'Failed to accept order', error: error.message })
    }
}

// Update status and coordinates of order 
const updateDeliveryStatus = async (req, res) => {
    try {
        const { orderId } = req.params
        const { deliveryStatus, lat, lng, addressString, otp } = req.body
        const deliveryBoyId = req.user.id

        const order = await Order.findOne({ _id: orderId, deliveryBoyId: deliveryBoyId })
        
        if (!order) {
            return res.status(404).json({ success: false, message: 'Active order assignment not found for your profile' })
        }

        if (deliveryStatus) {
            if (deliveryStatus === 'Out_for_Delivery' && order.deliveryStatus !== 'Out_for_Delivery') {
                // Generate 4-digit OTP
                const generatedOtp = Math.floor(1000 + Math.random() * 9000).toString()
                order.deliveryOtp = generatedOtp
                order.outForDeliveryAt = new Date() // Track when it went out
            }

            if (deliveryStatus === 'Delivered') {
                if (!otp || otp !== order.deliveryOtp) {
                    return res.status(400).json({ success: false, message: 'Invalid OTP provided by customer.' })
                }
                order.orderStatus = 'Delivered'
                order.paymentStatus = 'completed' 
                order.deliveredAt = new Date() // Track delivery completion
            }
            order.deliveryStatus = deliveryStatus
        }
        if (lat && lng) {
            order.currentLocation = {
                lat: parseFloat(lat),
                lng: parseFloat(lng),
                addressString: addressString || order.currentLocation.addressString
            }
        }

        await order.save()
        res.status(200).json({ success: true, message: 'Delivery status and location logs updated', data: order })
    } catch (error) {
        console.error("Status update query crash:", error)
        res.status(500).json({ success: false, message: 'Failed to update order status', error: error.message })
    }
}

// Get return orders available for pickup
const getAvailableReturns = async (req, res) => {
    try {
        const orders = await Order.find({
            orderStatus: 'Returned',
            deliveryStatus: 'Available'
        })
        .populate('userId', 'name email phone')
        .populate('products.productId', 'name price image')
        .select('_id createdAt totalPrice products deliveryStatus currentLocation shippingAddress returnDetails')

        res.status(200).json({ success: true, count: orders.length, orders })
    } catch (error) {
        console.error("Return pool query crash:", error)
        res.status(500).json({ success: false, message: 'Failed to fetch return orders', error: error.message })
    }
}

// Delivery boy accept return pickup
const acceptReturnPickup = async (req, res) => {
    try {
        const { orderId } = req.params
        const deliveryBoyId = req.user.id

        const generatedOtp = Math.floor(1000 + Math.random() * 9000).toString()

        const order = await Order.findOneAndUpdate(
            { _id: orderId, orderStatus: 'Returned', deliveryStatus: 'Available' },
            { deliveryStatus: 'Return_Pickup', deliveryBoyId: deliveryBoyId, deliveryOtp: generatedOtp },
            { new: true }
        )
        if (!order) {
            return res.status(400).json({ success: false, message: 'Too Late! Return already accepted.' })
        }
        res.status(200).json({ success: true, message: 'Return pickup accepted', data: order })
    } catch (error) {
        console.error("Return accept crash:", error)
        res.status(500).json({ success: false, message: 'Failed to accept return', error: error.message })
    }
}

// Mark return as collected
const confirmReturnCollected = async (req, res) => {
    try {
        const { orderId } = req.params
        const { otp } = req.body
        const deliveryBoyId = req.user.id

        const order = await Order.findOne({ _id: orderId, deliveryBoyId: deliveryBoyId, deliveryStatus: 'Return_Pickup' })
        if (!order) {
            return res.status(404).json({ success: false, message: 'Return pickup not found for your profile' })
        }

        if (!otp || otp !== order.deliveryOtp) {
            return res.status(400).json({ success: false, message: 'Invalid OTP provided by customer.' })
        }

        order.deliveryStatus = 'Return_Collected'
        order.orderStatus = 'Collected'
        order.deliveredAt = new Date() // Track completion time for returns too
        await order.save()
        res.status(200).json({ success: true, message: 'Return item collected successfully', data: order })
    } catch (error) {
        console.error("Return collected crash:", error)
        res.status(500).json({ success: false, message: 'Failed to mark return collected', error: error.message })
    }
}

// Get my deliveries (all active + completed orders assigned to this delivery boy)
const getMyDeliveries = async (req, res) => {
    try {
        const deliveryBoyId = req.user.id
        const orders = await Order.find({ deliveryBoyId })
            .populate('userId', 'name email phone')
            .populate('products.productId', 'name price image')
            .sort({ updatedAt: -1 })

        res.status(200).json({ success: true, count: orders.length, orders })
    } catch (error) {
        console.error("My deliveries crash:", error)
        res.status(500).json({ success: false, message: 'Failed to fetch your deliveries', error: error.message })
    }
}

// Rate the delivery boy
const rateDeliveryBoy = async (req, res) => {
    try {
        const { deliveryBoyId } = req.params
        const { rating } = req.body
        const userId = req.user.id // buyer ID

        if (!rating || rating < 1 || rating > 5) {
            return res.status(400).json({ success: false, message: 'Valid rating between 1 and 5 is required' })
        }

        const User = require('../models/User')
        const deliveryBoy = await User.findById(deliveryBoyId)
        if (!deliveryBoy || deliveryBoy.role !== 'delivery_boy') {
            return res.status(404).json({ success: false, message: 'Delivery boy not found' })
        }

        const currentRating = deliveryBoy.deliveryRating || { average: 0, count: 0 }
        const newCount = currentRating.count + 1
        const newAverage = ((currentRating.average * currentRating.count) + Number(rating)) / newCount

        deliveryBoy.deliveryRating = { average: newAverage, count: newCount }
        await deliveryBoy.save()

        res.status(200).json({ success: true, message: 'Thank you for your rating!' })
    } catch (error) {
        console.error("Rate delivery boy crash:", error)
        res.status(500).json({ success: false, message: 'Failed to submit rating', error: error.message })
    }
}
// Admin: Get delivery staff stats and calculate salaries
const getDeliveryStaffStats = async (req, res) => {
    try {
        const User = require('../models/User')
        const deliveryBoys = await User.find({ role: 'delivery_boy' }).select('-password')

        const stats = await Promise.all(deliveryBoys.map(async (dboy) => {
            // Find completed deliveries and return collections for this delivery boy
            const completedOrders = await Order.find({
                deliveryBoyId: dboy._id,
                deliveryStatus: { $in: ['Delivered', 'Return_Collected'] }
            })

            const totalDeliveries = completedOrders.length;
            let totalDeliveryTimeHours = 0;
            let validTimeEntries = 0;

            completedOrders.forEach(order => {
                if (order.outForDeliveryAt && order.deliveredAt) {
                    const diffMs = order.deliveredAt - order.outForDeliveryAt;
                    const diffHrs = diffMs / (1000 * 60 * 60);
                    totalDeliveryTimeHours += diffHrs;
                    validTimeEntries++;
                }
            })

            const avgDeliveryTime = validTimeEntries > 0 ? (totalDeliveryTimeHours / validTimeEntries) : 0;
            
            // Base Salary Calculation
            let baseSalary = totalDeliveries * 50; // ₹50 per successful delivery
            let penaltyReason = [];
            let finalSalary = baseSalary;

            // Penalty 1: Rating < 3.0
            if (dboy.deliveryRating && dboy.deliveryRating.count > 0 && dboy.deliveryRating.average < 3.0) {
                finalSalary -= (baseSalary * 0.20); // 20% penalty
                penaltyReason.push('Low Rating Penalty (20%)');
            }

            // Penalty 2: Avg Delivery Time > 24 hours
            if (avgDeliveryTime > 24) {
                finalSalary -= (baseSalary * 0.10); // 10% penalty
                penaltyReason.push('Late Delivery Penalty (10%)');
            }

            return {
                _id: dboy._id,
                name: dboy.name,
                email: dboy.email,
                avatar: dboy.profileImage || dboy.avatar,
                deliveryRating: dboy.deliveryRating,
                totalDeliveries,
                avgDeliveryTime: avgDeliveryTime.toFixed(1),
                baseSalary,
                finalSalary,
                penalties: penaltyReason
            }
        }));

        res.status(200).json({ success: true, count: stats.length, data: stats })
    } catch (error) {
        console.error("Staff stats crash:", error)
        res.status(500).json({ success: false, message: 'Failed to calculate staff stats', error: error.message })
    }
}

module.exports = { getAvailableOrders, acceptForDelivery, updateDeliveryStatus, getAvailableReturns, acceptReturnPickup, confirmReturnCollected, getMyDeliveries, rateDeliveryBoy, getDeliveryStaffStats }