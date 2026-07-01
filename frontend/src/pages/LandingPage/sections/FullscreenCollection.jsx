import React, { useState } from "react"

const collections = [
  {
    id: 1,
    name: "THE HERITAGE",
    bg: "https://images.pexels.com/photos/1018911/pexels-photo-1018911.jpeg",
  },
  {
    id: 2,
    name: "RAW SILK",
    bg: "https://images.pexels.com/photos/298863/pexels-photo-298863.jpeg",
  },
  {
    id: 3,
    name: "ARTISANAL",
    bg: "https://images.pexels.com/photos/852860/pexels-photo-852860.jpeg",
  },
]

const FullscreenCollection = () => {
  const [activeBg, setActiveBg] = useState(collections[0].bg)

  const handleMouseEnter = (bg) => {
    setActiveBg(bg)
  }

  return (
    <section className="relative w-full h-screen overflow-hidden bg-black flex flex-col justify-center cursor-none">
      {/* Background Images - Crossfade Transition */}
      {collections.map((col) => (
        <div
          key={col.id}
          className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
          style={{ opacity: activeBg === col.bg ? 0.4 : 0 }}
        >
          <img
            src={col.bg}
            alt={col.name}
            className="w-full h-full object-cover scale-105"
          />
        </div>
      ))}
      <div className="absolute inset-0 bg-black/40 mix-blend-multiply pointer-events-none" />

      {/* Massive Typographic Menu */}
      <div className="relative z-10 flex flex-col items-start pl-12 md:pl-32 gap-4 md:gap-0">
        {collections.map((col) => (
          <div
            key={col.id}
            onMouseEnter={() => handleMouseEnter(col.bg)}
            className="group relative inline-block cursor-none"
            data-cursor-text="SHOP"
          >
            <h2 className="text-5xl md:text-[8rem] lg:text-[10rem] font-serif text-transparent bg-clip-text bg-linear-to-b from-[#FFFDD0] to-gray-500 opacity-50 group-hover:opacity-100 transition-all duration-500 tracking-tighter leading-tight hover:translate-x-8 transform-gpu">
              {col.name}
            </h2>
          </div>
        ))}
      </div>
    </section>
  )
}

export default FullscreenCollection
