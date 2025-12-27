import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const handleAboutClick = () => {
    const aboutSection = document.getElementById('about-section');
    if (aboutSection) {
      aboutSection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  return (
    <div className="w-full bg-[#c4b199] px-4 py-4">
      <nav className="flex items-center justify-between w-full max-w-7xl mx-auto">
        
        {/* Logo Section - Cliquer sur le logo ramène à l'accueil */}
        <Link to="/" className="flex items-center text-3xl font-bold">
          <span className="text-[#bf5b00]">O</span>
          <span className="text-black">pportuNet</span>
        </Link>

        {/* Navigation Links avec React Router */}
        <div className="flex space-x-8">
          <Link to="/" className="text-[#bf5b00] font-medium hover:opacity-80 transition-opacity">
            Home
          </Link>
          <Link to="/Hackathons" className="text-black font-medium hover:opacity-80 transition-opacity">
            Hackathons
          </Link>
          <Link to="/courses" className="text-black font-medium hover:opacity-80 transition-opacity">
            Courses
          </Link>
          <Link to="/competitions" className="text-black font-medium hover:opacity-80 transition-opacity">
            Competitions
          </Link>
        </div>

        {/* About Us Button avec scroll */}
        <button 
          onClick={handleAboutClick}
          className="flex items-center px-6 py-3 bg-white/10 border border-white/30 rounded-full text-xl font-bold hover:bg-white/20 transition-all group"
        >
          About us
          <svg 
            className="w-6 h-6 ml-2 text-black/40 group-hover:translate-x-1 transition-transform" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </button>
      </nav>
    </div>
  );
};

export default Navbar;