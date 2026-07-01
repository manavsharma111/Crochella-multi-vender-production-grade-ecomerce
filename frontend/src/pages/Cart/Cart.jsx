import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { ShoppingCart, ArrowLeft } from "lucide-react"
import { getCartAsync } from "../../redux/slices/cartSlice"
import CartItem from "../../components/cart/CartItem"
import CartSummary from "../../components/cart/CartSummary"
import Reveal from "../../components/common/animation/Reveal"
import ActiveCoupons from "../../components/shop/cartComponents/ActiveCoupons"
import { getFlashSalesAsync } from "../../redux/slices/productSlice"

const Cart = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { cart, isLoading } = useSelector((state) => state.cart)
  const { flashSales } = useSelector((state) => state.product)

  useEffect(() => {
    dispatch(getCartAsync())
    dispatch(getFlashSalesAsync())
  }, [dispatch])

  // Derived properties from backend response
  const products = cart?.cart?.products || []
  const totalPrice = cart?.totalPrice || 0
  const discountAmount = cart?.discountAmount || 0
  const finalPrice = cart?.finalPrice || 0

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8 bg-[#050505]">
      <div className="max-w-[1400px] mx-auto">
        <Reveal>
          {/* Header Progress Bar */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-12 border-b border-white/10 pb-6">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate("/shop")}
                className="p-2 bg-[#111] border-2 border-gray-800 rounded-lg text-white hover:text-[#ff007f] hover:border-[#ff007f] transition-colors"
              >
                <ArrowLeft size={24} />
              </button>
              <h1 className="text-white font-black text-3xl uppercase tracking-tighter">
                <span className="text-[#ff007f]">Shield</span> Checkout
              </h1>
            </div>

            <div className="flex items-center gap-2 md:gap-6 text-sm font-bold uppercase tracking-widest text-gray-500 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
              <div className="flex items-center gap-2 text-white shrink-0">
                <span className="w-6 h-6 rounded-full bg-[#ff007f] text-white flex items-center justify-center text-xs">
                  1
                </span>
                Shopping Cart
              </div>
              <div className="w-12 h-[2px] bg-white/10 hidden md:block"></div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-xs">
                  2
                </span>
                Shipping Details
              </div>
              <div className="w-12 h-[2px] bg-white/10 hidden md:block"></div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-xs">
                  3
                </span>
                Payment Option
              </div>
            </div>
          </div>
        </Reveal>

        {isLoading && products.length === 0 ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-12 h-12 border-4 border-[#ff007f] border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : products.length === 0 ? (
          <Reveal>
            <div className="bg-[#111] border-2 border-gray-800 rounded-3xl p-12 text-center flex flex-col items-center">
              <div className="w-24 h-24 bg-[#0a0a0a] rounded-full flex items-center justify-center mb-6">
                <ShoppingCart size={40} className="text-gray-600" />
              </div>
              <h2 className="text-white font-black text-2xl uppercase tracking-widest mb-4">
                Your Cart is Empty
              </h2>
              <p className="text-gray-400 max-w-md mb-8">
                Looks like you haven't added anything to your cart yet. Discover
                our premium handloom collection and find something you love.
              </p>
              <button
                onClick={() => navigate("/shop")}
                className="bg-[#ff007f] hover:bg-[#d00068] text-white font-black uppercase tracking-widest py-3 px-8 rounded-xl transition-colors border-2 border-transparent shadow-[4px_4px_0px_#8b0045] active:shadow-none active:translate-y-[4px] active:translate-x-[4px]"
              >
                Start Shopping
              </button>
            </div>
          </Reveal>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            {/* Cart Items List */}
            <div className="flex-1 w-full space-y-6">
              <div className="hidden md:grid grid-cols-12 gap-4 pb-4 border-b border-white/10 text-xs font-bold uppercase tracking-widest text-gray-500">
                <div className="col-span-6">Product</div>
                <div className="col-span-3 text-center">Quantity</div>
                <div className="col-span-3 text-right">Price</div>
              </div>

              <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
                {products.map((item, idx) => (
                  <CartItem
                    key={
                      item._id || item.productId?._id || item.productId || idx
                    }
                    item={item}
                  />
                ))}
              </div>

              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400 py-4 border-b border-white/10">
                <span className="text-white">🔒 Buy With Confidence</span> •
                100% NO-RISK MONEY BACK GUARANTEE
                <button className="ml-auto text-red-500 hover:text-red-400 transition-colors flex items-center gap-1">
                  <span className="border border-red-500 rounded-full w-4 h-4 flex items-center justify-center text-[10px]">
                    ✕
                  </span>{" "}
                  Cancel Order
                </button>
              </div>

              {/* Cross-sells Section */}
              {flashSales && flashSales.length > 0 && (
                <div className="pt-8">
                  <h3 className="text-white font-bold text-lg uppercase tracking-widest mb-6">
                    You may also be interested in these exclusive offers.
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {flashSales.slice(0, 2).map((item) => (
                      <div
                        key={item._id}
                        className="border border-white/10 bg-[#0a0a0a] rounded-2xl p-4 flex gap-4 items-center group hover:border-[#ff007f]/30 transition-all relative z-10"
                      >
                        <div className="w-20 h-20 bg-black rounded-xl overflow-hidden shrink-0">
                          <img
                            src={item.media?.[0]?.url || "/placeholder.png"}
                            alt="cross-sell"
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-white font-bold truncate pr-2">
                            {item.productName ||
                              item.name ||
                              "Exclusive Product"}
                          </h4>
                          <p className="text-gray-500 text-[10px] line-clamp-2 pr-2 mt-1">
                            {item.description}
                          </p>
                          <div className="flex justify-between items-center mt-3 relative z-20">
                            <span className="text-[#ff007f] font-bold">
                              ₹{item.price}
                            </span>
                            <button
                              onClick={() => navigate(`/product/${item._id}`)}
                              className="px-3 py-1 text-[10px] border border-white/20 rounded hover:bg-white hover:text-black transition-colors font-bold uppercase cursor-pointer relative z-30"
                            >
                              View
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Available Coupons Section */}
              <div className="mt-8 pt-8 border-t-2 border-gray-800">
                <h3 className="text-white font-bold text-xl uppercase tracking-widest mb-4">
                  Available Offers
                </h3>
                <ActiveCoupons />
              </div>
            </div>

            {/* Order Summary Sidebar */}
            <div className="w-full lg:w-[400px] shrink-0">
              <Reveal delay={0.2}>
                <CartSummary
                  cart={cart.cart}
                  totalPrice={totalPrice}
                  discountAmount={discountAmount}
                  finalPrice={finalPrice}
                />
              </Reveal>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Cart
