import React, { useState, useId } from 'react'
import { motion } from 'framer-motion'

const LiquidImageHover = ({ src, alt, className }) => {
  const [isHovered, setIsHovered] = useState(false)
  const filterId = useId().replace(/:/g, '') // Ensure safe ID for SVG

  return (
    <div 
      className={`relative overflow-hidden ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <svg className="absolute w-0 h-0 pointer-events-none">
        <filter id={`liquid-${filterId}`}>
          <motion.feTurbulence
            type="fractalNoise"
            baseFrequency={0.00001}
            numOctaves={2}
            result="warp"
            initial={{ baseFrequency: 0.00001 }}
            animate={{ baseFrequency: isHovered ? 0.02 : 0.00001 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
          <feDisplacementMap
            xChannelSelector="R"
            yChannelSelector="G"
            scale="40"
            in="SourceGraphic"
            in2="warp"
          />
        </filter>
      </svg>
      <motion.img
        src={src}
        alt={alt}
        className="w-full h-full object-cover"
        style={{ filter: `url(#liquid-${filterId})` }}
        animate={{ scale: isHovered ? 1.1 : 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      />
    </div>
  )
}

export default LiquidImageHover
