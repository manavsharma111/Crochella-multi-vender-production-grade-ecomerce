import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getActiveCouponsAsync } from "../../../redux/slices/couponSlice"
import { Tag, Copy, CheckCircle2 } from "lucide-react"

const ActiveCoupons = () => {
  const dispatch = useDispatch()
  const { activeCoupons } = useSelector((state) => state.coupon)
  const [copiedCode, setCopiedCode] = useState(null)

  useEffect(() => {
    dispatch(getActiveCouponsAsync())
  }, [dispatch])

  const couponsList = Array.isArray(activeCoupons)
    ? activeCoupons
    : activeCoupons?.data || []

  // Filter out expired coupons just in case
  const validCoupons = couponsList.filter(
    (c) => new Date(c.expiryDate) > new Date(),
  )

  const handleCopy = (code) => {
    navigator.clipboard.writeText(code)
    setCopiedCode(code)
    setTimeout(() => setCopiedCode(null), 2000)
  }

  if (validCoupons.length === 0) return null

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-5 w-full">
      <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
        <Tag size={14} /> Available Offers
      </h3>

      <div className="flex flex-col gap-3">
        {validCoupons.map((coupon) => (
          <div
            key={coupon._id}
            className="relative overflow-hidden bg-black/40 border border-white/5 rounded-xl p-4 group"
          >
            {/* Ticket Cutout Effect */}
            <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-4 bg-[#050505] rounded-full border-r border-white/5" />
            <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-4 bg-[#050505] rounded-full border-l border-white/5" />

            <div className="flex justify-between items-center pl-4">
              <div>
                <div className="font-black text-[#ff007f] tracking-widest text-lg mb-0.5">
                  {coupon.couponCode}
                </div>
                <div className="text-xs text-gray-400">
                  {coupon.discountType === "percentage"
                    ? `${coupon.discountValue}% OFF`
                    : `₹${coupon.discountValue} OFF`}{" "}
                  - {coupon.couponName}
                </div>
              </div>

              <button
                onClick={() => handleCopy(coupon.couponCode)}
                className="p-2.5 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
                title="Copy Code"
              >
                {copiedCode === coupon.couponCode ? (
                  <CheckCircle2 size={16} className="text-green-500" />
                ) : (
                  <Copy
                    size={16}
                    className="text-gray-400 group-hover:text-white transition-colors"
                  />
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ActiveCoupons
