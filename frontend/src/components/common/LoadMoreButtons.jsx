import React from "react"
import { ChevronDown, ChevronUp } from "lucide-react"

const LoadMoreButtons = ({
  visibleCount,
  totalCount,
  setVisibleCount,
  step = 5,
}) => {
  return (
    <div className="flex justify-center gap-4 py-4 bg-[#1a1a1a] border-t border-gray-800">
      {visibleCount < totalCount && (
        <button
          onClick={() =>
            setVisibleCount((prev) => Math.min(prev + step, totalCount))
          }
          className="flex items-center gap-2 px-6 py-2 bg-[#ff007f]/10 text-[#ff007f] border border-[#ff007f]/30 hover:bg-[#ff007f] hover:text-white rounded-full text-xs font-bold uppercase tracking-widest transition-all"
        >
          Load More <ChevronDown size={14} />
        </button>
      )}

      {visibleCount > step && (
        <button
          onClick={() => setVisibleCount(step)}
          className="flex items-center gap-2 px-6 py-2 bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white rounded-full text-xs font-bold uppercase tracking-widest transition-all"
        >
          Load Less <ChevronUp size={14} />
        </button>
      )}
    </div>
  )
}

export default LoadMoreButtons
