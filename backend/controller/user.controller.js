const User = require('../models/User')
const jwt = require('jsonwebtoken')
const bcryptjs = require('bcryptjs')
const mongoose = require('mongoose')
const Product = require('../models/Product')


// Get current user profile
const getProfile = async (req, res) => {
  try {
    // If user is admin or seller, return a mock profile since they aren't in the DB
    if (req.user.role === 'admin') {
      return res.status(200).json({ 
        _id: "admin", 
        name: "Admin User", 
        email: process.env.ADMIN_EMAIL, 
        role: "admin",
        Delivery_address: [],
        recentlyViewed: []
      })
    }
    if (req.user.role === 'seller') {
      return res.status(200).json({ 
        _id: "seller", 
        name: "Seller User", 
        email: process.env.SELLER_EMAIL, 
        role: "seller",
        Delivery_address: [],
        recentlyViewed: []
      })
    }

    const user = await User.findById(req.user.id).select('-password')
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }
    res.status(200).json({ ...user.toObject(), role: req.user.role })
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" })
  }
}

// update profile
const updateProfile = async(req,res)=>{
    try{
        if (req.user.role === 'admin' || req.user.role === 'seller') return res.status(403).json({message: "Cannot update mock profile"});
        const {name,email,phone,profileImage}=req.body
        const user =await User.findById(req.user.id)
        if(!user){
            return res.status(404).json({message: "User not found"})
        }
        if(name !== undefined) user.name=name
        if(email !== undefined) user.email=email
        if(phone !== undefined) user.phone=phone
        if(profileImage !== undefined) user.profileImage=profileImage
        await user.save()
        return res.status(200).json({message: "Profile updated successfully", data: user})
    }
    catch(error){
        res.status(500).json({message: "Internal server error"})
    }
}

// change password  in login state
const changePassword = async (req, res) => {
    try {
        if (req.user.role === 'admin' || req.user.role === 'seller') return res.status(403).json({message: "Cannot change password for mock profile"});
        const { oldPassword, newPassword } = req.body

        if (!oldPassword || !newPassword) {
            return res.status(400).json({ message: "Please provide both old and new passwords" })
        }

        const user = await User.findById(req.user.id).select('+password')
        
        // Check if old password is correct
        const isMatch = await bcryptjs.compare(oldPassword, user.password)
        if (!isMatch) {
            return res.status(400).json({ message: "Incorrect old password" })
        }

        // Validate new password length
        if (newPassword.length < 8) {
            return res.status(400).json({ message: "New password must be at least 8 characters long" })
        }

        // Hash and save new password
        user.password = await bcryptjs.hash(newPassword, 10)
        await user.save()

        res.status(200).json({ message: "Password updated successfully" })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Internal server error" })
    }
}

// get delivery address
const getDeliveryAddress = async(req,res)=>{
    try{
        if (req.user.role === 'admin' || req.user.role === 'seller') return res.status(200).json([])
        const user =await User.findById(req.user.id).select('Delivery_address')
        if(!user){
            return res.status(404).json({message: "User not found"})
        }
        if(user.Delivery_address.length === 0){
            return res.status(404).json({message: "Delivery address not found"})
        }

        res.status(200).json(user.Delivery_address)
    }
    catch(error){
        res.status(500).json({message: "Internal server error"})
    }
}
// update delivary address
const updateDeliveryAddress = async(req,res)=>{
    try{
        if (req.user.role === 'admin' || req.user.role === 'seller') return res.status(403).json({message: "Access denied"});
        const {address} = req.body
        const user = await User.findById(req.user.id)
        if(!user){
            return res.status(404).json({message: "User not found"})
        }
        user.Delivery_address = address
        await user.save()
        return res.status(200).json({message: "Delivery address updated successfully"})
    }
    catch(error){
        res.status(500).json({message: "Internal server error"})
    }
}

// add more delivery address
const addDeliveryAddress = async(req,res)=>{
    try{
        if (req.user.role === 'admin' || req.user.role === 'seller') return res.status(403).json({message: "Access denied"});
        const {address} = req.body
        const user = await User.findById(req.user.id)
        if(!user){
            return res.status(404).json({message: "User not found"})
        }
        user.Delivery_address.push(address)
        await user.save()
        return res.status(200).json({message: "Delivery address added successfully"})
    }
    catch(error){
        res.status(500).json({message: "Internal server error"})
    }
}

// delete delivary address
const deleteDeliveryAddress = async(req,res)=>{
    try{
        if (req.user.role === 'admin' || req.user.role === 'seller') return res.status(403).json({message: "Access denied"});
        const {address} = req.body
        const user = await User.findById(req.user.id)
        if(!user){
            return res.status(404).json({message: "User not found"})
        }
        user.Delivery_address = address
        await user.save()
        return res.status(200).json({message: "Delivery address deleted successfully"})
    }
    catch(error){
        res.status(500).json({message: "Internal server error"})
    }
}

