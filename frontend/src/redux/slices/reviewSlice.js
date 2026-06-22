import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { addReview, getProductReviews, editReview, deleteReview } from "../../services/review.service"

// add review
export const addReviewAsync = createAsyncThunk("review/addReview", async ({ productId, reviewData }, { rejectWithValue, getState }) => {
    try {
        const authUser = getState().auth.user   // inject buyer info for instant display
        
        // Mock submission for dummy products to avoid backend crash
        if (typeof productId === 'string' && productId.toLowerCase().startsWith('d')) {
            return {
                _id: 'mock_' + Date.now(),
                product: productId,
                rating: Number(reviewData.rating),
                comment: reviewData.comment,
                media: reviewData.media || [],
                createdAt: new Date().toISOString(),
                buyer: {
                    _id:          authUser?._id  || authUser?.id,
                    name:         authUser?.name || "You",
                    email:        authUser?.email,
                    profileImage: authUser?.profileImage,
                }
            }
        }

        const response = await addReview(productId, reviewData)
        const review   = response.data?.data || response.data          // the saved review from DB
        return {
            ...review,
            buyer: {
                _id:          authUser?._id  || authUser?.id,
                name:         authUser?.name || "You",
                email:        authUser?.email,
                profileImage: authUser?.profileImage,
            }
        }
    } catch (e) {
        return rejectWithValue(e.response?.data?.message || "Failed to add review")
    }
})

// get product reviews
export const getProductReviewsAsync = createAsyncThunk("review/getProductReviews", async (productId, { rejectWithValue }) => {
    try {
        // Mock empty reviews array for dummy products to avoid backend crash
        if (typeof productId === 'string' && productId.toLowerCase().startsWith('d')) {
            return []
        }

        const response = await getProductReviews(productId)
        return response.data
    } catch (e) {
        return rejectWithValue(e.response?.data?.message || "Failed to fetch reviews")
    }
})

// edit review
export const editReviewAsync = createAsyncThunk("review/editReview", async ({ reviewId, reviewData }, { rejectWithValue }) => {
    try {
        if (typeof reviewId === 'string' && reviewId.startsWith('mock_')) {
            return { _id: reviewId, ...reviewData } // Mock update
        }
        const response = await editReview(reviewId, reviewData)
        return response.data
    } catch (e) {
        return rejectWithValue(e.response?.data?.message || "Failed to edit review")
    }
})

// delete review
export const deleteReviewAsync = createAsyncThunk("review/deleteReview", async (reviewId, { rejectWithValue }) => {
    try {
        if (typeof reviewId === 'string' && reviewId.startsWith('mock_')) {
            return reviewId // Mock delete
        }
        await deleteReview(reviewId)
        return reviewId
    } catch (e) {
        return rejectWithValue(e.response?.data?.message || "Failed to delete review")
    }
})

const reviewSlice = createSlice({
    name: "review",
    initialState: {
        reviews: [],
        loading: false,
        error: null,
    },
    reducers: {
        clearReviewError: (state) => {
            state.error = null
        },
        socketAddReview: (state, action) => {
            const newReview = action.payload?.data?.data || action.payload?.data || action.payload;
            if (newReview && newReview._id) {
                // Check if review already exists to prevent duplicate (e.g. from the user who created it)
                const exists = state.reviews.find(r => r._id === newReview._id)
                if (!exists) {
                    state.reviews.unshift(newReview)
                }
            }
        },
        socketUpdateReview: (state, action) => {
            const index = state.reviews.findIndex(r => r._id === action.payload._id)
            if (index !== -1) {
                state.reviews[index] = { ...state.reviews[index], ...action.payload }
            }
        },
        socketDeleteReview: (state, action) => {
            state.reviews = state.reviews.filter(r => r._id !== action.payload)
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(addReviewAsync.pending, (state) => {
                state.loading = true
            })
            .addCase(addReviewAsync.fulfilled, (state, action) => {
                state.loading = false
                state.error = null
                // Aggressively extract the review object whether it's nested in data or not
                const newReview = action.payload?.data?.data || action.payload?.data || action.payload;
                if (newReview && newReview._id) {
                    const exists = state.reviews.find(r => r._id === newReview._id);
                    if (!exists) {
                        state.reviews.unshift(newReview) // newest first
                    }
                }
            })
            .addCase(addReviewAsync.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })
            .addCase(getProductReviewsAsync.pending, (state) => {
                state.loading = true
            })
            .addCase(getProductReviewsAsync.fulfilled, (state, action) => {
                state.loading = false
                state.reviews = action.payload.data || action.payload
            })
            .addCase(getProductReviewsAsync.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })
            .addCase(editReviewAsync.pending, (state) => {
                state.loading = true
            })
            .addCase(editReviewAsync.fulfilled, (state, action) => {
                state.loading = false
                const updatedReview = action.payload.data || action.payload
                state.reviews = state.reviews.map(r => r._id === updatedReview._id ? updatedReview : r)
            })
            .addCase(editReviewAsync.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })
            .addCase(deleteReviewAsync.pending, (state) => {
                state.loading = true
            })
            .addCase(deleteReviewAsync.fulfilled, (state, action) => {
                state.loading = false
                state.reviews = state.reviews.filter(r => r._id !== action.meta.arg)
            })
            .addCase(deleteReviewAsync.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })
    }
})

export const { clearReviewError, socketAddReview, socketUpdateReview, socketDeleteReview } = reviewSlice.actions
export default reviewSlice.reducer
