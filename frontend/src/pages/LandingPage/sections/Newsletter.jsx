import React, { useEffect, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

const Newsletter = () => {
  const containerRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, scale: 0.95 },
        {
          opacity: 1,
          scale: 1,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 85%",
          },
        },
      )
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <section className="w-full bg-black py-24 px-6 border-y border-white/5">
      <div
        ref={containerRef}
        className="max-w-4xl mx-auto bg-gray-900/50 border border-white/10 rounded-2xl p-12 md:p-20 text-center backdrop-blur-md"
      >
        <h2 className="text-3xl md:text-4xl font-serif text-[#FFFDD0] mb-4">
          Join The Inner Circle
        </h2>
        <p className="text-gray-400 mb-10 max-w-lg mx-auto font-light">
          Subscribe to receive early access to new collections, exclusive
          invites, and styling insights.
        </p>

        <form className="flex flex-col md:flex-row gap-4 justify-center items-center max-w-xl mx-auto">
          <input
            type="email"
            placeholder="Your email address"
            className="w-full md:w-2/3 bg-transparent border-b border-gray-600 px-4 py-3 text-white focus:outline-none focus:border-[#FFFDD0] transition-colors"
          />
          <button
            type="submit"
            className="w-full md:w-auto px-8 py-3 bg-[#FFFDD0] text-black font-medium tracking-wide hover:bg-white transition-colors"
          >
            Subscribe
          </button>
        </form>
      </div>
    </section>
  )
}

export default Newsletter
