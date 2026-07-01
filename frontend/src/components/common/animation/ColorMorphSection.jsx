import React, { useEffect, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

const ColorMorphSection = ({
  children,
  color = "#2a0013",
  defaultColor = "#0a0a0a",
  className = "",
}) => {
  const sectionRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top 40%",
        end: "bottom 60%",
        onEnter: () =>
          gsap.to(document.body, {
            backgroundColor: color,
            duration: 1,
            ease: "power2.out",
            overwrite: "auto",
          }),
        onLeave: () =>
          gsap.to(document.body, {
            backgroundColor: defaultColor,
            duration: 1,
            ease: "power2.out",
            overwrite: "auto",
          }),
        onEnterBack: () =>
          gsap.to(document.body, {
            backgroundColor: color,
            duration: 1,
            ease: "power2.out",
            overwrite: "auto",
          }),
        onLeaveBack: () =>
          gsap.to(document.body, {
            backgroundColor: defaultColor,
            duration: 1,
            ease: "power2.out",
            overwrite: "auto",
          }),
      })
    }, sectionRef)

    return () => {
      ctx.revert()
      // Ensure we clean up by reverting body to default
      gsap.to(document.body, { backgroundColor: defaultColor, duration: 0.5 })
    }
  }, [color, defaultColor])

  return (
    <div ref={sectionRef} className={className}>
      {children}
    </div>
  )
}

export default ColorMorphSection
