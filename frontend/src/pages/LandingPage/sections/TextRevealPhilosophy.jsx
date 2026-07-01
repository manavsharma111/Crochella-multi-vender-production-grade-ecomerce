import React, { useEffect, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

const TextRevealPhilosophy = () => {
  const containerRef = useRef(null)
  const textRef = useRef(null)

  const innerRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Split the text into lines or characters for a scrub reveal.
      // We will use a simple color scrub on the entire text block,
      // or we can use a CSS clip-path/mask approach for a smoother reveal.

      gsap.to(textRef.current, {
        backgroundPositionX: "0%",
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 70%",
          end: "bottom 50%",
          scrub: 1,
        },
      })

      // Add scroll trigger for compress effect (top to down)
      gsap.to(innerRef.current, {
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
          pin: true,
          pinSpacing: true,
        },
        scale: 0.85,
        transformOrigin: "top center",
        ease: "none",
      })
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={containerRef}
      className="relative w-full min-h-screen bg-[#050505] flex items-center justify-center cursor-none"
    >
      <div
        ref={innerRef}
        className="absolute inset-0 w-full h-full flex flex-col items-center justify-center px-6 py-32"
      >
        {/* Background element for aesthetic */}
        <div className="absolute inset-0 bg-linear-to-b from-black to-[#050505] pointer-events-none"></div>

        <div className="relative z-10 max-w-5xl mx-auto text-center">
          {/* We use background-clip: text and a linear gradient that moves on scroll */}
          <p
            ref={textRef}
            className="text-3xl md:text-5xl lg:text-7xl font-serif leading-tight md:leading-tight lg:leading-tight tracking-tight text-transparent bg-clip-text"
            style={{
              backgroundImage:
                "linear-gradient(to right, #FFFDD0 50%, rgba(255, 255, 255, 0.1) 50%)",
              backgroundSize: "200% 100%",
              backgroundPositionX: "100%",
            }}
          >
            We believe that true luxury takes time. Every thread is a silent
            witness to hours of patient craftsmanship, woven by hands that carry
            generations of heritage. We do not just make clothes; we weave
            legacies.
          </p>
        </div>
      </div>
    </section>
  )
}

export default TextRevealPhilosophy
