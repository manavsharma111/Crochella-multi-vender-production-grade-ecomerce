import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useNavigate } from 'react-router-dom';

gsap.registerPlugin(ScrollTrigger);

const cards = [
  {
    id: 1,
    title: "THE IVORY WEAVE",
    subtitle: "Spring / Summer Collection",
    desc: "A delicate interplay of light and texture, handcrafted using centuries-old techniques.",
    img: "https://images.pexels.com/photos/298863/pexels-photo-298863.jpeg",
    bgColor: "#FAF9F6", // Cream
    textColor: "#1A1A1A"
  },
  {
    id: 2,
    title: "BLUSH SILK",
    subtitle: "Evening Edit",
    desc: "Soft pink tones woven into pure raw silk, designed to move like liquid.",
    img: "https://images.pexels.com/photos/1018911/pexels-photo-1018911.jpeg",
    bgColor: "#FDF5F6", // Soft Pink
    textColor: "#2B1A20"
  },
  {
    id: 3,
    title: "RAW BEIGE",
    subtitle: "The Signature Series",
    desc: "Unbleached, undyed natural fibers celebrating the earth's raw beauty.",
    img: "https://images.pexels.com/photos/852860/pexels-photo-852860.jpeg",
    bgColor: "#F5F5DC", // Beige
    textColor: "#3A352F"
  },
  {
    id: 4,
    title: "MIDNIGHT CHARCOAL",
    subtitle: "Avant-Garde",
    desc: "Deep, moody hues contrasting with luminous silver threads.",
    img: "https://images.pexels.com/photos/4590215/pexels-photo-4590215.jpeg",
    bgColor: "#EAE6DF", // Ivory/Grayish
    textColor: "#111111"
  }
];

const StackedFabricCards = () => {
  const containerRef = useRef(null);
  const cardsRef = useRef([]);
  const navigate = useNavigate();

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Create a timeline for the stacking effect
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: `+=${cards.length * 100}%`, // Scroll length depends on number of cards
          scrub: 1,
          pin: true,
        }
      });

      // Initially, position all cards except the first one below the screen
      gsap.set(cardsRef.current.slice(1), { yPercent: 100 });

      // Animate each card sliding up
      cardsRef.current.forEach((card, index) => {
        if (index === 0) return; // Skip the first card as it's already in place

        // Slide the current card up
        tl.to(card, {
          yPercent: 0,
          ease: "none"
        }, `stack-${index}`);

        // Simultaneously, scale down and blur all previous cards
        for (let i = 0; i < index; i++) {
          tl.to(cardsRef.current[i], {
            scale: 1 - (index - i) * 0.05,
            yPercent: -(index - i) * 2, // Slight upward shift
            filter: `blur(${(index - i) * 4}px)`,
            opacity: 1 - (index - i) * 0.1,
            ease: "none"
          }, `stack-${index}`);
        }
      });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="relative w-full h-screen bg-[#050505] overflow-hidden flex justify-center items-center cursor-none">
      <div className="relative w-full max-w-6xl h-[80vh]">
        {cards.map((card, index) => (
          <div
            key={card.id}
            ref={(el) => (cardsRef.current[index] = el)}
            className="absolute top-0 left-0 w-full h-full rounded-3xl p-8 md:p-16 flex flex-col md:flex-row gap-8 shadow-2xl origin-top"
            style={{ 
              backgroundColor: card.bgColor, 
              color: card.textColor,
              zIndex: index 
            }}
          >
            {/* Text Content */}
            <div className="w-full md:w-1/2 h-full flex flex-col justify-between z-10">
              <div>
                <p className="text-sm tracking-[0.3em] uppercase opacity-60 mb-4 font-semibold">{card.subtitle}</p>
                <h2 className="text-5xl md:text-7xl font-serif tracking-tighter leading-none mb-6">{card.title}</h2>
                <p className="text-lg md:text-xl font-light opacity-80 max-w-md">{card.desc}</p>
              </div>
              
              <div className="mt-8">
                <button 
                  data-magnetic="true"
                  onClick={() => navigate('/shop')}
                  className="px-8 py-4 rounded-full border border-current text-sm tracking-widest uppercase hover:bg-black hover:text-white transition-colors duration-500 cursor-none"
                >
                  Explore Collection
                </button>
              </div>
            </div>

            {/* Image Content */}
            <div 
              className="w-full md:w-1/2 h-full rounded-2xl overflow-hidden relative group"
              data-cursor-text="EXPLORE"
              onClick={() => navigate('/shop')}
            >
              <img 
                src={card.img} 
                alt={card.title} 
                className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 ease-out"
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default StackedFabricCards;
