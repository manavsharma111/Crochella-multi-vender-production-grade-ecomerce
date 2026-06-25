import React, { useState, useEffect, Suspense, lazy } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useLocation, useNavigate, Routes, Route, Navigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { checkAuth } from './redux/slices/authSlice'
import { Toaster, toast } from 'react-hot-toast'
import HandloomBackground from './components/common/HandloomBackground'
import Navbar from './components/Navbar/Navbar'
import PremiumPreloader from './components/common/PremiumPreloader'
import Profile from './pages/Profile/Profile'
import Home from './pages/LandingPage/Home'
import ThreeVerticalStripsReveal from './pages/LandingPage/ThreeVerticalStripsReveal'
import SmoothScroll from './components/common/animation/SmoothScroll'
import Cursor from './components/common/animation/Cursor'
import FloatingChatbot from './components/common/FloatingChatbot'
import NotFound from './pages/NotFound'

// Lazy-loaded routes for performance
const Shop = lazy(() => import('./pages/shop/Shop'))
const ProductDescriptionPage = lazy(() => import('./pages/shop/ProductDescriptionPage'))
const Cart = lazy(() => import('./pages/Cart/Cart'))
const Checkout = lazy(() => import('./pages/Checkout/Checkout'))
const OrderSuccess = lazy(() => import('./pages/Checkout/OrderSuccess'))
const PaymentSuccess = lazy(() => import('./pages/PaymentGateWay/PaymentSuccess'))
const Wishlist = lazy(() => import('./pages/Wishlist/Wishlist'))
const CustomWishlistDetails = lazy(() => import('./pages/Wishlist/CustomWishlistDetails'))
const AdminLayout = lazy(() => import('./components/admin/AdminLayout'))
const AdminDashboard = lazy(() => import('./pages/Admin/AdminDashboard'))
const AdminProducts = lazy(() => import('./pages/Admin/AdminProducts'))
const AdminOrders = lazy(() => import('./pages/Admin/AdminOrders'))
const AdminUsers = lazy(() => import('./pages/Admin/AdminUsers'))
const AdminDeliveryStaff = lazy(() => import('./pages/Admin/AdminDeliveryStaff'))
const AdminCoupons = lazy(() => import('./pages/Admin/AdminCoupons'))
const AdminReviews = lazy(() => import('./pages/Admin/AdminReviews'))
const DeliveryLayout = lazy(() => import('./components/delivery/DeliveryLayout'))
const DeliveryDashboard = lazy(() => import('./pages/Delivery/DeliveryDashboard'))
const DeliveryOrders = lazy(() => import('./pages/Delivery/DeliveryOrders'))
const DeliveryReturns = lazy(() => import('./pages/Delivery/DeliveryReturns'))
const MyDeliveries = lazy(() => import('./pages/Delivery/MyDeliveries'))
const UserDelivery = lazy(() => import('./pages/UserDeliveryPannel/UserDelivery'))

import PageTransition from './components/common/animation/PageTransition'

const App = () => {
  const [loading, setLoading] = useState(true)
  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const token = params.get('token')

    if (token) {
      localStorage.setItem('token', token)
      dispatch(checkAuth()).then((action) => {
        if (action.meta.requestStatus === 'fulfilled') {
          const userName = action.payload?.name || 'User'
          toast.success(`Welcome back, ${userName}!`)
        }
      })
      navigate('/', { replace: true })
    } else {
      const hasToken = localStorage.getItem('token')
      if (hasToken) {
        dispatch(checkAuth())
      }
    }
  }, [dispatch, navigate])

  return (
    <SmoothScroll>
      <div className="min-h-screen font-sans overflow-x-hidden relative">
        <Cursor />
        <Toaster />
        <AnimatePresence>
          {loading && (
            <ThreeVerticalStripsReveal 
              key="loader"
              onLoadingDone={() => {
                window.hasCompletedInitialLoad = true;
                setLoading(false);
              }}
              renderContent={(isPrimary, triggerExit) => (
                <PremiumPreloader triggerExit={triggerExit} />
              )}
            />
          )}
        </AnimatePresence>
        {!location.pathname.startsWith('/admin') && !location.pathname.startsWith('/delivery') && <HandloomBackground />}

        <AnimatePresence>
          {(!loading && !location.pathname.startsWith('/admin') && !location.pathname.startsWith('/delivery')) && (
            <>
              <motion.div
                initial={{ opacity: 0, y: -60 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", bounce: 0.6, duration: 1.2, delay: 0.1 }}
              >
                <Navbar />
              </motion.div>
              <FloatingChatbot />
            </>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            {/* User routes */}
            <Route path="/" element={<PageTransition><Home loading={loading} /></PageTransition>} />
            <Route path="/shop" element={<Suspense fallback={null}><PageTransition><Shop /></PageTransition></Suspense>} />
            <Route path="/product/:id" element={<Suspense fallback={null}><PageTransition><ProductDescriptionPage /></PageTransition></Suspense>} />
            <Route path="/cart" element={<Suspense fallback={null}><PageTransition><Cart /></PageTransition></Suspense>} />
            <Route path="/checkout" element={<Suspense fallback={null}><PageTransition><Checkout /></PageTransition></Suspense>} />
            <Route path="/order-success/:orderId" element={<Suspense fallback={null}><PageTransition><OrderSuccess /></PageTransition></Suspense>} />
            <Route path="/payment-success" element={<Suspense fallback={null}><PageTransition><PaymentSuccess /></PageTransition></Suspense>} />
            <Route path="/wishlist" element={<Suspense fallback={null}><PageTransition><Wishlist /></PageTransition></Suspense>} />
            <Route path="/wishlist/:id" element={<Suspense fallback={null}><PageTransition><CustomWishlistDetails /></PageTransition></Suspense>} />
            <Route path="/login" element={<Navigate to="/" replace />} />
            <Route path="/profile" element={<PageTransition><Profile /></PageTransition>} />
            
            {/* admin routes */}
            <Route path="/admin" element={<Suspense fallback={null}><AdminLayout /></Suspense>}>
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="orders" element={<AdminOrders />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="delivery-staff" element={<AdminDeliveryStaff />} />
              <Route path="reviews" element={<AdminReviews />} />
              <Route path="coupons" element={<AdminCoupons />} />
            </Route>
            
            {/* delivery boy routes */}
            <Route path="/delivery" element={<Suspense fallback={null}><DeliveryLayout /></Suspense>}>
              <Route path="dashboard" element={<DeliveryDashboard />} />
              <Route path="orders" element={<DeliveryOrders />} />
              <Route path="returns" element={<DeliveryReturns />} />
              <Route path="my-deliveries" element={<MyDeliveries />} />
              <Route path="active" element={<UserDelivery />} />
            </Route>

            <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
          </Routes>
        </AnimatePresence>
      </div>
    </SmoothScroll>
  )
}

export default App
