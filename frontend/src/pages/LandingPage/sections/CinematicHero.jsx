import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useNavigate } from 'react-router-dom';
import heroVideo from '../../../assets/HERO.mp4';
import MagneticButton from '../../../components/common/animation/MagneticButton';

const CinematicHero = ({ loading }) => {
  const containerRef = useRef(null);
  const videoRef = useRef(null);
  const textContainerRef = useRef(null);
  const navigate = useNavigate();
  
  const text1 = "WOVEN BY HAND".split(" ");
  const text2 = "CRAFTED FOR GENERATIONS".split(" ");

  const innerRef = useRef(null);

  const tlRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Video scale and fade in - starts immediately so it's ready behind the preloader!
      gsap.fromTo(videoRef.current, 
        { scale: 1.2, opacity: 0 },
        { scale: 1, opacity: 0.6, duration: 2, ease: "power2.out" }
      );

      // Prepare text timeline but keep it paused initially
      const words = gsap.utils.toArray('.hero-word');
      gsap.set(words, { yPercent: 120, rotateZ: 5 });
      
      tlRef.current = gsap.timeline({ paused: true });
      tlRef.current.to(words, {
        yPercent: 0,
        rotateZ: 0,
        duration: 1.5,
        stagger: 0.05,
        ease: "power4.out"
      });

      // Add scroll trigger for compress effect (down to top)
      gsap.to(innerRef.current, {
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
          pin: true,
          pinSpacing: false
        },
        scale: 0.85,
        transformOrigin: "top center",
        ease: "none"
      });

    }, containerRef);

    return () => ctx.revert();
  }, []); // Run ONLY once on mount

  // Play text animation when preloader finishes
  useEffect(() => {
    if (!loading && tlRef.current) {
      tlRef.current.play();
    }
  }, [loading]);

  // Handle Mousemove Parallax
  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    const xPos = (clientX / window.innerWidth - 0.5) * 40;
    const yPos = (clientY / window.innerHeight - 0.5) * 40;

    gsap.to(textContainerRef.current, {
      x: -xPos,
      y: -yPos,
      duration: 1,
      ease: "power3.out"
    });
  };

  return (
    <section 
      ref={containerRef} 
      onMouseMove={handleMouseMove}
      className="relative w-full h-screen overflow-hidden bg-black flex items-center justify-center cursor-none"
    >
      <div ref={innerRef} className="absolute inset-0 w-full h-full flex flex-col items-center justify-center">
        <div className="absolute inset-0 z-0">
        <video 
          ref={videoRef}
          autoPlay 
          muted 
          loop 
          playsInline
          preload="auto"
          className="w-full h-full object-cover opacity-0 scale-125 transform-gpu will-change-transform"
          src={heroVideo}
        />
        <div className="absolute inset-0 bg-black/40 mix-blend-multiply" />
      </div>

      <div ref={textContainerRef} className="relative z-10 w-full flex flex-col items-center justify-center text-center px-4">
        
        <div className="overflow-hidden flex gap-4 md:gap-8 justify-center flex-wrap">
          {text1.map((word, i) => (
            <span key={`t1-${i}`} className="overflow-hidden inline-block pb-4">
              <span className="hero-word inline-block text-5xl md:text-[8rem] xl:text-[10rem] font-bold text-[#FFFDD0] tracking-tighter leading-none origin-bottom-left uppercase">
                {word}
              </span>
            </span>
          ))}
        </div>

        <div className="overflow-hidden flex gap-4 md:gap-8 justify-center flex-wrap mt-4">
          {text2.map((word, i) => (
            <span key={`t2-${i}`} className="overflow-hidden inline-block pb-4">
              <span className="hero-word inline-block text-3xl md:text-[5rem] xl:text-[7rem] font-light italic text-white/80 tracking-tight leading-none origin-bottom-left uppercase" style={{ fontFamily: "Georgia, serif" }}>
                {word}
              </span>
            </span>
          ))}
        </div>

        <MagneticButton className="mt-8 z-30 relative">
          <button 
            onClick={() => navigate('/shop')}
            className="px-10 py-4 border border-white/20 text-white uppercase tracking-widest text-sm hover:bg-[#ff007f]/10 transition-colors duration-300 w-full h-full"
          >
            Shop Collection
          </button>
        </MagneticButton>
      </div>

      <div className="absolute bottom-12 z-10 flex flex-col items-center gap-4 mix-blend-difference text-white opacity-80 pointer-events-none">
        <div className="w-1px h-16 bg-linear-to-b from-white to-transparent"></div>
        <span className="text-[10px] tracking-[0.3em] uppercase font-light">Scroll to Explore</span>
      </div>

      </div>
    </section>
  );
};

export default CinematicHero;
