import React from 'react'
import { motion } from 'framer-motion'
import { MapPin, Phone, Package, IndianRupee, CheckCircle2, Loader2 } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { useDispatch } from 'react-redux'
import { acceptOrderAsync, getAvailableOrdersAsync } from '../../redux/slices/deliverySlice'

const statusColors = {
    Available: 'bg-green-100 text-green-700',
    Accepted: 'bg-blue-100 text-blue-700',
    Out_for_Delivery: 'bg-orange-100 text-orange-700',
    Delivered: 'bg-teal-100 text-teal-700',
}

const AvailableOrderCard = ({ order, delay = 0 }) => {
    const dispatch = useDispatch()
    const [loading, setLoading] = React.useState(false)

    const handleAccept = async () => {
        setLoading(true)
        try {
            const result = await dispatch(acceptOrderAsync(order._id))
            if (result.meta.requestStatus === 'fulfilled') {
                toast.success('Order accepted! Ready for pickup 🛵')
                dispatch(getAvailableOrdersAsync())
            } else {
                toast.error(result.payload || 'Failed to accept order')
            }
        } finally {
            setLoading(false)
        }
    }

    const addr = order.shippingAddress
    const itemCount = order.products?.reduce((s, p) => s + (p.quantity || 1), 0) || 0

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
                    <div className="w-9 h-9 rounded-xl bg-orange-100 flex items-center justify-center">
                        <Package size={18} className="text-orange-600" />
                    </div>
                    <div>
                        <p className="text-xs text-gray-400 font-medium">Order ID</p>
                        <p className="text-sm font-bold text-gray-800">#{order._id?.slice(-6)?.toUpperCase()}</p>
                    </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusColors[order.deliveryStatus] || 'bg-gray-100 text-gray-600'}`}>
                    {order.deliveryStatus}
                </span>
            </div>

            {/* Body */}
            <div className="px-5 py-4 space-y-3">
                {/* Customer */}
                {order.userId && (
                    <div className="flex items-center gap-3 text-sm">
                        <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs shrink-0">
                            {order.userId.name?.[0]?.toUpperCase() || 'C'}
                        </div>
                        <div className="min-w-0">
                            <p className="font-semibold text-gray-800 truncate">{order.userId.name || 'Customer'}</p>
                            {order.userId.phone && (
                                <div className="flex items-center gap-1 text-gray-500">
                                    <Phone size={11} />
                                    <span className="text-xs">{order.userId.phone}</span>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Address */}
                {addr && (
                    <div className="flex items-start gap-2 bg-gray-50 rounded-xl p-3">
                        <MapPin size={14} className="text-orange-500 mt-0.5 shrink-0" />
                        <p className="text-xs text-gray-600 leading-relaxed">
                            {[addr.address, addr.city, addr.state, addr.zip].filter(Boolean).join(', ')}
                        </p>
                    </div>
                )}

                {/* Stats row */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-sm font-bold text-gray-700">
                        <IndianRupee size={14} className="text-green-600" />
                        <span>{order.totalPrice?.toLocaleString('en-IN') || '—'}</span>
                        <span className="text-xs text-gray-400 font-normal ml-1">({order.paymentMethod})</span>
                    </div>
                    <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-lg">
                        {itemCount} item{itemCount !== 1 ? 's' : ''}
                    </div>
                </div>
            </div>

            {/* Accept Button */}
            <div className="px-5 pb-5">
                <motion.button
                    onClick={handleAccept}
                    disabled={loading}
                    whileHover={{ scale: loading ? 1 : 1.01 }}
                    whileTap={{ scale: loading ? 1 : 0.98 }}
                    className="w-full flex items-center justify-center gap-2 bg-linear-to-r from-orange-400 to-amber-500 hover:from-orange-500 hover:to-amber-600 text-white font-bold py-3 rounded-xl transition-all shadow-sm hover:shadow-orange-200 hover:shadow-md disabled:opacity-60"
                >
                    {loading ? <Loader2 size={18} className="animate-spin" /> : <CheckCircle2 size={18} />}
                    {loading ? 'Accepting...' : 'Accept Order'}
                </motion.button>
            </div>
        </motion.div>
    )
}

export default AvailableOrderCard
