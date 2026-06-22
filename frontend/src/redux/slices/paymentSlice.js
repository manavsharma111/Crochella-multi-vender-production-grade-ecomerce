import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { checkout, verifyPayment } from "../../services/payment.service"

// checkout
export const checkoutAsync = createAsyncThunk("payment/checkout", async (orderData, { rejectWithValue }) => {
    try {
        const response = await checkout(orderData)
        return response.data
    } catch (e) {
        return rejectWithValue(e.response?.data?.message || "Checkout failed")
    }
})

// verify payment
export const verifyPaymentAsync = createAsyncThunk("payment/verifyPayment", async (paymentData, { rejectWithValue }) => {
    try {
        const response = await verifyPayment(paymentData)
        return response.data
    } catch (e) {
        return rejectWithValue(e.response?.data?.message || "Payment verification failed")
    }
})

const paymentSlice = createSlice({
    name: "payment",
    initialState: {
        paymentDetails: null,
        loading: false,
        error: null,
    },
    reducers: {
        clearPaymentError: (state) => {
            state.error = null
        },
        resetPayment: (state) => {
            state.paymentDetails = null
            state.error = null
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(checkoutAsync.pending, (state) => {
                state.loading = true
            })
            .addCase(checkoutAsync.fulfilled, (state, action) => {
                state.loading = false
                state.paymentDetails = action.payload
            })
            .addCase(checkoutAsync.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })
            .addCase(verifyPaymentAsync.pending, (state) => {
                state.loading = true
            })
            .addCase(verifyPaymentAsync.fulfilled, (state, action) => {
                state.loading = false
                state.paymentDetails = action.payload
            })
            .addCase(verifyPaymentAsync.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })
    }
})

export const { clearPaymentError, resetPayment } = paymentSlice.actions
export default paymentSlice.reducer
