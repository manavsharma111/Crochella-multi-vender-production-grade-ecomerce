import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const timelineEvents = [
  {
    year: "3000 BCE",
    title: "Indus Valley Origins",
    desc: "The earliest evidence of woven cotton textiles was discovered in the Indus Valley Civilization, marking the birth of a 5,000-year-old legacy.",
    img: "https://images.pexels.com/photos/3738088/pexels-photo-3738088.jpeg"
  },
  {
    year: "16th Century",
    title: "The Mughal Golden Age",
    desc: "Under Mughal patronage, Indian weavers perfected the art of Jamdani and intricate silk brocades, creating fabrics as light as woven air.",
    img: "https://images.pexels.com/photos/5431057/pexels-photo-5431057.jpeg"
  },
  {
    year: "1905",
    title: "The Swadeshi Movement",
    desc: "The spinning wheel became a symbol of revolution. Hand-spun Khadi cloth empowered a nation to reclaim its identity and heritage.",
    img: "https://images.pexels.com/photos/5086055/pexels-photo-5086055.jpeg"
  },
  {
    year: "Present Day",
    title: "Modern Luxury & Crochella",
    desc: "Today, we elevate this ancient artistry. Preserving the soulful imperfections of handloom while redefining it for modern global luxury.",
    img: "https://images.pexels.com/photos/4590215/pexels-photo-4590215.jpeg"
  }
];

const HandloomHistoryTimeline = () => {
  const containerRef = useRef(null);
  const lineRef = useRef(null);
  const eventRefs = useRef([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Draw the center line as user scrolls down
      gsap.to(lineRef.current, {
        height: "100%",
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 20%",
          end: "bottom 80%",
          scrub: true
        }
      });

      // Fade and slide in each event block
      eventRefs.current.forEach((el, index) => {
        gsap.fromTo(el, 
          { opacity: 0, y: 100, scale: 0.95 },
          { 
            opacity: 1, 
            y: 0, 
            scale: 1,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: el,
              start: "top 80%",
              end: "top 50%",
              scrub: false,
              toggleActions: "play none none reverse"
            }
          }
        );
      });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={containerRef} 
      className="relative w-full bg-[#020202] py-32 px-6 md:px-12 text-[#FAF9F6] overflow-hidden cursor-none"
    >
      {/* Title */}
      <div className="text-center mb-32 relative z-10">
        <h2 className="text-sm tracking-[0.3em] uppercase opacity-50 mb-6 text-[#ff007f]">Heritage</h2>
        <h1 className="text-5xl md:text-8xl font-serif font-black tracking-tighter">THE LEGACY OF WOVEN AIR</h1>
        <p className="mt-6 max-w-2xl mx-auto opacity-70 text-lg">A 5,000-year journey from ancient looms to modern luxury.</p>
      </div>

      {/* Timeline Wrapper */}
      <div className="relative max-w-6xl mx-auto flex flex-col gap-24 md:gap-48 pb-32">
        
        {/* Background Center Line */}
        <div className="absolute top-0 bottom-0 left-8 md:left-1/2 w-px bg-white/10 -translate-x-1/2 hidden md:block" />
        
        {/* Animated Fill Line */}
        <div 
          ref={lineRef}
          className="absolute top-0 left-8 md:left-1/2 w-[2px] bg-linear-to-b from-[#ff007f] to-[#FAF9F6] origin-top h-0 -translate-x-1/2 hidden md:block shadow-[0_0_15px_#ff007f]" 
        />

        {/* Timeline Events */}
        {timelineEvents.map((item, index) => {
          const isEven = index % 2 === 0;
          return (
            <div 
              key={index}
              ref={(el) => (eventRefs.current[index] = el)}
              className={`relative flex flex-col md:flex-row items-center justify-between w-full gap-8 md:gap-16 ${isEven ? 'md:flex-row-reverse' : ''}`}
            >
              {/* Dot on the line (Desktop) */}
              <div className="hidden md:block absolute top-1/2 left-1/2 w-4 h-4 rounded-full bg-[#020202] border-2 border-[#ff007f] -translate-x-1/2 -translate-y-1/2 z-10 shadow-[0_0_10px_#ff007f]" />

              {/* Text Block */}
              <div className={`w-full md:w-1/2 flex flex-col ${isEven ? 'md:items-start md:text-left md:pl-24' : 'md:items-end md:text-right md:pr-24'}`}>
                <span className="text-[#ff007f] font-serif text-3xl md:text-5xl italic mb-4">{item.year}</span>
                <h3 className="text-3xl md:text-5xl font-black mb-4 tracking-tight">{item.title}</h3>
                <p className="text-lg opacity-70 leading-relaxed max-w-md">{item.desc}</p>
              </div>

              {/* Image Block */}
              <div className="w-full md:w-1/2 h-[40vh] md:h-[50vh] rounded-2xl overflow-hidden group">
                <img 
                  src={item.img} 
                  alt={item.title} 
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 ease-out scale-105 group-hover:scale-100"
                />
              </div>

            </div>
          );
        })}
      </div>
    </section>
  );
};

export default HandloomHistoryTimeline;
