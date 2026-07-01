import { useState } from "react"
import { Tag, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

// Note: In a real implementation, onApply would dispatch an action or check the code against the backend/redux state to calculate the new total.
const ApplyCoupon = ({ onApply, appliedCoupon, onRemove }) => {
  const [code, setCode] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()
    if (code.trim()) {
      onApply(code.trim().toUpperCase())
      setCode("")
    }
  }

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-5 w-full">
      <AnimatePresence mode="wait">
        {appliedCoupon ? (
          <motion.div
            key="applied"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex items-center justify-between bg-green-500/10 border border-green-500/30 rounded-xl p-4"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500/20 rounded-full">
                <Tag size={16} className="text-green-400" />
              </div>
              <div>
                <div className="text-sm font-bold text-green-400 tracking-wider">
                  {appliedCoupon.code} APPLIED
                </div>
                <div className="text-xs text-green-500/70">
                  You saved {appliedCoupon.discountString}!
                </div>
              </div>
            </div>
            <button
              onClick={onRemove}
              className="p-2 hover:bg-green-500/20 rounded-lg transition-colors text-green-500/70 hover:text-green-400"
            >
              <X size={16} />
            </button>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            onSubmit={handleSubmit}
            className="flex gap-2"
          >
            <input
              type="text"
              placeholder="Enter Promo Code"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              className="flex-1 bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white font-bold tracking-widest placeholder:text-gray-600 placeholder:font-normal placeholder:tracking-normal outline-none focus:border-[#ff007f] transition-colors"
            />
            <button
              type="submit"
              disabled={!code.trim()}
              className="px-6 py-3 bg-white text-black font-black uppercase tracking-widest rounded-xl hover:bg-gray-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Apply
            </button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  )
}

export default ApplyCoupon
