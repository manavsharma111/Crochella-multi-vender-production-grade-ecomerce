import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useDispatch } from 'react-redux'
import { updateOrderStatusAsync, sellerGetAllOrdersAsync, handleOrderRefundAsync } from '../../redux/slices/orderSlice'
import { X, Save, MapPin, RefreshCcw, CreditCard } from 'lucide-react'
import toast from 'react-hot-toast'

const OrderManagementModal = ({ order, onClose }) => {
    const dispatch = useDispatch()
    const [status, setStatus] = useState(order.orderStatus)
    const [lat, setLat] = useState(order.currentLocation?.lat || '')
    const [lng, setLng] = useState(order.currentLocation?.lng || '')
    const [addressString, setAddressString] = useState(order.currentLocation?.addressString || '')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isRefunding, setIsRefunding] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsSubmitting(true)
        try {
            await dispatch(updateOrderStatusAsync({
                id: order._id,
                orderData: {
                    status,
                    lat: parseFloat(lat) || undefined,
                    lng: parseFloat(lng) || undefined,
                    addressString: addressString || undefined
                }
            })).unwrap()
            
            toast.success("Order updated successfully")
            dispatch(sellerGetAllOrdersAsync()) // Refresh list
            onClose()
        } catch (error) {
            toast.error(error || "Failed to update order")
        } finally {
            setIsSubmitting(false)
        }
    };

    const executeRefund = async () => {
        setIsRefunding(true)
        try {
            await dispatch(handleOrderRefundAsync(order._id)).unwrap()
            toast.success("Refund processed and stock updated successfully!")
            dispatch(sellerGetAllOrdersAsync())
            onClose()
        } catch (error) {
            toast.error(error || "Failed to process refund")
        } finally {
            setIsRefunding(false)
        }
    }

    const handleRefund = () => {
        toast((t) => (
            <div>
                <p className="font-bold mb-3 text-white">Are you sure you want to process refund and restock this order?</p>
                <div className="flex gap-3 justify-end">
                    <button 
                        onClick={() => toast.dismiss(t.id)}
                        className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white text-sm font-bold rounded-lg transition-colors"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={() => {
                            toast.dismiss(t.id)
                            executeRefund()
                        }}
                        className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white text-sm font-bold rounded-lg transition-colors shadow-[0_0_10px_rgba(22,163,74,0.4)]"
                    >
                        Yes, Refund
                    </button>
                </div>
            </div>
        ), { 
            duration: Infinity,
            style: { background: '#111', border: '1px solid #333' }
        })
    }

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/80 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="bg-[#111] border-2 border-gray-800 rounded-3xl w-full max-w-lg overflow-hidden shadow-[8px_8px_0px_#000]"
                >
                    <div className="p-6 border-b border-gray-800 flex justify-between items-center bg-[#0a0a0a]">
                        <h2 className="text-white font-black text-xl uppercase tracking-widest">Update Order</h2>
                        <button 
                            onClick={onClose}
                            className="p-2 bg-[#1a1a1a] hover:bg-[#ff007f] text-gray-400 hover:text-white rounded-full transition-colors border border-gray-800"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6 space-y-6">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Order Status</label>
                            <select 
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                className="w-full bg-[#1a1a1a] border-2 border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#ff007f] transition-colors appearance-none"
                            >
                                <option value="Processing">Processing</option>
                                <option value="Shipped">Shipped</option>
                                <option value="Delivered">Delivered</option>
                                <option value="Cancelled">Cancelled</option>
                                <option value="Returned">Returned</option>
                                <option value="Collected">Collected</option>
                                <option value="Refunded">Refunded</option>
                            </select>
                        </div>

                        {order.returnDetails && (
                            <div className="p-4 bg-[#1a1a1a] border border-gray-800 rounded-xl space-y-3">
                                <div className="flex items-center gap-2 mb-2 text-purple-500">
                                    <CreditCard size={18} />
                                    <h3 className="font-bold text-sm uppercase tracking-widest text-white">Refund Details</h3>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-sm text-gray-300"><span className="font-bold text-gray-500 uppercase tracking-widest text-xs">Reason:</span> {order.returnDetails.reason}</p>
                                    <p className="text-sm text-gray-300"><span className="font-bold text-gray-500 uppercase tracking-widest text-xs">Method:</span> {order.returnDetails.refundMethod}</p>
                                    {order.returnDetails.upiId && (
                                        <p className="text-sm text-white font-bold"><span className="font-bold text-gray-500 uppercase tracking-widest text-xs">UPI ID:</span> {order.returnDetails.upiId}</p>
                                    )}
                                    {order.returnDetails.bankDetails && order.returnDetails.bankDetails.accountNumber && (
                                        <div className="bg-[#111] p-3 rounded-lg border border-gray-800 space-y-1">
                                            <p className="text-sm text-white"><span className="text-gray-500 text-xs">Name:</span> {order.returnDetails.bankDetails.accountHolderName}</p>
                                            <p className="text-sm text-white"><span className="text-gray-500 text-xs">A/C:</span> {order.returnDetails.bankDetails.accountNumber}</p>
                                            <p className="text-sm text-white"><span className="text-gray-500 text-xs">IFSC:</span> {order.returnDetails.bankDetails.ifscCode}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        <div className="p-4 bg-[#1a1a1a] border border-gray-800 rounded-xl space-y-4">
                            <div className="flex items-center gap-2 mb-2 text-[#ff007f]">
                                <MapPin size={18} />
                                <h3 className="font-bold text-sm uppercase tracking-widest text-white">Live Tracking Details</h3>
                            </div>
                            
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Current Address / Location Name</label>
                                <input 
                                    type="text" 
                                    value={addressString}
                                    onChange={(e) => setAddressString(e.target.value)}
                                    placeholder="e.g., In transit at Mumbai Hub"
                                    className="w-full bg-[#111] border border-gray-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#ff007f] transition-colors text-sm"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Latitude</label>
                                    <input 
                                        type="number" 
                                        step="any"
                                        value={lat}
                                        onChange={(e) => setLat(e.target.value)}
                                        placeholder="28.6139"
                                        className="w-full bg-[#111] border border-gray-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#ff007f] transition-colors text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Longitude</label>
                                    <input 
                                        type="number" 
                                        step="any"
                                        value={lng}
                                        onChange={(e) => setLng(e.target.value)}
                                        placeholder="77.2090"
                                        className="w-full bg-[#111] border border-gray-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#ff007f] transition-colors text-sm"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            {status === 'Returned' && order.paymentStatus !== 'refunded' && (
                                <button 
                                    type="button"
                                    onClick={handleRefund}
                                    disabled={isRefunding || isSubmitting}
                                    className="flex-1 bg-green-600 text-white py-4 rounded-xl font-black uppercase tracking-widest text-sm flex items-center justify-center gap-2 hover:bg-transparent hover:text-green-600 border-2 border-green-600 transition-all disabled:opacity-50"
                                >
                                    {isRefunding ? 'Processing...' : <><RefreshCcw size={18} /> Refund & Restock</>}
                                </button>
                            )}

                            <button 
                                type="submit"
                                disabled={isSubmitting || isRefunding}
                                className="flex-1 bg-[#ff007f] text-white py-4 rounded-xl font-black uppercase tracking-widest text-sm flex items-center justify-center gap-2 hover:bg-transparent hover:text-[#ff007f] border-2 border-[#ff007f] transition-all disabled:opacity-50"
                            >
                                {isSubmitting ? 'Saving...' : <><Save size={18} /> Save Changes</>}
                            </button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </AnimatePresence>
    )
}

export default OrderManagementModal
