import React, { useEffect, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

const collections = [
  {
    id: 1,
    title: "The Royal Weave",
    img: "https://images.pexels.com/photos/1018911/pexels-photo-1018911.jpeg",
  },
  {
    id: 2,
    title: "Midnight Silk",
    img: "https://images.pexels.com/photos/298863/pexels-photo-298863.jpeg",
  },
  {
    id: 3,
    title: "Golden Heritage",
    img: "https://images.pexels.com/photos/852860/pexels-photo-852860.jpeg",
  },
]

const FeaturedCollections = () => {
  const containerRef = useRef(null)
  const cardsRef = useRef([])

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        cardsRef.current,
        { y: 100, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.2,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 75%",
          },
        },
      )
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={containerRef} className="w-full bg-black py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div>
            <h2 className="text-4xl md:text-6xl font-serif text-[#FFFDD0] leading-tight">
              Featured <br /> Collections
            </h2>
          </div>
          <button className="uppercase tracking-[0.2em] text-sm text-gray-400 border-b border-gray-400 pb-1 hover:text-[#FFFDD0] hover:border-[#FFFDD0] transition-colors">
            View All
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {collections.map((item, i) => (
            <div
              key={item.id}
              ref={(el) => (cardsRef.current[i] = el)}
              className="group cursor-pointer"
            >
              <div className="w-full h-[60vh] overflow-hidden bg-gray-900 rounded-sm mb-6 relative">
                <img
                  src={item.img}
                  alt={item.title}
                  className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500"></div>
              </div>
              <h3 className="text-2xl font-serif text-[#FFFDD0] group-hover:text-white transition-colors">
                {item.title}
              </h3>
              <p className="text-gray-500 uppercase tracking-widest text-xs mt-2">
                Explore
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default FeaturedCollections
