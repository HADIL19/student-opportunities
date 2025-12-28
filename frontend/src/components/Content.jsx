import React from 'react';
import { Link } from 'react-router-dom'; 

const Content = () => {
  const cards = [
    {
      title: "Hackathons",
      path: "/hackathons", 
      icon: (
        <svg viewBox="0 0 100 60" className="w-32 h-20 mb-4 opacity-40" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="10" y="5" width="80" height="50" rx="8" />
          <path d="M30 30 L40 20 L30 10 M70 30 L60 20 L70 10" />
          <text x="50%" y="45" textAnchor="middle" className="text-[10px] font-sans italic" fill="black">coding</text>
        </svg>
      ),
      position: "md:-translate-y-12" // Position haute
    },
    {
      title: "Internships",
      path: "/internships", 
      icon: (
        <svg viewBox="0 0 100 80" className="w-32 h-24 mb-4 opacity-40" fill="none" stroke="currentColor" strokeWidth="1.5">
          {/* Icône pour Internships - bâtiment/bureau */}
          <rect x="20" y="25" width="60" height="45" rx="5" />
          <rect x="35" y="15" width="30" height="10" rx="3" />
          {/* Fenêtres */}
          <rect x="30" y="35" width="15" height="10" rx="2" />
          <rect x="55" y="35" width="15" height="10" rx="2" />
          <rect x="30" y="50" width="15" height="10" rx="2" />
          <rect x="55" y="50" width="15" height="10" rx="2" />
          {/* Porte */}
          <rect x="45" y="55" width="10" height="15" rx="2" />
        </svg>
      ),
      position: "md:translate-y-12" // Position basse (milieu)
    },
    {
      title: "Courses",
      path: "/courses",
      icon: (
        <svg viewBox="0 0 100 80" className="w-32 h-24 mb-4 opacity-40" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M20 40 L50 25 L80 40 L50 55 Z" />
          <path d="M30 45 V60 C30 65 50 70 70 60 V45" />
          <path d="M80 40 V60" />
        </svg>
      ),
      position: "md:-translate-y-12" // Position haute
    },
    {
      title: "Competitions", // Correction de l'orthographe
      path: "/competitions",
      icon: (
        <svg viewBox="0 0 100 80" className="w-32 h-24 mb-4 opacity-40" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="50" cy="25" r="8" />
          <circle cx="30" cy="55" r="8" />
          <circle cx="70" cy="55" r="8" />
          <path d="M45 35 L35 45 M55 35 L65 45 M40 55 L60 55" />
        </svg>
      ),
      position: "md:translate-y-12" // Position basse
    }
  ];

  return (
    <section className="w-full min-h-[600px] bg-[#fdf2e9] flex items-center justify-center px-4 py-20">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 max-w-7xl w-full">
        {cards.map((card, index) => (
          <Link
            key={index}
            to={card.path}
            className={`bg-white rounded-[40px] p-10 md:p-12 flex flex-col items-center justify-center shadow-sm 
                       hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group
                       ${card.position} h-64 md:h-80`}
          >
            {/* Icône */}
            <div className="text-black group-hover:scale-110 transition-transform duration-300">
              {card.icon}
            </div>

            {/* Label */}
            <span className="text-[#bf5b00] text-2xl md:text-3xl font-bold tracking-wide mt-6">
              {card.title}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default Content;