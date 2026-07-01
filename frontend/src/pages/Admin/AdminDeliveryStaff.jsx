import React, { useState, useEffect } from "react"
import { getDeliveryStaffStats } from "../../services/delivery.service"
import {
  User,
  Shield,
  AlertTriangle,
  Clock,
  TrendingDown,
  Search,
} from "lucide-react"
import LoadMoreButtons from "../../components/common/LoadMoreButtons"

const AdminDeliveryStaff = () => {
  const [staff, setStaff] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [visibleCount, setVisibleCount] = useState(6)

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const res = await getDeliveryStaffStats()
        if (res.success) {
          setStaff(res.data)
        }
      } catch (error) {
        console.error("Failed to fetch staff stats", error)
      } finally {
        setLoading(false)
      }
    }
    fetchStaff()
  }, [])

  const filteredStaff = staff.filter(
    (s) =>
      s.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.email?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <h1 className="text-3xl font-black text-white uppercase tracking-widest">
          Delivery Staff
        </h1>
      </div>

      <div className="bg-[#1a1a1a] border-2 border-gray-800 rounded-3xl overflow-hidden">
        <div className="p-6 border-b border-gray-800 flex items-center justify-between">
          <div className="relative w-full max-w-md">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
              size={18}
            />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#111] border border-gray-800 rounded-xl py-2.5 pl-12 pr-4 text-white focus:outline-none focus:border-[#ff007f] transition-colors"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-400">
            <thead className="bg-[#111] text-xs uppercase font-bold text-gray-500 border-b border-gray-800">
              <tr>
                <th className="px-6 py-4">Delivery Boy</th>
                <th className="px-6 py-4">Deliveries</th>
                <th className="px-6 py-4">Avg Time</th>
                <th className="px-6 py-4">Rating</th>
                <th className="px-6 py-4">Final Payout</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center">
                    <div className="inline-block w-8 h-8 border-4 border-[#ff007f] border-t-transparent rounded-full animate-spin"></div>
                  </td>
                </tr>
              ) : filteredStaff.length > 0 ? (
                filteredStaff.slice(0, visibleCount).map((s) => (
                  <tr
                    key={s._id}
                    className="border-b border-gray-800/50 hover:bg-gray-800/20 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <img
                          src={
                            s.avatar ||
                            `https://api.dicebear.com/7.x/initials/svg?seed=${s.name}`
                          }
                          alt={s.name}
                          className="w-10 h-10 rounded-full border border-gray-700 bg-black"
                        />
                        <div>
                          <p className="text-white font-bold">{s.name}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {s.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-white font-black text-lg">
                        {s.totalDeliveries}
                      </span>
                      <span className="text-gray-500 text-xs ml-1 uppercase font-bold">
                        Total
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Clock
                          size={16}
                          className={
                            Number(s.avgDeliveryTime) > 24
                              ? "text-red-500"
                              : "text-green-500"
                          }
                        />
                        <span
                          className={`font-bold ${Number(s.avgDeliveryTime) > 24 ? "text-red-500" : "text-white"}`}
                        >
                          {s.avgDeliveryTime} hrs
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {s.deliveryRating?.average > 0 ? (
                        <div
                          className={`flex items-center gap-1 w-fit px-2 py-0.5 rounded border font-bold text-xs ${s.deliveryRating.average < 3.0 ? "text-red-500 bg-red-500/10 border-red-500/20" : "text-yellow-500 bg-yellow-500/10 border-yellow-500/20"}`}
                        >
                          ⭐ {s.deliveryRating.average.toFixed(1)} / 5.0
                        </div>
                      ) : (
                        <span className="text-gray-500 text-xs font-bold uppercase">
                          No Ratings
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-white font-black text-lg">
                          ₹{s.finalSalary.toLocaleString("en-IN")}
                        </span>
                        {s.penalties && s.penalties.length > 0 && (
                          <div className="flex flex-col gap-1 mt-1">
                            {s.penalties.map((penalty, idx) => (
                              <span
                                key={idx}
                                className="flex items-center gap-1 text-[10px] text-red-500 font-bold uppercase tracking-wider"
                              >
                                <TrendingDown size={10} /> {penalty}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    className="px-6 py-12 text-center text-gray-500 font-bold"
                  >
                    No delivery staff found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-gray-800">
          <LoadMoreButtons
            visibleCount={visibleCount}
            totalCount={filteredStaff.length}
            setVisibleCount={setVisibleCount}
            step={6}
          />
        </div>
      </div>
    </div>
  )
}

export default AdminDeliveryStaff
