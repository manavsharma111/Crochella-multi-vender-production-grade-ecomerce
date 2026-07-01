import React, { useState } from "react"

const artisans = [
  {
    id: 1,
    name: "MOHAMMED ANSARI",
    role: "Master Weaver, Varanasi",
    desc: "A fifth-generation artisan whose hands have woven silk for royalty. Mohammed specializes in the delicate art of Kadwa brocade, where every motif is woven separately by hand, taking months to complete a single piece.",
    img: "https://images.pexels.com/photos/837265/pexels-photo-837265.jpeg", // Placeholder portrait
  },
  {
    id: 2,
    name: "LAKSHMI DEVI",
    role: "Dyeing Specialist, Kutch",
    desc: "Lakshmi breathes life into raw threads using ancient natural dyeing techniques. From indigo to madder root, her profound knowledge of earth's alchemy creates the signature vibrant hues of Crochella.",
    img: "https://images.pexels.com/photos/1105058/pexels-photo-1105058.jpeg",
  },
  {
    id: 3,
    name: "KABIR DAS",
    role: "Loom Engineer, Bengal",
    desc: "The silent architect behind the weaves. Kabir builds and tunes the traditional wooden handlooms, ensuring the perfect tension for the gossamer-like Jamdani fabrics that float on air.",
    img: "https://images.pexels.com/photos/846741/pexels-photo-846741.jpeg",
  },
]

const ArtisansAccordion = () => {
  const [activeId, setActiveId] = useState(1)

  return (
    <section className="w-full bg-[#050505] text-[#FAF9F6] py-32 px-6 md:px-12 cursor-none">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-16">
        {/* Title Section */}
        <div className="w-full lg:w-1/3">
          <h2 className="text-sm tracking-[0.3em] uppercase opacity-50 mb-6 text-[#ff007f]">
            The Hands Behind The Loom
          </h2>
          <h1 className="text-5xl md:text-7xl font-serif font-black tracking-tighter mb-8 leading-tight">
            MASTER ARTISANS
          </h1>
          <p className="opacity-70 text-lg leading-relaxed max-w-sm">
            Our fabrics are not born in factories. They are born in the homes of
            masters who have inherited their craft through centuries of oral
            tradition. Meet the souls of Crochella.
          </p>
          <div className="mt-12">
            <button
              data-magnetic="true"
              onClick={() => alert("Read all artisan stories")}
              className="px-8 py-4 rounded-full border border-white/30 text-sm tracking-widest uppercase hover:bg-white hover:text-black transition-colors duration-500 cursor-none"
            >
              Meet The Community
            </button>
          </div>
        </div>

        {/* Accordion Section */}
        <div className="w-full lg:w-2/3 flex flex-col gap-4">
          {artisans.map((artisan) => {
            const isActive = activeId === artisan.id

            return (
              <div
                key={artisan.id}
                onMouseEnter={() => setActiveId(artisan.id)}
                className={`relative overflow-hidden transition-all duration-700 ease-out border-b border-white/10 ${isActive ? "h-[500px]" : "h-[100px]"}`}
                data-cursor-text="VIEW"
              >
                {/* Background Image (Reveals on Active) */}
                <div
                  className={`absolute inset-0 transition-opacity duration-700 delay-100 ${isActive ? "opacity-40" : "opacity-0"}`}
                >
                  <img
                    src={artisan.img}
                    alt={artisan.name}
                    className="w-full h-full object-cover grayscale"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-[#050505] via-[#050505]/50 to-transparent" />
                </div>

                {/* Content */}
                <div className="relative z-10 w-full h-full flex flex-col justify-end pb-8">
                  <div
                    className={`flex items-end justify-between px-4 md:px-8 transition-transform duration-500 ${isActive ? "translate-y-0" : "translate-y-4"}`}
                  >
                    <div>
                      <h3
                        className={`font-serif tracking-tighter transition-all duration-500 ${isActive ? "text-4xl md:text-6xl text-[#ff007f]" : "text-2xl md:text-4xl opacity-50"}`}
                      >
                        {artisan.name}
                      </h3>
                      <p
                        className={`text-sm tracking-widest uppercase mt-2 transition-opacity duration-500 ${isActive ? "opacity-100" : "opacity-0"}`}
                      >
                        {artisan.role}
                      </p>
                    </div>
                  </div>

                  {/* Description (Fades in) */}
                  <div
                    className={`px-4 md:px-8 overflow-hidden transition-all duration-700 ${isActive ? "max-h-40 mt-6 opacity-80" : "max-h-0 mt-0 opacity-0"}`}
                  >
                    <p className="max-w-2xl text-lg font-light leading-relaxed">
                      {artisan.desc}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default ArtisansAccordion
