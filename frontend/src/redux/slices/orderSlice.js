import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { placeOrder, cancelOrderNotDelivered, returnRequest, getLiveTracking, getOrder, getUserOrders, updateOrderStatus, sellerGetAllOrders, handleOrderRefund } from "../../services/order.service"

// place order
export const placeOrderAsync = createAsyncThunk("order/placeOrder", async (orderData, { rejectWithValue }) => {
    try{
        const response = await placeOrder(orderData)
        return response
    }
    catch(e){
        console.log(e)
        return rejectWithValue(e.response?.data?.message || "failed")
    }
})

// cancel order if not delivered
export const cancelOrderNotDeliveredAsync = createAsyncThunk("order/cancelOrderNotDelivered", async (id, { rejectWithValue }) => {
    try{
        const response = await cancelOrderNotDelivered(id)
        return response
    }
    catch(e){
        console.log(e)
        return rejectWithValue(e.response?.data?.message || "failed")
    }
})

// buyer return request after delivery
export const returnOrderAfterDeliveryAsync = createAsyncThunk("order/returnOrderAfterDelivery", async ({id, returnData}, { rejectWithValue }) => {
    try{
        const response = await returnRequest(id, returnData)
        return response
    }
    catch(e){
        console.log(e)
        return rejectWithValue(e.response?.data?.message || "failed")
    }
})

// get live tracking
export const getLiveTrackingAsync = createAsyncThunk("order/getLiveTracking", async (id, { rejectWithValue }) => {
    try{
        const response = await getLiveTracking(id)
        return response
    }
    catch(e){
        console.log(e)
        return rejectWithValue(e.response?.data?.message || "failed")
    }
})

// seller update status and map coordinates
export const updateOrderStatusAsync = createAsyncThunk("order/updateOrderStatus", async ({id, orderData}, { rejectWithValue }) => {
    try{
        const response = await updateOrderStatus(id, orderData)
        return response
    }
    catch(e){
        console.log(e)
        return rejectWithValue(e.response?.data?.message || "failed")
    }
})

// get single order
export const getOrderAsync = createAsyncThunk("order/getOrder", async (id, { rejectWithValue }) => {
    try{
        const response = await getOrder(id)
        return response
    }
    catch(e){
        console.log(e)
        return rejectWithValue(e.response?.data?.message || "failed")
    }
})

//get all order for logged in user
export const getUserOrdersAsync = createAsyncThunk("order/getUserOrders", async (_, { rejectWithValue }) => {
    try{
        const response = await getUserOrders()
        return response
    }
    catch(e){
        console.log(e)
        return rejectWithValue(e.response?.data?.message || "failed")
    }
})

// seller get all orders
export const sellerGetAllOrdersAsync = createAsyncThunk("order/sellerGetAllOrders", async (params = {}, { rejectWithValue }) => {
    try{
        const response = await sellerGetAllOrders(params)
        return response
    }
    catch(e){
        console.log(e)
        return rejectWithValue(e.response?.data?.message || "failed")
    }
})

// seller handle refund and stock update
export const handleOrderRefundAsync = createAsyncThunk("order/handleOrderRefund", async (id, { rejectWithValue }) => {
    try{
        const response = await handleOrderRefund(id)
        return response
    }
    catch(e){
        console.log(e)
        return rejectWithValue(e.response?.data?.message || "failed")
    }
})

// create order slice
const orderSlice = createSlice({
    name: "order",
    initialState: {
        orders: [],
        order: null,
        orderPlaced: false,
        loading: false,
        error: null,
    },
    reducers: {
        resetOrder: (state) => {
            state.order = null
            state.orderPlaced = false
            state.loading = false
            state.error = null
        },
        clearError: (state) => {
            state.error = null
        },
        updateLiveLocation: (state, action) => {
            if (state.order) {
                if (action.payload.lat && action.payload.lng) {
                    if (!state.order.currentLocation) state.order.currentLocation = {}
                    state.order.currentLocation.lat = action.payload.lat
                    state.order.currentLocation.lng = action.payload.lng
                    state.order.currentLocation.addressString = action.payload.addressString
                }
                if (action.payload.status) {
                    state.order.orderStatus = action.payload.status
                }
            }
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(placeOrderAsync.pending, (state) => {
                state.loading = true
            })
            .addCase(placeOrderAsync.fulfilled, (state, action) => {
                state.loading = false
                state.orderPlaced = true
                state.order = action.payload.data || action.payload
            })
            .addCase(placeOrderAsync.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })
            .addCase(cancelOrderNotDeliveredAsync.pending, (state) => {
                state.loading = true
            })
            .addCase(cancelOrderNotDeliveredAsync.fulfilled, (state, action) => {
                state.loading = false
                state.order = action.payload
            })
            .addCase(cancelOrderNotDeliveredAsync.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })
            .addCase(returnOrderAfterDeliveryAsync.pending, (state) => {
                state.loading = true
            })
            .addCase(returnOrderAfterDeliveryAsync.fulfilled, (state, action) => {
                state.loading = false
                state.order = action.payload
            })
            .addCase(returnOrderAfterDeliveryAsync.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })
            .addCase(getLiveTrackingAsync.pending, (state) => {
                state.loading = true
            })
            .addCase(getLiveTrackingAsync.fulfilled, (state, action) => {
                state.loading = false
                state.order = action.payload
            })
            .addCase(getLiveTrackingAsync.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })
            .addCase(getOrderAsync.pending, (state) => {
                state.loading = true
            })
            .addCase(getOrderAsync.fulfilled, (state, action) => {
                state.loading = false
                state.order = action.payload
            })
            .addCase(getOrderAsync.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })
            .addCase(getUserOrdersAsync.pending, (state) => {
                state.loading = true
            })
            .addCase(getUserOrdersAsync.fulfilled, (state, action) => {
                state.loading = false
                state.orders = action.payload.data || action.payload // Based on backend sending {success: true, data: orders}
            })
            .addCase(getUserOrdersAsync.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })
            .addCase(sellerGetAllOrdersAsync.pending, (state) => {
                state.loading = true
            })
            .addCase(sellerGetAllOrdersAsync.fulfilled, (state, action) => {
                state.loading = false
                state.orders = action.payload.data || action.payload
            })
            .addCase(sellerGetAllOrdersAsync.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })
            .addCase(updateOrderStatusAsync.pending, (state) => {
                state.loading = true
            })
            .addCase(updateOrderStatusAsync.fulfilled, (state, action) => {
                state.loading = false
                state.order = action.payload.data || action.payload
            })
            .addCase(updateOrderStatusAsync.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })
            .addCase(handleOrderRefundAsync.pending, (state) => {
                state.loading = true
            })
            .addCase(handleOrderRefundAsync.fulfilled, (state, action) => {
                state.loading = false
                state.order = action.payload
            })
            .addCase(handleOrderRefundAsync.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })
    }
})

export const { resetOrder, clearError, updateLiveLocation } = orderSlice.actions

export default orderSlice.reducer