import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { loginUser } from '../../redux/slices/authSlice'
import { toast } from 'react-hot-toast'
import { Eye, EyeOff } from 'lucide-react'

const Login = ({ onForgotClick }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  
  const { isLoading, error } = useSelector((state) => state.auth)

  const handleLogin = (e) => {
    e.preventDefault()
    if (email && password) {
      dispatch(loginUser({ email, password })).then((action) => {
        if (action.meta.requestStatus === 'fulfilled') {
          const user = action.payload
          toast.success(`Welcome back, ${user?.name || 'User'}!`)
          if (user?.role === 'delivery_boy') {
            navigate('/delivery/dashboard')
          }
        }
      })
    }
  }

  const handleGoogleLogin = () => {
    window.location.href = `${import.meta.env.VITE_BACKEND_URL}/auth/google`
  }

  return (
    <div className="p-6 relative">
      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-10 rounded-4xl">
          <div className="w-8 h-8 border-2 border-[#ff007f] border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      <div className="text-center mb-5">
        <h2 className="text-2xl font-black text-white tracking-widest font-sans">
          CROCHELL<span className="text-[#ff007f]">[A]</span>
        </h2>
        <p className="text-gray-400 text-xs mt-1 uppercase tracking-widest">Sign in to Luxury</p>
      </div>
      
      {error && (
        <div className="mb-4 text-[10px] uppercase tracking-wider text-center text-[#ff007f] bg-[#ff007f]/10 border border-[#ff007f]/20 py-2 rounded-lg font-bold">
          {error}
        </div>
      )}

      <form onSubmit={handleLogin} className="flex flex-col gap-3">
        <div>
          <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1 ml-1">Email</label>
          <input 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#ff007f] focus:bg-white/10 transition-all"
            placeholder="your@email.com"
            required
          />
        </div>
        <div>
          <div className="flex justify-between items-end mb-1 px-1">
            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest">Password</label>
            <button 
              type="button" 
              onClick={onForgotClick}
              className="text-[10px] text-[#ff007f] hover:text-white transition-colors uppercase tracking-wider font-bold"
            >
              Forgot?
            </button>
          </div>
          <div className="relative">
            <input 
              type={showPassword ? "text" : "password"} 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#ff007f] focus:bg-white/10 transition-all pr-10"
              placeholder="••••••••"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors cursor-pointer"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>
        
        <button 
          type="submit"
          disabled={isLoading}
          className="mt-2 w-full bg-white text-black font-black uppercase tracking-widest py-3 rounded-xl shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)] hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:hover:scale-100"
        >
          Sign In
        </button>
      </form>

      {/* Or Divider */}
      <div className="flex items-center gap-3 my-4">
        <div className="flex-1 h-px bg-white/10"></div>
        <span className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Or</span>
        <div className="flex-1 h-px bg-white/10"></div>
      </div>

      {/* Google Login Button */}
      <button 
        type="button"
        onClick={handleGoogleLogin}
        className="w-full flex items-center justify-center gap-3 bg-white/5 border border-white/10 text-white font-bold text-xs uppercase tracking-widest py-3 rounded-xl hover:bg-white/10 transition-all"
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
        </svg>
        Sign in with Google
      </button>
      
    </div>
  )
}

export default Login