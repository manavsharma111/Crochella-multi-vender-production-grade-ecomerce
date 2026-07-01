import axiosInstance from "../utils/axiosInstance"

export const subscribeUser = async (subscriptionData) => {
  const response = await axiosInstance.post(
    `/notifications/subscribe`,
    subscriptionData,
  )
  return response.data
}

export const broadcastAlert = async (alertData) => {
  const response = await axiosInstance.post(
    `/notifications/broadcast`,
    alertData,
  )
  return response.data
}
