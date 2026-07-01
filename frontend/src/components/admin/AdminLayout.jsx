import React, { useEffect } from "react"
import { Outlet, useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"
import AdminSidebar from "./AdminSidebar"
import AdminTopbar from "./AdminTopbar"

const AdminLayout = () => {
  const { user, isAuthenticated } = useSelector((state) => state.auth)
  const navigate = useNavigate()
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false)

  useEffect(() => {
    // Protect Route
    if (!isAuthenticated) {
      navigate("/login")
    } else if (user?.role !== "admin" && user?.role !== "seller") {
      navigate("/")
    }
  }, [isAuthenticated, user, navigate])

  if (!isAuthenticated || (user?.role !== "admin" && user?.role !== "seller")) {
    return null
  }

  return (
    <div className="min-h-screen bg-[#111] text-white selection:bg-[#ff007f] selection:text-white font-sans">
      <AdminSidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      <div className="flex flex-col min-h-screen">
        <AdminTopbar setIsSidebarOpen={setIsSidebarOpen} />

        {/* Main Content Area */}
        <main className="flex-1 lg:ml-64 p-4 md:p-8 overflow-y-auto mt-20 lg:mt-0">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default AdminLayout
