import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const BrandStory = () => {
  const containerRef = useRef(null);
  const textRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(textRef.current.children,
        { 
          opacity: 0, 
          y: 80, 
          scale: 0.9, 
          rotationX: 45,
          filter: "blur(15px)"
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          rotationX: 0,
          filter: "blur(0px)",
          stagger: 0.3,
          duration: 1.5,
          ease: "expo.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 75%",
          }
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="w-full bg-[#050505] py-32 px-6 flex items-center justify-center text-center">
      <div ref={textRef} className="max-w-3xl flex flex-col items-center gap-8">
        <h2 className="text-3xl md:text-5xl font-serif text-[#FFFDD0]">Our Legacy</h2>
        <div className="w-12 h-1px bg-[#FFFDD0]/30"></div>
        <p className="text-xl md:text-2xl text-gray-400 font-light leading-relaxed">
          CROCHELLA was born from a desire to bridge the gap between ancient textile heritage 
          and contemporary luxury. Every piece in our collection is a testament to the hands 
          that wove it.
        </p>
      </div>
    </section>
  );
};

export default BrandStory;
