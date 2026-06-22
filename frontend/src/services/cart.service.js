import axiosInstance from "../utils/axiosInstance"

// Add Interceptor

// Add to cart
const addToCart = async (productId,quantity,sku,customization) => {
    const response = await axiosInstance.post(`/cart/add`, {productId,quantity,sku,customization})
    return response.data
}

// Remove from cart
const removeFromCart = async(productId,sku,customization) => {
    const response = await axiosInstance.post(`/cart/remove`, {productId,sku,customization})
    return response.data
}

// Update quantity
const updateQuantity = async(productId,sku,customization,quantity) => {
    const response = await axiosInstance.put(`/cart/update-cart`, {productId,sku,customization,quantity})
    return response.data
}

// Get cart
const getCart = async() => {
    const response = await axiosInstance.get(`/cart/get-cart`)
    return response.data
}

// Clear cart
const clearCart = async() => {
    const response = await axiosInstance.delete(`/cart/clear`)
    return response.data
}

// Apply coupon
const applyCoupon = async(couponCode) => {
    const response = await axiosInstance.post(`/cart/apply-coupon`, {couponCode})
    return response.data
}

// Remove coupon
const removeCoupon = async() => {
    const response = await axiosInstance.post(`/cart/remove-coupon`)
    return response.data
}

export {
    addToCart,
    removeFromCart,
    updateQuantity,
    getCart,
    clearCart,
    applyCoupon,
    removeCoupon
}
