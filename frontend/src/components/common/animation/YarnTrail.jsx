import { useEffect, useRef } from "react"

const YarnTrail = ({ color = "#ff007f" }) => {
  const canvasRef = useRef(null)
  const points = useRef([])
  const animationFrameId = useRef(null)
  const isDirty = useRef(false)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    window.addEventListener("resize", resize)
    resize()

    const render = () => {
      animationFrameId.current = null
      if (!isDirty.current) return
      isDirty.current = false

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      if (points.current.length > 1) {
        ctx.beginPath()
        ctx.moveTo(points.current[0].x, points.current[0].y)

        for (let i = 1; i < points.current.length - 2; i++) {
          const xc = (points.current[i].x + points.current[i + 1].x) / 2
          const yc = (points.current[i].y + points.current[i + 1].y) / 2
          ctx.quadraticCurveTo(points.current[i].x, points.current[i].y, xc, yc)
        }

        if (points.current.length > 2) {
          const last = points.current.length - 1
          ctx.quadraticCurveTo(
            points.current[last - 1].x,
            points.current[last - 1].y,
            points.current[last].x,
            points.current[last].y,
          )
        }

        ctx.lineCap = "round"
        ctx.lineJoin = "round"
        ctx.lineWidth = 2
        ctx.strokeStyle = color
        ctx.shadowColor = color
        ctx.shadowBlur = 10
        ctx.stroke()
      }
    }

    const handleMouseMove = (e) => {
      points.current.push({ x: e.clientX, y: e.clientY })
      if (points.current.length > 12) {
        points.current.shift()
      }
      isDirty.current = true

      // Only schedule a new frame if one is not already pending
      if (!animationFrameId.current) {
        animationFrameId.current = requestAnimationFrame(render)
      }
    }

    window.addEventListener("mousemove", handleMouseMove)

    return () => {
      window.removeEventListener("resize", resize)
      window.removeEventListener("mousemove", handleMouseMove)
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current)
      }
    }
  }, [color])

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-screen h-screen pointer-events-none z-9998"
    />
  )
}

export default YarnTrail
