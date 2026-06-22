import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import productReducer from './slices/productSlice'
import wishlistReducer from './slices/wishlistSlice'
import cartReducer from './slices/cartSlice'
import orderReducer from './slices/orderSlice'
import paymentReducer from './slices/paymentSlice'
import reviewReducer from './slices/reviewSlice'
import couponReducer from './slices/couponSlice'
import aiReducer from './slices/aiSlice'
import userReducer from './slices/userSlice'
import notificationReducer from './slices/notificationSlice'
import dashboardReducer from './slices/dashboardSlice'
import deliveryReducer from './slices/deliverySlice'


export const store = configureStore({
  reducer: {
    auth: authReducer,
    product: productReducer,
    wishlist: wishlistReducer,
    cart: cartReducer,
    order: orderReducer,
    payment: paymentReducer,
    review: reviewReducer,
    coupon: couponReducer,
    ai: aiReducer,
    user: userReducer,
    notification: notificationReducer,
    dashboard: dashboardReducer,
    delivery: deliveryReducer,
  },
})
