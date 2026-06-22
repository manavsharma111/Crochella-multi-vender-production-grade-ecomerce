import axiosInstance from "../utils/axiosInstance"

// check out
export const checkout = async (orderData) => {
    const response = await axiosInstance.post(`/payment/checkout`, orderData)
    return response.data
}
// verify
export const verifyPayment = async (paymentData) => {
    const response = await axiosInstance.post(`/payment/verify`, paymentData)
    return response.data
}
