import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { checkoutAsync } from '../../../redux/slices/paymentSlice'

// Helper function to load Razorpay script
const loadRazorpayScript = () => {
    return new Promise((resolve) => {
        const script = document.createElement("script")
        script.src = "https://checkout.razorpay.com/v1/checkout.js"
        script.onload = () => resolve(true)
        script.onerror = () => resolve(false)
        document.body.appendChild(script)
    })
}

const RazorpayHandler = ({ orderData, shippingAddress, onSuccess, onError, isTriggered, setTriggered }) => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [isScriptLoaded, setIsScriptLoaded] = useState(false)

    useEffect(() => {
        loadRazorpayScript().then((res) => {
            if (!res) {
                toast.error("Razorpay SDK failed to load. Are you online?")
            }
            setIsScriptLoaded(res)
        })
    }, [])

    useEffect(() => {
        if (isTriggered && isScriptLoaded) {
            handlePayment()
        } else if (isTriggered && !isScriptLoaded) {
            toast.error("Razorpay is still loading...")
            setTriggered(false)
            if (onError) onError()
        }
    }, [isTriggered])

    const handlePayment = async () => {
        try {
            // Create order on backend
            const res = await dispatch(checkoutAsync(orderData)).unwrap()
            
            if (!res || !res.order) {
                throw new Error("Failed to create order on server")
            }

            // Setup Razorpay options
            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID || "your_key_id", 
                amount: res.order.amount,
                currency: "INR",
                name: "Neo Handlooms",
                description: "Secure Checkout Payment",
                order_id: res.order.id, 
                
                // Razorpay will POST verification payload to this URL
                callback_url: `${import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000/api'}/payment/verify`,
                
                prefill: {
                    name: shippingAddress.name || "User",
                    email: shippingAddress.email || "",
                    contact: shippingAddress.phone || ""
                },
                theme: {
                    color: "#ff007f"
                },
                modal: {
                    ondismiss: function() {
                        toast.error("Payment cancelled by user")
                        setTriggered(false)
                        if (onError) onError()
                    }
                }
            }

            // Open Razorpay Modal
            const paymentObject = new window.Razorpay(options)
            paymentObject.open()

        } catch (error) {
            console.error("Payment error:", error)
            toast.error(error.message || "Something went wrong with the payment")
            setTriggered(false)
            if (onError) onError()
        }
    }

    return null
}

export default RazorpayHandler
