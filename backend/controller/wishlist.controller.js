const Wishlist = require('../models/Wishlist')
const Product = require('../models/Product')
const CustomWishlist = require('../models/CustomWishlist')

// add/remove fron  wishlist
const toggleWishlist = async (req,res) => {
    try {
        const { productId } = req.body
        const userId = req.user.id
        if(!userId){
            return res.status(401).json({message:'Please login to add product to wishlist'})
        }
        if (req.user.role === 'admin' || req.user.role === 'seller') {
            return res.status(400).json({message: 'Admins and Sellers cannot use the wishlist feature.'})
        }
        if(!productId){
            return res.status(400).json({message:'Please provide productId'})
        }
        const product = await Product.findById(productId)
        if(!product){
            return res.status(404).json({message:'Product not found'})
        }
        const existingWishlist = await Wishlist.findOne({userId,productId})
        if(existingWishlist){
            await Wishlist.findByIdAndDelete(existingWishlist._id)
            return res.status(200).json({message:'Product removed from wishlist'})
        }
        else{
            const newWishlist = new Wishlist({userId,productId})
            await newWishlist.save()
            return res.status(200).json({message:'Product added to wishlist'})
        }
    } catch (error) {
        console.error("toggleWishlist Error:", error)
        res.status(500).json({message: error.message || 'Internal server error'})
    }
}
// get wishlist
const getWishlist = async (req,res) => {
    try {
        const userId = req.user.id
        if(!userId){
            return res.status(401).json({message:'Please login to view wishlist'})
        }
        if (req.user.role === 'admin' || req.user.role === 'seller') {
            return res.status(200).json({message:'Wishlist fetched successfully', wishlist: []})
        }
        const wishlistData = await Wishlist.find({userId}).populate('productId')
        return res.status(200).json({message:'Wishlist fetched successfully', wishlist: wishlistData})
    } catch (error) {
        console.error(error)
        res.status(500).json({message: 'Internal server error'})
    }
}

// create custom wishlist 
const createCustomWishlist = async (req,res)=>{
    try {
        const { name, description } = req.body
        const userId = req.user.id
        if(!userId){
            return res.status(401).json({message:'Please login to create wishlist'})
        }
        if(!name){
            return res.status(400).json({message:'Please provide wishlist name'})
        }
        const newCustomWishlist = new CustomWishlist({userId,name,description})
        await newCustomWishlist.save()
        return res.status(200).json({message:'Custom wishlist created successfully', wishlist: newCustomWishlist})
    } catch (error) {
        console.error(error)
        res.status(500).json({message: 'Internal server error'})
    }
}

// toggle product in custom wishlist
const toggleProductInCustomWishlist = async (req, res) => {
    try {
        const { customWishlistId, productId } = req.body
        const userId = req.user.id
        
        const wishlist = await CustomWishlist.findOne({ _id: customWishlistId, userId })
        if (!wishlist) return res.status(404).json({ message: 'Custom wishlist not found' })
        
        const productIndex = wishlist.products.indexOf(productId)
        
        if (productIndex !== -1) {
            // If product already exists, remove it (Toggle Off)
            wishlist.products.splice(productIndex, 1)
            await wishlist.save()
            return res.status(200).json({ message: 'Product removed from custom wishlist', wishlist })
        } else {
            // If product doesn't exist, add it (Toggle On)
            wishlist.products.push(productId)
            await wishlist.save()
            return res.status(200).json({ message: 'Product added to custom wishlist', wishlist })
        }
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Internal server error' })
    }
}

// get custom wishlists
const getCustomWishlists = async (req, res) => {
    try {
        const userId = req.user.id
        if (req.user.role === 'admin' || req.user.role === 'seller') {
            return res.status(200).json({ message: 'Custom wishlists fetched', wishlists: [] })
        }
        const wishlists = await CustomWishlist.find({ userId }).populate('products')
        return res.status(200).json({ message: 'Custom wishlists fetched', wishlists })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Internal server error' })
    }
}

// delete custom wishlist
const deleteCustomWishlist = async (req, res) => {
    try {
        const { customWishlistId } = req.params
        const userId = req.user.id
        
        const deletedWishlist = await CustomWishlist.findOneAndDelete({ _id: customWishlistId, userId })
        if (!deletedWishlist) return res.status(404).json({ message: 'Custom wishlist not found' })
        
        return res.status(200).json({ message: 'Custom wishlist deleted successfully' })
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' })
    }
}

// update custom wishlist
const updateCustomWishlist = async (req, res) => {
    try {
        const { customWishlistId } = req.params
        const { name, description } = req.body
        const userId = req.user.id
        
        const updatedWishlist = await CustomWishlist.findOneAndUpdate(
            { _id: customWishlistId, userId },
            { name, description },
            { new: true }
        );
        
        if (!updatedWishlist) return res.status(404).json({ message: 'Custom wishlist not found' })
        
        return res.status(200).json({ message: 'Custom wishlist updated successfully', wishlist: updatedWishlist })
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' })
    }
}


module.exports = { 
    toggleWishlist, 
    getWishlist, 
    createCustomWishlist,
    toggleProductInCustomWishlist,
    getCustomWishlists,
    deleteCustomWishlist,
    updateCustomWishlist
}