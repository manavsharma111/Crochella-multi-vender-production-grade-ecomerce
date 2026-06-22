import React, { useState, useRef, useEffect } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useSelector, useDispatch } from 'react-redux'
import { logoutUser } from '../../redux/slices/authSlice'
import {
    LayoutDashboard, Package, RotateCcw, ClipboardList,
    LogOut, Truck, ChevronLeft, ChevronRight, Menu, X
} from 'lucide-react'

const MENU_ITEMS = [
    { text: 'Dashboard', path: '/delivery/dashboard', icon: <LayoutDashboard size={20} /> },
    { text: 'Available Orders', path: '/delivery/orders', icon: <Package size={20} /> },
    { text: 'Return Pickups', path: '/delivery/returns', icon: <RotateCcw size={20} /> },
    { text: 'My Deliveries', path: '/delivery/my-deliveries', icon: <ClipboardList size={20} /> },
]

const DeliverySidebar = ({ isCollapsed, setIsCollapsed, isMobileOpen, setIsMobileOpen }) => {
    const { user } = useSelector((state) => state.auth)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const username = user?.name || 'Delivery Boy'
    const initial = username.charAt(0).toUpperCase()

    const handleLogout = () => {
        dispatch(logoutUser())
        localStorage.removeItem('token')
        navigate('/login')
        setIsMobileOpen(false)
    }

    const handleNavigate = (path) => {
        navigate(path)
        setIsMobileOpen(false)
    }

    useEffect(() => {
        document.body.style.overflow = isMobileOpen ? 'hidden' : 'auto'
        return () => { document.body.style.overflow = 'auto' }
    }, [isMobileOpen])

    return (
        <>
            {/* Mobile Overlay */}
            <AnimatePresence>
                {isMobileOpen && (
                    <motion.div 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 lg:hidden" 
                        onClick={() => setIsMobileOpen(false)}
                    />
                )}
            </AnimatePresence>
            

            {/* Main Sidebar (Desktop + Mobile) */}
            <motion.aside
                className={`flex flex-col fixed top-0 left-0 bottom-0 z-50 transform ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-transform duration-300 ${isCollapsed ? 'w-20' : 'w-64'}`}
                animate={{ width: isCollapsed ? 80 : 256 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
            >
                <div className="bg-[#0a0a0a] border-r-2 border-gray-800 shadow-md h-full flex flex-col">
                    {/* Logo */}
                    <div className={`flex items-center justify-between p-5 border-b-2 border-gray-800 ${isCollapsed ? 'justify-center' : ''}`}>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-linear-to-br from-[#ff007f] to-purple-600 flex items-center justify-center shadow-[0_0_15px_rgba(255,0,127,0.3)] shrink-0">
                                <Truck size={20} className="text-white" />
                            </div>
                            <AnimatePresence initial={false}>
                                {!isCollapsed && (
                                    <motion.div
                                        initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}
                                        transition={{ duration: 0.18 }}
                                    >
                                        <p className="text-sm font-black text-white tracking-wide">Delivery Boy</p>
                                        <p className="text-xs text-[#ff007f] font-bold">Dashboard</p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                        <button 
                            onClick={() => setIsMobileOpen(false)} 
                            className="lg:hidden text-gray-400 hover:text-white transition-colors"
                        >
                            <X size={24} />
                        </button>
                    </div>

                    {/* User Profile */}
                    <div className={`p-4 border-b-2 border-gray-800 ${isCollapsed ? 'px-3' : 'px-6'}`}>
                        <div className={`flex gap-3 ${isCollapsed ? 'justify-center' : 'items-center'}`}>
                            <div className="w-11 h-11 rounded-xl bg-linear-to-br from-[#ff007f] to-purple-600 flex items-center justify-center text-white font-bold text-lg shrink-0 shadow-[0_0_15px_rgba(255,0,127,0.3)]">
                                {initial}
                            </div>
                            <AnimatePresence initial={false}>
                                {!isCollapsed && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
                                        transition={{ duration: 0.18 }} className="min-w-0"
                                    >
                                        <p className="text-sm font-semibold text-white truncate">{username}</p>
                                        <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Delivery Partner</p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* Nav */}
                    <nav className="p-2 flex-1 overflow-y-auto">
                        <ul className="space-y-1 px-2">
                            {MENU_ITEMS.map((item) => (
                                <motion.li key={item.text} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                                    <NavLink
                                        to={item.path}
                                        onClick={() => setIsMobileOpen(false)}
                                        className={({ isActive }) =>
                                            `flex items-center gap-3 py-3 rounded-xl font-bold transition-all duration-200 ${isCollapsed ? 'justify-center px-2' : 'px-4'} ${isActive
                                                ? 'bg-[#ff007f] text-white shadow-[4px_4px_0px_#000]'
                                                : 'text-gray-400 hover:bg-[#111] hover:text-white'
                                            }`
                                        }
                                    >
                                        <span>{item.icon}</span>
                                        <AnimatePresence initial={false}>
                                            {!isCollapsed && (
                                                <motion.span
                                                    initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                                                    exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.16 }}
                                                    className="text-sm"
                                                >
                                                    {item.text}
                                                </motion.span>
                                            )}
                                        </AnimatePresence>
                                    </NavLink>
                                </motion.li>
                            ))}
                        </ul>
                    </nav>

                    {/* Footer */}
                    <div className={`border-t-2 border-gray-800 p-4 ${isCollapsed ? 'px-3' : 'px-6'} space-y-2 relative`}>
                        <button
                            onClick={() => setIsCollapsed(prev => !prev)}
                            className="hidden lg:flex absolute -right-3 top:-5rem z-20 w-6 h-6 bg-[#1a1a1a] border border-gray-700 rounded-full items-center justify-center text-gray-400 hover:text-white hover:border-[#ff007f] hover:bg-[#ff007f] transition-all shadow-[0_0_10px_rgba(0,0,0,0.5)]"
                        >
                            {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
                        </button>
                        <motion.button
                            onClick={handleLogout}
                            className={`flex items-center gap-3 py-2 rounded-xl font-bold text-gray-400 hover:text-red-500 w-full transition-all ${isCollapsed ? 'justify-center' : ''}`}
                            whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
                        >
                            <LogOut size={18} className="shrink-0" />
                            <AnimatePresence initial={false}>
                                {!isCollapsed && (
                                    <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-sm">
                                        Logout
                                    </motion.span>
                                )}
                            </AnimatePresence>
                        </motion.button>
                    </div>
                </div>
            </motion.aside>
        </>
    )
}

export default DeliverySidebar
