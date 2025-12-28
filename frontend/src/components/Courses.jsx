import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import coursesData from '../data/coursera_courses (1).json';
import Navbar2 from './Navbar2';

const Courses = () => {
  const [filters, setFilters] = useState({
    provider: 'all',
    sortBy: 'newest',
    searchQuery: '',
  });

  const [filteredCourses, setFilteredCourses] = useState([]);

  // Appliquer les filtres
  useEffect(() => {
    let results = [...coursesData];

    // Filtre par recherche (Titre ou Provider)
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      results = results.filter(item =>
        (item.title && item.title.toLowerCase().includes(query)) ||
        (item.provider && item.provider.toLowerCase().includes(query))
      );
    }

    // Filtre par Provider (Partenaire)
    if (filters.provider !== 'all') {
      results = results.filter(item => item.provider === filters.provider);
    }

    // Tri par Titre
    results.sort((a, b) => {
      if (filters.sortBy === 'newest') {
        return (a.title || '').localeCompare(b.title || '');
      }
      return 0;
    });

    setFilteredCourses(results);
  }, [filters]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      provider: 'all',
      sortBy: 'newest',
      searchQuery: '',
    });
  };

  // Liste unique des partenaires pour le menu déroulant
  const providers = ['all', ...new Set(coursesData.map(c => c.provider))];

  return (
    <>
      <Navbar2 />
      {/* Background matches Hackathons page exactly */}
      <section className="w-full min-h-screen bg-[#fdf2e9] py-16 px-4 md:px-10">
        
        {/* Bouton Retour - Same style as Hackathons */}
        <div className="max-w-6xl mx-auto mb-10">
          <Link to="/" className="inline-flex items-center text-[#bf5b00] hover:opacity-80 transition-opacity">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </Link>
        </div>

        {/* Titre et Stats - Same style as Hackathons */}
        <div className="max-w-6xl mx-auto mb-8">
          <h1 className="text-[#bf5b00] text-4xl md:text-5xl font-serif italic text-center mb-6">
            Courses
          </h1>
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <div className="bg-white rounded-full px-4 py-2 shadow-sm">
              <span className="text-gray-600">Total Courses: </span>
              <span className="font-bold text-[#bf5b00]">{coursesData.length}</span>
            </div>
          </div>
        </div>

        {/* Barre de filtres - Copy of Hackathons style */}
        <div className="max-w-6xl mx-auto mb-12">
          <div className="bg-white rounded-[30px] p-6 shadow-lg">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
              <h2 className="text-2xl font-bold text-black">Filtrer les Cours</h2>
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
                placeholder="Rechercher par titre ou partenaire..."
                value={filters.searchQuery}
                onChange={(e) => handleFilterChange('searchQuery', e.target.value)}
                className="w-full px-4 py-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#bf5b00] focus:border-transparent"
              />
            </div>

            {/* Filtres principaux */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Partenaire</label>
                <select
                  value={filters.provider}
                  onChange={(e) => handleFilterChange('provider', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#bf5b00]"
                >
                  {providers.map(p => (
                    <option key={p} value={p}>{p === 'all' ? 'Tous les partenaires' : p}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Trier par</label>
                <select
                  value={filters.sortBy}
                  onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#bf5b00]"
                >
                  <option value="newest">Titre A-Z</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Résultats Grid - Copy of Hackathons structure */}
        <div className="max-w-6xl mx-auto">
          {filteredCourses.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-xl font-bold text-gray-600 mb-2">Aucun cours trouvé</h3>
              <button onClick={clearFilters} className="px-6 py-2 bg-[#bf5b00] text-white rounded-full">
                Réinitialiser
              </button>
            </div>
          ) : (
            <>
              <div className="mb-8">
                <span className="text-gray-600">
                  Affichage de <span className="font-bold text-black">{filteredCourses.length}</span> cours
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCourses.map((item, index) => (
                  <div key={index} className="bg-white rounded-[30px] p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col h-full">
                    {/* Badge Provider */}
                    <div className="mb-4">
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800">
                        {item.provider}
                      </span>
                    </div>
                    
                    <h3 className="text-xl font-bold text-black mb-3 flex-grow">{item.title}</h3>
                    
                    <div className="space-y-2 text-sm mb-4">
                      <p><span className="font-bold text-[#bf5b00]">Hôte:</span> {item.provider}</p>
                      <p><span className="font-bold text-[#bf5b00]">Prix:</span> Gratuit</p>
                    </div>
                    
                    {/* Dark button like LabLab style */}
                    <a 
                      href={item.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="mt-auto block w-full py-2 bg-[#2d2d2d] text-white text-center rounded-lg text-sm font-bold hover:bg-black transition-colors"
                    >
                      VOIR LE COURS
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

export default Courses;