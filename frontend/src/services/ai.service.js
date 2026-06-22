import axiosInstance from "../utils/axiosInstance"

export const askAI = async (queryData) => {
    const response = await axiosInstance.post(`/ai/askAI`, queryData)
    return response.data
}
