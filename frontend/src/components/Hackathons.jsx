import React from 'react';
import { Link } from 'react-router-dom';
import lablabData from '../data/lablab_hackathons.json';
import devpostData from '../data/hackathons.json';

const Hackathons = () => {
  // Fusionner ou traiter les données séparément
  const allHackathons = [
    ...lablabData.map(item => ({ ...item, source: 'lablab' })),
    ...devpostData.map(item => ({ ...item, source: 'devpost' }))
  ];

  // Ou garder séparé
  const lablabHackathons = lablabData;
  const devpostHackathons = devpostData;

  return (
    <section className="w-full min-h-screen bg-[#fdf2e9] py-16 px-4 md:px-10">
      
      {/* Bouton Retour */}
      <div className="max-w-6xl mx-auto mb-10">
        <Link to="/" className="inline-flex items-center text-[#bf5b00] hover:opacity-80 transition-opacity">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Home
        </Link>
      </div>

      {/* Titre */}
      <h1 className="text-[#bf5b00] text-4xl md:text-5xl font-serif italic text-center mb-16">
        Hackathons
      </h1>

      {/* Option A : Afficher tous mélangés */}
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-black mb-8">Tous les Hackathons</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allHackathons.map((item, index) => (
            <div key={index} className="bg-white rounded-[30px] p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="mb-4">
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${item.source === 'lablab' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
                  {item.source === 'lablab' ? 'LabLab.ai' : 'Devpost'}
                </span>
              </div>
              
              <h3 className="text-xl font-bold text-black mb-3">{item.title}</h3>
              
              {/* Affichage conditionnel selon la source */}
              {item.source === 'lablab' ? (
                <div className="space-y-2 text-sm">
                  <p><span className="font-bold text-[#bf5b00]">Prix:</span> {item.prize_amount}</p>
                  <p><span className="font-bold text-[#bf5b00]">Thèmes:</span> {item.themes}</p>
                  <p><span className="font-bold text-[#bf5b00]">Période:</span> {item.submission_period}</p>
                </div>
              ) : (
                <div className="space-y-2 text-sm">
                  <p><span className="font-bold text-[#bf5b00]">Hôte:</span> {item.host}</p>
                  <p><span className="font-bold text-[#bf5b00]">Prix:</span> {item.prize_amount}</p>
                  <p><span className="font-bold text-[#bf5b00]">Participants:</span> {item.participants.toLocaleString()}</p>
                  <p><span className="font-bold text-[#bf5b00]">Temps restant:</span> {item.days_left}</p>
                </div>
              )}
              
              <a href={item.link} target="_blank" rel="noopener noreferrer" className="mt-4 block w-full py-2 bg-[#2d2d2d] text-white text-center rounded-lg text-sm font-bold hover:bg-black transition-colors">
                Participer
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* Option B : Afficher en sections séparées */}
      <div className="max-w-6xl mx-auto mt-16">
        
        {/* Section LabLab.ai */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-black mb-8 flex items-center">
            <span className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full mr-3">LabLab.ai</span>
            Hackathons
          </h2>
          <div className="flex flex-col gap-10">
            {lablabHackathons.map((item) => (
              <div key={item.id} className="bg-white rounded-[40px] p-6 md:p-10 shadow-sm flex flex-col md:flex-row gap-10 hover:shadow-md transition-shadow">
                {/* Colonne Gauche : Image */}
                <div className="relative w-full md:w-1/2 h-64 overflow-hidden rounded-[30px] bg-gray-100">
                  <img src={item.image_url} alt={item.title} className="w-full h-full object-cover" />
                </div>
                
                {/* Colonne Droite : Infos */}
                <div className="w-full md:w-1/2">
                  <h3 className="text-2xl font-bold text-black mb-6">{item.title}</h3>
                  <div className="space-y-3 mb-6">
                    <p><span className="text-[#bf5b00] font-bold">Période:</span> ⏰ {item.submission_period}</p>
                    <p><span className="text-[#bf5b00] font-bold">Thèmes:</span> {item.themes}</p>
                    <p><span className="text-[#bf5b00] font-bold">Prix:</span> 🏆 {item.prize_amount}</p>
                  </div>
                  <a href={item.link} target="_blank" rel="noopener noreferrer" className="block w-full py-3 bg-[#2d2d2d] text-white text-center rounded-lg text-xs font-bold tracking-widest hover:bg-black transition-colors">
                    GO TO
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section Devpost */}
        <div>
          <h2 className="text-3xl font-bold text-black mb-8 flex items-center">
            <span className="bg-green-100 text-green-800 px-4 py-2 rounded-full mr-3">Devpost</span>
            Hackathons
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {devpostHackathons.map((item, index) => (
              <div key={index} className="bg-white rounded-[30px] p-6 shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-xl font-bold text-black mb-4">{item.title}</h3>
                <div className="space-y-2 text-sm mb-4">
                  <p><span className="font-bold text-[#bf5b00]">Hôte:</span> {item.host}</p>
                  <p><span className="font-bold text-[#bf5b00]">Statut:</span> 
                    <span className={`ml-2 px-2 py-1 rounded-full text-xs ${item.status === 'open' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {item.status}
                    </span>
                  </p>
                  <p><span className="font-bold text-[#bf5b00]">Localisation:</span> {item.location}</p>
                  <p><span className="font-bold text-[#bf5b00]">Prix:</span> {item.prize_amount}</p>
                  <p><span className="font-bold text-[#bf5b00]">Participants:</span> {item.participants.toLocaleString()}</p>
                  <p><span className="font-bold text-[#bf5b00]">Temps restant:</span> {item.days_left}</p>
                </div>
                <a href={item.link} target="_blank" rel="noopener noreferrer" className="block w-full py-2 bg-green-600 text-white text-center rounded-lg text-sm font-bold hover:bg-green-700 transition-colors">
                  Voir sur Devpost
                </a>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default Hackathons;