import React, { useRef, useState, useEffect } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'

const Footer = () => {
  const containerRef = useRef(null)
  const [time, setTime] = useState(new Date())

  // Live ticking clock
  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(interval)
  }, [])

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end end"]
  })

  // Deep parallax entrance
  const y = useTransform(scrollYProgress, [0, 1], [-150, 0])
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0, 0.5, 1])

  return (
    <footer ref={containerRef} className="w-full bg-[#050505] text-white pt-24 md:pt-32 pb-8 relative overflow-hidden cursor-none border-t border-white/10 rounded-t-[2.5rem] md:rounded-t-[4rem] z-20 shadow-[0_-20px_50px_rgba(0,0,0,0.5)]">
      
      {/* Noise Texture Overlay for Analog Feel */}
      <div className="absolute inset-0 opacity-[0.04] mix-blend-overlay pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>

      <motion.div style={{ y, opacity }} className="container mx-auto px-6 md:px-12 relative z-10">
        
        {/* Top Grid Area */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8 mb-20 md:mb-32">
          {/* Column 1: Brand Intro */}
          <div className="md:col-span-2 flex flex-col justify-between">
            <h3 className="text-3xl md:text-4xl lg:text-5xl font-serif text-[#FFFDD0] leading-tight mb-8 flex flex-wrap gap-x-2 md:gap-x-3">
              {"Redefining luxury through neo-brutalist craftsmanship.".split(" ").map((word, index) => (
                <span key={index} className="inline-block overflow-hidden pb-2">
                  <motion.span
                    initial={{ y: "-100%", opacity: 0, rotateX: -90 }}
                    whileInView={{ y: 0, opacity: 1, rotateX: 0 }}
                    transition={{ 
                      duration: 0.8, 
                      delay: index * 0.1, 
                      ease: [0.16, 1, 0.3, 1] 
                    }}
                    viewport={{ once: true }}
                    className="inline-block origin-top"
                  >
                    {word}
                  </motion.span>
                </span>
              ))}
            </h3>
            <div className="text-gray-500 text-[10px] md:text-xs tracking-widest uppercase flex gap-4 items-center">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ff007f] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#ff007f]"></span>
              </span>
              <span className="flex items-center gap-1">
                Designed & Developed by Manav Sharma. <br className="hidden md:block" />
                Want a website like this? <a href={`https://mail.google.com/mail/?view=cm&fs=1&to=${import.meta.env.VITE_EMAIL_ADDRESS}`} target="_blank" rel="noreferrer" className="text-white hover:text-[#ff007f] transition-colors underline decoration-white/20 underline-offset-4">Contact him.</a>
              </span>
            </div>
          </div>

          {/* Column 2: Navigation */}
          <div className="flex flex-col gap-6">
            <h4 className="text-gray-600 text-[10px] tracking-[0.2em] uppercase font-bold mb-2">Navigation</h4>
            {[
              { name: 'Shop Collection', path: '/shop' },
              { name: 'Our Philosophy', path: '/about' },
              { name: 'Journal', path: '/journal' },
              { name: 'Track Order', path: '/delivery/dashboard' }
            ].map((item) => (
              <Link key={item.name} to={item.path} data-magnetic="true" className="w-fit text-sm md:text-base text-gray-300 hover:text-[#ff007f] cursor-none transition-colors duration-300 flex items-center gap-2 group">
                {item.name}
                <ArrowUpRight size={14} className="opacity-0 -translate-y-2 translate-x-2 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all duration-300" />
              </Link>
            ))}
          </div>

          {/* Column 3: Socials & Live Time */}
          <div className="flex flex-col gap-8 justify-between">
            <div>
              <h4 className="text-gray-600 text-[10px] tracking-[0.2em] uppercase font-bold mb-4">Socials</h4>
              <div className="flex flex-col gap-4">
                {[
                  { name: 'Instagram', url: 'https://instagram.com' },
                  { name: 'Twitter (X)', url: 'https://twitter.com' },
                  { name: 'Pinterest', url: 'https://pinterest.com' }
                ].map((item) => (
                  <a href={item.url} target="_blank" rel="noreferrer" key={item.name} data-magnetic="true" className="w-fit text-sm md:text-base text-gray-300 hover:text-[#FFFDD0] cursor-none transition-colors duration-300 group flex overflow-hidden relative">
                    <span className="inline-block transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-full">{item.name}</span>
                    <span className="absolute left-0 top-0 inline-block transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] translate-y-full group-hover:translate-y-0 text-[#FFFDD0]">{item.name}</span>
                  </a>
                ))}
              </div>
            </div>
            
            <div className="mt-4 md:mt-0">
              <h4 className="text-gray-600 text-[10px] tracking-[0.2em] uppercase font-bold mb-2">Local Time</h4>
              <p className="text-lg md:text-xl font-mono text-[#FFFDD0] tracking-wider">
                {time.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })} IST
              </p>
            </div>
          </div>
        </div>

        {/* Massive Logo Area */}
        <div className="relative w-full border-t border-white/10 pt-16 pb-8 flex flex-col items-center overflow-hidden">
          <motion.h1 
            initial={{ opacity: 0, scale: 0.9, y: 50 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: true, margin: "-50px" }}
            className="text-[18vw] md:text-[15vw] font-black tracking-tighter text-transparent bg-clip-text bg-linear-to-b from-white via-[#FFFDD0]/90 to-[#050505] leading-none select-none"
            style={{ WebkitTextStroke: "1px rgba(255,255,255,0.05)" }}
          >
            CROCHELLA
          </motion.h1>
        </div>

        {/* Bottom Copyright Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-white/10 gap-4 md:gap-0">
          <p className="text-gray-500 text-[10px] tracking-[0.2em] uppercase">
            &copy; {new Date().getFullYear()} CROCHELLA. All rights reserved.
          </p>
          <div className="flex gap-8 text-gray-500 text-[10px] tracking-[0.2em] uppercase">
            <span data-magnetic="true" className="hover:text-white cursor-none transition-colors">Privacy Policy</span>
            <span data-magnetic="true" className="hover:text-white cursor-none transition-colors">Terms of Service</span>
          </div>
        </div>
        
      </motion.div>
    </footer>
  )
}

export default Footer