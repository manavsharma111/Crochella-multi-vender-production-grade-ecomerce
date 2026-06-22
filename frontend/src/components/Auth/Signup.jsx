import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { registerUser, sendOtpAsync } from '../../redux/slices/authSlice'
import { toast } from 'react-hot-toast'
import { Eye, EyeOff, EyeClosed,  } from 'lucide-react'

const Signup = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [userOtp, setUserOtp] = useState('')
  const [role, setRole] = useState('buyer')
  const dispatch = useDispatch()
  const navigate = useNavigate()
  
  const { isLoading, error } = useSelector((state) => state.auth)

  const handleSendOtp = () => {
    if (!email) {
      toast.error("Please enter your email first!")
      return
    }
    dispatch(sendOtpAsync(email)).then((action) => {
      if (action.meta.requestStatus === 'fulfilled') {
        toast.success("OTP sent to your email!")
      } else {
        toast.error(action.payload || "Failed to send OTP")
      }
    })
  }

  const handleSignup = (e) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      toast.error("Passwords do not match!")
      return
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
    if (!passwordRegex.test(password)) {
      toast.error("Password must contain at least 8 chars, 1 uppercase, 1 lowercase, 1 number & 1 special char.")
      return
    }

    if (!userOtp) {
      toast.error("Please enter the OTP!")
      return
    }
    
    dispatch(registerUser({ name, email, password, confirmPassword, userOtp, role })).then((action) => {
      if (action.meta.requestStatus === 'fulfilled') {
        toast.success('Registration successful!')
      } else {
        toast.error(action.payload || 'Registration failed')
      }
    })
  }

  const handleGoogleSignup = () => {
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

      <div className="text-center mb-4">
        <h2 className="text-2xl font-black text-white tracking-widest font-sans">
          CROCHELL<span className="text-[#ff007f]">[A]</span>
        </h2>
        <p className="text-gray-400 text-xs mt-1 uppercase tracking-widest">Join the Luxury</p>
      </div>

      {/* Role Selection */}
      <div className="mb-4">
        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">I am registering as</p>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setRole('buyer')}
            className={`py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all border ${
              role === 'buyer'
                ? 'bg-[#ff007f] text-white border-[#ff007f] shadow-[0_0_15px_rgba(255,0,127,0.3)]'
                : 'bg-white/5 text-gray-400 border-white/10 hover:border-white/20'
            }`}
          >
            🛍️ Buyer
          </button>
          <button
            type="button"
            onClick={() => setRole('delivery_boy')}
            className={`py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all border ${
              role === 'delivery_boy'
                ? 'bg-[#ff007f] text-white border-[#ff007f] shadow-[0_0_15px_rgba(255,0,127,0.3)]'
                : 'bg-white/5 text-gray-400 border-white/10 hover:border-white/20'
            }`}
          >
            🛵 Delivery Boy
          </button>
        </div>
      </div>
      
      {error && (
        <div className="mb-4 text-[10px] uppercase tracking-wider text-center text-[#ff007f] bg-[#ff007f]/10 border border-[#ff007f]/20 py-2 rounded-lg font-bold">
          {error}
        </div>
      )}

      <form onSubmit={handleSignup} className="flex flex-col gap-3">

        {/*  Name + Email */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1 ml-1">Full Name</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#ff007f] focus:bg-white/10 transition-all"
              placeholder="John Doe"
              required
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1 ml-1">Email</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#ff007f] focus:bg-white/10 transition-all"
              placeholder="you@email.com"
              required
            />
          </div>
        </div>

        {/* Password + Confirm Password */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1 ml-1">Password</label>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#ff007f] focus:bg-white/10 transition-all pr-8"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors cursor-pointer"
              >
                {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1 ml-1">Confirm</label>
            <div className="relative">
              <input 
                type={showConfirmPassword ? "text" : "password"} 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#ff007f] focus:bg-white/10 transition-all pr-8"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors cursor-pointer"
              >
                {showConfirmPassword ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>
        </div>

        {/* OTP */}
        <div>
          <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1 ml-1">OTP Verification</label>
          <div className="flex gap-2">
            <input 
              type="text" 
              value={userOtp}
              onChange={(e) => setUserOtp(e.target.value)}
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-[#ff007f] focus:bg-white/10 transition-all"
              placeholder="123456"
              required
            />
            <button 
              type="button"
              onClick={handleSendOtp}
              disabled={isLoading || !email}
              className="bg-[#ff007f] text-white font-bold text-[10px] uppercase tracking-widest px-4 rounded-xl hover:bg-[#ff007f]/80 transition-all disabled:opacity-50"
            >
              Send OTP
            </button>
          </div>
        </div>
        
        <button 
          type="submit"
          disabled={isLoading}
          className="mt-1 w-full bg-white text-black font-black uppercase tracking-widest py-3 rounded-xl shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)] hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:hover:scale-100"
        >
          Register
        </button>
      </form>

      {/* Or Divider */}
      <div className="flex items-center gap-3 my-4">
        <div className="flex-1 h-px bg-white/10"></div>
        <span className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Or</span>
        <div className="flex-1 h-px bg-white/10"></div>
      </div>

      {/* Google Signup Button */}
      <button 
        type="button"
        onClick={handleGoogleSignup}
        className="w-full flex items-center justify-center gap-3 bg-white/5 border border-white/10 text-white font-bold text-xs uppercase tracking-widest py-3 rounded-xl hover:bg-white/10 transition-all"
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
        </svg>
        Sign up with Google
      </button>
      
    </div>
  )
}

export default Signup