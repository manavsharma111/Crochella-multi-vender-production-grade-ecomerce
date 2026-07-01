import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import {
  subscribeUser,
  broadcastAlert,
} from "../../services/notification.service"

// subscribe user
export const subscribeUserAsync = createAsyncThunk(
  "notification/subscribeUser",
  async (subscriptionData, { rejectWithValue }) => {
    try {
      const response = await subscribeUser(subscriptionData)
      return response.data
    } catch (e) {
      return rejectWithValue(e.response?.data?.message || "Failed to subscribe")
    }
  },
)

// broadcast alert
export const broadcastAlertAsync = createAsyncThunk(
  "notification/broadcastAlert",
  async (alertData, { rejectWithValue }) => {
    try {
      const response = await broadcastAlert(alertData)
      return response.data
    } catch (e) {
      return rejectWithValue(
        e.response?.data?.message || "Failed to broadcast alert",
      )
    }
  },
)

const notificationSlice = createSlice({
  name: "notification",
  initialState: {
    loading: false,
    error: null,
  },
  reducers: {
    clearNotificationError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(subscribeUserAsync.pending, (state) => {
        state.loading = true
      })
      .addCase(subscribeUserAsync.fulfilled, (state) => {
        state.loading = false
      })
      .addCase(subscribeUserAsync.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(broadcastAlertAsync.pending, (state) => {
        state.loading = true
      })
      .addCase(broadcastAlertAsync.fulfilled, (state) => {
        state.loading = false
      })
      .addCase(broadcastAlertAsync.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export const { clearNotificationError } = notificationSlice.actions
export default notificationSlice.reducer
