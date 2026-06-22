import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Star, CheckCircle } from 'lucide-react'

const DeliveryRatingModal = ({ isOpen, onClose, onSubmit, isSubmitting }) => {
    const [rating, setRating] = useState(0)
    const [hover, setHover] = useState(0)

    if (!isOpen) return null

    const handleSubmit = (e) => {
        e.preventDefault()
        if (rating > 0) {
            onSubmit(rating)
        }
    }

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                    onClick={onClose}
                />
                
                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    className="bg-[#111] border border-gray-800 rounded-3xl w-full max-w-sm relative z-10 overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
                >
                    <div className="p-6 border-b border-gray-800 flex justify-between items-center bg-[#0a0a0a]">
                        <h2 className="text-white font-black text-xl uppercase tracking-widest">Rate Delivery Boy</h2>
                        <button 
                            onClick={onClose}
                            className="text-gray-500 hover:text-white transition-colors"
                        >
                            <X size={24} />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6 text-center">
                        <p className="text-gray-400 text-sm mb-6">
                            How was your delivery experience? Your feedback helps us improve our service.
                        </p>
                        
                        <div className="flex justify-center gap-2 mb-8">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setRating(star)}
                                    onMouseEnter={() => setHover(star)}
                                    onMouseLeave={() => setHover(0)}
                                    className="focus:outline-none transition-transform hover:scale-110"
                                >
                                    <Star 
                                        size={36} 
                                        className={star <= (hover || rating) ? "fill-[#ff007f] text-[#ff007f]" : "text-gray-700"} 
                                    />
                                </button>
                            ))}
                        </div>

                        <button 
                            type="submit"
                            disabled={rating === 0 || isSubmitting}
                            className="w-full bg-[#ff007f] hover:bg-[#e60073] disabled:opacity-50 disabled:hover:bg-[#ff007f] text-white py-4 rounded-xl font-bold uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(255,0,127,0.3)] flex items-center justify-center gap-2"
                        >
                            {isSubmitting ? (
                                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                                <>
                                    <CheckCircle size={20} />
                                    Submit Rating
                                </>
                            )}
                        </button>
                    </form>
                </motion.div>
            </div>
        </AnimatePresence>
    )
}

export default DeliveryRatingModal
