import React, { useEffect, useRef } from "react"
import gsap from "gsap"
import { ArrowDown } from "lucide-react"

const Hero = ({ loading }) => {
  const containerRef = useRef(null)
  const titleRefs = useRef([])
  const ctaRef = useRef(null)

  // Split the text into an array of words
  const heading = "Woven By Hand, Crafted For Generations".split(" ")

  useEffect(() => {
    if (loading) return

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.8 })

      gsap.set(titleRefs.current, { yPercent: 120, opacity: 0, rotateZ: 2 })
      gsap.set(ctaRef.current, { opacity: 0, y: 30 })

      tl.to(titleRefs.current, {
        yPercent: 0,
        opacity: 1,
        rotateZ: 0,
        duration: 1.4,
        stagger: 0.1,
        ease: "power4.out",
      }).to(
        ctaRef.current,
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
        },
        "-=0.8",
      )
    }, containerRef)

    return () => ctx.revert()
  }, [loading])

  return (
    <section
      ref={containerRef}
      className="relative w-full h-screen overflow-hidden bg-black flex items-center justify-center"
    >
      {/* Video Background */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover opacity-40"
          src="https://videos.pexels.com/video-files/5826915/5826915-hd_1920_1080_24fps.mp4"
        />
        <div className="absolute inset-0 bg-linear-to-b from-black/60 via-black/30 to-[#0a0a0a]" />
      </div>

      <div className="relative z-10 container mx-auto px-6 md:px-12 flex flex-col items-center text-center mt-20">
        <h1 className="flex flex-wrap justify-center gap-x-4 gap-y-2 md:gap-y-4 max-w-6xl overflow-hidden mb-8">
          {heading.map((word, i) => (
            <span key={i} className="overflow-hidden block">
              <span
                ref={(el) => (titleRefs.current[i] = el)}
                className="block text-5xl md:text-7xl lg:text-8xl xl:text-9xl font-bold tracking-tighter text-[#FFFDD0] leading-tight"
                style={{ fontFamily: "Georgia, serif" }}
              >
                {word}
              </span>
            </span>
          ))}
        </h1>

        <div ref={ctaRef} className="flex flex-col items-center gap-8">
          <p className="text-gray-300 tracking-widest uppercase text-sm md:text-base font-light max-w-xl">
            Experience the pinnacle of artisanal luxury.
          </p>
          <button className="px-10 py-4 border border-[#FFFDD0]/30 rounded-full text-[#FFFDD0] hover:bg-[#FFFDD0] hover:text-black transition-all duration-500 font-medium tracking-wide">
            Shop Collection
          </button>
        </div>
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 opacity-60">
        <span className="text-[10px] tracking-[0.3em] uppercase text-[#FFFDD0]">
          Scroll
        </span>
        <ArrowDown className="w-4 h-4 text-[#FFFDD0] animate-bounce" />
      </div>
    </section>
  )
}

export default Hero
