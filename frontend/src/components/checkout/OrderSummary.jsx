import { Tag, ShieldCheck, Truck, ArrowRight } from "lucide-react"
import { useSelector } from "react-redux"

const OrderSummary = ({ handlePlaceOrder, isPlacingOrder, isValid }) => {
  const { cart } = useSelector((state) => state.cart)
  const products = cart?.cart?.products || []
  const totalPrice = cart?.totalPrice || 0
  const discountAmount = cart?.discountAmount || 0
  const finalPrice = cart?.finalPrice || 0

  return (
    <div className="bg-[#111] p-6 rounded-2xl border-2 border-gray-800 sticky top-24">
      <h2 className="text-white font-black text-2xl uppercase tracking-widest mb-6">
        Review Order
      </h2>

      {/* Items snippet */}
      <div className="space-y-3 mb-6 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
        {products.map((item) => {
          const product = item.productId || {}
          const media =
            Array.isArray(product.media) && product.media.length > 0
              ? product.media[0].url
              : "https://via.placeholder.com/50"
          const currentPrice =
            item.price ||
            product.dynamicPrice ||
            product.discountPrice ||
            product.price ||
            0

          return (
            <div
              key={product._id}
              className="flex gap-3 items-center bg-[#0a0a0a] p-2 rounded-lg border border-gray-800"
            >
              <img
                src={media}
                alt={product.productName}
                className="w-12 h-12 rounded object-cover"
              />
              <div className="flex-1">
                <p className="text-white text-sm font-bold line-clamp-1">
                  {product.productName}
                </p>
                <p className="text-gray-500 text-xs">Qty: {item.quantity}</p>
              </div>
              <div className="text-right">
                <p className="text-white font-bold text-sm">
                  ₹{(currentPrice * item.quantity).toLocaleString("en-IN")}
                </p>
              </div>
            </div>
          )
        })}
      </div>

      <div className="space-y-4 mb-6 pt-4 border-t-2 border-gray-800">
        <div className="flex justify-between items-center text-gray-400 font-medium">
          <span>Subtotal</span>
          <span className="text-white">
            ₹{totalPrice.toLocaleString("en-IN")}
          </span>
        </div>

        {discountAmount > 0 && (
          <div className="flex justify-between items-center text-[#00ff88] font-bold">
            <span className="flex items-center gap-1">
              <Tag size={16} /> Discount
            </span>
            <span>- ₹{discountAmount.toLocaleString("en-IN")}</span>
          </div>
        )}

        <div className="flex justify-between items-center text-gray-400 font-medium">
          <span>Shipping</span>
          <span className="text-[#00ff88]">FREE</span>
        </div>

        <div className="h-px bg-gray-800 w-full my-4"></div>

        <div className="flex justify-between items-end">
          <span className="text-white font-bold text-lg uppercase tracking-wider">
            Total
          </span>
          <div className="text-right">
            <span className="text-[#ff007f] font-black text-3xl">
              ₹{finalPrice.toLocaleString("en-IN")}
            </span>
            <p className="text-gray-500 text-xs mt-1">Inclusive of all taxes</p>
          </div>
        </div>
      </div>

      <button
        onClick={handlePlaceOrder}
        disabled={!isValid || isPlacingOrder}
        className="w-full bg-[#ff007f] hover:bg-[#d00068] disabled:bg-gray-800 disabled:text-gray-500 disabled:shadow-none text-white font-black uppercase tracking-widest py-4 px-6 rounded-xl flex items-center justify-center gap-2 transition-all border-2 border-transparent hover:border-white shadow-[4px_4px_0px_#8b0045] active:shadow-none active:translate-y-[4px] active:translate-x-[4px]"
      >
        {isPlacingOrder ? "Processing..." : "Place Order"}{" "}
        <ArrowRight size={20} />
      </button>

      <div className="mt-6 space-y-3">
        <div className="flex items-center gap-2 text-gray-500 text-xs font-medium">
          <ShieldCheck size={16} className="text-[#00ff88]" />
          100% Secure Payment & Buyer Protection
        </div>
        <div className="flex items-center gap-2 text-gray-500 text-xs font-medium">
          <Truck size={16} className="text-[#00ff88]" />
          Estimated Delivery: 3-5 Business Days
        </div>
      </div>
    </div>
  )
}

export default OrderSummary
