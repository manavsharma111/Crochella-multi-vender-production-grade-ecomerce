import axiosInstance from "../utils/axiosInstance"

// Interceptor to add token

// buyer place order
const placeOrder = async (orderData) => {
    const response = await axiosInstance.post(`/order/place-order`, orderData)
    return response.data
}

// buyer cancel order if not delivered
const cancelOrderNotDelivered = async (id) => {
    const response = await axiosInstance.put(`/order/${id}/cancel-not-deliver`)
    return response.data
}

// return request by buyer
const returnRequest = async (id, returnData) => {
    const response = await axiosInstance.put(`/order/${id}/return`, returnData)
    return response.data
}

// live tracking
const getLiveTracking = async (id) => {
    const response = await axiosInstance.get(`/order/${id}/track`)
    return response.data
}

// get single order
const getOrder = async (id) => {
    const response = await axiosInstance.get(`/order/${id}`)
    return response.data
}

// get all orders for logged in user
const getUserOrders = async () => {
    const response = await axiosInstance.get(`/order/my-orders`)
    return response.data
}

// seller update order status
const updateOrderStatus = async (id, orderData) => {
    const response = await axiosInstance.put(`/order/${id}/status`, orderData)
    return response.data
}

// seller get all orders
const sellerGetAllOrders = async (params = {}) => {
    const response = await axiosInstance.get(`/order/all-orders`, { params })
    return response.data
} 

// seller handle refund and stock update
const handleOrderRefund = async (id) => {
    const response = await axiosInstance.put(`/order/${id}/refund`)
    return response.data
}

export {
    placeOrder,
    cancelOrderNotDelivered,
    returnRequest,
    getLiveTracking,
    getOrder,
    getUserOrders,
    updateOrderStatus,
    sellerGetAllOrders,
    handleOrderRefund
}
