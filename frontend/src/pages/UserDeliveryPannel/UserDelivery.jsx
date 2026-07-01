import React, { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import {
  getMyDeliveriesAsync,
  updateDeliveryStatusAsync,
} from "../../redux/slices/deliverySlice"
import LiveTrackingMap from "../Checkout/Livetracking"
import toast from "react-hot-toast"
import { ArrowLeft } from "lucide-react"
import { useNavigate } from "react-router-dom"

const UserDelivery = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { myDeliveries, isLoading } = useSelector((state) => state.delivery)
  const [activeOrder, setActiveOrder] = useState(null)
  const [currentPos, setCurrentPos] = useState(null)

  // 1. Fetch active deliveries on load
  useEffect(() => {
    dispatch(getMyDeliveriesAsync())
  }, [dispatch])

  // 2. Filter the first active order
  useEffect(() => {
    if (myDeliveries?.length > 0) {
      // Find an order that is actively being delivered or picked up
      const active = myDeliveries.find(
        (o) =>
          o.deliveryStatus === "Out_for_Delivery" ||
          o.deliveryStatus === "Return_Pickup",
      )
      setActiveOrder(active || null)
    } else {
      setActiveOrder(null)
    }
  }, [myDeliveries])

  // 3. Track location and sync with backend automatically!
  useEffect(() => {
    if (!activeOrder) return

    let watchId
    if ("geolocation" in navigator) {
      watchId = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          setCurrentPos({ lat: latitude, lng: longitude })

          // Pushing live location to backend Redux action
          dispatch(
            updateDeliveryStatusAsync({
              orderId: activeOrder._id,
              data: { lat: latitude, lng: longitude },
            }),
          )
        },
        (error) => {
          console.error("Location error:", error)
          toast.error("Please enable GPS for live tracking.")
        },
        { enableHighAccuracy: true, maximumAge: 10000, timeout: 10000 },
      )
    }

    return () => {
      if (watchId) navigator.geolocation.clearWatch(watchId)
    }
  }, [activeOrder, dispatch])

  const handleMarkDelivered = () => {
    if (!activeOrder) return

    const isReturn = activeOrder.deliveryStatus === "Return_Pickup"
    const newStatus = isReturn ? "Return_Collected" : "Delivered"

    dispatch(
      updateDeliveryStatusAsync({
        orderId: activeOrder._id,
        data: { deliveryStatus: newStatus },
      }),
    ).then((res) => {
      if (!res.error) {
        toast.success(
          isReturn ? "Return Item Collected!" : "Order Marked as Delivered!",
        )
        dispatch(getMyDeliveriesAsync()) // Refresh list
      }
    })
  }

  if (isLoading && !activeOrder) {
    return (
      <div className="min-h-screen pt-24 pb-20 flex justify-center items-center text-white bg-[#050505]">
        Loading...
      </div>
    )
  }

  if (!activeOrder) {
    return (
      <div className="min-h-screen pt-24 pb-20 flex justify-center items-center bg-[#050505] text-white">
        <h2 className="text-2xl font-bold uppercase tracking-widest text-gray-500">
          No Active Deliveries
        </h2>
      </div>
    )
  }

  // Extract user destination from DB coordinates
  const userDestination = activeOrder.shippingAddress?.coordinates
    ? {
        lat: activeOrder.shippingAddress.coordinates[1],
        lng: activeOrder.shippingAddress.coordinates[0],
      }
    : null

  const isReturn = activeOrder.deliveryStatus === "Return_Pickup"

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 sm:px-6 bg-[#050505] text-white">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={() => navigate(-1)}
            className="p-3 bg-[#111] hover:bg-[#1a1a1a] text-white rounded-full transition-colors border border-gray-800"
          >
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-3xl md:text-4xl font-black uppercase tracking-widest text-[#ff007f] m-0">
            Delivery Dashboard
          </h1>
        </div>

        <div className="bg-[#111] border-2 border-gray-800 rounded-3xl p-6 md:p-8 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold flex items-center gap-2">
              📍 {isReturn ? "Active Pickup Route" : "Active Delivery Route"}
            </h2>
            <p className="text-sm text-gray-400 hidden sm:block">
              Order ID: #{activeOrder._id}
            </p>
          </div>

          {/* Render Map using real live user and delivery boy coords */}
          <div className="h-[400px] md:h-[500px] w-full mb-6">
            <LiveTrackingMap
              deliveryCoords={currentPos || activeOrder.currentLocation}
              userCoords={userDestination}
            />
          </div>

          <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="text-gray-300 w-full sm:w-auto text-left">
              <p className="font-bold">Customer: {activeOrder.userId?.name}</p>
              <p className="text-sm">Phone: {activeOrder.userId?.phone}</p>
              <p className="text-sm mt-1 flex items-center gap-2">
                Payment Method:
                <span className="bg-[#ff007f]/20 text-[#ff007f] px-2 py-0.5 rounded text-xs font-black uppercase tracking-widest border border-[#ff007f]/30">
                  {activeOrder.paymentMethod || "COD"}
                </span>
              </p>
            </div>
            <div className="flex gap-4 w-full sm:w-auto">
              <a
                href={`tel:${activeOrder.userId?.phone}`}
                className="flex-1 sm:flex-none bg-white/10 hover:bg-white/20 px-6 py-3 rounded-xl font-bold uppercase transition-colors text-center inline-block"
              >
                Call
              </a>
              <button
                onClick={handleMarkDelivered}
                className={`flex-1 sm:flex-none text-black px-6 py-3 rounded-xl font-bold uppercase transition-colors ${isReturn ? "bg-[#00b8ff] hover:bg-[#0099e6] shadow-[0_0_15px_rgba(0,184,255,0.4)]" : "bg-[#00ff88] hover:bg-[#00e67a] shadow-[0_0_15px_rgba(0,255,136,0.4)]"}`}
              >
                {isReturn ? "Mark Collected" : "Mark Delivered"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserDelivery
