import React from 'react';
import { assets } from '../assets/assets';

const Contact = () => {
  // Utilisez les assets importés
  const socialIcons = [
    { name: 'YouTube', link: '#', img: assets.youtube },
    { name: 'Instagram', link: '#', img: assets.instagram },
    { name: 'Facebook', link: '#', img: assets.facebook },
    { name: 'LinkedIn', link: '#', img: assets.linkedin }, // Correction: assets.linkedin
    { name: 'Twitter', link: '#', img: assets.twitter }, // Correction: link: '#'
  ];

  return (
    <footer className="w-full bg-black">
      <div className="w-full bg-[#fdf2e9] rounded-b-[50px] py-16 px-6 flex flex-col items-center text-center">
        
        {/* Title */}
        <h2 className="text-black text-3xl md:text-4xl font-bold tracking-[0.2em] mb-4">
          CONTACT US
        </h2>

        {/* Subtext with Email */}
        <p className="text-black text-xl md:text-2xl font-serif italic mb-10">
          by email <span className="text-[#bf5b00]">asten@gmail.com</span> or on social media
        </p>

        {/* Social Media Icons Row */}
        <div className="flex flex-wrap justify-center gap-4 md:gap-6">
          {socialIcons.map((social, index) => (
            <a
              key={index}
              href={social.link}
              className="w-14 h-14 md:w-16 md:h-16 bg-white rounded-full flex items-center justify-center shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300"
              aria-label={social.name}
              target="_blank"
              rel="noopener noreferrer"
            >
              {/* Afficher l'image importée */}
              <img 
                src={social.img} 
                alt={social.name} 
                className="w-7 h-7 object-contain"
              />
            </a>
          ))}
        </div>
        
      </div>
    </footer>
  );
};

export default Contact;