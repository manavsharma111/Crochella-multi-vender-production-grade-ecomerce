import React, { useEffect, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

const TextMaskPhilosophy = () => {
  const containerRef = useRef(null)
  const maskRef = useRef(null)
  const containerMaskRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Pin the section and scale up the text mask to reveal the video underneath
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=150%",
          scrub: 1,
          pin: true,
        },
      })

      tl.to(
        maskRef.current,
        {
          scale: 8, // Scale text up moderately
          duration: 1,
          ease: "power1.inOut",
        },
        0,
      ).to(
        containerMaskRef.current,
        {
          opacity: 0, // Fade out smoothly over the scroll
          duration: 0.6,
          ease: "power1.inOut",
        },
        0.4,
      ) // Start fading out later so the text gets big first
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={containerRef}
      className="relative w-full h-screen bg-gray-900 overflow-hidden flex items-center justify-center cursor-none isolate"
    >
      {/* Background Image that gets revealed (replaced video due to expiring URLs causing black screen) */}
      <div className="absolute inset-0 w-full h-full z-0">
        <img
          src="https://images.pexels.com/photos/3738087/pexels-photo-3738087.jpeg"
          alt="Weave Texture"
          className="w-full h-full object-cover opacity-80"
        />
      </div>

      {/* When mix-blend-multiply on black background with white text is placed over a video:
          Multiply: Black stays black, white becomes transparent. */}
      <div
        ref={containerMaskRef}
        className="absolute inset-0 z-10 bg-black flex items-center justify-center mix-blend-multiply text-white pointer-events-none"
      >
        <h2
          ref={maskRef}
          className="text-[12vw] font-black tracking-tighter leading-none transform-gpu origin-center whitespace-nowrap"
        >
          THE ESSENCE
        </h2>
      </div>
    </section>
  )
}

export default TextMaskPhilosophy
