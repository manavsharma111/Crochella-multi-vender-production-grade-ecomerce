import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import authService from '../../services/auth.service'

// checking Auth
export const checkAuth = createAsyncThunk('user/checkAuth', async (_, { rejectWithValue }) => {
    try {
        const user = await authService.checkAuthStatus()
        return user
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Not Authenticated')
    }
})

// Login User
export const loginUser = createAsyncThunk('user/login', async ({ email, password }, { rejectWithValue }) => {
    try {
        const response = await authService.login(email, password)
        // authService already returns response.data
        // so response is { message, token, user }
        if (response.token) {
            localStorage.setItem("token", response.token)
        }
        return response.user
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Login failed')
    }
})

// Register User
export const registerUser = createAsyncThunk('user/register', async ({ name, email, password, confirmPassword, userOtp, role }, { rejectWithValue }) => {
    try {
        const response = await authService.register(name, email, password, confirmPassword, userOtp, role)
        if (response.token) {
            localStorage.setItem("token", response.token)
        }
        return response.user
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Registration failed')
    }
})

// Logout User
export const logoutUser = createAsyncThunk('user/logout', async (_, { rejectWithValue }) => {
    try {
        await authService.logout()
        return null
    } catch (error) {
        return rejectWithValue('Logout failed')
    }
})

// Send OTP
export const sendOtpAsync = createAsyncThunk('user/sendOtp', async (email, { rejectWithValue }) => {
    try {
        const response = await authService.sendOtp(email)
        return response
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Failed to send OTP')
    }
})

// Verify OTP
export const verifyOtpAsync = createAsyncThunk('user/verifyOtp', async ({ email, otp }, { rejectWithValue }) => {
    try {
        const response = await authService.verifyOtp(email, otp)
        return response
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Failed to verify OTP')
    }
})

// Reset Password
export const resetPasswordAsync = createAsyncThunk('user/resetPassword', async ({ email, password }, { rejectWithValue }) => {
    try {
        const response = await authService.resetPassword(email, password)
        return response
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Failed to reset password')
    }
})

const authSlice = createSlice({
    name: 'user',
    initialState: {
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
    },
    reducers: {
        clearError: (state) => {
            state.error = null
        }
    },
    extraReducers: (builder) => {
        builder
            // checkAuth cases
            .addCase(checkAuth.pending, (state) => {
                state.isLoading = true
            })
            .addCase(checkAuth.fulfilled, (state, action) => {
                state.isLoading = false
                state.isAuthenticated = true
                state.user = action.payload
            })
            .addCase(checkAuth.rejected, (state, action) => {
                state.isLoading = false
                state.isAuthenticated = false
                state.user = null
                console.error("checkAuth rejected:", action.payload)
            })
            // login cases
            .addCase(loginUser.pending, (state) => {
                state.isLoading = true
                state.error = null
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.isLoading = false
                state.isAuthenticated = true
                state.user = action.payload
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.isLoading = false
                state.error = action.payload
            })
            // register cases
            .addCase(registerUser.pending, (state) => {
                state.isLoading = true
                state.error = null
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.isLoading = false
                // If backend doesn't auto-login on register, we can leave isAuthenticated as false
                // But typically we do. Let's assume the backend sends a token and user object.
                if (action.payload) {
                    state.isAuthenticated = true
                    state.user = action.payload
                }
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.isLoading = false
                state.error = action.payload
            })
            // logout cases
            .addCase(logoutUser.fulfilled, (state) => {
                state.user = null
                state.isAuthenticated = false
            })
            // forgot password cases
            .addCase(sendOtpAsync.pending, (state) => {
                state.isLoading = true
                state.error = null
            })
            .addCase(sendOtpAsync.fulfilled, (state) => {
                state.isLoading = false
            })
            .addCase(sendOtpAsync.rejected, (state, action) => {
                state.isLoading = false
                state.error = action.payload
            })
            .addCase(verifyOtpAsync.pending, (state) => {
                state.isLoading = true
                state.error = null
            })
            .addCase(verifyOtpAsync.fulfilled, (state) => {
                state.isLoading = false
            })
            .addCase(verifyOtpAsync.rejected, (state, action) => {
                state.isLoading = false
                state.error = action.payload
            })
            .addCase(resetPasswordAsync.pending, (state) => {
                state.isLoading = true
                state.error = null
            })
            .addCase(resetPasswordAsync.fulfilled, (state) => {
                state.isLoading = false
            })
            .addCase(resetPasswordAsync.rejected, (state, action) => {
                state.isLoading = false
                state.error = action.payload
            })
    }
})

export const { clearError } = authSlice.actions
export default authSlice.reducer
