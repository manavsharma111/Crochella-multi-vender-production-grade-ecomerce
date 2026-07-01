import React, { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { addReviewAsync } from "../../../redux/slices/reviewSlice"
import StarRating from "./StarRating"
import { motion, AnimatePresence } from "framer-motion"
import { Send, Image as ImageIcon, X, Play } from "lucide-react"

const ReviewForm = ({ productId }) => {
  const dispatch = useDispatch()
  const { isAuthenticated } = useSelector((state) => state.auth)
  const { loading, error } = useSelector((state) => state.review)

  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState("")
  const [media, setMedia] = useState([]) // Array of objects: { url, type, file }

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files)
    if (files.length === 0) return

    const newMedia = files.map((file) => ({
      url: URL.createObjectURL(file),
      type: file.type.startsWith("video/") ? "video" : "image",
      file,
    }))
    setMedia((prev) => [...prev, ...newMedia])
  }

  const removeMedia = (index) => {
    setMedia((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!comment.trim()) return

    // In a real scenario, you'd upload the 'media.file' to S3/Cloudinary here
    // and pass the returned URLs in the reviewData.media array.
    // For now, we'll just pass the local object URLs for UI demonstration.
    const formattedMedia = media.map((m) => ({ url: m.url, type: m.type }))

    const result = await dispatch(
      addReviewAsync({
        productId,
        reviewData: { rating, comment, media: formattedMedia },
      }),
    )

    // Only clear form if submission actually succeeded
    if (result.meta.requestStatus === "fulfilled") {
      setComment("")
      setRating(5)
      setMedia([])
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="bg-[#111] border-2 border-gray-800 rounded-2xl p-6 text-center">
        <h3 className="text-white font-black uppercase tracking-widest mb-2">
          Write a Review
        </h3>
        <p className="text-gray-400 text-sm mb-4">
          You must be logged in to share your experience.
        </p>
        <button className="bg-[#ff007f] text-white px-6 py-2.5 rounded-lg font-black uppercase tracking-widest text-xs border-2 border-[#ff007f] hover:bg-transparent transition-colors">
          Log In Now
        </button>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[#0a0a0a] border-2 border-gray-800 rounded-2xl p-6 relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-28 h-28 bg-[#ff007f]/5 rounded-full blur-3xl -z-10"></div>

      <h3 className="text-white font-black uppercase tracking-widest mb-4">
        Write a Review
      </h3>

      {error && (
        <div className="bg-red-500/10 border border-red-500 text-red-500 p-3 rounded-lg mb-4 text-sm font-bold">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
        <div>
          <label className="block text-xs text-gray-500 font-bold uppercase tracking-widest mb-2">
            Your Rating
          </label>
          <StarRating rating={rating} setRating={setRating} size={28} />
        </div>

        <div>
          <label className="block text-xs text-gray-500 font-bold uppercase tracking-widest mb-2">
            Your Review
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            required
            placeholder="Tell us what you think about this product..."
            className="w-full bg-[#111] border-2 border-gray-800 rounded-xl p-4 text-white placeholder-gray-600 focus:outline-none focus:border-[#ff007f] transition-colors resize-none h-24"
          ></textarea>
        </div>

        {/* Media Upload & Preview */}
        <div>
          {media.length > 0 && (
            <div className="flex flex-wrap gap-3 mb-3">
              <AnimatePresence>
                {media.map((m, idx) => (
                  <motion.div
                    key={m.url}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="relative w-20 h-20 rounded-lg overflow-hidden border border-gray-700 bg-black group"
                  >
                    {m.type === "video" ? (
                      <div className="w-full h-full flex items-center justify-center bg-gray-900">
                        <Play size={20} className="text-gray-500" />
                      </div>
                    ) : (
                      <img
                        src={m.url}
                        alt="upload preview"
                        className="w-full h-full object-cover"
                      />
                    )}
                    <button
                      type="button"
                      onClick={() => removeMedia(idx)}
                      className="absolute top-1 right-1 bg-black/60 p-1 rounded-full text-white hover:bg-red-500 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <X size={12} />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}

          <label className="inline-flex items-center gap-2 px-4 py-2 bg-[#111] border border-gray-800 hover:border-gray-600 rounded-lg text-sm text-gray-400 hover:text-white cursor-pointer transition-colors">
            <ImageIcon size={16} />
            <span>Add Photos/Video</span>
            <input
              type="file"
              accept="image/*,video/*"
              multiple
              className="hidden"
              onChange={handleFileChange}
            />
          </label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#ff007f] text-white border-2 border-[#ff007f] hover:bg-transparent px-8 py-3 rounded-xl font-black uppercase tracking-widest text-xs transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
        >
          {loading ? "Submitting..." : "Submit Review"}
          {!loading && (
            <Send
              size={16}
              className="group-hover:translate-x-1 transition-transform"
            />
          )}
        </button>
      </form>
    </motion.div>
  )
}

export default ReviewForm