// for admin only function 
const getAllUsers = async (req, res) => {
    try {
        const limit = Number(req.query.limit) || 10;
        const page = Number(req.query.page) || 1;
        const skip = (page - 1) * limit;
        const { search } = req.query;

        let query = {};
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } }
            ];
        }

        const total = await User.countDocuments(query);
        const users = await User.find(query)
            .select('-password')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        res.status(200).json({
            success: true,
            count: users.length,
            users,
            pagination: { total, page, limit }
        })
    } catch (error) {
        console.error("Error in getAllUsers:", error)
        res.status(500).json({ message: "Internal server error" })
    }
}

// admin — get all delivery boys
const getAllDeliveryBoys = async (req, res) => {
    try {
        const deliveryBoys = await User.find({ role: 'delivery_boy' }).select('-password').sort({ createdAt: -1 })
        res.status(200).json({ success: true, count: deliveryBoys.length, deliveryBoys })
    } catch (error) {
        console.error("Error in getAllDeliveryBoys:", error)
        res.status(500).json({ message: "Internal server error" })
    }
}

// admin — assign/change role of a user
const assignRole = async (req, res) => {
    try {
        const { userId } = req.params
        const { role } = req.body
        const allowedRoles = ['buyer', 'delivery_boy']
        if (!allowedRoles.includes(role)) {
            return res.status(400).json({ message: 'Invalid role. Allowed: buyer, delivery_boy' })
        }
        const user = await User.findByIdAndUpdate(userId, { role }, { new: true }).select('-password')
        if (!user) return res.status(404).json({ message: 'User not found' })
        res.status(200).json({ success: true, message: `Role updated to ${role}`, user })
    } catch (error) {
        console.error("Error in assignRole:", error)
        res.status(500).json({ message: "Internal server error" })
    }
}

// Track product view
const trackProductView = async (req, res) => {
    try {
        if (req.user.role === 'admin' || req.user.role === 'seller') return res.status(200).json({ success: true });
        const productId = req.params.productId;
        
        // Prevent dummy product IDs from crashing the database
        if(!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(200).json({ success: true, message: "Dummy product view ignored" });
        }

        const user = await User.findById(req.user.id);
        
        if (!user) return res.status(404).json({ message: "User not found" });

        // Remove the product if it already exists to avoid duplicates
        user.recentlyViewed = user.recentlyViewed.filter(id => id.toString() !== productId);
        
        // Add to the beginning of the array
        user.recentlyViewed.unshift(productId);

        // Keep only the last 10 viewed products
        if (user.recentlyViewed.length > 10) {
            user.recentlyViewed = user.recentlyViewed.slice(0, 10);
        }

        await user.save();
        res.status(200).json({ success: true, message: "Product view tracked" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

// Get personalized recommendations
const getRecommendations = async (req, res) => {
    try {
        if (req.user.role === 'admin' || req.user.role === 'seller') {
            const fallbackProducts = await Product.find().sort('-rating').limit(5);
            return res.status(200).json({ success: true, data: fallbackProducts });
        }
        let user = await User.findById(req.user.id);

        // CLEANUP: Remove invalid IDs (like 'd1') before populating to prevent CastError crashes
        if (user && user.recentlyViewed) {
            const validIds = user.recentlyViewed.filter(id => mongoose.Types.ObjectId.isValid(id));
            if (validIds.length !== user.recentlyViewed.length) {
                user.recentlyViewed = validIds;
                await user.save();
            }
        }

        user = await user.populate('recentlyViewed');
        
        if (!user || !user.recentlyViewed || user.recentlyViewed.length === 0) {
            // If no history, return top rated products
            const fallbackProducts = await Product.find().sort('-rating').limit(5);
            return res.status(200).json({ success: true, data: fallbackProducts });
        }

        // Extract categories and materials from recently viewed
        const categories = [...new Set(user.recentlyViewed.map(p => p.category).filter(Boolean))];
        const materials = [...new Set(user.recentlyViewed.map(p => p.material).filter(Boolean))];
        const viewedIds = user.recentlyViewed.map(p => p._id);

        // Find products matching these categories/materials but NOT already viewed
        const recommendations = await Product.find({
            _id: { $nin: viewedIds },
            $or: [
                { category: { $in: categories } },
                { material: { $in: materials } }
            ]
        }).limit(10);

        res.status(200).json({
            success: true,
            data: recommendations.length > 0 ? recommendations : user.recentlyViewed
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

module.exports = { updateProfile,
    getProfile,
    getDeliveryAddress,
    updateDeliveryAddress, 
    changePassword,
    addDeliveryAddress,
    deleteDeliveryAddress,
    getAllUsers,
    getAllDeliveryBoys,
    assignRole,
    trackProductView,
    getRecommendations
}