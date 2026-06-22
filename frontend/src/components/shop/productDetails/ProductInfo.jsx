import { useState } from 'react'
import { motion } from 'framer-motion'
import { ShoppingCart, Heart, ShieldCheck, Truck, RefreshCw } from 'lucide-react'
import StarRating from '../reviewSection/StarRating'
import { useDispatch, useSelector } from 'react-redux'
import { addToCartAsync } from '../../../redux/slices/cartSlice'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

const ProductInfo = ({ product }) => {
  const dispatch = useDispatch()
  const [quantity, setQuantity] = useState(1)
  const [isAdding, setIsAdding] = useState(false)

  if (!product) return null

  const navigate = useNavigate()

  const handleAddToCart = async () => {
    setIsAdding(true)
    const res = await dispatch(addToCartAsync({
      productId: product._id,
      quantity,
      sku: product._id.substring(0, 6).toUpperCase()
    }))
    if (res.meta.requestStatus === 'fulfilled') {
      toast.success("Added to cart successfully!")
    } else {
      toast.error(res.payload || "Please login to add to cart")
    }
    setIsAdding(false)
  }

  const handleBuyNow = async () => {
    setIsAdding(true)
    const res = await dispatch(addToCartAsync({
      productId: product._id,
      quantity,
      sku: product._id.substring(0, 6).toUpperCase()
    }))
    if (res.meta.requestStatus === 'fulfilled') {
      toast.success("Added to cart!")
      navigate('/cart')
    } else {
      toast.error(res.payload || "Please login to buy")
    }
    setIsAdding(false)
  }

  const { reviews } = useSelector((state) => state.review)

  // Dynamically calculate rating so it updates instantly when user submits a new review
  const activeReviews = reviews && reviews.length > 0 ? reviews : []
  const totalReviews = activeReviews.length
  const dynamicRating = totalReviews > 0 
    ? (activeReviews.reduce((acc, curr) => acc + curr.rating, 0) / totalReviews)
    : (product.rating || 0)
  const displayNumReviews = totalReviews > 0 ? totalReviews : (product.numReviews || 0)

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="flex flex-col gap-6 w-full"
    >
      <motion.div variants={itemVariants}>
        <div className="flex items-center gap-2 mb-2">
          {product.category && (
            <span className="bg-white/10 text-[#FFFDD0] text-[10px] font-serif uppercase tracking-widest px-2 py-1 border border-white/5">
              {product.category}
            </span>
          )}
          {product.isFlashSale && (
            <span className="bg-white/10 text-white text-[10px] font-serif uppercase tracking-widest px-2 py-1 border border-white/5">
              Flash Sale
            </span>
          )}
        </div>
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif text-[#FFFDD0] uppercase tracking-widest mb-2">
          {product.productName || 'Premium Product'}
        </h1>

        {/* Rating Summary */}
        <div className="flex items-center gap-2 mt-2">
          <StarRating rating={dynamicRating} readonly size={16} />
          <span className="text-gray-400 text-sm font-serif tracking-widest uppercase">
            {dynamicRating > 0 ? dynamicRating.toFixed(1) : 'New'} ({displayNumReviews} Reviews)
          </span>
        </div>
      </motion.div>

      {/* Price */}
      <motion.div variants={itemVariants} className="flex items-end gap-3 pb-6 border-b border-white/5">
        <span className="text-4xl font-serif text-[#FFFDD0]">
          ₹{product.isFlashSale && product.flashSalePrice ? product.flashSalePrice : product.price}
        </span>
        {(product.discountPrice > 0 || product.isFlashSale) && (
          <span className="text-xl text-gray-500 line-through font-serif mb-1">
            ₹{product.price}
          </span>
        )}
      </motion.div>

      {/* Description */}
      <motion.div variants={itemVariants}>
        <p className="text-gray-400 text-sm leading-relaxed font-serif tracking-wide">
          {product.description}
        </p>
      </motion.div>

      {/* Actions */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 mt-4">
        {/* Quantity Selector */}
        <div className="flex items-center bg-transparent border border-white/10 h-14 px-2 shrink-0 w-full sm:w-32 justify-between">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="text-gray-400 hover:text-white p-2 transition-colors font-serif text-lg"
          >
            -
          </button>
          <span className="text-[#FFFDD0] font-serif">{quantity}</span>
          <button
            onClick={() => setQuantity(quantity + 1)}
            className="text-gray-400 hover:text-white p-2 transition-colors font-serif text-lg"
          >
            +
          </button>
        </div>

        {/* Buttons */}
        <div className="flex gap-2 flex-1">
          <button
            onClick={handleBuyNow}
            disabled={isAdding}
            className="flex-1 bg-transparent text-[#FFFDD0] border border-white/10 hover:border-[#FFFDD0] h-14 font-serif uppercase tracking-widest text-xs transition-all flex items-center justify-center disabled:opacity-50"
          >
            Buy Now
          </button>
          <button
            onClick={handleAddToCart}
            disabled={isAdding}
            className="flex-1 bg-white text-black border border-white h-14 font-serif uppercase tracking-widest text-xs transition-all hover:bg-gray-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isAdding ? (
              <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-5 h-5"></span>
            ) : (
              <>
                <ShoppingCart size={16} /> Add To Cart
              </>
            )}
          </button>
          <button className="h-14 w-14 shrink-0 bg-transparent border border-white/10 hover:border-white hover:text-white flex items-center justify-center text-gray-400 transition-all">
            <Heart size={20} />
          </button>
        </div>
      </motion.div>

      {/* Meta info */}
      <motion.div variants={itemVariants} className="mt-6 pt-6 border-t border-white/5 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex items-center gap-3 text-sm text-gray-400 font-serif tracking-wider uppercase">
          <ShieldCheck size={18} className="text-[#FFFDD0]" />
          <span>1 Year Premium Warranty</span>
        </div>
        <div className="flex items-center gap-3 text-sm text-gray-400 font-serif tracking-wider uppercase">
          <Truck size={18} className="text-[#FFFDD0]" />
          <span>Free Express Shipping</span>
        </div>
        <div className="flex items-center gap-3 text-sm text-gray-400 font-serif tracking-wider uppercase">
          <RefreshCw size={18} className="text-[#FFFDD0]" />
          <span>30-Day Easy Returns</span>
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="mt-4 pt-4 border-t border-white/5 space-y-2">
        <p className="text-xs text-gray-500 font-serif">
          <span className="text-gray-400 uppercase tracking-widest">Item Code:</span> {product._id.substring(0, 8).toUpperCase()}
        </p>
        <p className="text-xs text-gray-500 font-serif">
          <span className="text-gray-400 uppercase tracking-widest">Tags:</span> {product.category}, {product.material}, {product.weaveType}
        </p>
      </motion.div>

    </motion.div>
  )
}

export default ProductInfo
