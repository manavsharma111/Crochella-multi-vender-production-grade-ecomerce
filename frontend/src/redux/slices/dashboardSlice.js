import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import {
  getAdminDashboardStats,
  getSellerDashboardStats,
} from "../../services/dashboard.service"

// get admin dashboard stats
export const getAdminDashboardStatsAsync = createAsyncThunk(
  "dashboard/getAdminDashboardStats",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getAdminDashboardStats()
      return response.data
    } catch (e) {
      return rejectWithValue(
        e.response?.data?.message || "Failed to get admin stats",
      )
    }
  },
)

// get seller dashboard stats
export const getSellerDashboardStatsAsync = createAsyncThunk(
  "dashboard/getSellerDashboardStats",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getSellerDashboardStats()
      return response.data
    } catch (e) {
      return rejectWithValue(
        e.response?.data?.message || "Failed to get seller stats",
      )
    }
  },
)

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState: {
    stats: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearDashboardError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAdminDashboardStatsAsync.pending, (state) => {
        state.loading = true
      })
      .addCase(getAdminDashboardStatsAsync.fulfilled, (state, action) => {
        state.loading = false
        state.stats = action.payload.data || action.payload
      })
      .addCase(getAdminDashboardStatsAsync.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(getSellerDashboardStatsAsync.pending, (state) => {
        state.loading = true
      })
      .addCase(getSellerDashboardStatsAsync.fulfilled, (state, action) => {
        state.loading = false
        state.stats = action.payload.data || action.payload
      })
      .addCase(getSellerDashboardStatsAsync.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export const { clearDashboardError } = dashboardSlice.actions
export default dashboardSlice.reducer
