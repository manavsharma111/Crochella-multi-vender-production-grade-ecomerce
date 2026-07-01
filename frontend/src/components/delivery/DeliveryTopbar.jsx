import React, { useState, useEffect, useRef } from "react"
import { useSelector, useDispatch } from "react-redux"
import { Bell, Truck, LogOut, ChevronDown, Menu } from "lucide-react"
import { useNavigate, useLocation } from "react-router-dom"
import { logoutUser } from "../../redux/slices/authSlice"
import { motion, AnimatePresence } from "framer-motion"

const PAGE_TITLES = {
  "/delivery/dashboard": {
    title: "Corchella Delivery Boy Dashboard",
    emoji: "🛒",
  },
  "/delivery/orders": { title: "Available Orders", emoji: "📦" },
  "/delivery/returns": { title: "Return Pickups", emoji: "↩️" },
  "/delivery/my-deliveries": { title: "My Deliveries", emoji: "🗂️" },
}

const DeliveryTopbar = ({ isCollapsed, setIsMobileOpen }) => {
  const { user } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [notificationOpen, setNotificationOpen] = useState(false)
  const [hasReadNotifications, setHasReadNotifications] = useState(false)
  const [time, setTime] = useState(new Date())
  const dropdownRef = useRef(null)

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 60000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setNotificationOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const timeStr = time.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  })
  const dateStr = time.toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
  })
  const page = PAGE_TITLES[pathname] || { title: "Delivery Panel", emoji: "🛵" }
  const initial = user?.name?.[0]?.toUpperCase() || "D"
  const shortName = user?.name?.split(" ")[0] || "Delivery Boy"

  const handleLogout = () => {
    dispatch(logoutUser())
    localStorage.removeItem("token")
    navigate("/login")
    setDropdownOpen(false)
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 ${isCollapsed ? "lg:left-20" : "lg:left-64"} z-20 bg-[#0a0a0a]/95 backdrop-blur-sm border-b-2 border-gray-800 shadow-[0_4px_30px_rgba(0,0,0,0.5)] transition-all duration-300`}
    >
      <div className="flex items-center justify-between px-4 md:px-6 h-16">
        {/* Left — Mobile logo + Page title */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsMobileOpen(true)}
            className="lg:hidden p-2 -ml-2 text-gray-400 hover:text-white"
          >
            <Menu size={24} />
          </button>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-base">{page.emoji}</span>
              <h1 className="text-base font-black text-white tracking-wide">
                {page.title}
              </h1>
            </div>
            <p className="text-xs text-gray-500 hidden sm:block font-bold">
              {dateStr} &bull; {timeStr}
            </p>
          </div>
        </div>

        {/* Right — Status badge + Notification + User */}
        <div className="flex items-center gap-2 md:gap-3">
          {/* On Duty badge */}
          <div className="hidden md:flex items-center gap-1.5 bg-green-500/10 border border-green-500/20 text-green-500 px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-widest shadow-[0_0_10px_rgba(0,255,136,0.1)]">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_5px_#00ff88]"></span>
            On Duty
          </div>

          {/* Notification */}
          <div className="relative sm:static" ref={dropdownRef}>
            <button
              onClick={() => {
                setNotificationOpen(!notificationOpen)
                setHasReadNotifications(true)
              }}
              className="relative p-2 rounded-xl hover:bg-[#111] transition-colors border border-transparent hover:border-gray-800"
            >
              <Bell
                size={19}
                className="text-gray-400 hover:text-white transition-colors"
              />
              {!hasReadNotifications && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#ff007f] rounded-full ring-2 ring-[#0a0a0a] shadow-[0_0_5px_#ff007f]"></span>
              )}
            </button>

            <AnimatePresence>
              {notificationOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.15 }}
                  className="fixed top-16 left-4 right-4 sm:absolute sm:inset-auto sm:right-0 sm:top-full sm:mt-2 sm:w-80 bg-[#111] border-2 border-gray-800 rounded-2xl shadow-[8px_8px_0px_#000] overflow-hidden z-50"
                >
                  <div className="p-4 border-b border-gray-800 bg-[#1a1a1a]">
                    <h3 className="text-white font-bold uppercase tracking-widest text-sm">
                      Notifications
                    </h3>
                  </div>
                  <div className="p-8 text-center text-gray-500 text-sm">
                    No new notifications
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* User dropdown */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen((p) => !p)}
              className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl hover:bg-[#111] transition-colors border border-gray-800"
            >
              <div className="w-8 h-8 rounded-xl bg-linear-to-br from-[#ff007f] to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-[0_0_10px_rgba(255,0,127,0.3)]">
                {initial}
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-xs font-black text-white leading-tight max-w-[90px] truncate">
                  {shortName}
                </p>
                <p className="text-[10px] text-[#ff007f] font-bold uppercase tracking-wider leading-tight">
                  Delivery Partner
                </p>
              </div>
              <ChevronDown
                size={14}
                className={`text-gray-500 transition-transform hidden sm:block ${dropdownOpen ? "rotate-180" : ""}`}
              />
            </button>

            <AnimatePresence>
              {dropdownOpen && (
                <>
                  <motion.div
                    className="fixed inset-0 z-10"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setDropdownOpen(false)}
                  />
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-2 w-56 bg-[#0a0a0a] rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.8)] border border-gray-800 z-20 overflow-hidden"
                  >
                    {/* Profile header */}
                    <div className="px-4 py-4 bg-[#111] border-b border-gray-800">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-linear-to-br from-[#ff007f] to-purple-600 flex items-center justify-center text-white font-bold shadow-[0_0_10px_rgba(255,0,127,0.3)]">
                          {initial}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-black text-white truncate">
                            {user?.name || "Delivery Boy"}
                          </p>
                          <p className="text-[10px] text-[#ff007f] font-bold uppercase tracking-widest">
                            Delivery Partner
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* On duty status */}
                    <div className="px-4 py-3 flex items-center gap-2 border-b border-gray-800 bg-[#0a0a0a]">
                      <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_5px_#00ff88]"></span>
                      <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">
                        Currently On Duty
                      </span>
                    </div>

                    {/* Logout */}
                    <div className="p-2 bg-[#0a0a0a]">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-red-500 hover:bg-red-500/10 hover:text-red-400 rounded-xl transition-colors font-bold uppercase tracking-wide"
                      >
                        <LogOut size={16} />
                        Logout
                      </button>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  )
}

export default DeliveryTopbar
