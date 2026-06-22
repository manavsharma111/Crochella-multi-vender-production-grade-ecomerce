import { useState } from 'react'
import { Package, Truck, CheckCircle, XCircle, ArrowRight, CornerDownLeft, Download, Banknote, MapPin } from 'lucide-react'
import { useDispatch } from 'react-redux'
import { cancelOrderNotDeliveredAsync, returnOrderAfterDeliveryAsync } from '../../redux/slices/orderSlice'
import { rateDeliveryBoy } from '../../services/delivery.service'
import toast from 'react-hot-toast'
import OrderTrackingModal from './OrderTrackingModal'
import ReturnReasonModal from './ReturnReasonModal'
import ConfirmModal from '../common/Modals/ConfirmModal'
import DeliveryRatingModal from './DeliveryRatingModal'

const OrderCard = ({ order, onRefresh }) => {
    const dispatch = useDispatch()
    const [isCancelling, setIsCancelling] = useState(false)
    const [isTrackingOpen, setIsTrackingOpen] = useState(false)
    const [isReturnModalOpen, setIsReturnModalOpen] = useState(false)
    const [isCancelModalOpen, setIsCancelModalOpen] = useState(false)
    const [isRatingModalOpen, setIsRatingModalOpen] = useState(false)
    const [isRated, setIsRated] = useState(false)
    const [isSubmittingRating, setIsSubmittingRating] = useState(false)

    const handleRatingSubmit = async (rating) => {
        setIsSubmittingRating(true)
        try {
            await rateDeliveryBoy(order.deliveryBoyId, rating)
            toast.success('Thank you for your rating!')
            setIsRated(true)
            setIsRatingModalOpen(false)
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to submit rating')
        } finally {
            setIsSubmittingRating(false)
        }
    }

    const getStatusColor = (status) => {
        switch (status) {
            case 'Processing': return 'text-yellow-500 border-yellow-500 bg-yellow-500/10'
            case 'Shipped': return 'text-blue-500 border-blue-500 bg-blue-500/10'
            case 'Delivered': return 'text-[#00ff88] border-[#00ff88] bg-[#00ff88]/10'
            case 'Cancelled': return 'text-red-500 border-red-500 bg-red-500/10'
            case 'Returned': return 'text-purple-500 border-purple-500 bg-purple-500/10'
            case 'Collected': return 'text-indigo-500 border-indigo-500 bg-indigo-500/10'
            case 'Refunded': return 'text-teal-500 border-teal-500 bg-teal-500/10'
            default: return 'text-gray-500 border-gray-500 bg-gray-500/10'
        }
    }

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Processing': return <Package size={16} />
            case 'Shipped': return <Truck size={16} />
            case 'Delivered': return <CheckCircle size={16} />
            case 'Cancelled': return <XCircle size={16} />
            case 'Returned': return <CornerDownLeft size={16} />
            case 'Collected': return <MapPin size={16} />
            case 'Refunded': return <Banknote size={16} />
            default: return <Package size={16} />
        }
    }

    const handleCancel = () => {
        setIsCancelModalOpen(true)
    }

    const executeCancel = async () => {
        setIsCancelling(true)
        try {
            await dispatch(cancelOrderNotDeliveredAsync(order._id)).unwrap()
            toast.success("Order Cancelled Successfully")
            onRefresh()
        } catch (err) {
            toast.error(err || "Failed to cancel order")
        } finally {
            setIsCancelling(false)
        }
    }

    const handleReturn = async (returnData) => {
        setIsCancelling(true)
        try {
            await dispatch(returnOrderAfterDeliveryAsync({ 
                id: order._id, 
                returnData: returnData 
            })).unwrap()
            toast.success("Return Request Submitted")
            onRefresh()
        } catch (err) {
            toast.error(err || "Failed to request return")
        } finally {
            setIsCancelling(false)
        }
    }

    const handleDownloadInvoice = () => {
        const token = localStorage.getItem('token')
        fetch(`${import.meta.env.VITE_BACKEND_URL}/order/invoice/${order._id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(response => {
            if (!response.ok) throw new Error('Failed to download invoice')
            return response.blob()
        })
        .then(blob => {
            const url = window.URL.createObjectURL(new Blob([blob]))
            const link = document.createElement('a')
            link.href = url
            link.setAttribute('download', `Invoice-${order._id.slice(-6)}.pdf`)
            document.body.appendChild(link)
            link.click()
            link.parentNode.removeChild(link)
        })
        .catch(error => {
            console.error('Error downloading invoice:', error)
            toast.error("Failed to download invoice")
        })
    }

    return (
        <>
            <div className="bg-[#1a1a1a] border-2 border-gray-800 rounded-2xl p-6 shadow-[4px_4px_0px_#000] mb-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 border-b border-gray-800 pb-4">
                    <div>
                        <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-1">Order ID: {order._id.substring(0, 8).toUpperCase()}</p>
                        <p className="text-gray-400 text-xs">Placed: {new Date(order.createdAt).toLocaleDateString()}</p>
                        {order.orderStatus !== 'Delivered' && order.orderStatus !== 'Cancelled' && order.orderStatus !== 'Returned' && order.orderStatus !== 'Collected' && order.orderStatus !== 'Refunded' && order.estimatedDeliveryDate && (
                            <p className="text-[#ff007f] text-xs font-bold mt-1">Est. Delivery: {new Date(order.estimatedDeliveryDate).toLocaleDateString()}</p>
                        )}
                    </div>
                    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border ${getStatusColor(order.orderStatus)}`}>
                        {getStatusIcon(order.orderStatus)}
                        <span className="text-xs font-black uppercase tracking-widest">{order.orderStatus}</span>
                    </div>
                </div>

                <div className="space-y-4 mb-6">
                    {order.products.map((item, idx) => {
                        const product = item.productId || {}
                        const media = Array.isArray(product.media) && product.media.length > 0 ? product.media[0].url : 'https://via.placeholder.com/50'
                        return (
                            <div key={idx} className="flex items-center gap-4">
                                <img src={media} alt={product.productName} className="w-16 h-16 rounded-lg object-cover border border-gray-700" />
                                <div className="flex-1">
                                    <h4 className="text-white font-bold text-sm line-clamp-1">{product.productName}</h4>
                                    <p className="text-gray-500 text-xs mt-1">Qty: {item.quantity}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-white font-bold">₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
                                </div>
                            </div>
                        )
                    })}
                </div>

                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-4 border-t border-gray-800">
                    <div>
                        <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Total Amount</p>
                        <p className="text-[#ff007f] font-black text-xl flex items-baseline gap-2">
                            ₹{order.totalPrice.toLocaleString('en-IN')}
                            <span className="text-[10px] bg-white/10 text-white px-2 py-0.5 rounded uppercase tracking-widest">{order.paymentMethod || 'COD'}</span>
                        </p>
                    </div>
                    
                    <div className="flex gap-2 w-full sm:w-auto">
                        {(order.orderStatus === 'Processing' || order.orderStatus === 'Shipped') && (
                            <button 
                                onClick={handleCancel}
                                disabled={isCancelling}
                                className="flex-1 sm:flex-none px-4 py-2 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white border border-red-500 rounded-lg text-xs font-black uppercase tracking-widest transition-colors"
                            >
                                Cancel
                            </button>
                        )}

                        {order.orderStatus === 'Delivered' && (
                            <button 
                                onClick={() => setIsReturnModalOpen(true)}
                                disabled={isCancelling}
                                className="flex-1 sm:flex-none px-4 py-2 bg-purple-500/10 text-purple-500 hover:bg-purple-500 hover:text-white border border-purple-500 rounded-lg text-xs font-black uppercase tracking-widest transition-colors"
                            >
                                Return
                            </button>
                        )}

                        {(order.orderStatus === 'Delivered' || order.orderStatus === 'Collected') && order.deliveryBoyId && !isRated && (
                            <button 
                                onClick={() => setIsRatingModalOpen(true)}
                                className="flex-1 sm:flex-none px-4 py-2 bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500 hover:text-white border border-yellow-500 rounded-lg text-xs font-black uppercase tracking-widest transition-colors"
                            >
                                Rate Delivery
                            </button>
                        )}

                        <button 
                            onClick={handleDownloadInvoice}
                            className="flex-1 sm:flex-none px-3 py-2 bg-gray-800 text-white rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors flex items-center justify-center"
                            title="Download Invoice"
                        >
                            <Download size={16} />
                        </button>
                        <button 
                            onClick={() => setIsTrackingOpen(true)}
                            className="flex-1 sm:flex-none px-4 py-2 bg-[#ff007f] text-white rounded-lg text-xs font-black uppercase tracking-widest border-2 border-[#ff007f] hover:bg-transparent hover:text-[#ff007f] transition-colors flex items-center justify-center gap-2"
                        >
                            Track Order <ArrowRight size={14} />
                        </button>
                    </div>
                </div>
            </div>

            <OrderTrackingModal 
                orderId={order._id} 
                isOpen={isTrackingOpen} 
                onClose={() => setIsTrackingOpen(false)} 
            />

            <ConfirmModal 
                isOpen={isCancelModalOpen}
                onClose={() => setIsCancelModalOpen(false)}
                onConfirm={executeCancel}
                title="Cancel Order?"
                message="Are you sure you want to cancel this order? This action cannot be undone."
                confirmText="Yes, Cancel"
                cancelText="No, Keep It"
                isDanger={true}
            />

            <ReturnReasonModal 
                isOpen={isReturnModalOpen} 
                onClose={() => setIsReturnModalOpen(false)} 
                onSubmit={handleReturn} 
                paymentMethod={order.paymentMethod}
            />

            <DeliveryRatingModal
                isOpen={isRatingModalOpen}
                onClose={() => setIsRatingModalOpen(false)}
                onSubmit={handleRatingSubmit}
                isSubmitting={isSubmittingRating}
            />
        </>
    )
}

export default OrderCard
