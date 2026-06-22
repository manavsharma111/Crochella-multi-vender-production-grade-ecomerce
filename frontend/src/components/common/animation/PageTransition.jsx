import React, { useLayoutEffect, useRef } from 'react'
import { motion, useIsPresent } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const PageTransition = ({ children }) => {
  const container = useRef(null)
  const isPresent = useIsPresent()
  
  // Store the initial load state for this component instance
  const isInitialLoadRef = useRef(!window.hasCompletedInitialLoad)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      if (isPresent) {
        // Skip animation on the very first load so the app's Loading Screen can run
        if (isInitialLoadRef.current) {
          gsap.set(".page-content", { opacity: 1 })
          return
        }

        // ENTER ANIMATION: Circular Wipe IN (Radial Reveal)
        gsap.fromTo(".page-content", 
          { 
            clipPath: "circle(0% at 50% 50%)",
            scale: 0, // Start as a tiny circle
            opacity: 0
          },
          { 
            clipPath: "circle(150% at 50% 50%)",
            scale: 1, // Grow to full size
            opacity: 1,
            duration: 0.8, 
            ease: "power3.inOut",
            clearProps: "all", // Important: removes clip-path and scale so ScrollTriggers/fixed elements don't break
            onComplete: () => {
              ScrollTrigger.refresh()
            }
          }
        )

      } else {
        // EXIT ANIMATION: Circular Wipe OUT
        gsap.fromTo(".page-content", 
          {
            clipPath: "circle(150% at 50% 50%)",
            scale: 1,
            opacity: 1
          },
          {
            clipPath: "circle(0% at 50% 50%)",
            scale: 0, // Shrink completely into a tiny circle
            opacity: 0,
            duration: 0.8,
            ease: "power3.inOut"
          }
        )
      }
    }, container)

    return () => ctx.revert()
  }, [isPresent])

  return (
    <motion.div
      ref={container}
      className="w-full relative"
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0.99 }} // Forces Framer Motion to wait for the 0.8s duration
      transition={{ duration: 0.8 }} 
    >
      <div className="page-content w-full bg-white relative">
        {children}
      </div>
    </motion.div>
  )
}

export default PageTransition
