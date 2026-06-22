import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import deliveryService from '../../services/delivery.service'

export const getAvailableOrdersAsync = createAsyncThunk('delivery/getAvailableOrders', async (_, { rejectWithValue }) => {
    try { return await deliveryService.getAvailableOrders() } catch (e) { return rejectWithValue(e.response?.data?.message || 'Failed') }
})

export const acceptOrderAsync = createAsyncThunk('delivery/acceptOrder', async (orderId, { rejectWithValue }) => {
    try { return await deliveryService.acceptOrder(orderId) } catch (e) { return rejectWithValue(e.response?.data?.message || 'Failed') }
})

export const updateDeliveryStatusAsync = createAsyncThunk('delivery/updateStatus', async ({ orderId, data }, { rejectWithValue }) => {
    try { return await deliveryService.updateDeliveryStatus(orderId, data) } catch (e) { return rejectWithValue(e.response?.data?.message || 'Failed') }
})

export const getAvailableReturnsAsync = createAsyncThunk('delivery/getAvailableReturns', async (_, { rejectWithValue }) => {
    try { return await deliveryService.getAvailableReturns() } catch (e) { return rejectWithValue(e.response?.data?.message || 'Failed') }
})

export const acceptReturnPickupAsync = createAsyncThunk('delivery/acceptReturn', async (orderId, { rejectWithValue }) => {
    try { return await deliveryService.acceptReturnPickup(orderId) } catch (e) { return rejectWithValue(e.response?.data?.message || 'Failed') }
})

export const confirmReturnCollectedAsync = createAsyncThunk('delivery/confirmReturn', async ({ orderId, data }, { rejectWithValue }) => {
    try { return await deliveryService.confirmReturnCollected(orderId, data) } catch (e) { return rejectWithValue(e.response?.data?.message || 'Failed') }
})

export const getMyDeliveriesAsync = createAsyncThunk('delivery/getMyDeliveries', async (_, { rejectWithValue }) => {
    try { return await deliveryService.getMyDeliveries() } catch (e) { return rejectWithValue(e.response?.data?.message || 'Failed') }
})

const deliverySlice = createSlice({
    name: 'delivery',
    initialState: {
        availableOrders: [],
        availableReturns: [],
        myDeliveries: [],
        isLoading: false,
        error: null
    },
    reducers: {
        clearDeliveryError: (state) => { state.error = null }
    },
    extraReducers: (builder) => {
        const handlePending = (state) => { state.isLoading = true; state.error = null }
        const handleRejected = (state, action) => { state.isLoading = false; state.error = action.payload }

        builder
            .addCase(getAvailableOrdersAsync.pending, handlePending)
            .addCase(getAvailableOrdersAsync.fulfilled, (state, action) => { state.isLoading = false; state.availableOrders = action.payload.orders || [] })
            .addCase(getAvailableOrdersAsync.rejected, handleRejected)
            .addCase(getAvailableReturnsAsync.pending, handlePending)
            .addCase(getAvailableReturnsAsync.fulfilled, (state, action) => { state.isLoading = false; state.availableReturns = action.payload.orders || [] })
            .addCase(getAvailableReturnsAsync.rejected, handleRejected)
            .addCase(getMyDeliveriesAsync.pending, handlePending)
            .addCase(getMyDeliveriesAsync.fulfilled, (state, action) => { state.isLoading = false; state.myDeliveries = action.payload.orders || [] })
            .addCase(getMyDeliveriesAsync.rejected, handleRejected)
            .addCase(acceptOrderAsync.pending, handlePending)
            .addCase(acceptOrderAsync.fulfilled, (state) => { state.isLoading = false })
            .addCase(acceptOrderAsync.rejected, handleRejected)
            .addCase(acceptReturnPickupAsync.pending, handlePending)
            .addCase(acceptReturnPickupAsync.fulfilled, (state) => { state.isLoading = false })
            .addCase(acceptReturnPickupAsync.rejected, handleRejected)
            .addCase(confirmReturnCollectedAsync.pending, handlePending)
            .addCase(confirmReturnCollectedAsync.fulfilled, (state) => { state.isLoading = false })
            .addCase(confirmReturnCollectedAsync.rejected, handleRejected)
    }
})

export const { clearDeliveryError } = deliverySlice.actions
export default deliverySlice.reducer
