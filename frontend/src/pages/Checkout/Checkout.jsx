import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import toast from 'react-hot-toast'
import { getCartAsync } from '../../redux/slices/cartSlice'
import { placeOrderAsync, resetOrder } from '../../redux/slices/orderSlice'
import Reveal from '../../components/common/animation/Reveal'
import AddressSelector from '../../components/checkout/AddressSelector'
import PaymentSelector from '../../components/checkout/PaymentSelector'
import OrderSummary from '../../components/checkout/OrderSummary'
import RazorpayHandler from '../../components/checkout/razorpay/RazorpayHandler'

const Checkout = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { cart } = useSelector(state => state.cart)
    const { user } = useSelector(state => state.auth)
    const { orderPlaced, order: currentOrder, loading: orderLoading } = useSelector(state => state.order)
    const [selectedAddress, setSelectedAddress] = useState(null)
    const [paymentMethod, setPaymentMethod] = useState('COD')
    const [triggerRazorpay, setTriggerRazorpay] = useState(false)

    useEffect(() => {
        dispatch(getCartAsync())
    }, [dispatch])

    // Sync Handler: Redirects directly to the live tracking view on success
    useEffect(() => {
        if (orderPlaced && currentOrder?._id) {
            toast.success("Order Placed Successfully!")
            const targetOrderId = currentOrder._id
            // Clean operations cleanup before switching routing layers
            dispatch(resetOrder());
            dispatch(getCartAsync()) 
            // dynamic map tracking route 
            navigate(`/order-success/${targetOrderId}`)
        }
    }, [orderPlaced, currentOrder, dispatch, navigate])

    const products = cart?.cart?.products || []

    // Redirect if cart is empty
    useEffect(() => {
        if (!orderPlaced && products.length === 0 && cart?.cart) {
            navigate('/cart')
        }
    }, [products, orderPlaced, cart, navigate])

    const handlePlaceOrder = async () => {
        if (!selectedAddress) {
            toast.error("Please select a delivery address")
            return
        }

        const shippingAddress = {
            name: user?.name || 'User',
            email: user?.email || '',
            phone: user?.phone || '',
            address: selectedAddress.Area,
            city: selectedAddress.city,
            state: selectedAddress.state,
            zip: selectedAddress.pinCode,
            country: selectedAddress.country || 'India'
        }

        const orderData = {
            shippingAddress,
            paymentMethod
        }

        if (paymentMethod === 'Razorpay') {
            setTriggerRazorpay(true);
            return;
        }

        dispatch(placeOrderAsync(orderData))
    }

    const shippingAddressData = selectedAddress ? {
        name: user?.name || 'User',
        email: user?.email || '',
        phone: user?.phone || '',
        address: selectedAddress.Area,
        city: selectedAddress.city,
        state: selectedAddress.state,
        zip: selectedAddress.pinCode,
        country: selectedAddress.country || 'India'
    } : {}

    return (
        <div className="min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8 bg-[#050505]">
            {/* 🌀 Cinematic Global Loading State overlay for Particle Acceleration */}
            {orderLoading && (
                <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/80 backdrop-blur-md">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#ff007f] mb-4"></div>
                    <p className="text-white font-black tracking-widest uppercase text-sm animate-pulse">
                        Securing Ledger & Forging Order...
                    </p>
                </div>
            )}

            {/* Hidden Razorpay Handler */}
            <RazorpayHandler 
                isTriggered={triggerRazorpay}
                setTriggered={setTriggerRazorpay}
                orderData={{ shippingAddress: shippingAddressData, paymentMethod: 'Razorpay' }}
                shippingAddress={shippingAddressData}
                onError={() => setTriggerRazorpay(false)}
            />

            <div className="max-w-[1400px] mx-auto">
                <Reveal>
                    <div className="flex items-center gap-4 mb-8">
                        <button 
                            onClick={() => navigate('/cart')}
                            className="p-2 bg-[#111] border-2 border-gray-800 rounded-lg text-white hover:text-[#ff007f] hover:border-[#ff007f] transition-colors"
                        >
                            <ArrowLeft size={24} />
                        </button>
                        <h1 className="text-white font-black text-4xl md:text-5xl uppercase tracking-tighter flex items-center gap-3">
                            Secure <span className="text-[#ff007f]">Checkout</span>
                        </h1>
                    </div>
                </Reveal>

                <div className="flex flex-col lg:flex-row gap-8 items-start">
                    {/* Forms Column */}
                    <div className="flex-1 w-full">
                        <Reveal delay={0.1}>
                            <AddressSelector 
                                selectedAddress={selectedAddress} 
                                setSelectedAddress={setSelectedAddress} 
                            />
                        </Reveal>
                        
                        <Reveal delay={0.2}>
                            <PaymentSelector 
                                paymentMethod={paymentMethod} 
                                setPaymentMethod={setPaymentMethod} 
                            />
                        </Reveal>
                    </div>

                    {/* Order Summary Sidebar */}
                    <div className="w-full lg:w-[450px] shrink-0">
                        <Reveal delay={0.3}>
                            <OrderSummary 
                                handlePlaceOrder={handlePlaceOrder}
                                isPlacingOrder={orderLoading}
                                isValid={!!selectedAddress}
                            />
                        </Reveal>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Checkout