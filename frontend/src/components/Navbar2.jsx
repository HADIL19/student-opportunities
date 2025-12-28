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
          <Link to="/internships" className="text-black font-medium hover:opacity-80 transition-opacity">
            Interships
          </Link>
        </div>

        {/* About Us Button avec scroll */}
       
           
      </nav>
    </div>
  );
};

export default Navbar;