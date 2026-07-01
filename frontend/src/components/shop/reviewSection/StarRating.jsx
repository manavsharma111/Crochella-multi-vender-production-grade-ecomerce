import { useState } from "react"
import { Star } from "lucide-react"

const StarRating = ({ rating, setRating, readonly = false, size = 20 }) => {
  const [hover, setHover] = useState(0)

  return (
    <div
      className="flex items-center gap-1"
      onMouseLeave={() => !readonly && setHover(0)}
    >
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={(e) => {
            if (readonly) return
            setRating && setRating(star)
            setHover(star)
          }}
          onMouseEnter={() => !readonly && setHover(star)}
          disabled={readonly}
          className={`${
            readonly
              ? "cursor-default"
              : "cursor-pointer active:scale-110 transition-transform"
          } focus:outline-none select-none`}
        >
          <Star
            size={size}
            className={`${
              star <= (hover || rating)
                ? "fill-[#ff007f] text-[#ff007f]"
                : "fill-transparent text-gray-600"
            } transition-colors pointer-events-none`}
          />
        </button>
      ))}
    </div>
  )
}

export default StarRating
