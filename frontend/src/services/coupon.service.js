import axiosInstance from "../utils/axiosInstance"

export const getActiveCoupons = async () => {
  const response = await axiosInstance.get(`/coupon/active`)
  return response.data
}

export const getAllCoupons = async () => {
  const response = await axiosInstance.get(`/coupon/all`)
  return response.data
}

export const createCoupon = async (couponData) => {
  const response = await axiosInstance.post(`/coupon/create`, couponData)
  return response.data
}

export const deleteCoupon = async (couponId) => {
  const response = await axiosInstance.delete(`/coupon/${couponId}`)
  return response.data
}
