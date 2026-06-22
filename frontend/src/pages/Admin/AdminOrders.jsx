import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { sellerGetAllOrdersAsync } from '../../redux/slices/orderSlice'
import { Search, MapPin, Package, Edit2 } from 'lucide-react'
import OrderManagementModal from './OrderManagementModal'
import LoadMoreButtons from '../../components/common/LoadMoreButtons'
import useDebounce from '../../hooks/useDebounce'

const AdminOrders = () => {
    const dispatch = useDispatch()
    const { orders, loading } = useSelector(state => state.order)
    const [searchTerm, setSearchTerm] = useState('')
    const debouncedSearchTerm = useDebounce(searchTerm, 500)
    const [selectedOrder, setSelectedOrder] = useState(null)
    const [visibleCount, setVisibleCount] = useState(6)

    useEffect(() => {
        dispatch(sellerGetAllOrdersAsync({ limit: visibleCount, search: debouncedSearchTerm }))
    }, [dispatch, visibleCount, debouncedSearchTerm])

    const getStatusColor = (status) => {
        switch (status) {
            case 'Processing': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
            case 'Shipped': return 'bg-blue-500/10 text-blue-500 border-blue-500/20'
            case 'Delivered': return 'bg-green-500/10 text-green-500 border-green-500/20'
            case 'Cancelled': return 'bg-red-500/10 text-red-500 border-red-500/20'
            case 'Returned': return 'bg-purple-500/10 text-purple-500 border-purple-500/20'
            case 'Collected': return 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20'
            case 'Refunded': return 'bg-teal-500/10 text-teal-500 border-teal-500/20'
            default: return 'bg-gray-500/10 text-gray-500 border-gray-500/20'
        }
    }

    const orderList = Array.isArray(orders) ? orders : (orders?.data || [])
    const totalCount = orders?.pagination?.total || orderList.length

    return (
        <div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <h1 className="text-3xl font-black text-white uppercase tracking-widest">Order Management</h1>
            </div>

            <div className="bg-[#1a1a1a] border-2 border-gray-800 rounded-3xl overflow-hidden">
                <div className="p-6 border-b border-gray-800 flex items-center justify-between">
                    <div className="relative w-full max-w-md">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                        <input 
                            type="text" 
                            placeholder="Search by Order ID or Customer Name..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-[#111] border border-gray-800 rounded-xl py-2.5 pl-12 pr-4 text-white focus:outline-none focus:border-[#ff007f] transition-colors"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-400">
                        <thead className="bg-[#111] text-xs uppercase font-bold text-gray-500 border-b border-gray-800">
                            <tr>
                                <th className="px-6 py-4">Order Details</th>
                                <th className="px-6 py-4">Customer</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Delivery Assigned</th>
                                <th className="px-6 py-4">Total</th>
                                <th className="px-6 py-4 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center">
                                        <div className="inline-block w-8 h-8 border-4 border-[#ff007f] border-t-transparent rounded-full animate-spin"></div>
                                    </td>
                                </tr>
                            ) : orderList.length > 0 ? (
                                orderList.map((order) => (
                                    <tr key={order._id} className="border-b border-gray-800/50 hover:bg-gray-800/20 transition-colors">
                                        <td className="px-6 py-4">
                                            <p className="text-white font-bold">{order._id.substring(0,8).toUpperCase()}</p>
                                            <p className="text-xs text-gray-500 mt-1">{new Date(order.createdAt).toLocaleDateString()}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-white font-bold">{order.userId?.name || 'Guest User'}</p>
                                            <p className="text-xs text-gray-500 mt-1">{order.userId?.email}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full border text-xs font-black uppercase tracking-widest inline-block ${getStatusColor(order.orderStatus)}`}>
                                                {order.orderStatus}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            {order.deliveryBoyId ? (
                                                <div>
                                                    <p className="text-white font-bold">{order.deliveryBoyId.name}</p>
                                                    <p className="text-xs text-gray-500 mt-1">{order.deliveryBoyId.phone}</p>
                                                </div>
                                            ) : (
                                                <p className="text-gray-500 italic text-xs">Unassigned</p>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="font-black text-white">₹{order.totalPrice?.toLocaleString('en-IN') || 0}</p>
                                            <p className="text-[10px] text-[#ff007f] font-bold tracking-widest uppercase mt-1">{order.paymentMethod || 'COD'}</p>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button 
                                                onClick={() => setSelectedOrder(order)}
                                                className="inline-flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-[#ff007f] text-white rounded-lg text-xs font-bold transition-colors"
                                            >
                                                <Edit2 size={14} /> Update
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                                        No orders found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                
                <div className="p-4 border-t border-gray-800">
                    <LoadMoreButtons 
                        visibleCount={visibleCount} 
                        totalCount={totalCount} 
                        setVisibleCount={setVisibleCount} 
                        step={6} 
                    />
                </div>
            </div>

            {selectedOrder && (
                <OrderManagementModal 
                    order={selectedOrder} 
                    onClose={() => setSelectedOrder(null)} 
                />
            )}
        </div>
    )
}

export default AdminOrders
