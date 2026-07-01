import React, { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { motion } from "framer-motion"
import { getAvailableOrdersAsync } from "../../redux/slices/deliverySlice"
import AvailableOrderCard from "../../components/delivery/AvailableOrderCard"
import { Package, RefreshCw, Inbox } from "lucide-react"

const DeliveryOrders = () => {
  const dispatch = useDispatch()
  const { availableOrders, isLoading } = useSelector((state) => state.delivery)
  const [visibleCount, setVisibleCount] = useState(6)

  useEffect(() => {
    dispatch(getAvailableOrdersAsync())
  }, [dispatch])

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-linear-to-r from-orange-500/10 to-amber-500/10 rounded-3xl p-5 md:p-6 border border-orange-100 shadow-sm"
      >
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <Package size={26} className="text-orange-500" />
              Available Orders
            </h1>
            <p className="text-gray-600 mt-1 text-sm">
              {availableOrders.length} order
              {availableOrders.length !== 1 ? "s" : ""} waiting for pickup
            </p>
          </div>
          <button
            onClick={() => dispatch(getAvailableOrdersAsync())}
            disabled={isLoading}
            className="flex items-center gap-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 px-4 py-2.5 rounded-xl transition-all text-sm font-medium hover:shadow-sm"
          >
            <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>
      </motion.div>

      {/* Orders Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-10 h-10 border-4 border-orange-400 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : availableOrders.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm"
        >
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-orange-50 flex items-center justify-center">
            <Inbox size={36} className="text-orange-400" />
          </div>
          <p className="text-gray-700 font-semibold text-lg">
            No orders available
          </p>
          <p className="text-gray-500 text-sm mt-1">
            New orders will appear here when customers place them
          </p>
        </motion.div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {availableOrders.slice(0, visibleCount).map((order, i) => (
              <AvailableOrderCard
                key={order._id}
                order={order}
                delay={i * 0.07}
              />
            ))}
          </div>
          <div className="flex justify-center gap-4 mt-8">
            {visibleCount < availableOrders.length && (
              <button
                onClick={() =>
                  setVisibleCount((prev) =>
                    Math.min(prev + 6, availableOrders.length),
                  )
                }
                className="px-6 py-2.5 bg-orange-50 text-orange-600 hover:bg-orange-100 rounded-xl text-sm font-bold transition-colors"
              >
                Load More
              </button>
            )}
            {visibleCount > 6 && (
              <button
                onClick={() => setVisibleCount(6)}
                className="px-6 py-2.5 bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200 rounded-xl text-sm font-bold transition-colors"
              >
                Show Less
              </button>
            )}
          </div>
        </>
      )}
    </div>
  )
}

export default DeliveryOrders
