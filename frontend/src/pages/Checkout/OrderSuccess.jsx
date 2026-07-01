import React, { useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useParams, useNavigate } from "react-router-dom"
import { getLiveTrackingAsync } from "../../redux/slices/orderSlice"
import {
  CheckCircle2,
  Package,
  Truck,
  MapPin,
  ArrowLeft,
  Download,
  Banknote,
} from "lucide-react"
import Reveal from "../../components/common/animation/Reveal"
import LiveTrackingMap from "./Livetracking"

const OrderSuccess = () => {
  const { orderId } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const { order, loading } = useSelector((state) => state.order)

  useEffect(() => {
    if (orderId) {
      dispatch(getLiveTrackingAsync(orderId))

      // Set up polling for live tracking every 10 seconds if order is out for delivery
      const interval = setInterval(() => {
        dispatch(getLiveTrackingAsync(orderId))
      }, 10000)

      return () => clearInterval(interval)
    }
  }, [orderId, dispatch])

  const handleDownloadInvoice = () => {
    const token = localStorage.getItem("token")
    fetch(`${import.meta.env.VITE_BACKEND_URL}/order/invoice/${orderId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) throw new Error("Failed to download invoice")
        return response.blob()
      })
      .then((blob) => {
        const url = window.URL.createObjectURL(new Blob([blob]))
        const link = document.createElement("a")
        link.href = url
        link.setAttribute("download", `Invoice-${orderId.slice(-6)}.pdf`)
        document.body.appendChild(link)
        link.click()
        link.parentNode.removeChild(link)
      })
      .catch((error) => {
        console.error("Error downloading invoice:", error)
      })
  }

  // If still loading initially and no order data
  if (loading && !order) {
    return (
      <div className="min-h-screen pt-32 pb-20 px-4 flex items-center justify-center bg-[#050505]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#ff007f]"></div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="min-h-screen pt-32 pb-20 px-4 flex items-center justify-center bg-[#050505]">
        <p className="text-white">Order not found.</p>
      </div>
    )
  }

  const { deliveryLocation, deliveryBoyId, orderStatus } = order

  // Default coordinates (e.g. India center) if not available
  // GeoJSON is [lng, lat], Leaflet is [lat, lng]
  const mapCenter =
    deliveryLocation?.coordinates && deliveryLocation.coordinates.length === 2
      ? [deliveryLocation.coordinates[1], deliveryLocation.coordinates[0]]
      : [20.5937, 78.9629]

  return (
    <div className="relative z-10 min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8 bg-[#050505] overflow-hidden">
      {/* Edgy background effects */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-[#00ff88]/5 blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-[#ff007f]/5 blur-[120px]"></div>
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay"></div>
      </div>

      <div className="max-w-5xl mx-auto space-y-8 relative z-10">
        {/* Header Progress Bar - Complete State */}
        <Reveal>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8 border-b border-white/10 pb-6">
            <div className="flex items-center gap-4">
              <h1 className="text-white font-black text-3xl uppercase tracking-tighter">
                <span className="text-[#00ff88]">Order</span> Successful
              </h1>
            </div>

            <div className="flex items-center gap-2 md:gap-6 text-sm font-bold uppercase tracking-widest text-gray-500 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
              <div className="flex items-center gap-2 text-white shrink-0">
                <span className="w-6 h-6 rounded-full bg-[#00ff88] text-black flex items-center justify-center text-xs">
                  <CheckCircle2 size={12} />
                </span>
                Cart
              </div>
              <div className="w-12 h-[2px] bg-[#00ff88]/50 hidden md:block"></div>
              <div className="flex items-center gap-2 text-white shrink-0">
                <span className="w-6 h-6 rounded-full bg-[#00ff88] text-black flex items-center justify-center text-xs">
                  <CheckCircle2 size={12} />
                </span>
                Shipping
              </div>
              <div className="w-12 h-[2px] bg-[#00ff88]/50 hidden md:block"></div>
              <div className="flex items-center gap-2 text-[#00ff88] shrink-0">
                <span className="w-6 h-6 rounded-full bg-[#00ff88] text-black flex items-center justify-center text-xs">
                  <CheckCircle2 size={12} />
                </span>
                Success
              </div>
            </div>
          </div>
        </Reveal>

        {/* Main Success Banner */}
        <Reveal>
          <div className="bg-linear-to-br from-[#111] to-[#0a0a0a] border border-white/10 rounded-3xl p-8 sm:p-12 text-center shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#00ff88]/5 rounded-full blur-3xl -mr-20 -mt-20 group-hover:bg-[#00ff88]/10 transition-colors duration-700"></div>
            <div className="w-24 h-24 bg-[#00ff88]/10 rounded-full flex items-center justify-center mx-auto mb-8 shadow-[0_0_30px_rgba(0,255,136,0.15)] relative z-10 border border-[#00ff88]/20">
              <CheckCircle2 size={48} className="text-[#00ff88]" />
            </div>
            <h1 className="text-4xl sm:text-5xl font-black text-white uppercase tracking-widest mb-4 relative z-10">
              Thank You!
            </h1>
            <p className="text-gray-400 font-serif text-lg mb-2 relative z-10">
              Your premium order has been confirmed.
            </p>
            <p className="text-gray-500 font-mono text-sm mb-8 relative z-10">
              Order ID: #{order._id}
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
              <button
                onClick={handleDownloadInvoice}
                className="flex items-center justify-center gap-2 w-full sm:w-auto text-white bg-transparent border border-[#00ff88]/50 hover:bg-[#00ff88]/10 px-8 py-4 rounded-xl font-bold uppercase tracking-widest transition-colors text-sm"
              >
                <Download size={16} /> Download Invoice
              </button>
              <button
                onClick={() => navigate("/shop")}
                className="flex items-center justify-center gap-2 w-full sm:w-auto text-black bg-[#00ff88] hover:bg-[#00cc66] px-8 py-4 rounded-xl font-bold uppercase tracking-widest transition-all hover:-translate-y-1 hover:shadow-[0_10px_20px_rgba(0,255,136,0.2)] text-sm"
              >
                <ArrowLeft size={16} /> Continue Shopping
              </button>
            </div>
          </div>
        </Reveal>

        {/* Map & Tracking Section */}
        <Reveal delay={0.1}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Map */}
            <div className="lg:col-span-2 bg-[#111] border border-gray-800 rounded-3xl overflow-hidden h-[500px] shadow-[0_10px_30px_rgba(0,0,0,0.3)] relative">
              {orderStatus === "Delivered" ? (
                <div className="absolute inset-0 z-10 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center">
                  <div className="w-16 h-16 bg-[#00ff88] rounded-full flex items-center justify-center mb-4 shadow-[0_0_30px_rgba(0,255,136,0.5)]">
                    <Package size={32} className="text-black" />
                  </div>
                  <h3 className="text-2xl font-black text-white uppercase tracking-widest">
                    Package Delivered
                  </h3>
                </div>
              ) : null}

              <LiveTrackingMap
                deliveryCoords={{ lat: mapCenter[0], lng: mapCenter[1] }}
                userCoords={
                  order?.shippingAddress?.coordinates
                    ? {
                        lat: order.shippingAddress.coordinates[1],
                        lng: order.shippingAddress.coordinates[0],
                      }
                    : null
                }
              />
            </div>

            {/* Status & Delivery Boy */}
            <div className="space-y-6">
              <div className="bg-[#111] border border-gray-800 rounded-3xl p-6 shadow-[0_10px_30px_rgba(0,0,0,0.3)]">
                <h3 className="text-white font-bold uppercase tracking-widest mb-10 flex items-center gap-2">
                  <Truck size={18} className="text-[#ff007f]" /> Delivery Status
                </h3>

                <div className="mb-8 mt-4 shrink-0 relative px-4">
                  {(() => {
                    const isReturn = orderStatus
                      ?.toLowerCase()
                      .includes("return")

                    const normalSteps = [
                      { label: "Processing", icon: Package },
                      { label: "Shipped", icon: Truck },
                      { label: "Out for Delivery", icon: MapPin },
                      { label: "Delivered", icon: CheckCircle2 },
                    ]

                    const returnSteps = [
                      { label: "Requested", icon: Package },
                      { label: "Accepted", icon: Package },
                      { label: "Out for Pickup", icon: Truck },
                      { label: "Collected", icon: CheckCircle2 },
                      { label: "Refunded", icon: Banknote },
                    ]

                    const steps = isReturn ? returnSteps : normalSteps

                    // Calculate progress step based on status
                    let currentStep = 1
                    if (!isReturn) {
                      if (orderStatus === "Shipped") currentStep = 2
                      if (
                        orderStatus === "Out_for_Delivery" ||
                        orderStatus === "Out for delivery"
                      )
                        currentStep = 3
                      if (orderStatus === "Delivered") currentStep = 4
                    } else {
                      if (orderStatus === "Return_Accepted") currentStep = 2
                      if (
                        orderStatus === "Return_Pickup" ||
                        orderStatus === "Out for Pickup"
                      )
                        currentStep = 3
                      if (
                        orderStatus === "Return_Collected" ||
                        orderStatus === "Returned" ||
                        orderStatus === "Collected"
                      )
                        currentStep = 4
                      if (orderStatus === "Refunded") currentStep = 5
                    }

                    let fillPercent =
                      order?.progressPercent > 0
                        ? order.progressPercent
                        : ((currentStep - 1) / (steps.length - 1)) * 100
                    if (fillPercent === 0 && currentStep > 1) {
                      fillPercent =
                        ((currentStep - 1) / (steps.length - 1)) * 100
                    }

                    return (
                      <div className="relative">
                        {/* Background Line */}
                        <div className="absolute top-5 left-[10%] right-[10%] h-[3px] bg-gray-800 z-0 rounded-full"></div>

                        {/* Active Progress Line */}
                        <div
                          className={`absolute top-5 left-[10%] max-w-[80%] h-[3px] z-0 rounded-full transition-all duration-1000 ${
                            fillPercent === 100
                              ? "bg-[#00ff88]"
                              : fillPercent >= 50
                                ? "bg-blue-500"
                                : "bg-[#ff007f]"
                          }`}
                          style={{ width: `${fillPercent}%` }}
                        />

                        <div className="flex justify-between items-start">
                          {steps.map((step, idx) => {
                            const Icon = step.icon
                            const stepPercent = (idx / (steps.length - 1)) * 100
                            const isCompleted = fillPercent >= stepPercent
                            const isCurrent = currentStep === idx + 1

                            // Color logic
                            let colorClass =
                              "bg-[#1a1a1a] border-gray-700 text-gray-500"
                            let labelClass = "text-gray-500"

                            if (isCompleted || isCurrent) {
                              if (
                                idx === steps.length - 1 &&
                                fillPercent === 100
                              ) {
                                colorClass =
                                  "bg-[#00ff88] border-[#00ff88] text-black shadow-[0_0_15px_rgba(0,255,136,0.4)]"
                                labelClass = "text-[#00ff88]"
                              } else if (idx >= 1) {
                                colorClass =
                                  "bg-blue-500 border-blue-500 text-white shadow-[0_0_15px_rgba(59,130,246,0.4)]"
                                labelClass = "text-blue-500"
                              } else {
                                colorClass =
                                  "bg-[#ff007f] border-[#ff007f] text-white shadow-[0_0_15px_#ff007f]"
                                labelClass = "text-[#ff007f]"
                              }
                            }

                            return (
                              <div
                                key={idx}
                                className="flex flex-col items-center w-20"
                              >
                                <div
                                  className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors duration-500 bg-[#111] z-10 ${colorClass}`}
                                >
                                  <Icon
                                    size={18}
                                    className="relative z-10 bg-transparent"
                                  />
                                </div>
                                <span
                                  className={`text-[9px] sm:text-[10px] font-bold uppercase tracking-widest mt-2 text-center ${labelClass}`}
                                >
                                  {step.label}
                                </span>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    )
                  })()}
                </div>
              </div>

              {/* Delivery Boy details if available */}
              {deliveryBoyId && (
                <div className="bg-[#111] border border-gray-800 rounded-3xl p-6 shadow-[0_10px_30px_rgba(0,0,0,0.3)]">
                  <h3 className="text-white font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
                    <MapPin size={18} className="text-[#00ff88]" /> Delivery
                    Partner
                  </h3>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-linear-to-br from-[#00ff88] to-[#00b8ff] flex items-center justify-center text-black font-black text-xl shadow-[0_0_15px_rgba(0,255,136,0.3)]">
                      {deliveryBoyId?.name?.charAt(0) || "D"}
                    </div>
                    <div>
                      <p className="text-white font-bold">
                        {deliveryBoyId?.name || "Assigned Partner"}
                      </p>
                      <p className="text-gray-400 text-sm mt-0.5">
                        {deliveryBoyId?.phone || "Contact info pending"}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  )
}

export default OrderSuccess
