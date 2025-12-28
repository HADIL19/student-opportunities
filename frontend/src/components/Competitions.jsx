import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import competitionsData from '../data/competitions.json';
import Navbar2 from './Navbar2';

const Competitions = () => {
  const [filters, setFilters] = useState({
    sortBy: 'newest',
    searchQuery: '',
  });

  const [filteredCompetitions, setFilteredCompetitions] = useState([]);

  // Logique de filtrage identique
  useEffect(() => {
    let results = [...competitionsData];

    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      results = results.filter(item =>
        (item.title && item.title.toLowerCase().includes(query)) ||
        (item.description && item.description.toLowerCase().includes(query))
      );
    }

    // Tri par Titre (A-Z)
    results.sort((a, b) => {
      return (a.title || '').localeCompare(b.title || '');
    });

    setFilteredCompetitions(results);
  }, [filters]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      sortBy: 'newest',
      searchQuery: '',
    });
  };

  return (
    <>
      <Navbar2 />
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
            Competitions
          </h1>
          <div className="flex justify-center mb-8">
            <div className="bg-white rounded-full px-6 py-2 shadow-sm border border-orange-100">
              <span className="text-gray-600">Total Competitions: </span>
              <span className="font-bold text-[#bf5b00]">{competitionsData.length}</span>
            </div>
          </div>
        </div>

        {/* Barre de filtres */}
        <div className="max-w-6xl mx-auto mb-12">
          <div className="bg-white rounded-[30px] p-8 shadow-lg">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-black">Filtrer les Compétitions</h2>
              <button onClick={clearFilters} className="text-sm text-gray-500 hover:text-orange-600 underline">
                Réinitialiser
              </button>
            </div>

            <input
              type="text"
              placeholder="Rechercher une compétition..."
              value={filters.searchQuery}
              onChange={(e) => handleFilterChange('searchQuery', e.target.value)}
              className="w-full px-6 py-4 rounded-full border border-gray-200 focus:ring-2 focus:ring-[#bf5b00] outline-none mb-4"
            />
          </div>
        </div>

        {/* Grille de résultats */}
        <div className="max-w-6xl mx-auto">
          {filteredCompetitions.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-xl text-gray-500">Aucune compétition ne correspond à votre recherche.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredCompetitions.map((item, index) => (
                <div key={index} className="bg-white rounded-[40px] p-8 shadow-sm hover:shadow-xl transition-all flex flex-col h-full border border-transparent hover:border-orange-100">
                  {/* Badge */}
                  <div className="mb-6">
                    <span className="bg-orange-50 text-[#bf5b00] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
                      Competition
                    </span>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 flex-grow leading-tight">
                    {item.title}
                  </h3>
                  
                  {/* Description courte si elle existe */}
                  {item.description && (
                    <p className="text-gray-600 text-sm mb-6 line-clamp-3">
                      {item.description}
                    </p>
                  )}

                  <div className="space-y-3 mb-8">
                    <div className="flex items-center text-sm">
                      <span className="font-bold text-[#bf5b00] w-20">Type:</span>
                      <span className="text-gray-700">International</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <span className="font-bold text-[#bf5b00] w-20">Prix:</span>
                      <span className="text-gray-700">Certificat / Cash</span>
                    </div>
                  </div>
                  
                  <a 
                    href={item.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="mt-auto block w-full py-4 bg-[#2d2d2d] text-white text-center rounded-2xl font-bold hover:bg-black transition-colors"
                  >
                    PARTICIPER
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default Competitions;