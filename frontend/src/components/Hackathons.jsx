import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import lablabData from '../data/lablab_hackathons.json';
import devpostData from '../data/hackathons.json';
import Navbar2 from './Navbar2';


const Hackathons = () => {
  const [filters, setFilters] = useState({
    source: 'all',
    status: 'all',
    sortBy: 'newest',
    searchQuery: '',
    prizeRange: 'all',
  });

  const [filteredHackathons, setFilteredHackathons] = useState([]);

  // Fonction sécurisée pour extraire le montant du prix
  function extractPrizeAmount(prizeString) {
    if (!prizeString) return 0;
    
    // Gérer différentes formes de prix
    const string = prizeString.toString();
    
    // Chercher des nombres (avec séparateurs décimaux)
    const match = string.match(/(\d+[,.]?\d*)/);
    if (match) {
      // Convertir en nombre (remplacer les virgules par des points)
      const num = parseFloat(match[1].replace(',', ''));
      return isNaN(num) ? 0 : num;
    }
    
    return 0;
  }

  // Combiner toutes les données avec des valeurs par défaut
  const allHackathons = [
    ...lablabData.map(item => ({ 
      ...item, 
      source: 'lablab',
      status: 'open',
      participants: 0,
      host: item.host || 'LabLab.ai',
      days_left: item.days_left || 'N/A',
      prizeAmount: extractPrizeAmount(item.prize_amount)
    })),
    ...devpostData.map(item => ({ 
      ...item, 
      source: 'devpost',
      prizeAmount: extractPrizeAmount(item.prize_amount),
      participants: item.participants || 0,
      host: item.host || 'Unknown',
      days_left: item.days_left || 'N/A',
      themes: item.themes || '',
      submission_period: item.submission_period || 'N/A'
    }))
  ];

  // Appliquer les filtres
  useEffect(() => {
    let results = [...allHackathons];

    // Filtre par source
    if (filters.source !== 'all') {
      results = results.filter(item => item.source === filters.source);
    }

    // Filtre par statut
    if (filters.status !== 'all') {
      results = results.filter(item => item.status === filters.status);
    }

    // Filtre par recherche
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      results = results.filter(item =>
        (item.title && item.title.toLowerCase().includes(query)) ||
        (item.themes && item.themes.toLowerCase().includes(query)) ||
        (item.host && item.host.toLowerCase().includes(query))
      );
    }

    // Filtre par prix
    if (filters.prizeRange !== 'all') {
      results = results.filter(item => {
        const amount = item.prizeAmount || 0;
        switch (filters.prizeRange) {
          case 'small': return amount < 10000;
          case 'medium': return amount >= 10000 && amount < 50000;
          case 'large': return amount >= 50000;
          default: return true;
        }
      });
    }

    // Tri
    results.sort((a, b) => {
      switch (filters.sortBy) {
        case 'prize':
          const prizeA = a.prizeAmount || 0;
          const prizeB = b.prizeAmount || 0;
          return prizeB - prizeA;
        
        case 'participants':
          const partA = a.participants || 0;
          const partB = b.participants || 0;
          return partB - partA;
        
        case 'newest':
        default:
          // Par défaut, on trie par titre
          return (a.title || '').localeCompare(b.title || '');
      }
    });

    setFilteredHackathons(results);
  }, [filters]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      source: 'all',
      status: 'all',
      sortBy: 'newest',
      searchQuery: '',
      prizeRange: 'all',
    });
  };

  // Version simplifiée sans les sections séparées
  return (
    <>
    <Navbar2/>
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

      {/* Titre et Stats */}
      <div className="max-w-6xl mx-auto mb-8">
        <h1 className="text-[#bf5b00] text-4xl md:text-5xl font-serif italic text-center mb-6">
          Hackathons
        </h1>
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <div className="bg-white rounded-full px-4 py-2 shadow-sm">
            <span className="text-gray-600">Total: </span>
            <span className="font-bold text-[#bf5b00]">{allHackathons.length}</span>
          </div>
          <div className="bg-white rounded-full px-4 py-2 shadow-sm">
            <span className="text-gray-600">LabLab.ai: </span>
            <span className="font-bold text-blue-600">{lablabData.length}</span>
          </div>
          <div className="bg-white rounded-full px-4 py-2 shadow-sm">
            <span className="text-gray-600">Devpost: </span>
            <span className="font-bold text-green-600">{devpostData.length}</span>
          </div>
        </div>
      </div>

      {/* Barre de filtres simplifiée */}
      <div className="max-w-6xl mx-auto mb-12">
        <div className="bg-white rounded-[30px] p-6 shadow-lg">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <h2 className="text-2xl font-bold text-black">Filtrer les Hackathons</h2>
            <button
              onClick={clearFilters}
              className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
            >
              Réinitialiser
            </button>
          </div>

          {/* Recherche */}
          <div className="mb-6">
            <input
              type="text"
              placeholder="Rechercher par titre ou thème..."
              value={filters.searchQuery}
              onChange={(e) => handleFilterChange('searchQuery', e.target.value)}
              className="w-full px-4 py-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#bf5b00] focus:border-transparent"
            />
          </div>

          {/* Filtres principaux */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Source */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Source</label>
              <select
                value={filters.source}
                onChange={(e) => handleFilterChange('source', e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#bf5b00]"
              >
                <option value="all">Toutes les sources</option>
                <option value="lablab">LabLab.ai</option>
                <option value="devpost">Devpost</option>
              </select>
            </div>

            {/* Trier par */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Trier par</label>
              <select
                value={filters.sortBy}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#bf5b00]"
              >
                <option value="newest">Titre A-Z</option>
                <option value="prize">Prix décroissant</option>
                <option value="participants">Participants décroissant</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Résultats */}
      <div className="max-w-6xl mx-auto">
        {filteredHackathons.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-600 mb-2">Aucun hackathon trouvé</h3>
            <p className="text-gray-500 mb-4">Essayez de modifier vos critères de recherche</p>
            <button
              onClick={clearFilters}
              className="px-6 py-2 bg-[#bf5b00] text-white rounded-full hover:bg-[#a34c00] transition-colors"
            >
              Réinitialiser les filtres
            </button>
          </div>
        ) : (
          <>
            {/* Résumé des résultats */}
            <div className="mb-8">
              <span className="text-gray-600">
                Affichage de <span className="font-bold text-black">{filteredHackathons.length}</span> hackathon{filteredHackathons.length > 1 ? 's' : ''}
              </span>
            </div>

            {/* Grille des hackathons */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredHackathons.map((item, index) => (
                <div key={index} className="bg-white rounded-[30px] p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col h-full">
                  {/* Badge source */}
                  <div className="mb-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${item.source === 'lablab' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
                      {item.source === 'lablab' ? 'LabLab.ai' : 'Devpost'}
                    </span>
                  </div>
                  
                  {/* Titre */}
                  <h3 className="text-xl font-bold text-black mb-3 flex-grow">{item.title}</h3>
                  
                  {/* Détails communs */}
                  <div className="space-y-2 text-sm mb-4">
                    {item.host && (
                      <p><span className="font-bold text-[#bf5b00]">Hôte:</span> {item.host}</p>
                    )}
                    {item.prize_amount && (
                      <p><span className="font-bold text-[#bf5b00]">Prix:</span> {item.prize_amount}</p>
                    )}
                    {item.themes && (
                      <p><span className="font-bold text-[#bf5b00]">Thèmes:</span> {item.themes}</p>
                    )}
                    {item.submission_period && (
                      <p><span className="font-bold text-[#bf5b00]">Période:</span> {item.submission_period}</p>
                    )}
                    {item.participants > 0 && (
                      <p><span className="font-bold text-[#bf5b00]">Participants:</span> {item.participants.toLocaleString()}</p>
                    )}
                    {item.days_left && item.days_left !== 'N/A' && (
                      <p><span className="font-bold text-[#bf5b00]">Temps restant:</span> {item.days_left}</p>
                    )}
                  </div>
                  
                  {/* Bouton */}
                  <a 
                    href={item.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className={`mt-auto block w-full py-2 text-white text-center rounded-lg text-sm font-bold transition-colors ${item.source === 'lablab' ? 'bg-[#2d2d2d] hover:bg-black' : 'bg-green-600 hover:bg-green-700'}`}
                  >
                    {item.source === 'lablab' ? 'GO TO' : 'Voir sur Devpost'}
                  </a>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
    </>
  );
};

export default Hackathons;