import { useDispatch, useSelector } from "react-redux"
import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  getAllProductsAsync,
  getFilterOptionsAsync,
} from "../../redux/slices/productSlice"
import ProductCard from "../../components/common/Cards/ProductCard"
import BrutalistButton from "../../components/common/Buttons/BrutalistButton"
import { List, LayoutGrid, SlidersHorizontal, ArrowUp } from "lucide-react"
import FloatingChatbot from "../../components/common/Chatbot/FloatingChatbot"

// New components
import SearchBox from "../../components/common/shopComponents/SearchBox"
import SortDropdown from "../../components/common/shopComponents/SortDropdown"
import FilterSidebar from "../../components/common/shopComponents/FilterSidebar"
import { CardSkeleton } from "../../components/common/Skeleton"
import Reveal from "../../components/common/animation/Reveal"
import { gsap } from "gsap"
import { Flip } from "gsap/Flip"
import HandloomBackground from "../../components/common/HandloomBackground"

gsap.registerPlugin(Flip)

// Removed dummy products as we are using live database data
const Shop = () => {
  const dispatch = useDispatch()
  const { products: storeProducts, loading } = useSelector(
    (state) => state.product,
  )

  const [activeCategory, setActiveCategory] = useState("All")
  const [searchQuery, setSearchQuery] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")
  const [viewMode, setViewMode] = useState("grid")
  const [sortOption, setSortOption] = useState("newest")
  const [isSortOpen, setIsSortOpen] = useState(false)
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false)
  const [showScrollTop, setShowScrollTop] = useState(false)
  const [visibleCount, setVisibleCount] = useState(6)

  // Advanced filters
  const [maxPrice, setMaxPrice] = useState(50000)
  const [debouncedMaxPrice, setDebouncedMaxPrice] = useState(50000)
  const [material, setMaterial] = useState("")
  const [weaveType, setWeaveType] = useState("")

  const changeLayout = (mode) => {
    if (mode === viewMode) return

    // Get current state of cards before layout change
    const state = Flip.getState(".product-card-container")

    // Change state which triggers React render
    setViewMode(mode)

    // Animate from previous state to new state using GSAP Flip
    requestAnimationFrame(() => {
      Flip.from(state, {
        duration: 0.5,
        absolute: true,
        stagger: 0.05,
        ease: "power2.inOut",
      })
    })
  }

  // Scroll to top visibility toggle
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowScrollTop(true)
      } else {
        setShowScrollTop(false)
      }
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  // Debounce search input and maxPrice
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery)
      setDebouncedMaxPrice(maxPrice)
    }, 500)
    return () => clearTimeout(handler)
  }, [searchQuery, maxPrice])

  // Fetch filter options on mount
  useEffect(() => {
    dispatch(getFilterOptionsAsync())
  }, [dispatch])

  // Fetch from backend whenever filters/sort change
  useEffect(() => {
    const filters = {
      sort: sortOption,
      limit: 50,
    }
    if (activeCategory !== "All") {
      filters.category = activeCategory.replace(/s$/, "")
    }
    if (debouncedSearch) {
      filters.searchTerm = debouncedSearch
    }
    if (debouncedMaxPrice < 50000) {
      filters.price = debouncedMaxPrice
    }
    if (material) {
      filters.material = material
    }
    if (weaveType) {
      filters.weaveType = weaveType
    }

    dispatch(getAllProductsAsync(filters))
  }, [
    dispatch,
    activeCategory,
    debouncedSearch,
    sortOption,
    debouncedMaxPrice,
    material,
    weaveType,
  ])

  const productData = Array.isArray(storeProducts)
    ? storeProducts
    : storeProducts?.data || []
  let displayProducts = productData

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8 bg-black selection:bg-white/20 selection:text-white relative z-10">
      <HandloomBackground />
      <div className="max-w-[1400px] mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col md:flex-row md:items-end justify-between gap-6"
          >
            <div>
              <h1 className="text-[#FFFDD0] font-serif text-4xl md:text-6xl uppercase tracking-widest mb-2">
                The Shop
              </h1>
              <p className="text-gray-400 text-sm md:text-base max-w-xl">
                Discover our curated collection of authentic handloom weaves.
                Every piece tells a story of heritage.
              </p>
            </div>

            {/* Desktop Search Bar */}
            <div className="hidden md:block w-80">
              <SearchBox
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
              />
            </div>
          </motion.div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <FilterSidebar
            activeCategory={activeCategory}
            setActiveCategory={setActiveCategory}
            isMobileOpen={isMobileFilterOpen}
            setIsMobileOpen={setIsMobileFilterOpen}
            maxPrice={maxPrice}
            setMaxPrice={setMaxPrice}
            material={material}
            setMaterial={setMaterial}
            weaveType={weaveType}
            setWeaveType={setWeaveType}
          />

          {/* Main Content Area */}
          <div className="flex-1">
            {/* Action Bar */}
            <div className="mb-4 md:mb-6 flex flex-row gap-2 md:gap-4 items-center justify-between bg-[#050505] border border-white/5 rounded-xl md:rounded-2xl p-2 md:p-4">
              {/* Mobile Search - Flex-1 so it takes remaining space */}
              <div className="md:hidden flex-1 min-w-[100px]">
                <SearchBox
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                />
              </div>

              {/* View Toggles - Hidden on very small screens, visible on md+ */}
              <div className="hidden sm:flex bg-[#0a0a0a] border border-white/5 rounded-md md:rounded-lg overflow-hidden shrink-0 ml-auto md:ml-0">
                <button
                  onClick={() => changeLayout("list")}
                  className={`p-1.5 md:p-2 transition-colors border-r border-white/5 ${viewMode === "list" ? "text-[#FFFDD0] bg-white/5" : "text-gray-500 hover:text-white"}`}
                >
                  <List size={14} className="md:w-4 md:h-4" />
                </button>
                <button
                  onClick={() => changeLayout("grid")}
                  className={`p-1.5 md:p-2 transition-colors ${viewMode === "grid" ? "text-[#FFFDD0] bg-white/5" : "text-gray-500 hover:text-white"}`}
                >
                  <LayoutGrid size={14} className="md:w-4 md:h-4" />
                </button>
              </div>

              {/* Filter Button */}
              <button
                onClick={() => setIsMobileFilterOpen(true)}
                className="lg:hidden flex items-center justify-center gap-1.5 text-[10px] md:text-xs text-white uppercase tracking-widest bg-transparent hover:bg-white/5 transition-colors px-2.5 py-2 md:px-3 border border-white/10 rounded-md shrink-0"
              >
                <SlidersHorizontal size={12} />{" "}
                <span className="hidden sm:inline">Filter</span>
              </button>

              {/* Sort Dropdown Component */}
              <SortDropdown
                sortOption={sortOption}
                setSortOption={setSortOption}
                isSortOpen={isSortOpen}
                setIsSortOpen={setIsSortOpen}
              />
            </div>

            {/* Products Grid / List */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 px-4 pb-20">
                {Array(8)
                  .fill(0)
                  .map((_, i) => (
                    <CardSkeleton key={i} />
                  ))}
              </div>
            ) : displayProducts.length > 0 ? (
              <>
                <motion.div
                  layout
                  className={`grid gap-3 md:gap-6 ${viewMode === "grid" ? "grid-cols-2 md:grid-cols-3" : "grid-cols-1 lg:grid-cols-2"}`}
                >
                  <AnimatePresence>
                    {displayProducts.slice(0, visibleCount).map((product) => (
                      <motion.div
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.5 }}
                        key={product._id}
                        className="product-card-container"
                      >
                        <ProductCard
                          product={product}
                          isListView={viewMode === "list"}
                        />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>

                {/* Load More / Load Less Buttons */}
                <div className="mt-12 flex justify-center gap-4">
                  {visibleCount < displayProducts.length && (
                    <BrutalistButton
                      onClick={() => setVisibleCount((prev) => prev + 6)}
                      className="px-8 py-3 text-sm"
                    >
                      Load More
                    </BrutalistButton>
                  )}
                  {visibleCount > 6 && (
                    <BrutalistButton
                      onClick={() => {
                        setVisibleCount(6)
                        window.scrollTo({ top: 400, behavior: "smooth" })
                      }}
                      className="px-8 py-3 text-sm opacity-80"
                    >
                      Load Less
                    </BrutalistButton>
                  )}
                </div>
              </>
            ) : (
              <div className="py-20 text-center bg-[#050505] border border-white/5 rounded-3xl">
                <h2 className="text-[#FFFDD0] font-serif text-2xl uppercase tracking-widest mb-2">
                  No Products Found
                </h2>
                <p className="text-gray-400">
                  Try adjusting your search or category filters.
                </p>
                <BrutalistButton
                  className="mt-6 mx-auto px-8 py-3"
                  onClick={() => {
                    setSearchQuery("")
                    setActiveCategory("All")
                    setMaxPrice(50000)
                    setMaterial("")
                    setWeaveType("")
                  }}
                >
                  Clear All Filters
                </BrutalistButton>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Floating AI Chatbot */}
      <FloatingChatbot />

      {/* Scroll To Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 left-6 z-50 p-3 bg-white text-black hover:bg-[#FFFDD0] transition-colors rounded-full shadow-2xl border border-black/10 flex items-center justify-center pointer-events-auto"
          aria-label="Scroll to top"
        >
          <ArrowUp size={20} />
        </button>
      )}
    </div>
  )
}

export default Shop
