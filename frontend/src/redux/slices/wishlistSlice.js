import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { toggleWishlist, getWishlist, createCustomWishlist, toggleProductInCustomWishlist, getCustomWishlists, deleteCustomWishlist, updateCustomWishlist } from "../../services/wishlist.service"

// toggle wishlist
export const toggleWishlistAsync = createAsyncThunk("wishlist/toggleWishlist", async (productId, { rejectWithValue }) => {
    try {
        const response = await toggleWishlist(productId)
        return response
    }
    catch(e){
        console.log(e)
        return rejectWithValue(e.response?.data?.message || "failed")
    }
})

// get wishlist
export const getWishlistAsync = createAsyncThunk("wishlist/getWishlist", async (_, { rejectWithValue }) => {
    try{
        const response = await getWishlist()
        return response
    }
    catch(e){
        console.log(e)
        return rejectWithValue(e.response?.data?.message || "failed")
    }
})

// create custom wishlist
export const createCustomWishlistAsync = createAsyncThunk("wishlist/createCustomWishlist", async ({ name, description }, { rejectWithValue }) => {
    try{
        const response = await createCustomWishlist(name, description)
        return response
    }
    catch(e){
        console.log(e)
        return rejectWithValue(e.response?.data?.message || "failed")
    }
})

// toggle product in custom wishlist
export const toggleProductInCustomWishlistAsync = createAsyncThunk("wishlist/toggleProductInCustomWishlist", async ({ customWishlistId, productId }, { rejectWithValue }) => {
    try{
        const response = await toggleProductInCustomWishlist(customWishlistId, productId)
        return response
    }
    catch(e){
        console.log(e)
        return rejectWithValue(e.response?.data?.message || "failed")
    }
})

// get custom wishlists
export const getCustomWishlistsAsync = createAsyncThunk("wishlist/getCustomWishlists", async (_, { rejectWithValue }) => {
    try{
        const response = await getCustomWishlists()
        return response
    }
    catch(e){
        console.log(e)
        return rejectWithValue(e.response?.data?.message || "failed")
    }
})

// delete custom wishlist
export const deleteCustomWishlistAsync = createAsyncThunk("wishlist/deleteCustomWishlist", async (customWishlistId, { rejectWithValue }) => {
    try{
        const response = await deleteCustomWishlist(customWishlistId)
        return response
    }
    catch(e){
        console.log(e)
        return rejectWithValue(e.response?.data?.message || "failed")
    }
})

// update custom wishlist
export const updateCustomWishlistAsync = createAsyncThunk("wishlist/updateCustomWishlist", async ({ customWishlistId, name, description }, { rejectWithValue }) => {
    try{
        const response = await updateCustomWishlist(customWishlistId, name, description)
        return response
    }
    catch(e){
        console.log(e)
        return rejectWithValue(e.response?.data?.message || "failed")
    }
})

const wishlistSlice = createSlice({
    name: "wishlist",
    initialState: {
        wishlist: [],
        customWishlists: [],
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
            // toggle wishlist
            .addCase(toggleWishlistAsync.pending, (state) => {
                state.isLoading = true
            })
            .addCase(toggleWishlistAsync.fulfilled, (state, action) => {
                state.isLoading = false
                state.wishlist = action.payload
            })
            .addCase(toggleWishlistAsync.rejected, (state, action) => {
                state.isLoading = false
                state.error = action.payload
            })
            // get wishlist
            .addCase(getWishlistAsync.pending, (state) => {
                state.isLoading = true
            })
            .addCase(getWishlistAsync.fulfilled, (state, action) => {
                state.isLoading = false
                state.wishlist = action.payload
            })
            .addCase(getWishlistAsync.rejected, (state, action) => {
                state.isLoading = false
                state.error = action.payload
            })
            // create custom wishlist
            .addCase(createCustomWishlistAsync.pending, (state) => {
                state.isLoading = true
            })
            .addCase(createCustomWishlistAsync.fulfilled, (state, action) => {
                state.isLoading = false
                state.customWishlists.push(action.payload)
            })
            .addCase(createCustomWishlistAsync.rejected, (state, action) => {
                state.isLoading = false
                state.error = action.payload
            })
            // toggle product in custom wishlist
            .addCase(toggleProductInCustomWishlistAsync.pending, (state) => {
                state.isLoading = true
            })
            .addCase(toggleProductInCustomWishlistAsync.fulfilled, (state, action) => {
                state.isLoading = false
                state.customWishlists = state.customWishlists.map(cw => cw._id === action.payload._id ? action.payload : cw)
            })
            .addCase(toggleProductInCustomWishlistAsync.rejected, (state, action) => {
                state.isLoading = false
                state.error = action.payload
            })
            // get custom wishlists
            .addCase(getCustomWishlistsAsync.pending, (state) => {
                state.isLoading = true
            })
            .addCase(getCustomWishlistsAsync.fulfilled, (state, action) => {
                state.isLoading = false
                state.customWishlists = action.payload
            })
            .addCase(getCustomWishlistsAsync.rejected, (state, action) => {
                state.isLoading = false
                state.error = action.payload
            })
            // delete custom wishlist
            .addCase(deleteCustomWishlistAsync.pending, (state) => {
                state.isLoading = true
            })
            .addCase(deleteCustomWishlistAsync.fulfilled, (state, action) => {
                state.isLoading = false
                state.customWishlists = state.customWishlists.filter(cw => cw._id !== action.payload._id)
            })
            .addCase(deleteCustomWishlistAsync.rejected, (state, action) => {
                state.isLoading = false
                state.error = action.payload
            })
            // update custom wishlist
            .addCase(updateCustomWishlistAsync.pending, (state) => {
                state.isLoading = true
            })
            .addCase(updateCustomWishlistAsync.fulfilled, (state, action) => {
                state.isLoading = false
                state.customWishlists = state.customWishlists.map(cw => cw._id === action.payload._id ? action.payload : cw)
            })
            .addCase(updateCustomWishlistAsync.rejected, (state, action) => {
                state.isLoading = false
                state.error = action.payload
            })
    }
})

export const { clearError } = wishlistSlice.actions
export default wishlistSlice.reducer