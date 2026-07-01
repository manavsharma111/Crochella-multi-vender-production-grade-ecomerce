import React from "react"
import { motion } from "framer-motion"
import {
  MapPin,
  Phone,
  RotateCcw,
  IndianRupee,
  PackageCheck,
  Loader2,
} from "lucide-react"
import { toast } from "react-hot-toast"
import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import {
  acceptReturnPickupAsync,
  confirmReturnCollectedAsync,
  getAvailableReturnsAsync,
  getMyDeliveriesAsync,
} from "../../redux/slices/deliverySlice"

const AvailableReturnCard = ({
  order,
  isMyReturn = false,
  delay = 0,
  onOpenOtpModal,
}) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [loading, setLoading] = React.useState(false)

  const handleAcceptReturn = async () => {
    setLoading(true)
    try {
      const result = await dispatch(acceptReturnPickupAsync(order._id))
      if (result.meta.requestStatus === "fulfilled") {
        toast.success("Return pickup accepted! ↩️")
        dispatch(getAvailableReturnsAsync())
      } else {
        toast.error(result.payload || "Failed")
      }
    } finally {
      setLoading(false)
    }
  }

  const handleCollected = async () => {
    if (onOpenOtpModal) {
      onOpenOtpModal(order._id)
      return
    }
    setLoading(true)
    try {
      const result = await dispatch(
        confirmReturnCollectedAsync({ orderId: order._id }),
      )
      if (result.meta.requestStatus === "fulfilled") {
        toast.success("Item collected successfully ✅")
        dispatch(getMyDeliveriesAsync())
      } else {
        toast.error(result.payload || "Failed")
      }
    } finally {
      setLoading(false)
    }
  }

  const addr = order.shippingAddress

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay }}
      className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-gray-50">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-blue-100 flex items-center justify-center">
            <RotateCcw size={18} className="text-blue-600" />
          </div>
          <div>
            <p className="text-xs text-gray-400 font-medium">Return Order</p>
            <p className="text-sm font-bold text-gray-800">
              #{order._id?.slice(-6)?.toUpperCase()}
            </p>
          </div>
        </div>
        <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700">
          {order.deliveryStatus === "Return_Pickup"
            ? "Pickup Accepted"
            : "Needs Pickup"}
        </span>
      </div>

      {/* Body */}
      <div className="px-5 py-4 space-y-3">
        {order.userId && (
          <div className="flex items-center gap-3 text-sm">
            <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs shrink-0">
              {order.userId.name?.[0]?.toUpperCase() || "C"}
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-gray-800 truncate">
                {order.userId.name || "Customer"}
              </p>
              {order.userId.phone && (
                <div className="flex items-center gap-1 text-gray-500">
                  <Phone size={11} />
                  <span className="text-xs">{order.userId.phone}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {addr && (
          <div className="flex items-start gap-2 bg-gray-50 rounded-xl p-3">
            <MapPin size={14} className="text-blue-500 mt-0.5 shrink-0" />
            <p className="text-xs text-gray-600 leading-relaxed">
              {[addr.address, addr.city, addr.state, addr.zip]
                .filter(Boolean)
                .join(", ")}
            </p>
          </div>
        )}

        {order.returnDetails?.reason && (
          <div className="bg-amber-50 rounded-xl p-3 border border-amber-100">
            <p className="text-xs text-amber-700 font-medium">Return Reason:</p>
            <p className="text-xs text-gray-600 mt-0.5">
              {order.returnDetails.reason}
            </p>
          </div>
        )}

        <div className="flex items-center gap-1 text-sm font-bold text-gray-700">
          <IndianRupee size={14} className="text-green-600" />
          <span>{order.totalPrice?.toLocaleString("en-IN") || "—"}</span>
        </div>
      </div>

      {/* Action */}
      <div className="px-5 pb-5">
        {!isMyReturn || order.deliveryStatus === "Available" ? (
          <motion.button
            onClick={handleAcceptReturn}
            disabled={loading}
            whileHover={{ scale: loading ? 1 : 1.01 }}
            whileTap={{ scale: loading ? 1 : 0.98 }}
            className="w-full flex items-center justify-center gap-2 bg-linear-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold py-3 rounded-xl transition-all shadow-sm hover:shadow-blue-200 hover:shadow-md disabled:opacity-60"
          >
            {loading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <RotateCcw size={18} />
            )}
            {loading ? "Accepting..." : "Accept Return Pickup"}
          </motion.button>
        ) : (
          <div className="flex gap-2">
            <motion.button
              onClick={() => navigate("/delivery/active")}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 flex items-center justify-center gap-2 bg-linear-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-3 rounded-xl transition-all shadow-sm hover:shadow-md"
            >
              <MapPin size={18} />
              View Map
            </motion.button>
            <motion.button
              onClick={handleCollected}
              disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.01 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              className="flex-1 flex items-center justify-center gap-2 bg-linear-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white font-bold py-3 rounded-xl transition-all shadow-sm hover:shadow-green-200 hover:shadow-md disabled:opacity-60"
            >
              {loading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <PackageCheck size={18} />
              )}
              {loading ? "Marking..." : "Collected"}
            </motion.button>
          </div>
        )}
      </div>
    </motion.div>
  )
}

export default AvailableReturnCard
