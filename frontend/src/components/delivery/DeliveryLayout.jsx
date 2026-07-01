import React, { useEffect, useState } from "react"
import { Outlet, useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"
import DeliverySidebar from "./DeliverySidebar"
import DeliveryTopbar from "./DeliveryTopbar"

const DeliveryLayout = () => {
  const { user, isAuthenticated, isLoading } = useSelector(
    (state) => state.auth,
  )
  const navigate = useNavigate()

  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      navigate("/login")
    } else if (!isLoading && isAuthenticated && user?.role !== "delivery_boy") {
      navigate("/")
    }
  }, [isAuthenticated, user, isLoading, navigate])

  const token = localStorage.getItem("token")
  if (!token) return null
  if (!isAuthenticated || user?.role !== "delivery_boy") return null

  return (
    <div className="min-h-screen bg-[#111] text-white selection:bg-[#ff007f] selection:text-white font-sans">
      <DeliverySidebar
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
      />
      <div
        className={`flex flex-col min-h-screen transition-all duration-300 ${isCollapsed ? "lg:ml-20" : "lg:ml-64"}`}
      >
        <DeliveryTopbar
          isCollapsed={isCollapsed}
          setIsMobileOpen={setIsMobileOpen}
        />
        <main className="flex-1 p-4 md:p-6 pt-20 md:pt-20">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default DeliveryLayout
