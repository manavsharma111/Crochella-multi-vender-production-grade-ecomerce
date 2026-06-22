import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useDispatch, useSelector } from 'react-redux'
import { X, Package, Truck, CheckCircle, MapPin, CornerDownLeft, CheckCircle2, Banknote } from 'lucide-react'
import { getLiveTrackingAsync, updateLiveLocation } from '../../redux/slices/orderSlice'
import LiveTrackingMap from '../../pages/Checkout/Livetracking'
import { io } from 'socket.io-client'

const OrderTrackingModal = ({ orderId, isOpen, onClose }) => {
    const dispatch = useDispatch()
    const { order, loading } = useSelector(state => state.order)

    useEffect(() => {
        let socket;
        if (isOpen) {
            document.body.style.overflow = 'hidden'
            document.documentElement.style.overflow = 'hidden'
            if (window.lenis) window.lenis.stop()
            
            if (orderId) {
                dispatch(getLiveTrackingAsync(orderId))
                
                // Initialize socket connection
                socket = io(import.meta.env.VITE_BACKEND_URL, {
                    withCredentials: true
                })
                socket.emit('joinOrderTracking', orderId)
                socket.on('locationUpdate', (data) => {
                    dispatch(updateLiveLocation(data))
                })
            }
        } else {
            document.body.style.overflow = 'unset'
            document.documentElement.style.overflow = 'unset'
            if (window.lenis) window.lenis.start()
        }

        return () => {
            if (socket) socket.disconnect()
            document.body.style.overflow = 'unset'
            document.documentElement.style.overflow = 'unset'
            if (window.lenis) window.lenis.start()
        }
    }, [isOpen, orderId, dispatch])

    if (!isOpen) return null

    const currentOrder = order?.success ? order : null
    const progressPercent = currentOrder?.progressPercent || 0
    const status = currentOrder?.orderStatus || 'Processing'
    
    const lat = currentOrder?.currentLocation?.lat || 27.8800
    const lng = currentOrder?.currentLocation?.lng || 78.0800
    const mockUserCoords = { lat: lat - 0.02, lng: lng + 0.025 }

    return (
        <AnimatePresence>
            <div 
                className="fixed inset-0 z-50 flex items-start justify-center px-4 pt-20 pb-4 md:pt-28 md:pb-8"
                onClick={onClose}
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="bg-[#111] border-2 border-gray-800 rounded-3xl w-full max-w-2xl h-[75vh] md:h-[calc(100vh-144px)] flex flex-col shadow-[8px_8px_0px_#000] relative overflow-hidden"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="p-6 border-b border-gray-800 flex justify-between items-center bg-[#0a0a0a] shrink-0">
                        <div>
                            <h2 className="text-white font-black text-xl uppercase tracking-widest">Live Tracking</h2>
                            <p className="text-gray-500 text-xs font-bold mt-1">ORDER ID: {orderId.substring(0, 8).toUpperCase()}</p>
                        </div>
                        <button 
                            onClick={onClose}
                            className="p-2 bg-[#1a1a1a] hover:bg-[#ff007f] text-gray-400 hover:text-white rounded-full transition-colors border border-gray-800"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    <div className="p-6 md:p-8 flex-1 flex flex-col min-h-0">
                        {loading ? (
                            <div className="flex flex-col items-center justify-center h-full">
                                <div className="w-10 h-10 border-4 border-[#ff007f] border-t-transparent rounded-full animate-spin mb-4"></div>
                                <p className="text-gray-500 text-sm font-bold animate-pulse">Fetching live location...</p>
                            </div>
                        ) : (
                            <>
                                {/* Progress Bar */}
                                <div className="mb-8 mt-4 shrink-0 relative px-4">
                                    {(() => {
                                        const isReturn = status.toLowerCase().includes('return')
                                        
                                        const normalSteps = [
                                            { label: 'Processing', icon: Package },
                                            { label: 'Shipped', icon: Truck },
                                            { label: 'Out for Delivery', icon: MapPin },
                                            { label: 'Delivered', icon: CheckCircle }
                                        ];

                                        const returnSteps = [
                                            { label: 'Requested', icon: Package },
                                            { label: 'Accepted', icon: Package },
                                            { label: 'Out for Pickup', icon: Truck },
                                            { label: 'Collected', icon: CheckCircle2 },
                                            { label: 'Refunded', icon: Banknote }
                                        ]

                                        const steps = isReturn ? returnSteps : normalSteps
                                        
                                        let currentStep = 1
                                        if (!isReturn) {
                                            if (status === 'Shipped') currentStep = 2
                                            if (status === 'Out_for_Delivery' || status === 'Out for delivery') currentStep = 3
                                            if (status === 'Delivered') currentStep = 4
                                        } else {
                                            if (status === 'Return_Accepted') currentStep = 2
                                            if (status === 'Return_Pickup' || status === 'Out for Pickup') currentStep = 3
                                            if (status === 'Return_Collected' || status === 'Returned' || status === 'Collected') currentStep = 4
                                            if (status === 'Refunded') currentStep = 5
                                        }

                                        let fillPercent = progressPercent > 0 ? progressPercent : ((currentStep - 1) / (steps.length - 1)) * 100
                                        if (fillPercent === 0 && currentStep > 1) {
                                           fillPercent = ((currentStep - 1) / (steps.length - 1)) * 100
                                        }

                                        return (
                                            <div className="relative">
                                                {/* Background Line */}
                                                <div className="absolute top-5 left-[10%] right-[10%] h-[3px] bg-gray-800 z-0 rounded-full"></div>
                                                
                                                {/* Active Progress Line */}
                                                <motion.div 
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${fillPercent}%` }}
                                                    transition={{ duration: 1, ease: "easeOut" }}
                                                    className={`absolute top-5 left-[10%] max-w-[80%] h-[3px] z-0 rounded-full ${
                                                        fillPercent === 100 ? 'bg-[#00ff88]' : 
                                                        fillPercent >= 50 ? 'bg-blue-500' : 'bg-[#ff007f]'
                                                    }`}
                                                />

                                                <div className="flex justify-between items-start">
                                                    {steps.map((step, idx) => {
                                                        const Icon = step.icon
                                                        const stepPercent = (idx / (steps.length - 1)) * 100
                                                        const isCompleted = fillPercent >= stepPercent
                                                        const isCurrent = currentStep === idx + 1
                                                        
                                                        let colorClass = 'bg-[#1a1a1a] border-gray-700 text-gray-500'
                                                        let labelClass = 'text-gray-500'
                                                        
                                                        if (isCompleted || isCurrent) {
                                                            if (idx === steps.length - 1 && fillPercent === 100) {
                                                                colorClass = 'bg-[#00ff88] border-[#00ff88] text-black shadow-[0_0_15px_rgba(0,255,136,0.4)]'
                                                                labelClass = 'text-[#00ff88]'
                                                            } else if (idx >= 1) {
                                                                colorClass = 'bg-blue-500 border-blue-500 text-white shadow-[0_0_15px_rgba(59,130,246,0.4)]'
                                                                labelClass = 'text-blue-500'
                                                            } else {
                                                                colorClass = 'bg-[#ff007f] border-[#ff007f] text-white shadow-[0_0_15px_#ff007f]'
                                                                labelClass = 'text-[#ff007f]'
                                                            }
                                                        }

                                                        return (
                                                            <div key={idx} className="flex flex-col items-center w-20">
                                                                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors duration-500 bg-[#111] z-10 ${colorClass}`}>
                                                                    <Icon size={18} className="relative z-10 bg-transparent" />
                                                                </div>
                                                                <span className={`text-[9px] sm:text-[10px] font-bold uppercase tracking-widest mt-2 text-center ${labelClass}`}>
                                                                    {step.label}
                                                                </span>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        )
                                    })()}
                                </div>

                                {/* OTP Display */}
                                {(currentOrder?.deliveryStatus === 'Out_for_Delivery' || currentOrder?.deliveryStatus === 'Return_Pickup') && currentOrder?.deliveryOtp && (
                                    <div className="mx-4 mb-6 p-4 shrink-0 bg-[#ff007f]/10 border border-[#ff007f]/30 rounded-2xl flex items-center justify-between shadow-[0_0_20px_rgba(255,0,127,0.15)]">
                                        <div>
                                            <p className="text-[#ff007f] font-bold text-xs uppercase tracking-widest mb-1">Secret Delivery OTP</p>
                                            <p className="text-gray-400 text-[10px]">Share this with the delivery executive.</p>
                                        </div>
                                        <div className="bg-[#111] px-6 py-2 rounded-xl border border-[#ff007f]/50">
                                            <span className="text-2xl font-black text-white tracking-[0.25em]">{currentOrder.deliveryOtp}</span>
                                        </div>
                                    </div>
                                )}

                                {/* Map Section using the robust LiveTrackingMap component */}
                                <div className="mt-4 flex-1 relative min-h-0">
                                    <LiveTrackingMap 
                                        deliveryCoords={{ lat, lng }} 
                                        userCoords={mockUserCoords} 
                                    />
                                </div>
                                
                                {status === 'Cancelled' && (
                                    <div className="mt-6 p-4 shrink-0 bg-red-500/10 border border-red-500 rounded-xl text-center">
                                        <p className="text-red-500 font-bold uppercase tracking-widest text-sm">Order Cancelled</p>
                                        <p className="text-red-400 text-xs mt-1">This order is no longer being tracked.</p>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    )
}

export default OrderTrackingModal
