import React, { useEffect, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import weavingVideo from "../../../assets/Weaving Machine Animation and Basic Principle of Weaving - Textile Explained (1080p).mp4"

gsap.registerPlugin(ScrollTrigger)

const images = [
  "https://images.pexels.com/photos/852860/pexels-photo-852860.jpeg",
  "https://images.pexels.com/photos/1018911/pexels-photo-1018911.jpeg",
  "https://images.pexels.com/photos/298863/pexels-photo-298863.jpeg",
  "https://images.pexels.com/photos/4590215/pexels-photo-4590215.jpeg",
]

const VideoScaleTransition = () => {
  const containerRef = useRef(null)
  const centerVideoRef = useRef(null)
  const textRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=200%",
          scrub: 1,
          pin: true,
        },
      })

      // Fly-out grid images
      const grids = gsap.utils.toArray(".grid-fly")
      grids.forEach((el) => {
        // We use dataset properties or just calculate distance from center
        const rect = el.getBoundingClientRect()
        const centerX = rect.left + rect.width / 2
        const centerY = rect.top + rect.height / 2
        const winCenterX = window.innerWidth / 2
        const winCenterY = window.innerHeight / 2

        const dx = centerX - winCenterX
        const dy = centerY - winCenterY

        tl.to(
          el,
          {
            x: dx * 3, // Fly outwards
            y: dy * 3,
            scale: 3,
            opacity: 0,
            ease: "power2.inOut",
          },
          0,
        )
      })

      // Center video scales up to full screen
      tl.to(
        centerVideoRef.current,
        {
          width: "100vw",
          height: "100vh",
          borderRadius: "0%",
          ease: "power2.inOut",
        },
        0,
      )

      // Background text scales massively and fades
      tl.to(
        textRef.current,
        {
          scale: 4,
          opacity: 0,
          ease: "power2.inOut",
        },
        0,
      )
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={containerRef}
      className="relative w-full h-screen bg-[#050505] flex items-center justify-center overflow-hidden cursor-none"
    >
      <h2
        ref={textRef}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[15vw] font-black text-slate-50/10 whitespace-nowrap pointer-events-none z-0"
      >
        THE VISION
      </h2>

      {/* The 3x3 Grid Layout */}
      <div className="relative z-10 w-full h-full flex items-center justify-center pointer-events-none">
        {/* Top Left */}
        <div className="grid-fly absolute top-[10%] left-[10%] w-[20vw] h-[25vh] rounded-2xl overflow-hidden opacity-50 grayscale">
          <img
            src={images[0]}
            alt="Grid"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Top Right */}
        <div className="grid-fly absolute top-[15%] right-[10%] w-[15vw] h-[30vh] rounded-2xl overflow-hidden opacity-40 grayscale">
          <img
            src={images[1]}
            alt="Grid"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Bottom Left */}
        <div className="grid-fly absolute bottom-[15%] left-[15%] w-[18vw] h-[22vh] rounded-2xl overflow-hidden opacity-30 grayscale">
          <img
            src={images[2]}
            alt="Grid"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Bottom Right */}
        <div className="grid-fly absolute bottom-[10%] right-[15%] w-[22vw] h-[25vh] rounded-2xl overflow-hidden opacity-50 grayscale">
          <img
            src={images[3]}
            alt="Grid"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Center Main Video */}
        <div
          ref={centerVideoRef}
          className="relative w-[70vw] h-[30vh] md:w-[40vw] md:h-[40vh] lg:w-[25vw] lg:h-[35vh] rounded-[30px] overflow-hidden shadow-2xl pointer-events-auto"
          data-cursor-text="PLAY"
        >
          <video
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover scale-110 pointer-events-none"
            src={weavingVideo}
          />
          <div className="absolute inset-0 bg-black/10" />
        </div>
      </div>
    </section>
  )
}

export default VideoScaleTransition
