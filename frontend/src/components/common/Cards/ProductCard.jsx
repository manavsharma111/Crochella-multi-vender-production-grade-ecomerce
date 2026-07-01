import React, { useState } from "react"
import { Heart, ShoppingCart, Info, FolderPlus } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import {
  toggleWishlistAsync,
  getWishlistAsync,
  toggleProductInCustomWishlistAsync,
  getCustomWishlistsAsync,
} from "../../../redux/slices/wishlistSlice"
import { addToCartAsync } from "../../../redux/slices/cartSlice"
import toast from "react-hot-toast"
import LiquidImageHover from "../animation/LiquidImageHover"

const ProductCard = ({ product, isListView = false }) => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [showCollectionMenu, setShowCollectionMenu] = useState(false)

  const { wishlist, customWishlists } = useSelector((state) => state.wishlist)
  const { isAuthenticated } = useSelector((state) => state.auth)

  // Parse default wishlist
  const defaultWishlistItems = Array.isArray(wishlist)
    ? wishlist
    : wishlist?.wishlist || []
  const isInDefaultWishlist = defaultWishlistItems.some(
    (item) =>
      item.productId?._id === product?._id || item.productId === product?._id,
  )

  // Parse custom wishlists
  const customWishlistItems = Array.isArray(customWishlists)
    ? customWishlists
    : customWishlists?.wishlists || []

  const imageUrl =
    product?.media?.[0]?.url ||
    product?.images?.[0] ||
    `https://images.unsplash.com/photo-1605518216938-7c31b7b14ad0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80`
  const sku = product?._id?.substring(0, 6).toUpperCase() || "HL-024"
  const soldOut = Math.floor(Math.random() * 50) + 10
  const totalStock = 1200
  const inStock = product?.stock || 350
  const stockPercentage = (inStock / totalStock) * 100

  const productName =
    product?.productName || product?.name || "Handloom Silk Saree"

  const handleWishlist = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (product?._id) {
      if (product._id.length !== 24) {
        toast.error(
          "This is a demo product. Add real products from admin to use wishlist!",
        )
        return
      }

      dispatch(toggleWishlistAsync(product._id)).then((res) => {
        if (res.meta.requestStatus === "fulfilled") {
          toast.success(res.payload?.message || "Wishlist updated!")
          dispatch(getWishlistAsync())
        } else {
          toast.error("Please login to add to wishlist")
        }
      })
    }
  }

  const handleCustomWishlistToggle = (e, customWishlistId) => {
    e.preventDefault()
    e.stopPropagation()

    if (product._id.length !== 24) {
      toast.error("This is a demo product!")
      return
    }

    dispatch(
      toggleProductInCustomWishlistAsync({
        customWishlistId,
        productId: product._id,
      }),
    ).then((res) => {
      if (res.meta.requestStatus === "fulfilled") {
        toast.success(res.payload?.message || "Collection updated!")
        dispatch(getCustomWishlistsAsync())
        setShowCollectionMenu(false)
      } else {
        toast.error("Failed to update collection")
      }
    })
  }
  const handleAddToCart = (e) => {
    e.stopPropagation()
    if (product?._id) {
      if (product._id.length !== 24) {
        toast.error("This is a demo product. Cannot add to cart!")
        return
      }

      dispatch(addToCartAsync({ productId: product._id, quantity: 1 })).then(
        (res) => {
          if (res.meta.requestStatus === "fulfilled") {
            toast.success("Added to cart!")
          } else {
            toast.error(res.payload || "Please login to add to cart")
          }
        },
      )
    }
  }

  return (
    <div
      className={`bg-[#050505] border border-white/5 rounded-none transition-all hover:border-white/20 group flex ${isListView ? "flex-row" : "flex-col"} h-full relative z-0 hover:z-10`}
    >
      {/* Image Area */}
      <div
        className={`relative ${isListView ? "w-32 md:w-48 sm:w-64 border-r border-white/5" : "aspect-4/3 border-b border-white/5"} bg-[#0a0a0a] p-2 md:p-4 flex items-center justify-center overflow-hidden shrink-0`}
      >
        {product?.media?.[0]?.type === "video" ? (
          <video
            src={imageUrl}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            autoPlay
            muted
            loop
            playsInline
          />
        ) : (
          <LiquidImageHover
            src={imageUrl}
            alt={productName}
            className="w-full h-full object-cover"
          />
        )}
        {/* Wishlist Buttons */}
        <div className="absolute top-2 right-2 md:top-3 md:right-3 flex flex-col gap-2 z-20">
          <button
            onClick={handleWishlist}
            className="p-1.5 md:p-2 bg-black/40 backdrop-blur-md border border-white/10 text-white rounded-full hover:bg-white hover:text-black transition-all active:translate-y-1"
          >
            <Heart
              size={14}
              className={`md:w-4 md:h-4 transition-colors ${isInDefaultWishlist ? "fill-red-500 text-red-500" : ""}`}
            />
          </button>

          <div className="relative">
            <button
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                setShowCollectionMenu(!showCollectionMenu)
              }}
              className="p-1.5 md:p-2 bg-black/40 backdrop-blur-md border border-white/10 text-white rounded-full hover:bg-white hover:text-black transition-all active:translate-y-1"
            >
              <FolderPlus size={14} className="md:w-4 md:h-4" />
            </button>

            {/* Collections Dropdown */}
            {showCollectionMenu && (
              <div
                className="absolute right-0 top-full mt-2 w-48 bg-[#0a0a0a] border border-white/10 rounded-none shadow-xl overflow-hidden z-30"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="px-3 py-2 border-b border-white/10">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    Save to Collection
                  </span>
                </div>
                <div className="max-h-40 overflow-y-auto custom-scrollbar">
                  {isAuthenticated ? (
                    customWishlistItems.length > 0 ? (
                      customWishlistItems.map((cw) => {
                        const isProductInCw = cw.products?.some(
                          (p) => p._id === product?._id || p === product?._id,
                        )
                        return (
                          <button
                            key={cw._id}
                            onClick={(e) =>
                              handleCustomWishlistToggle(e, cw._id)
                            }
                            className="w-full text-left px-3 py-2 text-xs font-semibold text-gray-400 hover:bg-white/5 hover:text-white transition-colors flex items-center justify-between"
                          >
                            <span className="truncate">{cw.name}</span>
                            {isProductInCw && (
                              <span className="w-2 h-2 rounded-full bg-green-500 shrink-0 ml-2"></span>
                            )}
                          </button>
                        )
                      })
                    ) : (
                      <div className="px-3 py-4 text-xs text-center text-gray-500">
                        No collections yet
                      </div>
                    )
                  ) : (
                    <div className="px-3 py-4 text-xs text-center text-gray-500">
                      Please login first
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
        {/* Badges */}
        {product?.isNew && !isListView && (
          <div className="absolute top-2 left-2 md:top-3 md:left-3 bg-white text-black text-[8px] md:text-[10px] font-bold px-1.5 py-0.5 md:px-2 md:py-1 uppercase tracking-widest border border-white/10">
            New
          </div>
        )}
      </div>

      {/* Content Area */}
      <div className="p-3 md:p-5 flex flex-col flex-1">
        <div className="flex justify-between items-start gap-2 md:gap-4 mb-1 md:mb-2">
          <div className="min-w-0 flex-1">
            <h3 className="text-[#FFFDD0] font-serif text-sm md:text-xl uppercase tracking-widest line-clamp-1 mb-0.5 md:mb-1">
              {productName}
            </h3>
            <p className="text-gray-400 text-[8px] md:text-[10px] uppercase tracking-widest font-bold mb-2 md:mb-3 truncate">
              {product?.category || "Saree"}
            </p>
          </div>
          {product?.isNew && isListView && (
            <div className="hidden md:block bg-white text-black text-[10px] font-bold px-2 py-1 uppercase tracking-widest border border-white/10 shrink-0">
              New
            </div>
          )}
        </div>

        {isListView && (
          <p className="hidden sm:block text-gray-400 text-xs md:text-sm line-clamp-2 mb-4">
            {product?.description ||
              "Authentic traditional hand-woven pure silk saree with intricate zari work."}
          </p>
        )}

        {/* SKU and Stats */}
        <div className="flex justify-between items-center text-[8px] md:text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-2 md:mb-3">
          <span className="truncate mr-2">
            SKU: <span className="text-gray-300">{sku}</span>
          </span>
          <span className="shrink-0">
            Sold: <span className="text-gray-300">{soldOut}</span>
          </span>
        </div>

        {/* Stock Bar */}
        <div className="mb-3 md:mb-5">
          <div className="flex justify-between items-center text-[8px] md:text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1 md:mb-1.5">
            <span>Stock:</span>
            <span>
              <span className="text-gray-300">{inStock}</span> / {totalStock}
            </span>
          </div>
          <div className="h-1 md:h-1.5 w-full bg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-white/40 rounded-full"
              style={{ width: `${stockPercentage}%` }}
            ></div>
          </div>
        </div>

        {/* Price & Action */}
        <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between mt-auto pt-2 md:pt-4 border-t border-white/5 gap-2 xl:gap-0">
          <div className="flex items-center gap-1 md:gap-2 flex-wrap">
            <span className="text-sm md:text-xl font-serif text-[#FFFDD0]">
              ₹{product?.price || "4,999"}
            </span>
            {product?.originalPrice && (
              <span className="text-[10px] md:text-sm text-gray-500 line-through">
                ₹{product.originalPrice}
              </span>
            )}
          </div>
          <div className="flex gap-2 w-full xl:w-auto">
            <button
              onClick={() => navigate(`/product/${product?._id}`)}
              className="w-full xl:w-auto flex items-center justify-center gap-1.5 md:gap-2 bg-transparent text-gray-400 hover:text-white px-2 py-1.5 md:px-4 md:py-2 text-[10px] md:text-xs font-serif uppercase tracking-widest border border-white/10 hover:border-white/30 transition-all"
            >
              <Info size={14} className="md:w-4 md:h-4" />
              <span className="hidden sm:inline">Info</span>
            </button>
            <button
              onClick={handleAddToCart}
              className="w-full xl:w-auto flex items-center justify-center gap-1.5 md:gap-2 bg-white text-black hover:bg-gray-200 px-2 py-1.5 md:px-4 md:py-2 text-[10px] md:text-xs font-serif uppercase tracking-widest transition-all"
            >
              <ShoppingCart size={14} className="md:w-4 md:h-4" />
              {isListView && (
                <span className="hidden sm:inline">Add to Cart</span>
              )}
              {!isListView && (
                <span className="inline xl:hidden uppercase text-[8px] tracking-widest">
                  ADD
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductCard
