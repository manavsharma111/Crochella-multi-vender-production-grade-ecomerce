import { useEffect, useRef, useState } from "react"
import { gsap } from "gsap"
import { CustomEase } from "gsap/CustomEase"

// Register the CustomEase plugin
gsap.registerPlugin(CustomEase)

// Lenis-style cubic-bezier — slow start, very smooth deceleration
CustomEase.create("lenis", "M0,0,C0.075,0.82,0.165,1,1,1")

/**
 * Lenis-style ink wipe hover:
 *   Enter → fills from BOTTOM → TOP  (smooth, weighted ease out)
 *   Leave → exits going UPWARD       (bottom shrinks toward top)
 */
export default function Hover({ children, className = "", fillColor = "#ff007f" }) {
  const wrapRef = useRef(null)
  const fillRef = useRef(null)

  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    // Initial check
    checkMobile()
    
    // Listen for resize (useful when toggling devtools)
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    if (isMobile) return

    const wrap = wrapRef.current
    const fill = fillRef.current
    if (!wrap || !fill) return

    // Always hide the fill initially — BEFORE the touch check
    gsap.set(fill, {
      scaleY: 0,
      transformOrigin: "bottom center",
      force3D: true,
    })

    // Skip on touch devices — hover doesn't exist on mobile
    const isTouch = window.matchMedia("(hover: none)").matches
    if (isTouch) return

    const onEnter = () => {
      gsap.killTweensOf(fill)
      gsap.to(fill, {
        scaleY: 1,
        duration: 0.65,
        ease: "lenis",                    // custom Lenis-style ease
        transformOrigin: "bottom center",
        force3D: true,
        overwrite: true,
      })
    }

    const onLeave = () => {
      gsap.killTweensOf(fill)
      gsap.to(fill, {
        scaleY: 0,
        duration: 0.55,
        ease: "lenis",
        transformOrigin: "top center",   // shrinks upward
        force3D: true,
        overwrite: true,
      })
    }

    wrap.addEventListener("mouseenter", onEnter)
    wrap.addEventListener("mouseleave", onLeave)

    return () => {
      wrap.removeEventListener("mouseenter", onEnter)
      wrap.removeEventListener("mouseleave", onLeave)
    }
  }, [fillColor])
  if (isMobile) {
    return <div className={className}>{children}</div>
  }

  return (
    <div
      ref={wrapRef}
      className={`relative overflow-hidden ${className}`}
      style={{ isolation: "isolate" }}
    >
      {/* GPU-accelerated fill layer */}
      <div
        ref={fillRef}
        aria-hidden="true"
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          backgroundColor: fillColor,
          willChange: "transform",
        }}
      />
      {/* Content always on top */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}