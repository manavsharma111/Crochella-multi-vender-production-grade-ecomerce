import axiosInstance from "../utils/axiosInstance"

// get pofile
export const getProfile = async () => {
    const response = await axiosInstance.get(`/user/profile`)
    return response.data
}
// update profile
export const updateProfile = async (profileData) => {
    const response = await axiosInstance.post(`/user/update-profile`, profileData)
    return response.data
}
// change password
export const changePassword = async (passwordData) => {
    const response = await axiosInstance.post(`/user/change-password`, passwordData)
    return response.data
}
// get delivery address
export const getDeliveryAddress = async () => {
    const response = await axiosInstance.get(`/user/get-delivery-address`)
    return response.data
}
// add delivery address
export const addDeliveryAddress = async (addressData) => {
    const response = await axiosInstance.post(`/user/add-delivery-address`, addressData)
    return response.data
}
// update delivery address
export const updateDeliveryAddress = async (addressData) => {
    const response = await axiosInstance.post(`/user/update-delivery-address`, addressData)
    return response.data
}
// delete delivery address
export const deleteDeliveryAddress = async (addressIdData) => {
    const response = await axiosInstance.post(`/user/delete-delivery-address`, addressIdData)
    return response.data
}
// get all users
export const getAllUsers = async (params = {}) => {
    const response = await axiosInstance.get(`/user/admin/users`, { params })
    return response.data
}
// track product view
export const trackProductView = async (productId) => {
    const response = await axiosInstance.post(`/user/track-view/${productId}`)
    return response.data
}
// get recommendations
export const getRecommendations = async () => {
    const response = await axiosInstance.get(`/user/recommendations`)
    return response.data
}
