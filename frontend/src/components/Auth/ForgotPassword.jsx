import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import {
  sendOtpAsync,
  verifyOtpAsync,
  resetPasswordAsync,
} from "../../redux/slices/authSlice"
import { toast } from "react-hot-toast"
import { Eye, EyeOff } from "lucide-react"

const ForgotPassword = ({ onBack }) => {
  const [email, setEmail] = useState("")
  const [otp, setOtp] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const dispatch = useDispatch()
  const { isLoading, error } = useSelector((state) => state.auth)

  const handleSendOtp = () => {
    if (!email) {
      toast.error("Please enter your email first!")
      return
    }
    dispatch(sendOtpAsync(email)).then((action) => {
      if (action.meta.requestStatus === "fulfilled") {
        toast.success("OTP sent to your email!")
      } else {
        toast.error(action.payload || "Failed to send OTP")
      }
    })
  }

  const handleResetPassword = async (e) => {
    e.preventDefault()
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match!")
      return
    }

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
    if (!passwordRegex.test(newPassword)) {
      toast.error(
        "Password must contain at least 8 chars, 1 uppercase, 1 lowercase, 1 number & 1 special char.",
      )
      return
    }

    if (!otp) {
      toast.error("Please enter the OTP!")
      return
    }

    // Verify OTP
    const verifyAction = await dispatch(verifyOtpAsync({ email, otp }))
    if (verifyAction.meta.requestStatus !== "fulfilled") {
      toast.error(verifyAction.payload || "Invalid OTP")
      return
    }

    // Reset Password
    const resetAction = await dispatch(
      resetPasswordAsync({ email, password: newPassword }),
    )
    if (resetAction.meta.requestStatus === "fulfilled") {
      toast.success("Password reset successfully! Please login.")
      onBack()
    } else {
      toast.error(resetAction.payload || "Failed to reset password")
    }
  }

  return (
    <div className="p-6 relative">
      {isLoading && (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-10 rounded-4xl">
          <div className="w-8 h-8 border-2 border-[#ff007f] border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      <div className="text-center mb-5">
        <h2 className="text-2xl font-black text-white tracking-widest font-sans">
          RECOVER<span className="text-[#ff007f]">[X]</span>
        </h2>
        <p className="text-gray-400 text-xs mt-1 uppercase tracking-widest">
          Reset your password
        </p>
      </div>

      {error && (
        <div className="mb-4 text-[10px] uppercase tracking-wider text-center text-[#ff007f] bg-[#ff007f]/10 border border-[#ff007f]/20 py-2 rounded-lg font-bold">
          {error}
        </div>
      )}

      <form onSubmit={handleResetPassword} className="flex flex-col gap-3">
        <div>
          <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1 ml-1">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-[#ff007f] focus:bg-white/10 transition-all"
            placeholder="your@email.com"
            required
          />
        </div>

        <div>
          <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1 ml-1">
            OTP Verification
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
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

        <div>
          <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1 ml-1">
            New Password
          </label>
          <div className="relative">
            <input
              type={showNewPassword ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-[#ff007f] focus:bg-white/10 transition-all pr-10"
              placeholder="••••••••"
              required
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors cursor-pointer"
            >
              {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>
        <div>
          <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1 ml-1">
            Confirm New Password
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-[#ff007f] focus:bg-white/10 transition-all pr-10"
              placeholder="••••••••"
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors cursor-pointer"
            >
              {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="mt-2 w-full bg-[#ff007f] text-white font-black uppercase tracking-widest py-3 rounded-xl shadow-[0_0_20px_rgba(255,0,127,0.4)] hover:shadow-[0_0_30px_rgba(255,0,127,0.6)] hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:hover:scale-100"
        >
          Reset Password
        </button>

        <button
          type="button"
          onClick={onBack}
          className="mt-2 text-[10px] text-gray-500 hover:text-white transition-colors uppercase tracking-wider font-bold text-center w-full"
        >
          Back to Login
        </button>
      </form>
    </div>
  )
}

export default ForgotPassword
