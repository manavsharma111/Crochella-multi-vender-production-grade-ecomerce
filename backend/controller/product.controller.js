const user = require('../models/User')
const Product = require('../models/Product')
const jwt = require('jsonwebtoken')
const bcryptjs = require('bcryptjs')
const redisClient = require('../config/redis')

const clearProductCache = async () => {
    if (redisClient.isOpen) {
        try {
            const keys = await redisClient.keys('cache:/api/products*');
            if (keys.length > 0) {
                await redisClient.del(keys);
            }
        } catch (error) {
            console.error('Redis cache clearing error:', error);
        }
    }
}

// create product 
const createProduct = async (req,res) => {
    try{
        const {productName, description, price, discountPrice, stock, material, weaveType, category, isFlashSale, flashSalePrice, flashSaleEndTime} = req.body
        let mediaArray = []
        if (req.files && req.files.length > 0) {
            mediaArray = req.files.map(file => ({
                url: file.path,
                type: file.mimetype.startsWith('video/') ? 'video' : 'image'
            }))
        } else if (req.body.media) {
            mediaArray = typeof req.body.media === 'string' ? JSON.parse(req.body.media) : req.body.media
        }
        const newProduct = await Product.create({
            productName,
            description,
            price,
            discountPrice,
            stock,
            material,
            weaveType,
            category,
            isFlashSale: isFlashSale || false,
            flashSalePrice,
            flashSaleEndTime,
            media:mediaArray
        })

        await clearProductCache();

        res.status(201).json({
            success:true,
            message:"Product created successfully", 
            data:newProduct
        })
    }
    catch(error){
        res.status(500).json({message: error.message || "Internal server error"})
    }
}
// get all products
const getAllProducts = async (req,res) => {
    try{
        const {searchTerm, price, stock, rating, category, discountPrice, material, weaveType, sort} = req.query
        let queryObject = {}

        // Filtering
        if(searchTerm){
            queryObject.$or = [
                { productName: { $regex: searchTerm, $options: 'i' } },
                { description: { $regex: searchTerm, $options: 'i' } }
            ]
        }
        if(price){
            queryObject.price = { $lte: Number(price) }
        }
        if(stock){
            queryObject.stock = stock
        }
        if(rating){
            queryObject.rating = rating
        }
        if(category){
            queryObject.category = { $regex: new RegExp(`^${category}`, 'i') } // case-insensitive partial match for category
        }
        if(discountPrice){
            queryObject.discountPrice = discountPrice
        }
        if(material){
            queryObject.material = material
        }
        if(weaveType){
            queryObject.weaveType = weaveType
        }

        let result = Product.find(queryObject)

        // sorting
        if(sort==='price-low-to-high') result = result.sort('price')
        else if(sort==='price-high-to-low') result = result.sort('-price')
        else if(sort==='rating-low-to-high') result = result.sort('rating')
        else if(sort==='rating-high-to-low') result = result.sort('-rating')
        else if(sort==='discountPrice-low-to-high') result = result.sort('discountPrice')
        else if(sort==='discountPrice-high-to-low') result = result.sort('-discountPrice')
        else if(sort==='productName-a-to-z') result = result.sort('productName')
        else if(sort==='productName-z-to-a') result = result.sort('-productName')
        else if(sort==='oldest') result = result.sort('createdAt')
        else result = result.sort('-createdAt')

        const { calculateDynamicPrice } = require('../services/pricing.service');

        // pagination - isse saare product ek saath na aaye 
        const limit = Number(req.query.limit) || 10;
        const page = Number(req.query.page) || 1;
        const skip = (page - 1) * limit;

        result = await result.skip(skip).limit(limit)

        // Map through products and calculate dynamic price
        const productsWithDynamicPrice = result.map(product => {
            const productObj = product.toObject ? product.toObject() : product;
            productObj.dynamicPrice = calculateDynamicPrice(productObj);
            return productObj;
        });

        res.status(200).json({
            success:true,
            message:"Products fetched successfully",
            data:productsWithDynamicPrice,
            pagination:{
                page,
                limit,
                total:await Product.countDocuments(queryObject)
            }
        })
    }
    catch(error){
        console.error(error)
        res.status(500).json({message:"Internal server error"})
    }
}

