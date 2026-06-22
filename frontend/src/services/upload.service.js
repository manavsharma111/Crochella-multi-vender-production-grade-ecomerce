import axiosInstance from "../utils/axiosInstance"

export const uploadReturnImages = async (formData) => {
    const response = await axiosInstance.post(`/upload/return`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
    return response.data
}
