const Cart = require("../models/Cart")
const Product = require("../models/Product")
const Coupon = require("../models/Coupon")

// add to cart
const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body

    if (!productId) {
      return res.status(400).json({ message: "Product ID is required" })
    }

    const product = await Product.findById(productId)
    if (!product) {
      return res.status(404).json({ message: "Product not found" })
    }

    const userId = req.user.id || req.user._id
    let cart = await Cart.findOne({ userId })

    if (!cart) {
      const newCart = new Cart({
        userId,
        products: [
          { productId, quantity: quantity || 1, price: product.price },
        ],
      })
      await newCart.save()
      return res
        .status(200)
        .json({ message: "Product added to cart", cart: newCart })
    }

    const item = cart.products.find(
      (item) => item.productId.toString() === productId,
    )
    if (item) {
      item.quantity += quantity || 1
    } else {
      cart.products.push({
        productId,
        quantity: quantity || 1,
        price: product.price,
      })
    }

    await cart.save()
    return res.status(200).json({ message: "Product added to cart", cart })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Internal server error" })
  }
}

// remove from cart
const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.body

    const userId = req.user.id || req.user._id
    const cart = await Cart.findOne({ userId })
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" })
    }

    const item = cart.products.find(
      (item) => item.productId.toString() === productId,
    )
    if (!item) {
      return res.status(404).json({ message: "Item not found in cart" })
    }

    cart.products = cart.products.filter(
      (item) => item.productId.toString() !== productId,
    )

    // If cart is empty, remove coupon
    if (cart.products.length === 0) {
      cart.appliedCoupon = null
    }

    await cart.save()
    return res.status(200).json({ message: "Product removed from cart", cart })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Internal server error" })
  }
}

// update cart
const updateCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body

    if (!productId) {
      return res.status(400).json({ message: "Product ID is required" })
    }

    const userId = req.user.id || req.user._id
    const cart = await Cart.findOne({ userId })
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" })
    }

    const item = cart.products.find(
      (item) => item.productId.toString() === productId,
    )
    if (!item) {
      return res.status(404).json({ message: "Item not found in cart" })
    }

    item.quantity = quantity
    await cart.save()
    return res.status(200).json({ message: "Cart updated successfully", cart })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Internal server error" })
  }
}

// get cart & calculate discount
const getCart = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id
    const cart = await Cart.findOne({ userId })
      .populate("products.productId")
      .populate("appliedCoupon")
    if (!cart) {
      return res
        .status(200)
        .json({
          message: "Cart fetched successfully",
          cart: { products: [] },
          totalPrice: 0,
          discountAmount: 0,
          finalPrice: 0,
        })
    }

    const { calculateDynamicPrice } = require("../services/pricing.service")

    let totalPrice = 0

    // Filter out products that no longer exist in the database or failed to populate
    const validProducts = cart.products.filter(
      (item) => item.productId && item.productId._id,
    )

    validProducts.forEach((item) => {
      try {
        // Calculate dynamic price based on the current state of the populated product
        const currentDynamicPrice =
          calculateDynamicPrice(item.productId) || item.price || 0
        totalPrice += currentDynamicPrice * item.quantity
        item.price = currentDynamicPrice
      } catch (err) {
        console.error("Error calculating dynamic price", err)
        totalPrice += (item.price || 0) * item.quantity
      }
    })

    // If some products were removed because they don't exist anymore, save the updated cart
    if (validProducts.length !== cart.products.length) {
      cart.products = validProducts
      await cart.save()
    }

    let discountAmount = 0
    if (cart.appliedCoupon) {
      const coupon = cart.appliedCoupon
      if (coupon.discountType === "Percentage") {
        discountAmount = (totalPrice * coupon.discountValue) / 100
      } else if (coupon.discountType === "Flat") {
        discountAmount = coupon.discountValue
      }
      // Ensure discount doesn't exceed total price
      if (discountAmount > totalPrice) discountAmount = totalPrice
    }

    const finalPrice = totalPrice - discountAmount

    return res.status(200).json({
      message: "Cart fetched successfully",
      cart,
      totalPrice,
      discountAmount,
      finalPrice,
    })
  } catch (error) {
    console.error("GET CART ERROR:", error)
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message })
  }
}

// apply coupon
const applyCoupon = async (req, res) => {
  try {
    const { couponCode } = req.body
    const userId = req.user.id || req.user._id

    const cart = await Cart.findOne({ userId })
    if (!cart || cart.products.length === 0) {
      return res.status(400).json({ message: "Cart is empty" })
    }

    const coupon = await Coupon.findOne({
      couponCode: couponCode.toUpperCase(),
    })

    if (!coupon) return res.status(404).json({ message: "Invalid coupon code" })
    if (!coupon.isActive)
      return res.status(400).json({ message: "Coupon is no longer active" })
    if (coupon.couponLimit <= 0)
      return res.status(400).json({ message: "Coupon usage limit exceeded" })
    if (new Date(coupon.expiryDate) < new Date())
      return res.status(400).json({ message: "Coupon has expired" })

    cart.appliedCoupon = coupon._id
    await cart.save()

    res
      .status(200)
      .json({ success: true, message: "Coupon applied successfully" })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server Error" })
  }
}

// remove coupon
const removeCoupon = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id
    const cart = await Cart.findOne({ userId })

    if (cart) {
      cart.appliedCoupon = null
      await cart.save()
    }
    res.status(200).json({ success: true, message: "Coupon removed" })
  } catch (error) {
    res.status(500).json({ message: "Server Error" })
  }
}

// clear cart
const clearCart = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id
    const cart = await Cart.findOne({ userId })

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" })
    }

    cart.products = []
    cart.appliedCoupon = null
    await cart.save()

    return res.status(200).json({ message: "Cart cleared successfully", cart })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Internal server error" })
  }
}

module.exports = {
  addToCart,
  removeFromCart,
  updateCart,
  getCart,
  applyCoupon,
  removeCoupon,
  clearCart,
}
