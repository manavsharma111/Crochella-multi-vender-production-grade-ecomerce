import React, { useEffect, useRef, useState } from "react"
import { gsap } from "gsap"
import YarnTrail from "./YarnTrail"

export default function Cursor() {
  const dotRef = useRef(null)
  const followerRef = useRef(null)
  const textRef = useRef(null)
  const imageRef = useRef(null)

  const [isMobile, setIsMobile] = useState(false)
  const [cursorState, setCursorState] = useState({
    active: false,
    type: "default", // default, magnetic, view, pill
    text: "",
    image: "",
  })

  useEffect(() => {
    const checkMobile = () =>
      setIsMobile(window.matchMedia("(pointer: coarse)").matches)
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  useEffect(() => {
    if (isMobile) return

    // Use GSAP quickTo for buttery smooth 60fps performance
    const dotX = gsap.quickTo(dotRef.current, "x", {
      duration: 0.1,
      ease: "power3",
    })
    const dotY = gsap.quickTo(dotRef.current, "y", {
      duration: 0.1,
      ease: "power3",
    })

    const followerX = gsap.quickTo(followerRef.current, "x", {
      duration: 0.5,
      ease: "power3.out",
    })
    const followerY = gsap.quickTo(followerRef.current, "y", {
      duration: 0.5,
      ease: "power3.out",
    })

    // State refs for the event listener
    let isMagnetic = false
    let magneticRect = null

    const moveCursor = (e) => {
      let targetX = e.clientX
      let targetY = e.clientY

      if (isMagnetic && magneticRect) {
        // Calculate center of magnetic element
        const centerX = magneticRect.left + magneticRect.width / 2
        const centerY = magneticRect.top + magneticRect.height / 2

        // Distance-based interpolation (pull cursor towards center)
        const dx = e.clientX - centerX
        const dy = e.clientY - centerY

        // Snap cursor closer to the center of the element
        targetX = centerX + dx * 0.2
        targetY = centerY + dy * 0.2
      }

      dotX(targetX)
      dotY(targetY)
      followerX(targetX)
      followerY(targetY)
    }

    window.addEventListener("mousemove", moveCursor)

    // Global Hover Event Delegation
    const handleMouseOver = (e) => {
      const target = e.target
      const magneticEl = target.closest('[data-magnetic="true"]')
      const cursorText = target.closest("[data-cursor-text]")
      const cursorImage = target.closest("[data-cursor-image]")

      if (magneticEl) {
        isMagnetic = true
        magneticRect = magneticEl.getBoundingClientRect()

        setCursorState({ active: true, type: "magnetic", text: "", image: "" })
        gsap.to(dotRef.current, { scale: 0, duration: 0.2 })
        gsap.to(followerRef.current, {
          width: magneticRect.width + 20,
          height: magneticRect.height + 20,
          borderRadius: "12px",
          backgroundColor: "rgba(255, 0, 127, 0.1)",
          borderColor: "#ff007f",
          duration: 0.3,
        })
      } else if (cursorImage) {
        isMagnetic = false
        const img = cursorImage.getAttribute("data-cursor-image")
        setCursorState({
          active: true,
          type: "view",
          text: "EXPLORE",
          image: img,
        })

        gsap.to(dotRef.current, { scale: 0, duration: 0.2 })
        gsap.to(followerRef.current, {
          width: 120,
          height: 120,
          borderRadius: "50%",
          backgroundColor: "rgba(255, 0, 127, 0.2)",
          borderColor: "transparent",
          backdropFilter: "blur(5px)",
          duration: 0.3,
        })
        gsap.to(textRef.current, { opacity: 1, scale: 1, duration: 0.3 })
        gsap.to(imageRef.current, { opacity: 1, scale: 1, duration: 0.3 })
      } else if (cursorText) {
        isMagnetic = false
        const txt = cursorText.getAttribute("data-cursor-text")
        setCursorState({ active: true, type: "text", text: txt, image: "" })

        gsap.to(dotRef.current, { scale: 0, duration: 0.2 })
        gsap.to(followerRef.current, {
          width: 100,
          height: 100,
          borderRadius: "50%",
          backgroundColor: "#ff007f",
          borderColor: "transparent",
          mixBlendMode: "difference",
          duration: 0.3,
        })
        gsap.to(textRef.current, {
          opacity: 1,
          scale: 1,
          duration: 0.3,
          color: "white",
        })
      } else {
        // Reset to default
        isMagnetic = false
        setCursorState({ active: false, type: "default", text: "", image: "" })

        gsap.to(dotRef.current, { scale: 1, duration: 0.2 })
        gsap.to(followerRef.current, {
          width: 40,
          height: 40,
          borderRadius: "50%",
          backgroundColor: "transparent",
          borderColor: "rgba(255, 0, 127, 0.5)",
          mixBlendMode: "normal",
          backdropFilter: "blur(0px)",
          duration: 0.3,
        })
        gsap.to(textRef.current, { opacity: 0, scale: 0.5, duration: 0.2 })
        if (imageRef.current)
          gsap.to(imageRef.current, { opacity: 0, scale: 0.5, duration: 0.2 })
      }
    }

    window.addEventListener("mouseover", handleMouseOver)

    return () => {
      window.removeEventListener("mousemove", moveCursor)
      window.removeEventListener("mouseover", handleMouseOver)
    }
  }, [isMobile])

  if (isMobile) return null

  return (
    <>
      <YarnTrail color="#ff007f" />

      <div
        ref={followerRef}
        className="fixed top-0 left-0 border pointer-events-none z-9999 flex items-center justify-center overflow-hidden shadow-[0_0_15px_rgba(255,0,127,0.3)] transition-shadow duration-300"
        style={{
          width: "40px",
          height: "40px",
          borderColor: "rgba(255,0,127,0.5)",
          transform: "translate(-50%, -50%)",
        }}
      >
        <span
          ref={textRef}
          className="relative z-10 text-[10px] font-bold text-white uppercase tracking-widest opacity-0 scale-50 whitespace-nowrap"
        >
          {cursorState.text}
        </span>
        {cursorState.image && (
          <img
            ref={imageRef}
            src={cursorState.image}
            alt="preview"
            className="absolute inset-0 w-full h-full object-cover opacity-0 scale-50 rounded-full mix-blend-overlay"
          />
        )}
      </div>

      {/* The Glowing Dot */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 w-2 h-2 rounded-full bg-[#ff007f] shadow-[0_0_10px_#ff007f] pointer-events-none z-10000"
        style={{ transform: "translate(-50%, -50%)" }}
      />
    </>
  )
}
