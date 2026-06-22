import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const FabricShowcase = () => {
  const containerRef = useRef(null);
  const imageRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(imageRef.current,
        { y: -100 },
        {
          y: 100,
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true
          }
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="relative w-full h-[70vh] overflow-hidden bg-black flex items-center justify-center">
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img 
          ref={imageRef}
          src="https://images.pexels.com/photos/1030946/pexels-photo-1030946.jpeg" 
          alt="Fabric texture" 
          className="w-full h-[120%] object-cover opacity-30 grayscale scale-110"
        />
        <div className="absolute inset-0 bg-black/40"></div>
      </div>
      
      <div className="relative z-10 text-center max-w-4xl px-6">
        <h2 className="text-4xl md:text-6xl font-serif text-[#FFFDD0] mb-6 drop-shadow-2xl">
          Feel the Heritage
        </h2>
        <p className="text-lg md:text-xl text-gray-300 font-light leading-relaxed">
          The tactile essence of true luxury cannot be mass-produced. It is born from the 
          patient rhythm of the handloom and the passion of the weaver.
        </p>
      </div>
    </section>
  );
};

export default FabricShowcase;
