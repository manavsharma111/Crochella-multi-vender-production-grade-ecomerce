import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { addToCart,removeFromCart,updateQuantity,getCart,clearCart,applyCoupon,removeCoupon } from "../../services/cart.service"

// add to cart
export const addToCartAsync = createAsyncThunk("cart/addToCart", async({productId,quantity,sku,customization}, {rejectWithValue}) => {
    try{
        const response = await addToCart(productId,quantity,sku,customization)
        return response
    }
    catch(e){
        console.log(e)
        return rejectWithValue(e.response?.data?.message || "failed")
    }
})

// remove from cart
export const removeFromCartAsync = createAsyncThunk("cart/removeFromCart", async({productId,sku,customization}, {rejectWithValue}) => {
    try{
        const response = await removeFromCart(productId,sku,customization)
        return response
    }
    catch(e){
        console.log(e)
        return rejectWithValue(e.response?.data?.message || "failed")
    }
})

// update quantity
export const updateQuantityAsync = createAsyncThunk("cart/updateQuantity", async({productId,sku,customization,quantity}, {rejectWithValue}) => {
    try{
        const response = await updateQuantity(productId,sku,customization,quantity)
        return response
    }
    catch(e){
        console.log(e)
        return rejectWithValue(e.response?.data?.message || "failed")
    }
})

// get cart
export const getCartAsync = createAsyncThunk("cart/getCart", async(_, {rejectWithValue}) => {
    try{
        const response = await getCart()
        return response
    }
    catch(e){
        console.log(e)
        return rejectWithValue(e.response?.data?.message || "failed")
    }
})

// clear cart
export const clearCartAsync = createAsyncThunk("cart/clearCart", async(_, {rejectWithValue}) => {
    try{
        const response = await clearCart()
        return response
    }
    catch(e){
        console.log(e)
        return rejectWithValue(e.response?.data?.message || "failed")
    }
})

// apply coupon
export const applyCouponAsync = createAsyncThunk("cart/applyCoupon", async(couponCode, {rejectWithValue}) => {
    try{
        const response = await applyCoupon(couponCode)
        return response
    }
    catch(e){
        console.log(e)
        return rejectWithValue(e.response?.data?.message || "failed")
    }
})

// remove coupon
export const removeCouponAsync = createAsyncThunk("cart/removeCoupon", async(_, {rejectWithValue}) => {
    try{
        const response = await removeCoupon()
        return response
    }
    catch(e){
        console.log(e)
        return rejectWithValue(e.response?.data?.message || "failed")
    }
})

const cartSlice = createSlice({
    name: "cart",
    initialState: {
        cart: [],
        isLoading: false,
        error: null
    },
    reducers: {
        clearError: (state) => {
            state.error = null
        }
    },
    extraReducers: (builder) => {
        builder
            // add to cart
            .addCase(addToCartAsync.pending, (state) => {
                state.isLoading = true
            })
            .addCase(addToCartAsync.fulfilled, (state, action) => {
                state.isLoading = false
                state.cart = action.payload
            })
            .addCase(addToCartAsync.rejected, (state, action) => {
                state.isLoading = false
                state.error = action.payload
            })
            // remove from cart
            .addCase(removeFromCartAsync.pending, (state) => {
                state.isLoading = true
            })
            .addCase(removeFromCartAsync.fulfilled, (state, action) => {
                state.isLoading = false
                state.cart = action.payload
            })
            .addCase(removeFromCartAsync.rejected, (state, action) => {
                state.isLoading = false
                state.error = action.payload
            })
            // update quantity
            .addCase(updateQuantityAsync.pending, (state) => {
                state.isLoading = true
            })
            .addCase(updateQuantityAsync.fulfilled, (state, action) => {
                state.isLoading = false
                state.cart = action.payload
            })
            .addCase(updateQuantityAsync.rejected, (state, action) => {
                state.isLoading = false
                state.error = action.payload
            })
            // get cart
            .addCase(getCartAsync.pending, (state) => {
                state.isLoading = true
            })
            .addCase(getCartAsync.fulfilled, (state, action) => {
                state.isLoading = false
                state.cart = action.payload
            })
            .addCase(getCartAsync.rejected, (state, action) => {
                state.isLoading = false
                state.error = action.payload
            })
            // clear cart
            .addCase(clearCartAsync.pending, (state) => {
                state.isLoading = true
            })
            .addCase(clearCartAsync.fulfilled, (state, action) => {
                state.isLoading = false
                state.cart = action.payload
            })
            .addCase(clearCartAsync.rejected, (state, action) => {
                state.isLoading = false
                state.error = action.payload
            })
            // apply coupon
            .addCase(applyCouponAsync.pending, (state) => {
                state.isLoading = true
            })
            .addCase(applyCouponAsync.fulfilled, (state, action) => {
                state.isLoading = false
                state.cart = action.payload
            })
            .addCase(applyCouponAsync.rejected, (state, action) => {
                state.isLoading = false
                state.error = action.payload
            })
            // remove coupon
            .addCase(removeCouponAsync.pending, (state) => {
                state.isLoading = true
            })
            .addCase(removeCouponAsync.fulfilled, (state, action) => {
                state.isLoading = false
                state.cart = action.payload
            })
            .addCase(removeCouponAsync.rejected, (state, action) => {
                state.isLoading = false
                state.error = action.payload
            })
    }
})

export default cartSlice.reducer
export const { clearError } = cartSlice.actions
