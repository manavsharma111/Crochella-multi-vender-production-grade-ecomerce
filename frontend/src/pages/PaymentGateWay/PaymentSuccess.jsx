import React, { useEffect } from "react"
import { useSearchParams, useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"
import { CheckCircle, Package, ArrowRight } from "lucide-react"
import { motion } from "framer-motion"
import { getCartAsync } from "../../redux/slices/cartSlice"

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams()
  const reference = searchParams.get("reference")
  const navigate = useNavigate()
  const dispatch = useDispatch()

  useEffect(() => {
    // Refresh cart to reflect empty cart after successful payment
    dispatch(getCartAsync())
    window.scrollTo(0, 0)
  }, [dispatch])

  return (
    <div className="min-h-screen pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-[#050505] flex items-center justify-center relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#ff007f]/5 rounded-full blur-[100px] pointer-events-none"></div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="bg-[#111] border-2 border-[#ff007f]/30 rounded-3xl p-8 md:p-12 max-w-lg w-full text-center relative z-10 shadow-[0_0_50px_rgba(255,0,127,0.1)]"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="w-24 h-24 bg-[#ff007f]/10 rounded-full flex items-center justify-center mx-auto mb-8 border border-[#ff007f]/30"
        >
          <CheckCircle size={48} className="text-[#ff007f]" />
        </motion.div>

        <h1 className="text-white font-black text-3xl uppercase tracking-widest mb-4">
          Payment <span className="text-[#ff007f]">Successful</span>
        </h1>

        <p className="text-gray-400 mb-8">
          Your payment has been successfully processed and your order is
          confirmed!
        </p>

        {reference && (
          <div className="bg-[#1a1a1a] p-4 rounded-xl border border-gray-800 mb-8">
            <p className="text-xs text-gray-500 uppercase font-bold tracking-widest mb-1">
              Payment Reference ID
            </p>
            <p className="text-white font-mono text-sm break-all">
              {reference}
            </p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate("/profile?tab=orders")}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-[#ff007f] hover:bg-white text-white hover:text-black rounded-xl font-bold uppercase tracking-widest transition-all duration-300"
          >
            <Package size={20} />
            View Orders
          </button>
          <button
            onClick={() => navigate("/shop")}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-transparent hover:bg-[#1a1a1a] text-white rounded-xl font-bold uppercase tracking-widest border border-gray-800 transition-all duration-300"
          >
            Continue Shop <ArrowRight size={20} />
          </button>
        </div>
      </motion.div>
    </div>
  )
}

export default PaymentSuccess
