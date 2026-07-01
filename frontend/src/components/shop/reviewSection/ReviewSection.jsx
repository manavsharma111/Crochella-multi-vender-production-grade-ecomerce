import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import {
  getProductReviewsAsync,
  socketAddReview,
  socketUpdateReview,
  socketDeleteReview,
} from "../../../redux/slices/reviewSlice"
import { io } from "socket.io-client"
import StarRating from "./StarRating"
import ReviewForm from "./ReviewForm"
import ReviewList from "./ReviewList"
import { motion } from "framer-motion"

const ReviewSection = ({ productId }) => {
  const dispatch = useDispatch()
  const { reviews, loading } = useSelector((state) => state.review)

  useEffect(() => {
    if (productId) {
      dispatch(getProductReviewsAsync(productId))

      const socket = io(import.meta.env.VITE_BACKEND_URL, {
        withCredentials: true,
      })

      socket.emit("joinProductRoom", productId)

      socket.on("newReview", (review) => {
        dispatch(socketAddReview(review))
      })

      socket.on("updateReview", (review) => {
        dispatch(socketUpdateReview(review))
      })

      socket.on("deleteReview", (reviewId) => {
        dispatch(socketDeleteReview(reviewId))
      })

      return () => {
        socket.disconnect()
      }
    }
  }, [dispatch, productId])

  const totalReviews = reviews.length
  const averageRating =
    totalReviews > 0
      ? (
          reviews.reduce((acc, curr) => acc + curr.rating, 0) / totalReviews
        ).toFixed(1)
      : 0

  return (
    <div className="w-full mt-8 lg:mt-12">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mb-10 pb-6 border-b border-gray-800"
      >
        <div>
          <h2 className="text-3xl font-black text-white uppercase tracking-widest mb-4">
            Customer Reviews
          </h2>
          <div className="flex items-center gap-4">
            <div className="text-5xl font-black text-[#ff007f]">
              {averageRating}
            </div>
            <div>
              <StarRating rating={Number(averageRating)} readonly size={20} />
              <p className="text-sm text-gray-500 font-bold mt-1">
                Based on {totalReviews} reviews
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
        className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-10"
      >
        <div className="lg:col-span-8">
          {loading && reviews.length === 0 ? (
            <div className="py-20 text-center">
              <div className="inline-block w-8 h-8 border-4 border-[#ff007f] border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <ReviewList reviews={reviews} />
          )}
        </div>
        <div className="lg:col-span-4 lg:-mt-4">
          <div className="sticky top-28">
            <ReviewForm productId={productId} />
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default ReviewSection
