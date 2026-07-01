import { useEffect, useRef } from "react"
import gsap from "gsap"

const PremiumPreloader = ({ triggerExit }) => {
  const containerRef = useRef(null)
  const threadRef = useRef(null)
  const textRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: triggerExit,
      })

      // Animate the thread drawing
      tl.fromTo(
        threadRef.current,
        { strokeDasharray: 2000, strokeDashoffset: 2000 },
        { strokeDashoffset: 0, duration: 2.5, ease: "power2.inOut" },
      )
        // Fade in the brand name
        .to(
          textRef.current,
          {
            opacity: 1,
            letterSpacing: "0.2em",
            duration: 1.5,
            ease: "power3.out",
          },
          "-=1",
        )
        // Thread disappears
        .to(
          threadRef.current,
          {
            opacity: 0,
            duration: 0.5,
          },
          "-=0.5",
        )
    }, containerRef)

    return () => ctx.revert()
  }, [triggerExit])

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 flex items-center justify-center pointer-events-none"
    >
      {/* Weaving Thread SVG */}
      <svg
        viewBox="0 0 1000 200"
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] max-w-[800px]"
      >
        <path
          ref={threadRef}
          d="M 0 100 Q 250 0 500 100 T 1000 100"
          fill="transparent"
          stroke="#ff007f"
          strokeWidth="3"
          strokeLinecap="round"
          className="drop-shadow-[0_0_15px_#ff007f]"
        />
      </svg>

      {/* Brand Name */}
      <h1
        ref={textRef}
        className="text-4xl md:text-7xl font-serif text-[#FAF9F6] uppercase tracking-normal opacity-0 font-black relative z-10"
      >
        Crochella
      </h1>
      <p className="absolute bottom-10 text-xs tracking-widest text-white/30 uppercase z-10">
        Weaving the web...
      </p>
    </div>
  )
}

export default PremiumPreloader
