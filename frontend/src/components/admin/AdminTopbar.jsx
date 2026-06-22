import React, { useState, useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import { Bell, AlertTriangle, Menu } from 'lucide-react'
import { getAdminDashboardStats } from '../../services/dashboard.service'

const AdminTopbar = ({ setIsSidebarOpen }) => {
    const { user } = useSelector((state) => state.auth)
    const [isNotificationOpen, setIsNotificationOpen] = useState(false)
    const [lowStockProducts, setLowStockProducts] = useState([])
    const [hasReadNotifications, setHasReadNotifications] = useState(false)
    const dropdownRef = useRef(null)

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await getAdminDashboardStats()
                setLowStockProducts(response?.lowStockProducts || [])
            } catch (error) {
                console.error("Failed to fetch notifications")
            }
        }
        fetchStats()

        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsNotificationOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    return (
        <div className="h-20 bg-[#0a0a0a] border-b-2 border-gray-800 flex items-center justify-between px-4 md:px-8 lg:ml-64 fixed top-0 left-0 right-0 z-30">
            {/* Mobile Menu Toggle */}
            <button 
                onClick={() => setIsSidebarOpen(true)}
                className="lg:hidden p-2 text-gray-400 hover:text-white"
            >
                <Menu size={24} />
            </button>

            <div className="flex-1"></div>

            {/* Profile & Actions */}
            <div className="flex items-center gap-4 md:gap-6 ml-auto relative">
                <div ref={dropdownRef} className="relative sm:static">
                    <button 
                        onClick={() => {
                            setIsNotificationOpen(!isNotificationOpen);
                            setHasReadNotifications(true);
                        }}
                        className="relative p-2 text-gray-400 hover:text-white transition-colors"
                    >
                        <Bell size={20} />
                        {!hasReadNotifications && lowStockProducts.length > 0 && (
                            <span className="absolute top-1 right-1 w-2 h-2 bg-[#ff007f] rounded-full animate-pulse"></span>
                        )}
                    </button>

                    {/* Notification Dropdown */}
                    {isNotificationOpen && (
                        <div className="fixed top-20 left-4 right-4 sm:absolute sm:inset-auto sm:right-0 sm:top-full sm:mt-2 sm:w-80 bg-[#111] border-2 border-gray-800 rounded-2xl shadow-[8px_8px_0px_#000] overflow-hidden z-50">
                            <div className="p-4 border-b border-gray-800 bg-[#1a1a1a]">
                                <h3 className="text-white font-bold uppercase tracking-widest text-sm">Notifications</h3>
                            </div>
                            <div className="max-h-96 overflow-y-auto">
                                {lowStockProducts.length > 0 ? (
                                    lowStockProducts.map(product => (
                                        <div key={product._id} className="p-4 border-b border-gray-800 hover:bg-[#1a1a1a] transition-colors flex gap-3 items-start">
                                            <div className="p-2 bg-red-500/10 text-red-500 rounded-lg shrink-0 mt-1">
                                                <AlertTriangle size={16} />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-white line-clamp-1">{product.productName}</p>
                                                <p className="text-xs text-red-500 font-black mt-1">Only {product.stock} left in stock!</p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="p-8 text-center text-gray-500 text-sm">
                                        No new notifications
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
                
                <div className="flex items-center gap-3 pl-6 border-l-2 border-gray-800">
                    <div className="text-right hidden sm:block">
                        <p className="text-white text-sm font-bold">{user?.name || 'Admin User'}</p>
                        <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">{user?.role || 'Admin'}</p>
                    </div>
                    <img 
                        src={user?.profileImage || "https://api.dicebear.com/7.x/avataaars/svg?seed=Admin"} 
                        alt="Admin Profile" 
                        className="w-10 h-10 rounded-full border-2 border-[#ff007f] object-cover bg-gray-800"
                    />
                </div>
            </div>
        </div>
    )
}

export default AdminTopbar
