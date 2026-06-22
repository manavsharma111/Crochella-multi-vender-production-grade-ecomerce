import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const TextMarqueeSeparator = () => {
  const containerRef = useRef(null);
  const text1Ref = useRef(null);
  const text2Ref = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Horizontal scroll parallax
      gsap.to(text1Ref.current, {
        xPercent: -50,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1
        }
      });

      gsap.to(text2Ref.current, {
        xPercent: 50,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1
        }
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={containerRef} 
      className="w-full py-32 bg-[#050505] overflow-hidden flex flex-col justify-center gap-4 cursor-none"
    >
      <div className="w-[200vw] -ml-50vw">
        <h2 
          ref={text1Ref}
          className="text-[12vw] font-serif italic text-transparent bg-clip-text whitespace-nowrap opacity-80"
          style={{
            WebkitTextStroke: "1px rgba(255, 253, 208, 0.3)", // Cream stroke
            backgroundImage: "linear-gradient(to right, #FFFDD0, #ff007f)",
          }}
        >
          ELEGANCE IN EVERY THREAD — CRAFTED FOR THE BOLD — ELEGANCE IN EVERY THREAD
        </h2>
      </div>

      <div className="w-[200vw] -ml-50vw">
        <h2 
          ref={text2Ref}
          className="text-[12vw] font-serif font-black text-[#FAF9F6] whitespace-nowrap ml-[-20vw] opacity-90 tracking-tighter"
        >
          UNCOMPROMISING LUXURY — REDEFINING FASHION — UNCOMPROMISING LUXURY
        </h2>
      </div>
    </section>
  );
};

export default TextMarqueeSeparator;
