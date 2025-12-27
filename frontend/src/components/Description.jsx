import React from 'react';

const Description = () => {
  return (
    <div id="about-section" className=" w-full px-4 py-10 bg-[#fdf2e9]">
      <div className="max-w-7xl mx-auto border-2 border-[#bf5b00] rounded-[50px] px-6 py-10 md:py-14 text-center ">
        
        {/* Decorative Heading */}
        <h2 className="text-[#bf5b00] text-3xl md:text-4xl font-serif italic mb-6">
          About Us
        </h2>

        {/* Mission Statement Text */}
        <p className="text-black text-2xl md:text-3xl font-bold leading-tight max-w-6xl mx-auto">
          Our mission is to simplify access to opportunities that matter. 
          By aggregating <span className="text-[#bf5b00]">hackathons</span>, 
          <span className="text-[#bf5b00]"> competitions</span>, and 
          <span className="text-[#bf5b00]"> educational programs</span>, 
          we help learners focus on growth, innovation, and skill-building 
          instead of endless searching
        </p>
        
      </div>
    </div>
  );
};

export default Description;