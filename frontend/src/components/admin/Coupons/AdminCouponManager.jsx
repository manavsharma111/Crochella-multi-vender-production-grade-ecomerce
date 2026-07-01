import React, { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import {
  getAllCouponsAsync,
  createCouponAsync,
  deleteCouponAsync,
} from "../../../redux/slices/couponSlice"
import { motion, AnimatePresence } from "framer-motion"
import { Tag, Plus, Trash2, Calendar, AlertCircle } from "lucide-react"
import toast from "react-hot-toast"
import LoadMoreButtons from "../../common/LoadMoreButtons"

const AdminCouponManager = () => {
  const dispatch = useDispatch()
  const { allCoupons, loading } = useSelector((state) => state.coupon)

  const [showForm, setShowForm] = useState(false)
  const [visibleCount, setVisibleCount] = useState(6)
  const [formData, setFormData] = useState({
    couponName: "",
    couponCode: "",
    discountType: "percentage",
    discountValue: "",
    expiryDate: "",
    couponLimit: "",
  })

  useEffect(() => {
    dispatch(getAllCouponsAsync())
  }, [dispatch])

  const couponsList = Array.isArray(allCoupons)
    ? allCoupons
    : allCoupons?.data || []

  const handleCreate = (e) => {
    e.preventDefault()
    dispatch(
      createCouponAsync({
        ...formData,
        discountValue: Number(formData.discountValue),
        couponLimit: Number(formData.couponLimit),
      }),
    ).then((res) => {
      if (res.meta.requestStatus === "fulfilled") {
        toast.success("Coupon created successfully!")
        setShowForm(false)
        setFormData({
          couponName: "",
          couponCode: "",
          discountType: "percentage",
          discountValue: "",
          expiryDate: "",
          couponLimit: "",
        })
      } else {
        toast.error("Failed to create coupon")
      }
    })
  }

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this coupon?")) {
      dispatch(deleteCouponAsync(id)).then(() => {
        toast.success("Coupon deleted!")
      })
    }
  }

  return (
    <div className="bg-[#0c0c0d] p-6 rounded-3xl border border-white/10 shadow-2xl">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-black text-white uppercase tracking-wider flex items-center gap-2">
            <Tag size={24} className="text-[#ff007f]" /> Coupon Manager
          </h2>
          <p className="text-gray-400 text-sm mt-1">
            Create and manage discount codes.
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-[#ff007f] hover:bg-[#ff007f]/80 text-white px-4 py-2 rounded-xl font-bold transition-all text-sm uppercase tracking-wider"
        >
          {showForm ? (
            "Cancel"
          ) : (
            <>
              <Plus size={16} /> New Coupon
            </>
          )}
        </button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleCreate}
            className="bg-white/5 border border-white/10 p-6 rounded-2xl mb-8 overflow-hidden"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
                  Campaign Name
                </label>
                <input
                  required
                  type="text"
                  value={formData.couponName}
                  onChange={(e) =>
                    setFormData({ ...formData, couponName: e.target.value })
                  }
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-[#ff007f]"
                  placeholder="Diwali Sale"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
                  Coupon Code
                </label>
                <input
                  required
                  type="text"
                  value={formData.couponCode}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      couponCode: e.target.value.toUpperCase(),
                    })
                  }
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-[#ff007f] font-black tracking-widest outline-none focus:border-[#ff007f]"
                  placeholder="DIWALI50"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
                  Discount Type
                </label>
                <select
                  value={formData.discountType}
                  onChange={(e) =>
                    setFormData({ ...formData, discountType: e.target.value })
                  }
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-[#ff007f] appearance-none"
                >
                  <option value="percentage">Percentage (%)</option>
                  <option value="flat">Flat Amount (₹)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
                  Discount Value
                </label>
                <input
                  required
                  type="number"
                  min="1"
                  value={formData.discountValue}
                  onChange={(e) =>
                    setFormData({ ...formData, discountValue: e.target.value })
                  }
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-[#ff007f]"
                  placeholder="e.g. 20"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
                  Expiry Date
                </label>
                <input
                  required
                  type="date"
                  value={formData.expiryDate}
                  onChange={(e) =>
                    setFormData({ ...formData, expiryDate: e.target.value })
                  }
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-[#ff007f]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
                  Usage Limit
                </label>
                <input
                  required
                  type="number"
                  min="1"
                  value={formData.couponLimit}
                  onChange={(e) =>
                    setFormData({ ...formData, couponLimit: e.target.value })
                  }
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-[#ff007f]"
                  placeholder="e.g. 100 users"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-white text-black font-black uppercase tracking-widest py-4 rounded-xl hover:bg-gray-200 transition-all disabled:opacity-50"
            >
              {loading ? "Creating..." : "Launch Coupon Campaign"}
            </button>
          </motion.form>
        )}
      </AnimatePresence>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/10 text-xs font-bold text-gray-500 uppercase tracking-widest">
              <th className="pb-4 pl-4">Code & Campaign</th>
              <th className="pb-4">Discount</th>
              <th className="pb-4">Status / Expiry</th>
              <th className="pb-4">Limit</th>
              <th className="pb-4 pr-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {couponsList.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-12 text-gray-500">
                  <AlertCircle size={40} className="mx-auto mb-4 opacity-20" />
                  No coupons created yet.
                </td>
              </tr>
            ) : (
              couponsList.slice(0, visibleCount).map((coupon) => {
                const isExpired = new Date(coupon.expiryDate) < new Date()
                return (
                  <tr
                    key={coupon._id}
                    className="border-b border-white/5 hover:bg-white/5 transition-colors"
                  >
                    <td className="py-4 pl-4">
                      <div className="font-black text-[#ff007f] tracking-widest text-lg">
                        {coupon.couponCode}
                      </div>
                      <div className="text-xs text-gray-400">
                        {coupon.couponName}
                      </div>
                    </td>
                    <td className="py-4">
                      <span className="bg-white/10 px-3 py-1 rounded-full text-sm font-bold">
                        {coupon.discountType === "percentage"
                          ? `${coupon.discountValue}% OFF`
                          : `₹${coupon.discountValue} OFF`}
                      </span>
                    </td>
                    <td className="py-4">
                      <div
                        className={`flex items-center gap-1.5 text-sm font-bold ${isExpired ? "text-red-500" : "text-green-500"}`}
                      >
                        {isExpired ? "Expired" : "Active"}
                      </div>
                      <div className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                        <Calendar size={12} />{" "}
                        {new Date(coupon.expiryDate).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="py-4 text-sm font-semibold text-gray-300">
                      {coupon.couponLimit} users
                    </td>
                    <td className="py-4 pr-4 text-right">
                      <button
                        onClick={() => handleDelete(coupon._id)}
                        className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      <LoadMoreButtons
        visibleCount={visibleCount}
        totalCount={couponsList.length}
        setVisibleCount={setVisibleCount}
        step={6}
      />
    </div>
  )
}

export default AdminCouponManager
