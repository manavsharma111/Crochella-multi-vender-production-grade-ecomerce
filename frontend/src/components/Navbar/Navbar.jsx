import React, { useState, useEffect, useRef } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import {
  Home,
  Search,
  ShoppingBag,
  User,
  ShoppingCart,
  Heart,
  ChevronUp,
} from "lucide-react"
import AuthDropdown from "../Auth/Auth"

const navItems = [
  { id: "home", label: "Home", icon: Home, path: "/" },
  { id: "shop", label: "Shop", icon: ShoppingBag, path: "/shop" },
  { id: "cart", label: "Cart", icon: ShoppingCart, path: "/cart" },
  { id: "wishlist", label: "Wishlist", icon: Heart, path: "/wishlist" },
  { id: "user", label: "Account", icon: User, path: null },
]

export default function Navbar() {
  const location = useLocation()
  const navigate = useNavigate()

  const [activeTab, setActiveTab] = useState("home")
  const [dropdownOpen, setDropdownOpen] = useState(false)

  // Remember which tab was active before opening Account dropdown
  const prevTab = useRef("home")

  // Detect mobile vs desktop
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth < 768 : false,
  )
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener("resize", handler)
    return () => window.removeEventListener("resize", handler)
  }, [])

  // Track which item is "lit" on desktop via hover
  const [hoveredTab, setHoveredTab] = useState(null)

  // Timers for desktop hover intent
  const openT = useRef(null)
  const closeT = useRef(null)
  const clearT = () => {
    clearTimeout(openT.current)
    clearTimeout(closeT.current)
  }

  // Sync pill with route
  useEffect(() => {
    if (location.pathname.includes("/profile")) {
      setActiveTab("user")
      return
    }
    const m = navItems.find((i) => i.path && i.path === location.pathname)
    if (m) {
      setActiveTab(m.id)
      prevTab.current = m.id
    }
  }, [location.pathname])

  // Close dropdown on route change
  useEffect(() => {
    setDropdownOpen(false)
  }, [location.pathname])

  // Desktop mouse handlers
  const desktopMouseEnter = (id) => {
    clearT()
    setHoveredTab(id)
    if (id === "user") {
      // 300ms intent gate — brief flyovers don't open it
      openT.current = setTimeout(() => setDropdownOpen(true), 300)
    } else {
      // Moving to another item closes dropdown
      closeT.current = setTimeout(() => setDropdownOpen(false), 100)
    }
  }

  const desktopMouseLeave = () => {
    clearT()
    closeT.current = setTimeout(() => {
      setHoveredTab(null)
      setDropdownOpen(false)
    }, 250) // enough time to move cursor to dropdown card
  }

  const dropdownMouseEnter = () => {
    clearT() // cancel the pending close — user is now on the card
  }

  const dropdownMouseLeave = () => {
    clearT()
    closeT.current = setTimeout(() => {
      setHoveredTab(null)
      setDropdownOpen(false)
    }, 150)
  }

  // Click / Tap handlers
  const handleMobileTap = (item) => {
    if (item.id === "user") {
      setDropdownOpen((p) => !p)
    } else {
      setDropdownOpen(false)
      navigate(item.path)
    }
  }

  const handleDesktopClick = (item) => {
    if (item.id === "user") {
      clearT()
      setDropdownOpen((p) => !p)
    } else {
      setDropdownOpen(false)
      navigate(item.path)
    }
  }

  const getPillActive = (id) => {
    if (isMobile) {
      // On mobile, keep the route tab lit unless dropdown is open
      if (dropdownOpen) return id === "user"
      return activeTab === id
    } else {
      // On desktop, prioritize dropdown, then hover, then active route
      if (dropdownOpen) return id === "user"
      if (hoveredTab) return hoveredTab === id
      return activeTab === id
    }
  }

  return (
    <>
      {/* Mobile backdrop (ONLY on mobile)*/}
      <AnimatePresence>
        {dropdownOpen && isMobile && (
          <motion.div
            key="mob-backdrop"
            className="fixed inset-0 z-40 bg-black/50 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onPointerDown={() => {
              setActiveTab(prevTab.current)
              setDropdownOpen(false)
            }}
          />
        )}
      </AnimatePresence>

      {/* Navbar container */}
      <div className="fixed bottom-6 md:bottom-auto md:top-8 left-1/2 -translate-x-1/2 z-50 flex justify-center select-none">
        {/* Pill bar */}
        <nav
          onMouseLeave={isMobile ? undefined : desktopMouseLeave}
          className="flex items-center p-2 gap-0.5 bg-black/60 backdrop-blur-2xl rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.6)] border border-white/10"
        >
          {navItems.map((item) => {
            const isLit = getPillActive(item.id)
            const Icon = item.icon

            return (
              <button
                key={item.id}
                type="button"
                // Mobile: instant pointer response
                onPointerDown={
                  isMobile ? () => handleMobileTap(item) : undefined
                }
                // Desktop: click + hover
                onClick={!isMobile ? () => handleDesktopClick(item) : undefined}
                onMouseEnter={
                  !isMobile ? () => desktopMouseEnter(item.id) : undefined
                }
                className="relative flex items-center justify-center px-3 py-2.5 md:px-4 rounded-full outline-none"
                style={{
                  WebkitTapHighlightColor: "transparent",
                  touchAction: "manipulation",
                }}
              >
                {/* Pill glow */}
                <AnimatePresence>
                  {isLit && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 rounded-full bg-white/15"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{
                        type: "spring",
                        bounce: 0.1,
                        duration: 0.4,
                      }}
                    />
                  )}
                </AnimatePresence>

                <span
                  className={`relative z-10 flex items-center gap-2 transition-colors duration-200 ${isLit ? "text-white" : "text-gray-400"}`}
                >
                  <Icon size={19} strokeWidth={isLit ? 2.5 : 1.8} />

                  {/* Desktop label */}
                  <motion.span
                    initial={false}
                    animate={{
                      width: isLit ? "auto" : 0,
                      opacity: isLit ? 1 : 0,
                    }}
                    transition={{ type: "spring", bounce: 0.1, duration: 0.35 }}
                    className="hidden md:block overflow-hidden whitespace-nowrap text-sm font-semibold tracking-wide"
                  >
                    {item.label}
                  </motion.span>

                  {/* Chevron for User — desktop only */}
                  {item.id === "user" && (
                    <motion.span
                      animate={{ rotate: dropdownOpen ? 0 : 180 }}
                      transition={{
                        type: "spring",
                        bounce: 0.2,
                        duration: 0.35,
                      }}
                      className="hidden md:block"
                    >
                      <ChevronUp size={13} strokeWidth={2} />
                    </motion.span>
                  )}
                </span>
              </button>
            )
          })}
        </nav>

        {/*Auth Dropdown */}
        <AnimatePresence>
          {dropdownOpen && (
            <motion.div
              key="auth-card"
              onMouseEnter={!isMobile ? dropdownMouseEnter : undefined}
              onMouseLeave={!isMobile ? dropdownMouseLeave : undefined}
              initial={{ opacity: 0, y: 10, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.96 }}
              transition={{ type: "spring", bounce: 0.15, duration: 0.4 }}
              className={[
                "z-50 bg-[#0c0c0d] border border-white/10 rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.8)] overflow-hidden",
                // Mobile: fixed, centered above navbar
                "fixed bottom-24 left-1/2 -translate-x-1/2 w-[calc(100vw-32px)] max-w-[500px]",
                // Desktop: absolute below the pill bar, right-aligned
                "md:absolute md:fixed-none md:bottom-auto md:left-auto md:translate-x-0 md:right-0 md:top-full md:mt-3 md:w-[500px]",
              ].join(" ")}
            >
              <AuthDropdown />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  )
}
