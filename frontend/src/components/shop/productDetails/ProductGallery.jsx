import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const ProductGallery = ({ images = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0)

  // Normalize images to be objects with url and type
  const displayImages = images.length > 0 
    ? images.map(img => typeof img === 'string' ? { url: img, type: 'image' } : img) 
    : [{ url: 'https://images.unsplash.com/photo-1605518216938-7c31b7b14ad0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', type: 'image' }]

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % displayImages.length)
  }

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + displayImages.length) % displayImages.length)
  }

  return (
    <div className="flex flex-col-reverse lg:flex-row gap-4 lg:gap-6 h-full">
      {/* Thumbnails */}
      <div className="flex lg:flex-col gap-3 overflow-x-auto lg:overflow-y-auto scrollbar-hide w-full lg:w-24 shrink-0 p-1">
        {displayImages.map((img, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`relative w-20 h-24 shrink-0 rounded-xl overflow-hidden border-2 transition-all duration-300 ${
              currentIndex === idx 
                ? 'border-[#ff007f] shadow-[2px_2px_0px_#ff007f] scale-105' 
                : 'border-gray-800 hover:border-gray-600 opacity-60 hover:opacity-100'
            }`}
          >
            {img.type === 'video' ? (
              <video src={img.url} className="w-full h-full object-cover" muted playsInline />
            ) : (
              <img src={img.url} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
            )}
          </button>
        ))}
      </div>

      {/* Main Image Container */}
      <div className="relative w-full aspect-square lg:aspect-auto lg:h-[600px] bg-[#0a0a0a] border-2 border-gray-800 rounded-2xl shadow-[6px_6px_0px_#000] overflow-hidden flex items-center justify-center group">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.3 }}
            className="w-full h-full"
          >
            {displayImages[currentIndex].type === 'video' ? (
              <video 
                src={displayImages[currentIndex].url} 
                className="w-full h-full object-contain"
                autoPlay 
                controls 
                playsInline
              />
            ) : (
              <img
                src={displayImages[currentIndex].url}
                alt="Product Image"
                className="w-full h-full object-cover"
              />
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation Arrows */}
        {displayImages.length > 1 && (
          <>
            <button 
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-[#111]/80 backdrop-blur-sm text-white p-2 rounded-full border-2 border-gray-700 hover:border-[#ff007f] hover:text-[#ff007f] transition-all opacity-0 group-hover:opacity-100"
            >
              <ChevronLeft size={24} />
            </button>
            <button 
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-[#111]/80 backdrop-blur-sm text-white p-2 rounded-full border-2 border-gray-700 hover:border-[#ff007f] hover:text-[#ff007f] transition-all opacity-0 group-hover:opacity-100"
            >
              <ChevronRight size={24} />
            </button>
          </>
        )}
      </div>
    </div>
  )
}

export default ProductGallery
