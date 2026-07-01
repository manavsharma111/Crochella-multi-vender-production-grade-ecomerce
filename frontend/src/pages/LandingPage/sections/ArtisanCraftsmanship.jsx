import React, { useEffect, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

const ArtisanCraftsmanship = () => {
  const containerRef = useRef(null)
  const imageRef = useRef(null)
  const textRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Image scale effect with parallax overlay
      gsap.fromTo(
        imageRef.current,
        { scale: 1.5, opacity: 0, filter: "blur(10px)" },
        {
          scale: 1,
          opacity: 1,
          filter: "blur(0px)",
          ease: "expo.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 70%",
            end: "bottom 30%",
            scrub: 1.5,
          },
        },
      )

      // Text reveal effect
      gsap.fromTo(
        textRef.current.children,
        { x: 100, opacity: 0, filter: "blur(10px)" },
        {
          x: 0,
          opacity: 1,
          filter: "blur(0px)",
          stagger: 0.2,
          duration: 1.5,
          ease: "expo.out",
          scrollTrigger: {
            trigger: textRef.current,
            start: "top 80%",
          },
        },
      )
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={containerRef}
      className="relative w-full bg-black py-32 px-6 md:px-12 flex items-center justify-center"
    >
      <div className="max-w-7xl w-full grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 items-center">
        {/* Left Image */}
        <div className="w-full h-[60vh] md:h-[80vh] overflow-hidden rounded-sm">
          <img
            ref={imageRef}
            src="https://images.pexels.com/photos/4590215/pexels-photo-4590215.jpeg"
            alt="Artisan weaving"
            className="w-full h-full object-cover grayscale opacity-80"
          />
        </div>

        {/* Right Text */}
        <div
          ref={textRef}
          className="flex flex-col justify-center gap-8 text-[#FFFDD0]"
        >
          <h2 className="text-4xl md:text-5xl lg:text-7xl font-serif tracking-tighter leading-[1.1]">
            Artisan <br />
            <span className="italic text-gray-400">Craftsmanship</span>
          </h2>

          <div className="w-16 h-1px bg-[#FFFDD0]/30"></div>

          <p className="text-lg md:text-xl text-gray-400 font-light leading-relaxed max-w-lg">
            Every thread tells a story. Our master artisans spend weeks weaving
            a single garment, preserving centuries-old techniques while creating
            modern luxury. The slight imperfections are the hallmark of true
            human touch.
          </p>

          <button className="self-start relative group mt-8">
            <span className="uppercase tracking-[0.2em] text-sm border-b border-[#FFFDD0]/30 pb-2 group-hover:border-[#FFFDD0] transition-colors">
              Discover Our Process
            </span>
          </button>
        </div>
      </div>
    </section>
  )
}

export default ArtisanCraftsmanship
