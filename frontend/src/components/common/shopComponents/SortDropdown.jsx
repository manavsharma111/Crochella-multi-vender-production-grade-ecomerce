import { ChevronDown } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

const sortOptions = [
  { label: "Newest", value: "newest" },
  { label: "Oldest", value: "oldest" },
  { label: "Price: Low to High", value: "price-low-to-high" },
  { label: "Price: High to Low", value: "price-high-to-low" },
  { label: "A to Z", value: "productName-a-to-z" },
  { label: "Z to A", value: "productName-z-to-a" },
]

const SortDropdown = ({
  sortOption,
  setSortOption,
  isSortOpen,
  setIsSortOpen,
}) => {
  return (
    <div className="relative shrink-0 z-40">
      <button
        onClick={() => setIsSortOpen(!isSortOpen)}
        className="flex items-center gap-1.5 md:gap-2 text-[10px] md:text-xs font-serif text-gray-300 uppercase tracking-widest hover:text-white transition-all bg-transparent px-2 py-2 md:px-3 border border-white/10 rounded-md md:rounded-lg"
      >
        Sort{" "}
        <ChevronDown
          size={12}
          className={`md:w-3.5 md:h-3.5 transition-transform duration-300 ${isSortOpen ? "rotate-180" : ""}`}
        />
      </button>

      <AnimatePresence>
        {isSortOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 top-full mt-2 w-40 md:w-48 bg-[#0a0a0a] border border-white/10 rounded-lg md:rounded-xl shadow-xl overflow-hidden origin-top-right"
          >
            {sortOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => {
                  setSortOption(opt.value)
                  setIsSortOpen(false)
                }}
                className={`w-full text-left px-3 py-2 text-[10px] md:text-xs font-serif uppercase tracking-widest hover:bg-white/5 transition-colors ${sortOption === opt.value ? "text-[#FFFDD0]" : "text-gray-400"}`}
              >
                {opt.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default SortDropdown
