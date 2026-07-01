import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import StarRating from "./StarRating"
import { User, Calendar, Edit2, Trash2, X, Check } from "lucide-react"
import { useDispatch, useSelector } from "react-redux"
import {
  deleteReviewAsync,
  editReviewAsync,
} from "../../../redux/slices/reviewSlice"

const ReviewList = ({ reviews = [] }) => {
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)

  const [editingId, setEditingId] = useState(null)
  const [editComment, setEditComment] = useState("")
  const [editRating, setEditRating] = useState(5)
  const [visibleCount, setVisibleCount] = useState(3)

  // Sort reviews newest first, handling missing createdAt robustly
  const sortedReviews = [...reviews].sort((a, b) => {
    const dateA = a.createdAt ? new Date(a.createdAt).getTime() : Date.now()
    const dateB = b.createdAt ? new Date(b.createdAt).getTime() : Date.now()
    return dateB - dateA
  })
  const visibleReviews = sortedReviews.slice(0, visibleCount)

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 3)
  }

  if (!reviews || reviews.length === 0) {
    return (
      <div className="text-center py-12 bg-[#111] border-2 border-dashed border-gray-800 rounded-3xl">
        <h3 className="text-white font-black uppercase tracking-widest mb-2">
          No Reviews Yet
        </h3>
        <p className="text-gray-500 text-sm">
          Be the first to share your thoughts on this product!
        </p>
      </div>
    )
  }

  const handleDelete = (reviewId) => {
    if (window.confirm("Are you sure you want to delete this review?")) {
      dispatch(deleteReviewAsync(reviewId))
    }
  }

  const startEdit = (review) => {
    setEditingId(review._id)
    setEditComment(review.comment)
    setEditRating(review.rating)
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditComment("")
  }

  const saveEdit = (reviewId) => {
    if (!editComment.trim()) return
    dispatch(
      editReviewAsync({
        reviewId,
        reviewData: { comment: editComment, rating: editRating },
      }),
    )
    setEditingId(null)
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring" } },
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-4"
    >
      <AnimatePresence>
        {visibleReviews.map((review) => {
          const isOwner =
            user &&
            review.buyer &&
            (user.id === review.buyer._id || user._id === review.buyer._id)
          const isEditing = editingId === review._id

          return (
            <motion.div
              key={review._id}
              variants={itemVariants}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
              className={`bg-[#111] p-6 rounded-2xl border-2 transition-colors relative ${isEditing ? "border-[#ff007f]" : "border-gray-800 hover:border-gray-600"}`}
            >
              {/* Ownership Actions */}
              {isOwner && !isEditing && (
                <div className="absolute top-4 right-4 flex gap-2">
                  <button
                    onClick={() => startEdit(review)}
                    className="text-gray-500 hover:text-white transition-colors p-1"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(review._id)}
                    className="text-gray-500 hover:text-red-500 transition-colors p-1"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              )}

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 pr-12">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#0a0a0a] rounded-full border border-gray-700 flex items-center justify-center text-gray-400">
                    <User size={20} />
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-sm">
                      {review.buyer?.name || "Anonymous User"}
                    </h4>
                    <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                      <Calendar size={12} />
                      {new Date(review.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </div>
                  </div>
                </div>
                {isEditing ? (
                  <StarRating
                    rating={editRating}
                    setRating={setEditRating}
                    size={16}
                  />
                ) : (
                  <StarRating rating={review.rating} readonly size={16} />
                )}
              </div>

              {isEditing ? (
                <div className="mt-4">
                  <textarea
                    value={editComment}
                    onChange={(e) => setEditComment(e.target.value)}
                    className="w-full bg-[#050505] border border-gray-700 rounded-lg p-3 text-white text-sm focus:outline-none focus:border-[#ff007f] resize-none h-24 mb-3"
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={cancelEdit}
                      className="flex items-center gap-1 text-xs font-bold text-gray-400 hover:text-white px-3 py-1.5 rounded bg-gray-800"
                    >
                      <X size={14} /> Cancel
                    </button>
                    <button
                      onClick={() => saveEdit(review._id)}
                      className="flex items-center gap-1 text-xs font-bold text-white px-3 py-1.5 rounded bg-[#ff007f] hover:bg-[#d00068]"
                    >
                      <Check size={14} /> Save
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <p className="text-gray-300 text-sm leading-relaxed mb-3">
                    {review.comment}
                  </p>
                  {/* Media Display */}
                  {review.media && review.media.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {review.media.map((mediaItem, idx) => {
                        const url =
                          typeof mediaItem === "string"
                            ? mediaItem
                            : mediaItem.url
                        const type =
                          typeof mediaItem === "string"
                            ? url.includes("video") ||
                              url.includes("mp4") ||
                              (url.includes("blob") && !url.includes("image"))
                              ? "video"
                              : "image"
                            : mediaItem.type

                        return (
                          <div
                            key={idx}
                            className="w-16 h-16 rounded-md overflow-hidden border border-gray-700 bg-black"
                          >
                            {type === "video" ? (
                              <video
                                src={url}
                                className="w-full h-full object-cover"
                                controls
                                muted
                              />
                            ) : (
                              <img
                                src={url}
                                alt="review media"
                                className="w-full h-full object-cover"
                              />
                            )}
                          </div>
                        )
                      })}
                    </div>
                  )}
                </>
              )}
            </motion.div>
          )
        })}
      </AnimatePresence>

      {(visibleCount < sortedReviews.length || visibleCount > 3) && (
        <div className="flex justify-center gap-4 mt-8">
          {visibleCount < sortedReviews.length && (
            <button
              onClick={handleLoadMore}
              className="text-xs font-bold uppercase tracking-widest text-white border-2 border-gray-800 hover:border-[#ff007f] hover:text-[#ff007f] px-6 py-2.5 rounded-full transition-colors"
            >
              Load More Reviews
            </button>
          )}
          {visibleCount > 3 && (
            <button
              onClick={() => setVisibleCount(3)}
              className="text-xs font-bold uppercase tracking-widest text-gray-400 border-2 border-gray-800 hover:border-gray-500 hover:text-white px-6 py-2.5 rounded-full transition-colors"
            >
              Show Less Reviews
            </button>
          )}
        </div>
      )}
    </motion.div>
  )
}

export default ReviewList
