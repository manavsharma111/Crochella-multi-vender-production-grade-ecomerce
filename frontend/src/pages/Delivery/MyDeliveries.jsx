import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import { getMyDeliveriesAsync, updateDeliveryStatusAsync, confirmReturnCollectedAsync } from '../../redux/slices/deliverySlice'
import AvailableReturnCard from '../../components/delivery/AvailableReturnCard'
import { ClipboardList, RefreshCw, Package, Inbox, MapPin, IndianRupee, Map } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

import OtpPromptModal from '../../components/delivery/OtpPromptModal'

const statusColors = {
    Available: 'bg-gray-100 text-gray-600',
    Accepted: 'bg-blue-100 text-blue-700',
    Out_for_Delivery: 'bg-orange-100 text-orange-700',
    Delivered: 'bg-green-100 text-green-700',
    Return_Pickup: 'bg-purple-100 text-purple-700',
    Return_Collected: 'bg-teal-100 text-teal-700',
}

const MyDeliveries = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { myDeliveries, isLoading } = useSelector((state) => state.delivery)
    const [otpModalOpen, setOtpModalOpen] = useState(false)
    const [selectedOrderId, setSelectedOrderId] = useState(null)
    const [selectedOrderType, setSelectedOrderType] = useState('Delivery')
    const [visibleCompletedCount, setVisibleCompletedCount] = useState(6)
    const [isSubmittingOtp, setIsSubmittingOtp] = useState(false)

    useEffect(() => {
        dispatch(getMyDeliveriesAsync())
    }, [dispatch])

    const handleStatusUpdate = async (orderId, newStatus, otp = null) => {
        const data = { deliveryStatus: newStatus }
        if (otp) data.otp = otp

        const result = await dispatch(updateDeliveryStatusAsync({ orderId, data }))
        if (result.meta.requestStatus === 'fulfilled') {
            toast.success(`Status updated to ${newStatus.replace('_', ' ')}`)
            dispatch(getMyDeliveriesAsync())
            return true
        } else {
            toast.error(result.payload || 'Failed to update')
            return false
        }
    }

    const handleOtpSubmit = async (otp) => {
        setIsSubmittingOtp(true)
        let success = false
        if (selectedOrderType === 'Delivery') {
            success = await handleStatusUpdate(selectedOrderId, 'Delivered', otp)
        } else {
            // It's a return collection
            const result = await dispatch(confirmReturnCollectedAsync({ orderId: selectedOrderId, data: { otp } }))
            if (result.meta.requestStatus === 'fulfilled') {
                toast.success('Item collected successfully ✅')
                dispatch(getMyDeliveriesAsync())
                success = true
            } else {
                toast.error(result.payload || 'Failed')
            }
        }
        
        setIsSubmittingOtp(false)
        if (success) {
            setOtpModalOpen(false)
            setSelectedOrderId(null)
        }
    }

    const openOtpModal = (orderId, type = 'Delivery') => {
        setSelectedOrderId(orderId)
        setSelectedOrderType(type)
        setOtpModalOpen(true)
    }

    const activeDeliveries = myDeliveries.filter(o => ['Accepted', 'Out_for_Delivery'].includes(o.deliveryStatus))
    const returnPickups = myDeliveries.filter(o => o.deliveryStatus === 'Return_Pickup')
    const completed = myDeliveries.filter(o => ['Delivered', 'Return_Collected'].includes(o.deliveryStatus))

    return (
        <div className="space-y-6 max-w-7xl mx-auto relative">
            <OtpPromptModal 
                isOpen={otpModalOpen} 
                onClose={() => setOtpModalOpen(false)} 
                onSubmit={handleOtpSubmit}
                isSubmitting={isSubmittingOtp}
            />
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                className="bg-linear-to-r from-teal-500/10 to-cyan-500/10 rounded-3xl p-5 md:p-6 border border-teal-100 shadow-sm"
            >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                            <ClipboardList size={26} className="text-teal-500" />
                            My Deliveries
                        </h1>
                        <p className="text-gray-600 mt-1 text-sm">{myDeliveries.length} total assignments</p>
                    </div>
                    <button
                        onClick={() => dispatch(getMyDeliveriesAsync())}
                        disabled={isLoading}
                        className="flex items-center gap-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 px-4 py-2.5 rounded-xl transition-all text-sm font-medium"
                    >
                        <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
                        Refresh
                    </button>
                </div>
            </motion.div>

            {isLoading ? (
                <div className="flex items-center justify-center py-20">
                    <div className="w-10 h-10 border-4 border-teal-400 border-t-transparent rounded-full animate-spin"></div>
                </div>
            ) : myDeliveries.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
                    <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-teal-50 flex items-center justify-center">
                        <Inbox size={36} className="text-teal-400" />
                    </div>
                    <p className="text-gray-700 font-semibold text-lg">No deliveries yet</p>
                    <p className="text-gray-500 text-sm mt-1">Accept orders to see them here</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {/* Active Deliveries */}
                    {activeDeliveries.length > 0 && (
                        <div>
                            <h2 className="text-base font-bold text-gray-700 mb-3 flex items-center gap-2">
                                <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></span>
                                Active Deliveries ({activeDeliveries.length})
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                                {activeDeliveries.map((order, i) => (
                                    <motion.div
                                        key={order._id}
                                        initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
                                        className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
                                    >
                                        <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-gray-50">
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 rounded-xl bg-orange-100 flex items-center justify-center">
                                                    <Package size={16} className="text-orange-600" />
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-400">Order</p>
                                                    <p className="text-sm font-bold text-gray-800">#{order._id?.slice(-6)?.toUpperCase()}</p>
                                                </div>
                                            </div>
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${statusColors[order.deliveryStatus]}`}>
                                                {order.deliveryStatus?.replace('_', ' ')}
                                            </span>
                                        </div>
                                        <div className="px-5 py-4 space-y-3">
                                            <p className="text-sm font-semibold text-gray-800">{order.userId?.name || 'Customer'}</p>
                                            {order.shippingAddress && (
                                                <div className="flex items-start gap-2 bg-gray-50 rounded-xl p-3">
                                                    <MapPin size={13} className="text-orange-400 mt-0.5 shrink-0" />
                                                    <p className="text-xs text-gray-600">
                                                        {[order.shippingAddress.address, order.shippingAddress.city].filter(Boolean).join(', ')}
                                                    </p>
                                                </div>
                                            )}
                                            <div className="flex items-center gap-1 text-sm font-bold text-gray-700">
                                                <IndianRupee size={13} className="text-green-600" />
                                                {order.totalPrice?.toLocaleString('en-IN')}
                                                <span className="ml-2 px-1.5 py-0.5 bg-gray-100 text-[10px] uppercase text-gray-500 rounded font-black tracking-widest">{order.paymentMethod || 'COD'}</span>
                                            </div>
                                        </div>
                                        <div className="px-5 pb-5 grid grid-cols-2 gap-2">
                                            {order.deliveryStatus === 'Accepted' && (
                                                <button
                                                    onClick={() => handleStatusUpdate(order._id, 'Out_for_Delivery')}
                                                    className="col-span-2 bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold py-2.5 rounded-xl transition-all"
                                                >
                                                    🛵 Start Delivery
                                                </button>
                                            )}
                                            {order.deliveryStatus === 'Out_for_Delivery' && (
                                                <>
                                                    <button
                                                        onClick={() => navigate('/delivery/active')}
                                                        className="col-span-1 bg-blue-500 hover:bg-blue-600 text-white text-xs font-bold py-2.5 rounded-xl transition-all flex justify-center items-center gap-1"
                                                    >
                                                        <Map size={14} /> View Map
                                                    </button>
                                                    <button
                                                        onClick={() => openOtpModal(order._id)}
                                                        className="col-span-1 bg-green-500 hover:bg-green-600 text-white text-xs font-bold py-2.5 rounded-xl transition-all"
                                                    >
                                                        ✅ Delivered
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Return Pickups in Progress */}
                    {returnPickups.length > 0 && (
                        <div>
                            <h2 className="text-base font-bold text-gray-700 mb-3 flex items-center gap-2">
                                <span className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></span>
                                Return Pickups in Progress ({returnPickups.length})
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                                {returnPickups.map((order, i) => (
                                    <AvailableReturnCard 
                                        key={order._id} 
                                        order={order} 
                                        isMyReturn={true} 
                                        delay={i * 0.07} 
                                        onOpenOtpModal={(id) => openOtpModal(id, 'Return')}
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Completed */}
                    {completed.length > 0 && (
                        <div>
                            <h2 className="text-base font-bold text-gray-700 mb-3 flex items-center gap-2">
                                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                Completed ({completed.length})
                            </h2>
                            <div className="space-y-2">
                                {completed.slice(0, visibleCompletedCount).map((order, i) => (
                                    <motion.div
                                        key={order._id}
                                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}
                                        className="flex items-center justify-between bg-white p-4 rounded-xl border border-gray-100 hover:bg-gray-50 transition-all"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-xl bg-green-100 flex items-center justify-center">
                                                <Package size={14} className="text-green-600" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold text-gray-800">#{order._id?.slice(-6)?.toUpperCase()}</p>
                                                <p className="text-xs text-gray-500">{order.userId?.name || 'Customer'}</p>
                                            </div>
                                        </div>
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${statusColors[order.deliveryStatus]}`}>
                                            {order.deliveryStatus?.replace('_', ' ')}
                                        </span>
                                    </motion.div>
                                ))}
                            </div>
                            <div className="flex justify-center gap-4 mt-6">
                                {visibleCompletedCount < completed.length && (
                                    <button 
                                        onClick={() => setVisibleCompletedCount(prev => Math.min(prev + 6, completed.length))}
                                        className="px-6 py-2 bg-green-50 text-green-600 hover:bg-green-100 rounded-xl text-xs font-bold transition-colors"
                                    >
                                        Load More
                                    </button>
                                )}
                                {visibleCompletedCount > 6 && (
                                    <button 
                                        onClick={() => setVisibleCompletedCount(6)}
                                        className="px-6 py-2 bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200 rounded-xl text-xs font-bold transition-colors"
                                    >
                                        Show Less
                                    </button>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

export default MyDeliveries
