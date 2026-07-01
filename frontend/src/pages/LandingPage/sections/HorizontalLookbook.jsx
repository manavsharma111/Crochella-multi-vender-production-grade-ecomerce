import React, { useEffect, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

const lookbookItems = [
  {
    img: "https://images.pexels.com/photos/298863/pexels-photo-298863.jpeg",
    title: "THE ARCHIVE",
  },
  {
    img: "https://images.pexels.com/photos/1018911/pexels-photo-1018911.jpeg",
    title: "ROYAL WEAVE",
  },
  {
    img: "https://images.pexels.com/photos/852860/pexels-photo-852860.jpeg",
    title: "GOLDEN ERA",
  },
  {
    img: "https://images.pexels.com/photos/4590215/pexels-photo-4590215.jpeg",
    title: "ARTISAN",
  },
]

const HorizontalLookbook = () => {
  const containerRef = useRef(null)
  const scrollWrapperRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(scrollWrapperRef.current, {
        xPercent: (-100 * (lookbookItems.length - 1)) / lookbookItems.length,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          pin: true,
          scrub: 1,
          end: "+=3000",
        },
      })
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={containerRef}
      className="w-full h-screen overflow-hidden bg-[#050505] flex items-center cursor-none"
    >
      <div ref={scrollWrapperRef} className="flex h-full w-[400vw]">
        {lookbookItems.map((item, i) => (
          <div
            key={i}
            className="lookbook-panel w-screen h-screen flex flex-col justify-center items-center px-12 relative"
          >
            <div
              className="w-full md:w-[70vw] h-[70vh] overflow-hidden relative group"
              data-cursor-image={item.img}
            >
              <img
                src={item.img}
                alt={item.title}
                className="w-full h-full object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700 ease-out scale-105 group-hover:scale-100"
              />
            </div>
            <h3 className="absolute bottom-12 text-5xl md:text-8xl font-serif text-[#FFFDD0] mix-blend-difference pointer-events-none tracking-tighter">
              {item.title}
            </h3>
          </div>
        ))}
      </div>
    </section>
  )
}

export default HorizontalLookbook
