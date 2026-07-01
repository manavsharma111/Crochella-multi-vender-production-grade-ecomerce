import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { askAI } from "../../services/ai.service"

// ask ai
export const askAIAsync = createAsyncThunk(
  "ai/askAI",
  async (queryData, { rejectWithValue }) => {
    try {
      const response = await askAI(queryData)
      return response.data
    } catch (e) {
      return rejectWithValue(
        e.response?.data?.message || "AI failed to respond",
      )
    }
  },
)

const aiSlice = createSlice({
  name: "ai",
  initialState: {
    aiResponse: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearAiError: (state) => {
      state.error = null
    },
    resetAiResponse: (state) => {
      state.aiResponse = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(askAIAsync.pending, (state) => {
        state.loading = true
      })
      .addCase(askAIAsync.fulfilled, (state, action) => {
        state.loading = false
        state.aiResponse = action.payload.data || action.payload
      })
      .addCase(askAIAsync.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export const { clearAiError, resetAiResponse } = aiSlice.actions
export default aiSlice.reducer
