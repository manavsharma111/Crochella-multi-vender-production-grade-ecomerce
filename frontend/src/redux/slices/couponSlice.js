import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import {
  getActiveCoupons,
  getAllCoupons,
  createCoupon,
  deleteCoupon,
} from "../../services/coupon.service"

// get active coupons
export const getActiveCouponsAsync = createAsyncThunk(
  "coupon/getActiveCoupons",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getActiveCoupons()
      return response.data
    } catch (e) {
      return rejectWithValue(
        e.response?.data?.message || "Failed to fetch active coupons",
      )
    }
  },
)

// get all coupons
export const getAllCouponsAsync = createAsyncThunk(
  "coupon/getAllCoupons",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getAllCoupons()
      return response.data
    } catch (e) {
      return rejectWithValue(
        e.response?.data?.message || "Failed to fetch all coupons",
      )
    }
  },
)

// create coupon
export const createCouponAsync = createAsyncThunk(
  "coupon/createCoupon",
  async (couponData, { rejectWithValue }) => {
    try {
      const response = await createCoupon(couponData)
      return response.data
    } catch (e) {
      return rejectWithValue(
        e.response?.data?.message || "Failed to create coupon",
      )
    }
  },
)

// delete coupon
export const deleteCouponAsync = createAsyncThunk(
  "coupon/deleteCoupon",
  async (couponId, { rejectWithValue }) => {
    try {
      const response = await deleteCoupon(couponId)
      return response.data
    } catch (e) {
      return rejectWithValue(
        e.response?.data?.message || "Failed to delete coupon",
      )
    }
  },
)

const couponSlice = createSlice({
  name: "coupon",
  initialState: {
    activeCoupons: [],
    allCoupons: [], // for admin
    loading: false,
    error: null,
  },
  reducers: {
    clearCouponError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getActiveCouponsAsync.pending, (state) => {
        state.loading = true
      })
      .addCase(getActiveCouponsAsync.fulfilled, (state, action) => {
        state.loading = false
        state.activeCoupons = action.payload.data || action.payload
      })
      .addCase(getActiveCouponsAsync.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(getAllCouponsAsync.pending, (state) => {
        state.loading = true
      })
      .addCase(getAllCouponsAsync.fulfilled, (state, action) => {
        state.loading = false
        state.allCoupons = action.payload.data || action.payload
      })
      .addCase(getAllCouponsAsync.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(createCouponAsync.pending, (state) => {
        state.loading = true
      })
      .addCase(createCouponAsync.fulfilled, (state, action) => {
        state.loading = false
        if (action.payload.data) {
          state.allCoupons.unshift(action.payload.data) // Add new coupon to the top
        }
      })
      .addCase(createCouponAsync.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(deleteCouponAsync.pending, (state) => {
        state.loading = true
      })
      .addCase(deleteCouponAsync.fulfilled, (state, action) => {
        state.loading = false
        state.allCoupons = state.allCoupons.filter(
          (c) => c._id !== action.meta.arg,
        )
      })
      .addCase(deleteCouponAsync.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export const { clearCouponError } = couponSlice.actions
export default couponSlice.reducer
