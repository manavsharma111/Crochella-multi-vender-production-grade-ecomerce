import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { getProfile, updateProfile, changePassword, getDeliveryAddress, addDeliveryAddress, updateDeliveryAddress, deleteDeliveryAddress, getAllUsers, getRecommendations } from "../../services/user.service"

// get profile
export const getProfileAsync = createAsyncThunk("user/getProfile", async (_, { rejectWithValue }) => {
    try {
        const response = await getProfile()
        return response
    } catch (e) {
        return rejectWithValue(e.response?.data?.message || "Failed to get profile")
    }
})

// update profile
export const updateProfileAsync = createAsyncThunk("user/updateProfile", async (profileData, { rejectWithValue }) => {
    try {
        const response = await updateProfile(profileData)
        return response
    } catch (e) {
        return rejectWithValue(e.response?.data?.message || "Failed to update profile")
    }
})

// change password
export const changePasswordAsync = createAsyncThunk("user/changePassword", async (passwordData, { rejectWithValue }) => {
    try {
        const response = await changePassword(passwordData)
        return response
    } catch (e) {
        return rejectWithValue(e.response?.data?.message || "Failed to change password")
    }
})

// get delivery address
export const getDeliveryAddressAsync = createAsyncThunk("user/getDeliveryAddress", async (_, { rejectWithValue }) => {
    try {
        const response = await getDeliveryAddress()
        return response
    } catch (e) {
        return rejectWithValue(e.response?.data?.message || "Failed to get delivery address")
    }
})

// add delivery address
export const addDeliveryAddressAsync = createAsyncThunk("user/addDeliveryAddress", async (addressData, { rejectWithValue }) => {
    try {
        const response = await addDeliveryAddress(addressData)
        return response
    } catch (e) {
        return rejectWithValue(e.response?.data?.message || "Failed to add delivery address")
    }
})

// update delivery address
export const updateDeliveryAddressAsync = createAsyncThunk("user/updateDeliveryAddress", async (addressData, { rejectWithValue }) => {
    try {
        const response = await updateDeliveryAddress(addressData)
        return response
    } catch (e) {
        return rejectWithValue(e.response?.data?.message || "Failed to update delivery address")
    }
})

// delete delivery address
export const deleteDeliveryAddressAsync = createAsyncThunk("user/deleteDeliveryAddress", async (addressIdData, { rejectWithValue }) => {
    try {
        const response = await deleteDeliveryAddress(addressIdData)
        return response
    } catch (e) {
        return rejectWithValue(e.response?.data?.message || "Failed to delete delivery address")
    }
})

// get all users (admin)
export const getAllUsersAsync = createAsyncThunk("user/getAllUsers", async (params = {}, { rejectWithValue }) => {
    try {
        const response = await getAllUsers(params)
        return response
    } catch (e) {
        return rejectWithValue(e.response?.data?.message || "Failed to get all users")
    }
})

// get recommendations
export const getRecommendationsAsync = createAsyncThunk("user/getRecommendations", async (_, { rejectWithValue }) => {
    try {
        const response = await getRecommendations()
        return response
    } catch (e) {
        return rejectWithValue(e.response?.data?.message || "Failed to get recommendations")
    }
})

const userSlice = createSlice({
    name: "user",
    initialState: {
        profile: null,
        addresses: [],
        allUsers: [], // Admin only
        recommendations: [],
        loading: false,
        error: null,
    },
    reducers: {
        clearUserError: (state) => {
            state.error = null
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getProfileAsync.pending, (state) => { state.loading = true })
            .addCase(getProfileAsync.fulfilled, (state, action) => {
                state.loading = false
                state.profile = action.payload.data || action.payload
            })
            .addCase(getProfileAsync.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })
            .addCase(updateProfileAsync.pending, (state) => { state.loading = true })
            .addCase(updateProfileAsync.fulfilled, (state, action) => {
                state.loading = false
                state.profile = action.payload.data || action.payload
            })
            .addCase(updateProfileAsync.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })
            .addCase(getDeliveryAddressAsync.pending, (state) => { state.loading = true })
            .addCase(getDeliveryAddressAsync.fulfilled, (state, action) => {
                state.loading = false
                state.addresses = action.payload.data || action.payload
            })
            .addCase(getDeliveryAddressAsync.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })
            .addCase(addDeliveryAddressAsync.pending, (state) => { state.loading = true })
            .addCase(addDeliveryAddressAsync.fulfilled, (state, action) => {
                state.loading = false
                state.addresses = action.payload.data || action.payload
            })
            .addCase(addDeliveryAddressAsync.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })
            .addCase(updateDeliveryAddressAsync.pending, (state) => { state.loading = true })
            .addCase(updateDeliveryAddressAsync.fulfilled, (state, action) => {
                state.loading = false
                state.addresses = action.payload.data || action.payload
            })
            .addCase(updateDeliveryAddressAsync.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })
            .addCase(deleteDeliveryAddressAsync.pending, (state) => { state.loading = true })
            .addCase(deleteDeliveryAddressAsync.fulfilled, (state, action) => {
                state.loading = false
                state.addresses = action.payload.data || action.payload
            })
            .addCase(deleteDeliveryAddressAsync.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })
            .addCase(getAllUsersAsync.pending, (state) => { state.loading = true })
            .addCase(getAllUsersAsync.fulfilled, (state, action) => {
                state.loading = false
                state.allUsers = action.payload.data || action.payload
            })
            .addCase(getAllUsersAsync.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })
            .addCase(getRecommendationsAsync.pending, (state) => { state.loading = true })
            .addCase(getRecommendationsAsync.fulfilled, (state, action) => {
                state.loading = false
                state.recommendations = action.payload.data || action.payload
            })
            .addCase(getRecommendationsAsync.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })
    }
})

export const { clearUserError } = userSlice.actions
export default userSlice.reducer
