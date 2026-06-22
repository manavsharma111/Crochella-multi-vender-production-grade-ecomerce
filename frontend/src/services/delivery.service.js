import axiosInstance from "../utils/axiosInstance"

const getAvailableOrders = async () => {
    const res = await axiosInstance.get('/delivery/available')
    return res.data
}

const acceptOrder = async (orderId) => {
    const res = await axiosInstance.post(`/delivery/accept/${orderId}`)
    return res.data
}

const updateDeliveryStatus = async (orderId, data) => {
    const res = await axiosInstance.put(`/delivery/update/${orderId}`, data)
    return res.data
}

const getAvailableReturns = async () => {
    const res = await axiosInstance.get('/delivery/returns')
    return res.data
}

const acceptReturnPickup = async (orderId) => {
    const res = await axiosInstance.post(`/delivery/returns/accept/${orderId}`)
    return res.data
}

const confirmReturnCollected = async (orderId, data) => {
    const res = await axiosInstance.put(`/delivery/returns/collected/${orderId}`, data)
    return res.data
}

export const getMyDeliveries = async () => {
    const res = await axiosInstance.get('/delivery/my-orders')
    return res.data
}

export const rateDeliveryBoy = async (deliveryBoyId, rating) => {
    const res = await axiosInstance.post(`/delivery/rate/${deliveryBoyId}`, { rating })
    return res.data
}

export const getDeliveryStaffStats = async () => {
    const res = await axiosInstance.get('/delivery/admin/staff-stats')
    return res.data
}

const deliveryService = {
    getAvailableOrders,
    acceptOrder,
    updateDeliveryStatus,
    getAvailableReturns,
    acceptReturnPickup,
    confirmReturnCollected,
    getMyDeliveries,
    getDeliveryStaffStats
}

export default deliveryService
