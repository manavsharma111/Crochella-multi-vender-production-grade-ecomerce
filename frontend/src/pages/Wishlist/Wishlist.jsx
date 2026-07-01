import React, { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { motion, AnimatePresence } from "framer-motion"
import {
  getWishlistAsync,
  getCustomWishlistsAsync,
  toggleWishlistAsync,
  deleteCustomWishlistAsync,
  createCustomWishlistAsync,
} from "../../redux/slices/wishlistSlice"
import ProductCard from "../../components/common/Cards/ProductCard"
import CustomCollectionCard from "../../components/user/CustomCollectionCard"
import BrutalistButton from "../../components/common/Buttons/BrutalistButton"
import { Heart, Folder, Plus, Trash2, ArrowRight } from "lucide-react"
import { useNavigate } from "react-router-dom"

const Wishlist = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { wishlist, customWishlists, isLoading } = useSelector(
    (state) => state.wishlist,
  )
  const { isAuthenticated } = useSelector((state) => state.auth)

  const [activeTab, setActiveTab] = useState("default")
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [newCollectionName, setNewCollectionName] = useState("")
  const [newCollectionDesc, setNewCollectionDesc] = useState("")
  const [isCreating, setIsCreating] = useState(false)

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(getWishlistAsync())
      dispatch(getCustomWishlistsAsync())
    }
  }, [dispatch, isAuthenticated])

  // Safely extract arrays
  const defaultWishlistItems = Array.isArray(wishlist)
    ? wishlist
    : wishlist?.wishlist || []
  const customWishlistItems = Array.isArray(customWishlists)
    ? customWishlists
    : customWishlists?.wishlists || []

  const handleRemoveDefault = (productId) => {
    dispatch(toggleWishlistAsync(productId)).then(() => {
      dispatch(getWishlistAsync())
    })
  }

  const handleDeleteCustom = (id) => {
    dispatch(deleteCustomWishlistAsync(id)).then(() => {
      dispatch(getCustomWishlistsAsync())
    })
  }

  const handleCreateCollection = (e) => {
    e.preventDefault()
    if (!newCollectionName.trim()) return

    setIsCreating(true)
    dispatch(
      createCustomWishlistAsync({
        name: newCollectionName,
        description: newCollectionDesc,
      }),
    )
      .then(() => {
        setIsCreateModalOpen(false)
        setNewCollectionName("")
        setNewCollectionDesc("")
        dispatch(getCustomWishlistsAsync())
      })
      .finally(() => setIsCreating(false))
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center text-white p-4">
        <Heart size={64} className="text-gray-600 mb-6" />
        <h2 className="text-3xl font-bold mb-4 uppercase tracking-wider">
          Please Login
        </h2>
        <p className="text-gray-400 mb-8 max-w-md text-center">
          You need to be logged in to view your wishlist and saved collections.
        </p>
        <button
          onClick={() => navigate("/")}
          className="px-8 py-3 bg-[#ff007f] text-white font-bold rounded-xl"
        >
          Go Home
        </button>
      </div>
    )
  }

  return (
    <div className="relative z-10 min-h-screen bg-[#050505] text-white pt-24 px-4 pb-32">
      {/* Edgy background effects */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-[#ff007f]/5 blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-600/5 blur-[120px]"></div>
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center mb-16"
        >
          <div className="inline-block px-3 py-1 bg-white/5 text-gray-300 text-xs font-black tracking-widest uppercase mb-4 border border-white/10 rounded-full">
            Your Sanctuary
          </div>
          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-4 text-transparent bg-clip-text bg-linear-to-r from-white via-gray-200 to-gray-500">
            My Wishlist
          </h1>
          <p className="text-gray-400 font-serif max-w-xl text-center">
            Curate your personal collection of extraordinary pieces.
          </p>
        </motion.div>

        {/* Tabs */}
        <div className="flex justify-center gap-4 mb-16 relative z-20">
          <button
            onClick={() => setActiveTab("default")}
            className={`flex items-center gap-2 px-8 py-4 text-xs font-black tracking-widest uppercase rounded-2xl transition-all duration-300 border-2 ${activeTab === "default" ? "bg-[#ff007f] text-white border-black shadow-[4px_4px_0px_#000]" : "bg-transparent text-gray-400 border-white/10 hover:border-white/30 hover:text-white"}`}
          >
            <Heart
              size={16}
              className={activeTab === "default" ? "fill-white" : ""}
            />{" "}
            Default Collection
            <span
              className={`ml-2 px-2 py-0.5 rounded-full text-[10px] ${activeTab === "default" ? "bg-black/20" : "bg-white/10"}`}
            >
              {defaultWishlistItems.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab("custom")}
            className={`flex items-center gap-2 px-8 py-4 text-xs font-black tracking-widest uppercase rounded-2xl transition-all duration-300 border-2 ${activeTab === "custom" ? "bg-[#ff007f] text-white border-black shadow-[4px_4px_0px_#000]" : "bg-transparent text-gray-400 border-white/10 hover:border-white/30 hover:text-white"}`}
          >
            <Folder size={16} /> Custom Collections
            <span
              className={`ml-2 px-2 py-0.5 rounded-full text-[10px] ${activeTab === "custom" ? "bg-black/20" : "bg-white/10"}`}
            >
              {customWishlistItems.length}
            </span>
          </button>
        </div>

        {/* Default Wishlist Content */}
        {activeTab === "default" && (
          <motion.div
            key="default"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full"
          >
            {defaultWishlistItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 bg-white/5 rounded-3xl border border-white/10">
                <Heart size={64} className="text-white/20 mb-4" />
                <h3 className="text-2xl font-bold mb-2">
                  Your wishlist is empty
                </h3>
                <p className="text-gray-400 mb-6">
                  Start saving your favorite products!
                </p>
                <button
                  onClick={() => navigate("/shop")}
                  className="flex items-center gap-2 px-6 py-3 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-colors"
                >
                  Browse Shop <ArrowRight size={16} />
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                <AnimatePresence>
                  {defaultWishlistItems.map((item) => {
                    const product = item.productId
                    if (!product) return null
                    return (
                      <motion.div
                        key={item._id}
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="relative group"
                      >
                        <ProductCard product={product} />
                        <button
                          onClick={() => handleRemoveDefault(product._id)}
                          className="absolute top-4 right-4 p-2 bg-red-500/80 text-white rounded-full opacity-0 group-hover:opacity-100 hover:bg-red-600 transition-all z-10"
                        >
                          <Trash2 size={16} />
                        </button>
                      </motion.div>
                    )
                  })}
                </AnimatePresence>
              </div>
            )}
          </motion.div>
        )}

        {/* Custom Wishlists Content */}
        {activeTab === "custom" && (
          <motion.div
            key="custom"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full"
          >
            <div className="flex justify-end mb-6">
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="flex items-center gap-2 px-5 py-2.5 bg-white/10 border border-white/20 rounded-xl hover:bg-white/20 transition-all font-semibold text-sm"
              >
                <Plus size={16} /> Create Collection
              </button>
            </div>

            {customWishlistItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 bg-white/5 rounded-3xl border border-white/10">
                <Folder size={64} className="text-white/20 mb-4" />
                <h3 className="text-2xl font-bold mb-2">
                  No custom collections yet
                </h3>
                <p className="text-gray-400 mb-6">
                  Group your favorite items into collections.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {customWishlistItems.map((cw) => (
                  <CustomCollectionCard
                    key={cw._id}
                    collection={cw}
                    onDelete={handleDeleteCustom}
                  />
                ))}
              </div>
            )}
          </motion.div>
        )}
      </div>

      {/* Create Collection Modal */}
      <AnimatePresence>
        {isCreateModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-[#111] border-2 border-gray-800 rounded-3xl p-6 md:p-8 w-full max-w-md shadow-[8px_8px_0px_#000]"
            >
              <h2 className="text-2xl font-black uppercase tracking-widest mb-6 text-white">
                Create Collection
              </h2>
              <form onSubmit={handleCreateCollection} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
                    Collection Name
                  </label>
                  <input
                    type="text"
                    value={newCollectionName}
                    onChange={(e) => setNewCollectionName(e.target.value)}
                    placeholder="E.g., Summer Wardrobe"
                    className="w-full bg-[#050505] border-2 border-gray-800 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:border-[#ff007f] outline-none transition-colors"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
                    Description (Optional)
                  </label>
                  <textarea
                    value={newCollectionDesc}
                    onChange={(e) => setNewCollectionDesc(e.target.value)}
                    placeholder="What's this collection about?"
                    className="w-full bg-[#050505] border-2 border-gray-800 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:border-[#ff007f] outline-none transition-colors h-24 resize-none"
                  ></textarea>
                </div>
                <div className="flex gap-4 mt-8">
                  <button
                    type="button"
                    onClick={() => setIsCreateModalOpen(false)}
                    className="flex-1 px-4 py-3 border-2 border-gray-800 text-gray-400 font-bold uppercase tracking-widest rounded-xl hover:text-white hover:border-gray-600 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isCreating}
                    className="flex-1 px-4 py-3 bg-[#ff007f] border-2 border-black text-white font-bold uppercase tracking-widest rounded-xl hover:-translate-y-1 shadow-[4px_4px_0px_#000] hover:shadow-[6px_6px_0px_#000] transition-all disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-[4px_4px_0px_#000]"
                  >
                    {isCreating ? "Creating..." : "Create"}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Wishlist
