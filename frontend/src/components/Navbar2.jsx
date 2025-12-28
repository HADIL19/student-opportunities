import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();

  const handleAboutClick = () => {
    // If we're not on the home page, navigate to home first
    if (window.location.pathname !== '/') {
      navigate('/');
      // Wait for navigation to complete, then scroll
      setTimeout(() => {
        const aboutSection = document.getElementById('about-section');
        if (aboutSection) {
          aboutSection.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
          });
        }
      }, 100);
    } else {
      // If already on home page, just scroll
      const aboutSection = document.getElementById('about-section');
      if (aboutSection) {
        aboutSection.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      }
    }
  };

  return (
    <div className="w-full bg-[#c4b199] px-4 py-4">
      <nav className="flex items-center justify-between w-full max-w-7xl mx-auto">
        
        {/* Logo Section */}
        <Link to="/" className="flex items-center text-3xl font-bold hover:opacity-90 transition-opacity">
          <span className="text-[#bf5b00]">O</span>
          <span className="text-black">pportuNet</span>
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center space-x-8">
          <Link to="/" className="text-[#bf5b00] font-medium hover:opacity-80 transition-opacity">
            Home
          </Link>
          <Link to="/hackathons" className="text-black font-medium hover:opacity-80 transition-opacity">
            Hackathons
          </Link>
          <Link to="/courses" className="text-black font-medium hover:opacity-80 transition-opacity">
            Courses
          </Link>
          <Link to="/internships" className="text-black font-medium hover:opacity-80 transition-opacity">
            Internships
          </Link>
          
          {/* About Us Button */}
          <button
            onClick={handleAboutClick}
            className="px-6 py-2 bg-[#2d2d2d] text-white font-medium rounded-full hover:bg-black transition-colors"
          >
            About Us
          </button>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;