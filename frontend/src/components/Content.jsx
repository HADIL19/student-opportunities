import React from "react";
import { Link } from "react-router-dom";

const Content = () => {
  const cards = [
    {
      title: "Hackathons",
      path: "/hackathons",
      position: "md:-translate-y-10",
      icon: (
        <svg
          viewBox="0 0 100 60"
          className="w-28 h-20 mb-6 opacity-40"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <rect x="10" y="5" width="80" height="50" rx="8" />
          <path d="M30 30 L40 20 L30 10 M70 30 L60 20 L70 10" />
          <text
            x="50%"
            y="45"
            textAnchor="middle"
            className="text-[10px] italic fill-current"
          >
            coding
          </text>
        </svg>
      ),
    },
    {
      title: "Internships",
      path: "/internships",
      position: "md:translate-y-10",
      icon: (
        <svg
          viewBox="0 0 100 80"
          className="w-28 h-24 mb-6 opacity-40"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <rect x="20" y="25" width="60" height="45" rx="5" />
          <rect x="35" y="15" width="30" height="10" rx="3" />
          <rect x="30" y="35" width="15" height="10" rx="2" />
          <rect x="55" y="35" width="15" height="10" rx="2" />
          <rect x="30" y="50" width="15" height="10" rx="2" />
          <rect x="55" y="50" width="15" height="10" rx="2" />
          <rect x="45" y="55" width="10" height="15" rx="2" />
        </svg>
      ),
    },
    {
      title: "Courses",
      path: "/courses",
      position: "md:-translate-y-10",
      icon: (
        <svg
          viewBox="0 0 100 80"
          className="w-28 h-24 mb-6 opacity-40"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path d="M20 40 L50 25 L80 40 L50 55 Z" />
          <path d="M30 45 V60 C30 65 50 70 70 60 V45" />
          <path d="M80 40 V60" />
        </svg>
      ),
    },
  ];

  return (
    <section className="w-full min-h-screen bg-[#fdf2e9] flex items-center justify-center px-4 py-24">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl w-full place-items-center">
        {cards.map((card, index) => (
          <Link
            key={index}
            to={card.path}
            className={`
              bg-white rounded-[40px] p-12
              flex flex-col items-center justify-center
              h-72 md:h-80 w-full max-w-xs
              shadow-sm hover:shadow-xl
              hover:-translate-y-2
              transition-all duration-300 group
              ${card.position}
            `}
          >
            <div className="text-black group-hover:scale-110 transition-transform duration-300">
              {card.icon}
            </div>

            <span className="text-[#bf5b00] text-2xl md:text-3xl font-bold tracking-wide">
              {card.title}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default Content;
