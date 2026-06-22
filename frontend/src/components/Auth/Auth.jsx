import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, usePresence } from 'framer-motion'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { logoutUser } from '../../redux/slices/authSlice'
import Login from './login'
import Signup from './signup'
import ForgotPassword from './ForgotPassword'

const Auth = () => {
  const navigate = useNavigate()
  const [isLogin, setIsLogin] = useState(true)
  const [isForgotPassword, setIsForgotPassword] = useState(false)
  const { user, isAuthenticated } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const [isPresent] = usePresence()
  const frozenViewRef = useRef(null)

  const handleLogout = () => {
    dispatch(logoutUser())
    localStorage.removeItem("token")
  }
  // Flip Animation
  const variants = {
    enter: (direction) => ({
      rotateY: direction > 0 ? -90 : 90,
      opacity: 0,
      z: -100
    }),
    center: {
      rotateY: 0,
      opacity: 1,
      z: 0
    },
    exit: (direction) => ({
      rotateY: direction < 0 ? -90 : 90,
      opacity: 0,
      z: -100
    })
  }

  // Determine current view
  let currentView = 'login'
  if (isAuthenticated && user) currentView = 'profile'
  else if (isForgotPassword) currentView = 'forgotPassword'
  else if (!isLogin) currentView = 'signup'

  // to prevent Framer Motion crashes
  if (!isPresent) {
    if (!frozenViewRef.current) frozenViewRef.current = currentView
    currentView = frozenViewRef.current
  } else {
    frozenViewRef.current = null
  }

  return (
    <div className="relative w-full" style={{ perspective: 1000 }}>
      <AnimatePresence mode="wait" custom={isLogin ? 1 : -1}>
        {currentView === 'profile' && (
          <motion.div
            key="profile"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="p-6 relative text-center w-full"
          >
            <div className="w-16 h-16 mx-auto mb-4 rounded-full border-2 border-[#ff007f] overflow-hidden">
              {user.profileImage ? (
                <img src={user.profileImage} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-white/10 flex items-center justify-center text-white font-bold text-xl uppercase">
                  {user.name ? user.name[0] : 'U'}
                </div>
              )}
            </div>

            <h2 className="text-xl font-black text-white tracking-widest font-sans uppercase mb-1">
              {user.name}
            </h2>
            <p className="text-gray-400 text-xs mb-6 truncate">{user.email}</p>

            <div className="space-y-3">
              {(user.role === 'admin' || user.role === 'seller') && (
                <button 
                  onClick={() => navigate('/admin/dashboard')}
                  className="w-full bg-white/5 border cursor-pointer border-[#ff007f]/50 text-[#ff007f] font-black text-xs uppercase tracking-widest py-3 rounded-xl hover:bg-[#ff007f]/10 transition-all"
                >
                  Admin Dashboard
                </button>
              )}
              {user.role === 'delivery_boy' && (
                <button 
                  onClick={() => navigate('/delivery/dashboard')}
                  className="w-full bg-white/5 border cursor-pointer border-orange-400/50 text-orange-400 font-black text-xs uppercase tracking-widest py-3 rounded-xl hover:bg-orange-400/10 transition-all"
                >
                  🛵 Delivery Dashboard
                </button>
              )}
              <button 
                onClick={() => navigate('/profile')}
                className="w-full bg-white/5 border cursor-pointer border-white/10 text-white font-bold text-xs uppercase tracking-widest py-3 rounded-xl hover:bg-white/10 transition-all">
                My Orders
              </button>
              <button 
                onClick={() => navigate('/profile')}
                className="w-full bg-white/5 border cursor-pointer border-white/10 text-white font-bold text-xs uppercase tracking-widest py-3 rounded-xl hover:bg-white/10 transition-all"
              >
                Profile
              </button>
              <button
                onClick={handleLogout}
                className="w-full bg-[#ff007f] text-white cursor-pointer font-black text-xs uppercase tracking-widest py-3 rounded-xl hover:shadow-[0_0_20px_rgba(255,0,127,0.5)] hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                Logout
              </button>
            </div>
          </motion.div>
        )}

        {currentView === 'login' && (
          <motion.div
            key="login"
            custom={1}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="w-full backface-hidden"
          >
            <div className="flex flex-col">
              <Login onForgotClick={() => setIsForgotPassword(true)} />
              <div className="text-center text-[10px] text-gray-500 pb-6 -mt-2">
                Don't have an account?
                <button
                  onClick={() => setIsLogin(false)}
                  className="text-white font-bold ml-1 hover:text-[#ff007f] transition-colors cursor-pointer uppercase tracking-wider"
                >
                  Register
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {currentView === 'signup' && (
          <motion.div
            key="signup"
            custom={-1}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="w-full backface-hidden"
          >
            <div className="flex flex-col">
              <Signup />
              <div className="text-center text-[10px] text-gray-500 pb-6 -mt-2">
                Already have an account?
                <button
                  onClick={() => setIsLogin(true)}
                  className="text-white font-bold ml-1 hover:text-[#ff007f] transition-colors cursor-pointer uppercase tracking-wider"
                >
                  Sign In
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {currentView === 'forgotPassword' && (
          <motion.div
            key="forgotPassword"
            custom={1}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="w-full backface-hidden"
          >
            <ForgotPassword onBack={() => setIsForgotPassword(false)} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Auth
