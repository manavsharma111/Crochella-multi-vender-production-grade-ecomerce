import { useEffect, useRef } from 'react'

const YarnTrail = ({ color = "#ff007f" }) => {
  const canvasRef = useRef(null)
  const points = useRef([])
  const mouse = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 })

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    
    // Set canvas to full screen
    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    
    window.addEventListener('resize', resize)
    resize()

    const handleMouseMove = (e) => {
      mouse.current = { x: e.clientX, y: e.clientY }
    }
    
    window.addEventListener('mousemove', handleMouseMove)

    // Animation Loop
    let animationFrameId
    
    const render = () => {
      // Add current mouse position to points array
      points.current.push({ x: mouse.current.x, y: mouse.current.y })
      
      // Keep only the last 30 points for the trail length
      if (points.current.length > 30) {
        points.current.shift()
      }

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw the yarn trail
      if (points.current.length > 1) {
        ctx.beginPath()
        ctx.moveTo(points.current[0].x, points.current[0].y)

        // Smooth curve through points
        for (let i = 1; i < points.current.length - 2; i++) {
          const xc = (points.current[i].x + points.current[i + 1].x) / 2
          const yc = (points.current[i].y + points.current[i + 1].y) / 2
          ctx.quadraticCurveTo(points.current[i].x, points.current[i].y, xc, yc)
        }

        // Connect the last two points
        if (points.current.length > 2) {
          const last = points.current.length - 1
          ctx.quadraticCurveTo(
            points.current[last - 1].x, 
            points.current[last - 1].y, 
            points.current[last].x, 
            points.current[last].y
          )
        }

        // Stroke styling (Luxury Glowing Yarn)
        ctx.lineCap = 'round'
        ctx.lineJoin = 'round'
        ctx.lineWidth = 2
        ctx.strokeStyle = color
        ctx.shadowColor = color
        ctx.shadowBlur = 10
        
        // Add a slight gradient/fade effect to the trail
        // By drawing it with a global alpha that we don't strictly need if the array is short,
        // but we can achieve a fade by drawing segments with different alphas if we wanted.
        // For performance, a solid stroke with glow is 60fps.
        ctx.stroke()
      }

      animationFrameId = requestAnimationFrame(render)
    }

    render()

    return () => {
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', handleMouseMove)
      cancelAnimationFrame(animationFrameId)
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
