import axiosInstance from "../utils/axiosInstance"

export const getAllReviewsAdmin = async () => {
  const response = await axiosInstance.get(`/reviews/all/admin`)
  return response.data
}

// add review
export const addReview = async (productId, reviewData) => {
  const response = await axiosInstance.post(`/reviews/${productId}`, reviewData)
  return response.data
}
// get
export const getProductReviews = async (productId) => {
  const response = await axiosInstance.get(`/reviews/${productId}`)
  return response.data
}
// update
export const editReview = async (reviewId, reviewData) => {
  const response = await axiosInstance.put(`/reviews/${reviewId}`, reviewData)
  return response.data
}
// delete
export const deleteReview = async (reviewId) => {
  const response = await axiosInstance.delete(`/reviews/${reviewId}`)
  return response.data
}
