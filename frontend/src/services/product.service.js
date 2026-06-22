import axiosInstance from "../utils/axiosInstance"

// Interceptor to add token

// create products
const createProduct = async (productData) => {
    const response = await axiosInstance.post(`/products`, productData)
    return response.data
}

// get all products
const getAllProducts = async (filters = {}) => {
    const {searchTerm = '', page = 1, limit = 10, price, stock, rating, category, discountPrice, material, weaveType, sort} = filters
    const response = await axiosInstance.get(`/products`, {
        params: {
            searchTerm,
            page,
            limit,
            price,
            stock,
            rating,
            category,
            discountPrice,
            material,
            weaveType,
            sort
        }
    })
    return response.data
}

// get single product
const getProduct = async (id) => {
    const response = await axiosInstance.get(`/products/${id}`)
    return response.data
}

// update product
const updateProduct = async (id, productData) => {
    const response = await axiosInstance.put(`/products/${id}`, productData)
    return response.data
}

// delete product
const deleteProduct = async (id) => {
    const response = await axiosInstance.delete(`/products/${id}`)
    return response.data
}

// low stock products
const getLowStockProducts = async () => {
    const response = await axiosInstance.get(`/products/low-stock`)
    return response.data
}

// active flash sale
const getFlashSales = async () => {
    const response = await axiosInstance.get(`/products/flash-sales`)
    return response.data
}

// get filter options
const getFilterOptions = async () => {
    const response = await axiosInstance.get(`/products/filters`)
    return response.data
}

export {
    createProduct,
    getAllProducts,
    getProduct,
    updateProduct,
    deleteProduct,
    getLowStockProducts,
    getFlashSales,
    getFilterOptions
}

