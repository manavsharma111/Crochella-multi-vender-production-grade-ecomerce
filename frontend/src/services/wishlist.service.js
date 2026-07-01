import axiosInstance from "../utils/axiosInstance"

// Interceptor to add token

// Toggle product in default wishlist
const toggleWishlist = async (productId) => {
  const response = await axiosInstance.post(`/wishlist/toggle`, { productId })
  return response.data
}

// Get default wishlist
const getWishlist = async () => {
  const response = await axiosInstance.get(`/wishlist`)
  return response.data
}

// Create a custom wishlist
const createCustomWishlist = async (name, description) => {
  const response = await axiosInstance.post(`/wishlist/custom`, {
    name,
    description,
  })
  return response.data
}

// Toggle product in a specific custom wishlist
const toggleProductInCustomWishlist = async (customWishlistId, productId) => {
  const response = await axiosInstance.post(`/wishlist/custom/toggle`, {
    customWishlistId,
    productId,
  })
  return response.data
}

// Get all custom wishlists for the user
const getCustomWishlists = async () => {
  const response = await axiosInstance.get(`/wishlist/custom`)
  return response.data
}

// Delete a custom wishlist
const deleteCustomWishlist = async (customWishlistId) => {
  const response = await axiosInstance.delete(
    `/wishlist/custom/${customWishlistId}`,
  )
  return response.data
}

// Update a custom wishlist's name and description
const updateCustomWishlist = async (customWishlistId, name, description) => {
  const response = await axiosInstance.put(
    `/wishlist/custom/${customWishlistId}`,
    { name, description },
  )
  return response.data
}

export {
  toggleWishlist,
  getWishlist,
  createCustomWishlist,
  toggleProductInCustomWishlist,
  getCustomWishlists,
  deleteCustomWishlist,
  updateCustomWishlist,
}
