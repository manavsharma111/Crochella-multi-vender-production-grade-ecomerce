import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { PackageOpen, ChevronDown, ChevronUp } from "lucide-react"
import { getUserOrdersAsync } from "../../redux/slices/orderSlice"
import OrderCard from "./OrderCard"
import { motion, AnimatePresence } from "framer-motion"

const OrdersTab = () => {
  const dispatch = useDispatch()
  const { orders, loading } = useSelector((state) => state.order)
  const [visibleCount, setVisibleCount] = useState(2)

  const fetchOrders = () => {
    dispatch(getUserOrdersAsync())
  }

  useEffect(() => {
    fetchOrders()
  }, [dispatch])

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 2)
  }

  const handleLoadLess = () => {
    setVisibleCount(2)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
        <h3 className="text-white font-black text-2xl uppercase tracking-widest">
          My Orders
        </h3>
      </div>

      {loading && orders.length === 0 ? (
        <div className="py-20 text-center">
          <div className="inline-block w-8 h-8 border-4 border-[#ff007f] border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : orders.length > 0 ? (
        <div className="space-y-4">
          <AnimatePresence>
            {orders.slice(0, visibleCount).map((order) => (
              <motion.div
                key={order._id}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <OrderCard order={order} onRefresh={fetchOrders} />
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Load More / Load Less Buttons */}
          <div className="flex justify-center gap-4 mt-8 pt-4">
            {visibleCount < orders.length && (
              <button
                onClick={handleLoadMore}
                className="flex items-center gap-2 px-6 py-2.5 bg-[#1a1a1a] hover:bg-[#ff007f] text-gray-300 hover:text-white rounded-full font-bold text-sm transition-all duration-300 border border-gray-800 hover:border-[#ff007f] shadow-[0_0_10px_rgba(255,0,127,0)] hover:shadow-[0_0_15px_rgba(255,0,127,0.4)]"
              >
                Load More <ChevronDown size={16} />
              </button>
            )}
            {visibleCount > 2 && (
              <button
                onClick={handleLoadLess}
                className="flex items-center gap-2 px-6 py-2.5 bg-[#1a1a1a] hover:bg-white text-gray-300 hover:text-black rounded-full font-bold text-sm transition-all duration-300 border border-gray-800 hover:border-white shadow-[0_0_10px_rgba(255,255,255,0)] hover:shadow-[0_0_15px_rgba(255,255,255,0.4)]"
              >
                Load Less <ChevronUp size={16} />
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="text-center py-16 border-2 border-dashed border-gray-800 rounded-2xl">
          <div className="w-16 h-16 bg-[#1a1a1a] rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-800">
            <PackageOpen size={32} className="text-gray-500" />
          </div>
          <h4 className="text-white font-bold text-lg mb-2">No Orders Yet</h4>
          <p className="text-gray-500 text-sm max-w-sm mx-auto">
            Looks like you haven't placed any orders. Start exploring our
            handloom collection today!
          </p>
        </div>
      )}
    </motion.div>
  )
}

export default OrdersTab
