import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const processSteps = [
  {
    num: "01",
    title: "Sourcing Silk",
    desc: "We ethically source the finest raw silk from local farms, ensuring pure quality."
  },
  {
    num: "02",
    title: "Hand Dyeing",
    desc: "Natural organic dyes are used to create deep, long-lasting colors without harsh chemicals."
  },
  {
    num: "03",
    title: "The Loom",
    desc: "Weeks of meticulous weaving on traditional wooden handlooms bring the patterns to life."
  },
  {
    num: "04",
    title: "Finishing",
    desc: "Hand-rolled hems and rigorous quality checks ensure a masterpiece that lasts generations."
  }
];

const ProcessTimeline = () => {
  const containerRef = useRef(null);
  const lineRef = useRef(null);
  const stepsRefs = useRef([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      
      // Animate the vertical line drawing down
      gsap.fromTo(lineRef.current,
        { height: "0%" },
        {
          height: "100%",
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 60%",
            end: "bottom 80%",
            scrub: true
          }
        }
      );

      // Fade in each step sequentially
      stepsRefs.current.forEach((step, i) => {
        gsap.fromTo(step,
          { opacity: 0, x: i % 2 === 0 ? -50 : 50 },
          {
            opacity: 1,
            x: 0,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: step,
              start: "top 80%",
            }
          }
        );
      });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="relative w-full bg-[#050505] py-32 px-6 flex flex-col items-center border-t border-white/5">
      <div className="text-center mb-24">
        <h2 className="text-3xl md:text-5xl font-serif text-[#FFFDD0] mb-4">The Creation</h2>
        <p className="text-gray-400 uppercase tracking-widest text-sm">A Journey of Time</p>
      </div>

      <div className="relative max-w-4xl w-full">
        {/* The central line */}
        <div className="absolute left-1/2 top-0 bottom-0 w-1px bg-white/10 -translate-x-1/2"></div>
        {/* The animated central line */}
        <div ref={lineRef} className="absolute left-1/2 top-0 w-[2px] bg-[#FFFDD0] -translate-x-1/2 origin-top"></div>

        <div className="flex flex-col gap-24 md:gap-32">
          {processSteps.map((step, i) => {
            const isLeft = i % 2 === 0;
            return (
              <div 
                key={i} 
                ref={el => stepsRefs.current[i] = el}
                className={`relative flex w-full items-center ${isLeft ? 'justify-start' : 'justify-end'}`}
              >
                {/* Node dot */}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-black border-2 border-[#FFFDD0] z-10 shadow-[0_0_15px_rgba(255,253,208,0.5)]"></div>

                <div className={`w-1/2 ${isLeft ? 'pr-12 md:pr-24 text-right' : 'pl-12 md:pl-24 text-left'}`}>
                  <span className="text-6xl font-serif text-white/5 absolute top-0 -translate-y-1/2 opacity-20 pointer-events-none select-none">
                    {step.num}
                  </span>
                  <h3 className="text-2xl font-serif text-[#FFFDD0] mb-4 relative z-10">{step.title}</h3>
                  <p className="text-gray-400 font-light leading-relaxed relative z-10">
                    {step.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ProcessTimeline;
