import React, { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { motion } from "framer-motion"
import {
  getAvailableOrdersAsync,
  getAvailableReturnsAsync,
  getMyDeliveriesAsync,
} from "../../redux/slices/deliverySlice"
import DeliveryStatCard from "../../components/delivery/DeliveryStatCard"
import {
  Package,
  RotateCcw,
  CheckCircle2,
  Truck,
  Clock,
  TrendingUp,
  Wallet,
} from "lucide-react"

const DeliveryDashboard = () => {
  const dispatch = useDispatch()
  const { availableOrders, availableReturns, myDeliveries } = useSelector(
    (state) => state.delivery,
  )
  const { user } = useSelector((state) => state.auth)

  useEffect(() => {
    dispatch(getAvailableOrdersAsync())
    dispatch(getAvailableReturnsAsync())
    dispatch(getMyDeliveriesAsync())
  }, [dispatch])

  const delivered = myDeliveries.filter(
    (o) => o.deliveryStatus === "Delivered",
  ).length
  const inProgress = myDeliveries.filter((o) =>
    ["Accepted", "Out_for_Delivery"].includes(o.deliveryStatus),
  ).length
  const returnCollected = myDeliveries.filter(
    (o) => o.deliveryStatus === "Return_Collected",
  ).length

  const todayDeliveries = myDeliveries.filter((o) => {
    if (!o.updatedAt) return false
    const d = new Date(o.updatedAt)
    const today = new Date()
    return (
      d.toDateString() === today.toDateString() &&
      o.deliveryStatus === "Delivered"
    )
  }).length

  const totalEarnings = delivered * 40 + returnCollected * 30

  const stats = [
    {
      title: "Total Earnings",
      value: `₹${totalEarnings}`,
      icon: Wallet,
      color: "green",
      subtitle: "Commission earned",
    },
    {
      title: "Available Orders",
      value: availableOrders.length,
      icon: Package,
      color: "orange",
      subtitle: "Ready for pickup",
    },
    {
      title: "Return Pickups",
      value: availableReturns.length,
      icon: RotateCcw,
      color: "blue",
      subtitle: "Needs collection",
    },
    {
      title: "Today's Deliveries",
      value: todayDeliveries,
      icon: TrendingUp,
      color: "teal",
      subtitle: "Completed today",
    },
    {
      title: "In Progress",
      value: inProgress,
      icon: Clock,
      color: "purple",
      subtitle: "Active deliveries",
    },
    {
      title: "Total Delivered",
      value: delivered,
      icon: CheckCircle2,
      color: "teal",
      subtitle: "All time",
    },
    {
      title: "Returns Collected",
      value: returnCollected,
      icon: Truck,
      color: "red",
      subtitle: "All time",
    },
  ]

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-linear-to-r from-[#161616] to-[#0a0a0a] border border-gray-800/60 rounded-3xl p-8 shadow-2xl"
      >
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
              Good{" "}
              {new Date().getHours() < 12
                ? "Morning"
                : new Date().getHours() < 17
                  ? "Afternoon"
                  : "Evening"}
              ,{" "}
              <span className="text-[#ff007f]">
                {user?.name?.split(" ")[0] || "Rider"}
              </span>
              ! 👋
            </h1>
            <p className="text-gray-400 mt-2 font-medium">
              Here's your delivery overview for today.
            </p>
          </div>
          <div className="flex items-center gap-2 bg-[#ff007f]/10 border border-[#ff007f]/20 text-[#ff007f] px-5 py-2.5 rounded-xl font-black text-sm uppercase tracking-widest shadow-[0_0_15px_rgba(255,0,127,0.2)]">
            <span className="w-2.5 h-2.5 bg-[#ff007f] rounded-full animate-pulse shadow-[0_0_10px_#ff007f]"></span>
            On Duty
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {stats.map((s, i) => (
          <DeliveryStatCard key={s.title} {...s} delay={i * 0.08} />
        ))}
      </div>

      {/* Recent My Deliveries */}
      {myDeliveries.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-linear-to-br from-[#161616] to-[#0a0a0a] border border-gray-800/60 rounded-3xl p-8 shadow-2xl"
        >
          <h3 className="text-xl font-black text-white mb-6 flex items-center gap-3 tracking-wide border-b border-gray-800/50 pb-4">
            <Truck size={24} className="text-[#ff007f]" />
            Recent Deliveries
          </h3>
          <div className="space-y-4">
            {myDeliveries.slice(0, 5).map((order) => (
              <div
                key={order._id}
                className="flex items-center justify-between p-4 bg-[#111]/50 hover:bg-[#111] rounded-2xl border border-gray-800/50 transition-colors group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#ff007f]/10 border border-[#ff007f]/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Package size={20} className="text-[#ff007f]" />
                  </div>
                  <div>
                    <p className="text-base font-bold text-white">
                      #{order._id?.slice(-6)?.toUpperCase()}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {order.userId?.name || "Customer"}
                    </p>
                  </div>
                </div>
                <span
                  className={`px-4 py-1.5 rounded-xl text-xs font-black uppercase tracking-widest border ${
                    order.deliveryStatus === "Delivered"
                      ? "bg-green-500/10 text-green-500 border-green-500/20"
                      : order.deliveryStatus === "Out_for_Delivery"
                        ? "bg-orange-500/10 text-orange-500 border-orange-500/20"
                        : order.deliveryStatus === "Return_Collected"
                          ? "bg-blue-500/10 text-blue-500 border-blue-500/20"
                          : "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
                  }`}
                >
                  {order.deliveryStatus?.replace("_", " ")}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default DeliveryDashboard
