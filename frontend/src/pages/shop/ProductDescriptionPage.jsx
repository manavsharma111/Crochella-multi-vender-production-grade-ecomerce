import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useParams, Link } from "react-router-dom"
import { getProductAsync } from "../../redux/slices/productSlice"
import ProductGallery from "../../components/shop/productDetails/ProductGallery"
import ProductInfo from "../../components/shop/productDetails/ProductInfo"
import ProductAccordion from "../../components/shop/productDetails/ProductAccordion"
import ReviewSection from "../../components/shop/reviewSection/ReviewSection"
import RecommendedCarousel from "./RecommendedCarousel"
import { ArrowLeft } from "lucide-react"
import { motion } from "framer-motion"
const ProductDescriptionPage = () => {
  const { id } = useParams()
  const dispatch = useDispatch()
  const { currentProduct: product, isLoading } = useSelector(
    (state) => state.product,
  )
  useEffect(() => {
    if (id) {
      dispatch(getProductAsync(id))
      // Scroll to top when page loads
      window.scrollTo(0, 0)
    }
  }, [dispatch, id])

  const productToDisplay = product

  if (isLoading || !productToDisplay) {
    return (
      <div className="min-h-screen pt-32 pb-20 px-4 flex flex-col items-center justify-center bg-black">
        <div className="inline-block w-16 h-16 border-2 border-[#FFFDD0] border-t-transparent rounded-full animate-spin mb-6"></div>
        <h2 className="text-[#FFFDD0] font-serif text-2xl uppercase tracking-widest animate-pulse">
          Loading Product...
        </h2>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-24 pb-32 lg:pb-20 px-4 sm:px-6 lg:px-8 bg-black selection:bg-white/20 selection:text-white relative z-10">
      <div className="max-w-[1400px] mx-auto">
        {/* Breadcrumb / Back Navigation */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-8"
        >
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 text-gray-500 hover:text-[#FFFDD0] font-serif text-xs uppercase tracking-widest transition-colors group"
          >
            <ArrowLeft
              size={16}
              className="group-hover:-translate-x-1 transition-transform"
            />{" "}
            Back to Shop
          </Link>
        </motion.div>

        {/* Top Section: Gallery & Info */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
          <ProductGallery images={productToDisplay.media} />
          <div className="sticky top-28">
            <ProductInfo product={productToDisplay} />
            <ProductAccordion product={productToDisplay} />
          </div>
        </div>

        {/* Reviews Section */}
        <ReviewSection productId={productToDisplay._id} />

        {/* AI Recommended Products Carousel */}
        <RecommendedCarousel currentProductId={productToDisplay._id} />
      </div>
    </div>
  )
}

export default ProductDescriptionPage
