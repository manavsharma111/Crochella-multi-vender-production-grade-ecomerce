import axiosInstance from "../utils/axiosInstance"

export const getAdminDashboardStats = async () => {
  const response = await axiosInstance.get(`/dashboard/admin`)
  return response.data
}

export const getSellerDashboardStats = async () => {
  const response = await axiosInstance.get(`/dashboard/seller`)
  return response.data
}
