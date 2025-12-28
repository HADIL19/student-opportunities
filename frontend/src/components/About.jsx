import React from 'react';

const About = () => {
  return (
    <section className="relative w-full min-h-[80vh] flex flex-col items-center justify-center bg-[#fdf2e9] px-6 py-20 overflow-hidden font-sans text-center">
      
      {/* Background Decorative Swirls */}
      <div className="absolute top-10 left-[10%] opacity-20 pointer-events-none">
        <SwirlIcon size={180} />
      </div>
      <div className="absolute bottom-10 right-[10%] opacity-20 rotate-180 pointer-events-none">
        <SwirlIcon size={200} />
      </div>

      {/* Top Badge */}
      <div className="mb-8">
        <span className="px-5 py-2 rounded-full border border-black/10 bg-white/30 shadow-sm text-[#bf5b00] text-sm md:text-base font-medium">
          #1 in the word of development
        </span>
      </div>

      {/* Main Heading */}
      <h1 className="max-w-4xl text-5xl md:text-7xl font-bold text-[#1a1a1a] leading-tight mb-6">
        Opportunities <span className="text-[#bf5b00] font-serif italic font-normal">designed</span> for <br />
        <span className="text-[#bf5b00] font-serif italic font-normal text-6xl md:text-8xl">your future</span>
      </h1>

      {/* Subtext */}
      <p className="max-w-2xl text-lg md:text-xl text-[#bf5b00]/80 mb-10 leading-relaxed">
        An interactive platform that aggregates hackathons, competitions, and courses in one place.
      </p>

      {/* Get Started Button */}
      <button className="flex items-center gap-3 px-10 py-4 bg-[#bf5b00] text-black font-bold text-xl rounded-full hover:bg-[#a64f00] transition-colors shadow-lg group">
        Get Started
        <svg 
          className="w-6 h-6 transition-transform group-hover:translate-x-1" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </svg>
      </button>

    </section>
  );
};

// Simple SVG Component for the decorative line swirls
const SwirlIcon = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" stroke="#bf5b00" strokeWidth="0.5">
    <path d="M50 50C30 20 10 40 10 60C10 80 40 90 60 70C80 50 70 20 40 10C10 0 0 40 20 70" />
    <path d="M50 50C70 80 90 60 90 40C90 20 60 10 40 30C20 50 30 80 60 90C90 100 100 60 80 30" />
  </svg>
);

export default About;