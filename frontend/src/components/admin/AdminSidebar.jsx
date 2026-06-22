import React from 'react'
import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Package, ShoppingCart, Users, Ticket, MessageSquare, LogOut, Truck } from 'lucide-react'

const AdminSidebar = ({ isOpen, setIsOpen }) => {
    const navItems = [
        { path: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { path: '/admin/products', icon: Package, label: 'Products' },
        { path: '/admin/orders', icon: ShoppingCart, label: 'Orders' },
        { path: '/admin/users', icon: Users, label: 'Users' },
        { path: '/admin/delivery-staff', icon: Truck, label: 'Delivery Staff' },
        { path: '/admin/reviews', icon: MessageSquare, label: 'Reviews' },
        { path: '/admin/coupons', icon: Ticket, label: 'Coupons' }
    ]

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div 
                    className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 lg:hidden" 
                    onClick={() => setIsOpen(false)}
                />
            )}

            <div className={`w-64 h-screen bg-[#0a0a0a] border-r-2 border-gray-800 flex flex-col fixed left-0 top-0 z-50 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-transform duration-300`}>
                {/* Logo */}
                <div className="h-20 flex items-center justify-between px-6 border-b-2 border-gray-800">
                    <span className="text-2xl font-black text-white uppercase tracking-widest">
                        Neo<span className="text-[#ff007f]">Admin</span>
                    </span>
                    <button 
                        onClick={() => setIsOpen(false)} 
                        className="lg:hidden text-gray-400 hover:text-white"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                </div>

                {/* Nav Links */}
                <div className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 px-2">Main Menu</p>
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            onClick={() => setIsOpen(false)} // Close on navigation in mobile
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${
                                    isActive 
                                    ? 'bg-[#ff007f] text-white shadow-[4px_4px_0px_#000]' 
                                    : 'text-gray-400 hover:bg-[#111] hover:text-white'
                                }`
                            }
                        >
                            <item.icon size={20} />
                            <span className="text-sm tracking-wide">{item.label}</span>
                        </NavLink>
                    ))}
                </div>

                {/* Bottom Actions */}
                <div className="p-4 border-t-2 border-gray-800">
                    <NavLink to="/" className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white transition-colors">
                        <LogOut size={20} />
                        <span className="text-sm font-bold tracking-wide">Back to Store</span>
                    </NavLink>
                </div>
            </div>
        </>
    )
}

export default AdminSidebar
