import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import {
  createProduct,
  getAllProducts,
  getProduct,
  updateProduct,
  deleteProduct,
  getLowStockProducts,
  getFlashSales,
  getFilterOptions,
} from "../../services/product.service"

// create product
export const createProductAsync = createAsyncThunk(
  "product/createProduct",
  async (productData, { rejectWithValue }) => {
    try {
      const response = await createProduct(productData)
      return response.data
    } catch (e) {
      console.log(e)
      return rejectWithValue(e.response?.data?.message || "failed")
    }
  },
)

// getAll product
export const getAllProductsAsync = createAsyncThunk(
  "product/getAllProducts",
  async (filters = {}, { rejectWithValue }) => {
    try {
      const response = await getAllProducts(filters)
      return response.data
    } catch (e) {
      console.log(e)
      return rejectWithValue(e.response?.data?.message || "failed")
    }
  },
  {
    // Cancel API call if products are already cached and no specific filters are applied
    condition: (filters = {}, { getState }) => {
      const { product } = getState()
      if (Object.keys(filters).length === 0 && product.products.length > 0) {
        return false // Skips the payload creator and prevents the API call
      }
    },
  },
)

// get product
export const getProductAsync = createAsyncThunk(
  "product/getProduct",
  async (id, { rejectWithValue }) => {
    try {
      const response = await getProduct(id)
      return response.data
    } catch (e) {
      console.log(e)
      return rejectWithValue(e.response?.data?.message || "failed")
    }
  },
)

// update product
export const updateProductAsync = createAsyncThunk(
  "product/updateProduct",
  async ({ id, productData }, { rejectWithValue }) => {
    try {
      const response = await updateProduct(id, productData)
      return response.data
    } catch (e) {
      console.log(e)
      return rejectWithValue(e.response?.data?.message || "failed")
    }
  },
)

// delete product
export const deleteProductAsync = createAsyncThunk(
  "product/deleteProduct",
  async (id, { rejectWithValue }) => {
    try {
      const response = await deleteProduct(id)
      return response.data
    } catch (e) {
      console.log(e)
      return rejectWithValue(e.response?.data?.message || "failed")
    }
  },
)

// low stock products
export const getLowStockProductsAsync = createAsyncThunk(
  "product/getLowStockProducts",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getLowStockProducts()
      return response.data
    } catch (e) {
      console.log(e)
      return rejectWithValue(e.response?.data?.message || "failed")
    }
  },
  {
    // Cancel API call if low stock products are already loaded
    condition: (_, { getState }) => {
      const { product } = getState()
      if (product.lowStockProducts.length > 0) {
        return false
      }
    },
  },
)

// flash sales
export const getFlashSalesAsync = createAsyncThunk(
  "product/getFlashSales",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getFlashSales()
      return response.data
    } catch (e) {
      console.log(e)
      return rejectWithValue(e.response?.data?.message || "failed")
    }
  },
  {
    // Cancel API call if flash sales are already loaded
    condition: (_, { getState }) => {
      const { product } = getState()
      if (product.flashSales.length > 0) {
        return false
      }
    },
  },
)

// get filter options
export const getFilterOptionsAsync = createAsyncThunk(
  "product/getFilterOptions",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getFilterOptions()
      return response.data
    } catch (e) {
      console.log(e)
      return rejectWithValue(e.response?.data?.message || "failed")
    }
  },
)

const productSlice = createSlice({
  name: "product",
  initialState: {
    products: [],
    currentProduct: null,
    lowStockProducts: [],
    flashSales: [],
    filterOptions: { categories: ["All"], materials: [], weaveTypes: [] },
    isLoading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // create product
      .addCase(createProductAsync.pending, (state) => {
        state.isLoading = true
      })
      .addCase(createProductAsync.fulfilled, (state, action) => {
        state.isLoading = false
        state.products.push(action.payload)
      })
      .addCase(createProductAsync.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      // get all products
      .addCase(getAllProductsAsync.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getAllProductsAsync.fulfilled, (state, action) => {
        state.isLoading = false
        state.products = action.payload
      })
      .addCase(getAllProductsAsync.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      // get product
      .addCase(getProductAsync.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getProductAsync.fulfilled, (state, action) => {
        state.isLoading = false
        state.currentProduct = action.payload
      })
      .addCase(getProductAsync.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      // update product
      .addCase(updateProductAsync.pending, (state) => {
        state.isLoading = true
      })
      .addCase(updateProductAsync.fulfilled, (state, action) => {
        state.isLoading = false
        state.products = state.products.map((p) =>
          p._id === action.payload._id ? action.payload : p,
        )
        state.currentProduct = action.payload
      })
      .addCase(updateProductAsync.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      // delete product
      .addCase(deleteProductAsync.pending, (state) => {
        state.isLoading = true
      })
      .addCase(deleteProductAsync.fulfilled, (state, action) => {
        state.isLoading = false
        state.products = state.products.filter(
          (p) => p._id !== action.payload._id,
        )
      })
      .addCase(deleteProductAsync.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      // low stock products
      .addCase(getLowStockProductsAsync.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getLowStockProductsAsync.fulfilled, (state, action) => {
        state.isLoading = false
        state.lowStockProducts = action.payload
      })
      .addCase(getLowStockProductsAsync.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      // flash sales
      .addCase(getFlashSalesAsync.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getFlashSalesAsync.fulfilled, (state, action) => {
        state.isLoading = false
        state.flashSales = action.payload
      })
      .addCase(getFlashSalesAsync.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      // get filter options
      .addCase(getFilterOptionsAsync.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getFilterOptionsAsync.fulfilled, (state, action) => {
        state.isLoading = false
        state.filterOptions = action.payload || {
          categories: ["All"],
          materials: [],
          weaveTypes: [],
        }
      })
      .addCase(getFilterOptionsAsync.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
  },
})

export const { clearError } = productSlice.actions
export default productSlice.reducer
