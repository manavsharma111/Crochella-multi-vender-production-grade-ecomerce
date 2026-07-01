import React, { useState, useEffect } from "react"
import { useDispatch } from "react-redux"
import { motion } from "framer-motion"
import { Bell } from "lucide-react"
import { toast } from "react-hot-toast"
import BrutalistButton from "../../components/common/Buttons/BrutalistButton"
import NotificationCard from "../../components/common/Cards/NotificationCard"
import { subscribeUserAsync } from "../../redux/slices/notificationSlice"

const urlBase64ToUint8Array = (base64String) => {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/\-/g, "+").replace(/_/g, "/")
  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}

const NotificationsTab = () => {
  const dispatch = useDispatch()
  const [pushEnabled, setPushEnabled] = useState(false)
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "Order Shipped",
      message:
        "Your Handloom Silk Saree order has been shipped and is on the way.",
      time: "2 hours ago",
      read: false,
    },
    {
      id: 2,
      title: "Security Alert",
      message: "Your password was successfully updated.",
      time: "1 day ago",
      read: true,
    },
    {
      id: 3,
      title: "Special Offer",
      message:
        "Get 20% off on all new arrivals this weekend. Use code WEAVE20.",
      time: "3 days ago",
      read: true,
    },
  ])

  useEffect(() => {
    if ("serviceWorker" in navigator && "PushManager" in window) {
      navigator.serviceWorker.ready.then((reg) => {
        reg.pushManager.getSubscription().then((sub) => {
          if (sub) {
            setPushEnabled(true)
          }
        })
      })
    }
  }, [])

  const handleDeleteNotification = (id) => {
    setNotifications(notifications.filter((n) => n.id !== id))
    toast.success("Notification deleted")
  }

  const handleSubscribePush = async () => {
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
      toast.error("Push notifications aren't supported in this browser.")
      return
    }
    try {
      const register = await navigator.serviceWorker.register("/sw.js")
      const permission = await Notification.requestPermission()
      if (permission !== "granted") {
        toast.error("Notification permission denied!")
        return
      }
      const publicVapidKey = import.meta.env.VITE_VAPID_PUBLIC_KEY
      const subscription = await register.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicVapidKey),
      })

      const res = await dispatch(subscribeUserAsync({ subscription }))

      if (res.meta.requestStatus === "fulfilled") {
        toast.success("Successfully subscribed to notifications!")
        setPushEnabled(true)
      } else {
        toast.error(res.payload || "Failed to subscribe to notifications.")
      }
    } catch (error) {
      console.error("Error subscribing:", error)
      toast.error("Failed to subscribe to notifications.")
    }
  }

  const handleUnsubscribePush = async () => {
    try {
      const register = await navigator.serviceWorker.ready
      const subscription = await register.pushManager.getSubscription()
      if (subscription) {
        await subscription.unsubscribe()
      }

      const res = await dispatch(subscribeUserAsync({ subscription: null }))

      if (res.meta.requestStatus === "fulfilled") {
        toast.success("Successfully disabled notifications.")
        setPushEnabled(false)
      } else {
        toast.error(res.payload || "Failed to disable notifications.")
      }
    } catch (error) {
      console.error("Error unsubscribing:", error)
      toast.error("Failed to disable notifications.")
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 border-b border-white/10 pb-4">
        <h3 className="text-white font-black text-2xl uppercase tracking-widest">
          Notifications
        </h3>
        <BrutalistButton
          variant={pushEnabled ? "secondary" : "primary"}
          className={`px-4 py-2 text-xs ${pushEnabled ? "border-red-500 text-red-500 hover:bg-red-500 hover:text-white" : "bg-[#ff007f]"}`}
          onClick={pushEnabled ? handleUnsubscribePush : handleSubscribePush}
        >
          {pushEnabled
            ? "Disable Push Notifications"
            : "Enable Push Notifications"}
        </BrutalistButton>
      </div>

      <div className="space-y-4 max-h-[500px] overflow-y-auto custom-scrollbar pr-2">
        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <NotificationCard
              key={notification.id}
              notification={notification}
              onDelete={handleDeleteNotification}
            />
          ))
        ) : (
          <div className="text-center py-12 border-2 border-dashed border-white/10 rounded-2xl">
            <Bell size={40} className="mx-auto text-gray-600 mb-3" />
            <p className="text-gray-400 text-sm mb-4">No new notifications.</p>
          </div>
        )}
      </div>
    </motion.div>
  )
}

export default NotificationsTab
