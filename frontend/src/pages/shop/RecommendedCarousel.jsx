import React, { useEffect, useState } from "react"
import axios from "axios"
import { motion } from "framer-motion"
import { Link } from "react-router-dom"

const RecommendedCarousel = ({ currentProductId }) => {
  const [suggestions, setSuggestions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const res = await axios.get(
          `/api/ai/recommendations/${currentProductId}`,
        )
        if (res.data.success) {
          setSuggestions(res.data.data)
        }
      } catch (err) {
        console.error("Error pulling recommendations hooks:", err)
      } finally {
        setLoading(false)
      }
    }

    if (currentProductId) {
      setLoading(true)
      fetchRecommendations()
    }
  }, [currentProductId])

  if (loading) {
    return (
      <div className="mt-20 border-t border-gray-900 pt-12 text-center">
        <h2 className="text-white font-black text-2xl md:text-3xl uppercase tracking-tight mb-4">
          You May Also <span className="text-[#ff007f]">Like These</span>
        </h2>
        <div className="py-10 border-2 border-dashed border-gray-800 rounded-2xl flex flex-col items-center justify-center">
          <div className="w-10 h-10 border-4 border-[#ff007f] border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-500 text-sm font-bold uppercase tracking-widest animate-pulse">
            Finding perfect matches for you...
          </p>
        </div>
      </div>
    )
  }

  if (suggestions.length === 0) return null

  return (
    <div className="mt-20 border-t border-gray-900 pt-12">
      <h2 className="text-white font-black text-2xl md:text-3xl uppercase tracking-tight mb-8">
        You May Also <span className="text-[#ff007f]">Premium Match</span>
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {suggestions.map((item, index) => (
          <motion.div
            key={item._id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            className="bg-[#111] border border-gray-900 rounded-2xl p-4 overflow-hidden group hover:border-[#ff007f]/50 transition-all duration-300"
          >
            <Link to={`/product/${item._id}`}>
              <div className="w-full aspect-square bg-zinc-950 rounded-xl overflow-hidden mb-4 relative">
                <img
                  src={
                    item.media?.[0]?.url ||
                    (typeof item.media?.[0] === "string"
                      ? item.media[0]
                      : item.image) ||
                    "https://via.placeholder.com/150"
                  }
                  alt={item.name || "Product"}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <h4 className="text-white font-bold text-sm truncate">
                {item.name}
              </h4>
              <p className="text-gray-500 text-xs mt-1">₹{item.price}</p>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default RecommendedCarousel
