import React, { useEffect, useRef } from "react"
import gsap from "gsap"

const MarqueeText = () => {
  const containerRef = useRef(null)
  const textRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(textRef.current, {
        xPercent: -50,
        ease: "none",
        duration: 20,
        repeat: -1,
      })
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <div
      ref={containerRef}
      className="w-full bg-[#0a0a0a] py-8 border-y border-white/5 overflow-hidden flex items-center"
    >
      <div
        ref={textRef}
        className="flex whitespace-nowrap text-3xl md:text-5xl uppercase tracking-[0.2em] text-[#FFFDD0] opacity-40 font-light"
      >
        <span className="pr-12">Luxury Handloom</span>
        <span className="pr-12">·</span>
        <span className="pr-12">Artisan Crafted</span>
        <span className="pr-12">·</span>
        <span className="pr-12">Sustainable Fashion</span>
        <span className="pr-12">·</span>
        <span className="pr-12">Heritage Textiles</span>
        <span className="pr-12">·</span>

        {/* Duplicate for seamless infinite scroll */}
        <span className="pr-12">Luxury Handloom</span>
        <span className="pr-12">·</span>
        <span className="pr-12">Artisan Crafted</span>
        <span className="pr-12">·</span>
        <span className="pr-12">Sustainable Fashion</span>
        <span className="pr-12">·</span>
        <span className="pr-12">Heritage Textiles</span>
        <span className="pr-12">·</span>
      </div>
    </div>
  )
}

export default MarqueeText
