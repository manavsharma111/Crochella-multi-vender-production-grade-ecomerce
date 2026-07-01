import React, { useRef } from "react"
import gsap from "gsap"

const ThreeVerticalStripsReveal = ({ renderContent, onLoadingDone }) => {
  const stripsRef = useRef([])
  const NUM_STRIPS = 6

  const handleTriggerExit = () => {
    const tl = gsap.timeline({ onComplete: onLoadingDone })

    // Move each strip UP sequentially
    tl.to(stripsRef.current, {
      yPercent: -100,
      duration: 1.0,
      stagger: 0.1, // Smooth stagger
      ease: "power4.inOut",
    })
  }

  return (
    <div className="fixed inset-0 z-100 pointer-events-none">
      {Array.from({ length: NUM_STRIPS }).map((_, i) => {
        const left = (i / NUM_STRIPS) * 100
        const right = (1 - (i + 1) / NUM_STRIPS) * 100
        return (
          <div
            key={i}
            ref={(el) => (stripsRef.current[i] = el)}
            className="absolute inset-0 pointer-events-auto bg-[#050505] overflow-hidden"
            style={{ clipPath: `inset(0 ${right}% 0 ${left}%)` }}
          >
            {renderContent(i === 0, handleTriggerExit)}
          </div>
        )
      })}
    </div>
  )
}

export default ThreeVerticalStripsReveal