const mongoose = require('mongoose');

// get single product
const getProduct = async (req,res) => {
    try{
        if(!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(404).json({message:"Product not found (Invalid ID)"})
        }
        const product = await Product.findById(req.params.id)
        if(!product){
            return res.status(404).json({message:"Product not found"})
        }

        const { calculateDynamicPrice } = require('../services/pricing.service');
        const productObj = product.toObject ? product.toObject() : product;
        productObj.dynamicPrice = calculateDynamicPrice(productObj);

        res.status(200).json({
            success:true,
            message:"Product fetched successfully",
            data:productObj
        })
    }
    catch(error){
        console.error(error)
        res.status(500).json({message:"Internal server error"})
    }
}

// update product
const updateProduct = async (req,res) => {
    try{
        const {productName, description, price, discountPrice, stock, material, weaveType, category, isFlashSale, flashSalePrice, flashSaleEndTime} = req.body
        let mediaArray = []
        if (req.files && req.files.length > 0) {
            mediaArray = req.files.map(file => ({
                url: file.path,
                type: file.mimetype.startsWith('video/') ? 'video' : 'image'
            }))
        } else if (req.body.media) {
            mediaArray = typeof req.body.media === 'string' ? JSON.parse(req.body.media) : req.body.media
        }
        let updateFields = {
            productName,
            description,
            price,
            discountPrice,
            stock,
            material,
            weaveType,
            category,
            isFlashSale: isFlashSale !== undefined ? isFlashSale : undefined,
            flashSalePrice,
            flashSaleEndTime,
            media: mediaArray.length > 0 ? mediaArray : undefined
        }
        
        // Remove undefined fields so they don't overwrite existing ones
        Object.keys(updateFields).forEach(key => updateFields[key] === undefined && delete updateFields[key])

        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, updateFields, {new:true})

        await clearProductCache();

        res.status(200).json({
            success:true,
            message:"Product updated successfully",
            data:updatedProduct
        })
    }
    catch(error){
        console.error(error)
        res.status(500).json({message:"Internal server error"})
    }
}

// delete product
const deleteProduct = async (req,res) => {
    try{
        const deletedProduct = await Product.findByIdAndDelete(req.params.id)
        if(!deletedProduct){
            return res.status(404).json({message:"Product not found"})
        }

        await clearProductCache();

        res.status(200).json({
            success:true,
            message:"Product deleted successfully",
            data:deletedProduct
        })
    }
    catch(error){
        console.error(error)
        res.status(500).json({message:"Internal server error"})
    }
}

// get low stock products
const getLowStockProducts = async (req, res) => {
    try {
        const threshold = 5;
        const products = await Product.find({ stock: { $lte: threshold } }).sort('stock');
        res.status(200).json({
            success: true,
            message: "Low stock products fetched successfully",
            count: products.length,
            data: products
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

// get active flash sales
const getFlashSales = async (req, res) => {
    try {
        const products = await Product.find({ 
            isFlashSale: true,
            flashSaleEndTime: { $gt: new Date() }
        }).sort('flashSaleEndTime');
        res.status(200).json({
            success: true,
            message: "Flash sales fetched successfully",
            count: products.length,
            data: products
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

// get filter options (unique categories, materials, weaveTypes)
const getFilterOptions = async (req, res) => {
    try {
        const categories = await Product.distinct('category');
        const materials = await Product.distinct('material');
        const weaveTypes = await Product.distinct('weaveType');
        
        const cleanArray = (arr) => arr.filter(item => item && item.trim() !== '');

        res.status(200).json({
            success: true,
            data: {
                categories: ['All', ...cleanArray(categories)],
                materials: cleanArray(materials),
                weaveTypes: cleanArray(weaveTypes)
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

module.exports = {
    createProduct,
    getAllProducts,
    getProduct,
    updateProduct,
    deleteProduct,
    getLowStockProducts,
    getFlashSales,
    getFilterOptions
}
