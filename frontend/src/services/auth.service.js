import axiosInstance from "../utils/axiosInstance"

// Interceptor to add token

// Get User
const checkAuthStatus = async () => {
    const response = await axiosInstance.get(`/user/profile`)
    return response.data
}
// Login User
const login = async (email, password) => {
    const response = await axiosInstance.post(`/auth/login`, { email, password })
    return response.data
}
// Logout User
const logout = async () => {
    const response = await axiosInstance.post(`/auth/logout`)
    return response.data
}
// Send OTP
const sendOtp = async (email) => {
    const response = await axiosInstance.post(`/auth/send-otp`, { email })
    return response.data
}

// Verify OTP
const verifyOtp = async (email, otp) => {
    const response = await axiosInstance.post(`/auth/verify-otp`, { email, otp })
    return response.data
}

// Reset Password
const resetPassword = async (email, password) => {
    const response = await axiosInstance.post(`/auth/reset-password`, { email, password })
    return response.data
}

// Register User
const register = async (name, email, password, confirmPassword, userOtp, role = 'buyer') => {
    const response = await axiosInstance.post(`/auth/signup`, { name, email, password, confirmPassword, userOtp, role })
    return response.data
}

const authService = {
    checkAuthStatus,
    login,
    register,
    logout,
    sendOtp,
    verifyOtp,
    resetPassword
}

export default authService
