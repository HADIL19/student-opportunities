import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import internshipsData from '../data/interships.json';
import Navbar2 from './Navbar2';

const Internships = () => {
  const [filters, setFilters] = useState({
    jobType: 'all',
    location: 'all',
    salaryRange: 'all',
    searchQuery: '',
    sortBy: 'newest',
  });

  const [filteredInternships, setFilteredInternships] = useState([]);
  const [expandedDescriptions, setExpandedDescriptions] = useState({});

  // Fonction pour extraire le salaire minimum
  const extractMinSalary = (salaryString) => {
    if (!salaryString) return 0;
    
    const match = salaryString.match(/\$?(\d+[,.]?\d*)/);
    if (match) {
      const num = parseFloat(match[1].replace(',', ''));
      return isNaN(num) ? 0 : num;
    }
    return 0;
  };

  // Appliquer les filtres
  useEffect(() => {
    let results = [...internshipsData];

    // Filtre par type d'emploi
    if (filters.jobType !== 'all') {
      results = results.filter(item => 
        item.jobType && item.jobType.includes(filters.jobType)
      );
    }

    // Filtre par recherche
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      results = results.filter(item =>
        (item.positionName && item.positionName.toLowerCase().includes(query)) ||
        (item.company && item.company.toLowerCase().includes(query)) ||
        (item.description && item.description.toLowerCase().includes(query))
      );
    }

    // Filtre par salaire
    if (filters.salaryRange !== 'all') {
      results = results.filter(item => {
        const minSalary = extractMinSalary(item.salary);
        switch (filters.salaryRange) {
          case 'low': return minSalary < 15;
          case 'medium': return minSalary >= 15 && minSalary < 25;
          case 'high': return minSalary >= 25;
          default: return true;
        }
      });
    }

    // Tri
    results.sort((a, b) => {
      switch (filters.sortBy) {
        case 'salary':
          const salaryA = extractMinSalary(a.salary);
          const salaryB = extractMinSalary(b.salary);
          return salaryB - salaryA;
        
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        
        case 'newest':
        default:
          // Trier par date de posting (les plus récents d'abord)
          const dateA = new Date(a.postingDateParsed || 0);
          const dateB = new Date(b.postingDateParsed || 0);
          return dateB - dateA;
      }
    });

    setFilteredInternships(results);
  }, [filters]);

  // Obtenir les types d'emploi uniques
  const jobTypes = [...new Set(
    internshipsData.flatMap(item => item.jobType || [])
  )].filter(Boolean);

  // Obtenir les emplacements uniques
  const locations = [...new Set(
    internshipsData.map(item => item.location?.split(',')[0] || item.location)
  )].filter(Boolean);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      jobType: 'all',
      location: 'all',
      salaryRange: 'all',
      searchQuery: '',
      sortBy: 'newest',
    });
  };

  const toggleDescription = (id) => {
    setExpandedDescriptions(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Formater la date
  const formatDate = (dateString) => {
    if (!dateString) return 'Date non disponible';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

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
          Internships
        </h1>
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <div className="bg-white rounded-full px-4 py-2 shadow-sm">
            <span className="text-gray-600">Total: </span>
            <span className="font-bold text-[#bf5b00]">{internshipsData.length}</span>
          </div>
          <div className="bg-white rounded-full px-4 py-2 shadow-sm">
            <span className="text-gray-600">Entreprises: </span>
            <span className="font-bold text-blue-600">
              {[...new Set(internshipsData.map(item => item.company))].length}
            </span>
          </div>
          <div className="bg-white rounded-full px-4 py-2 shadow-sm">
            <span className="text-gray-600">Pays: </span>
            <span className="font-bold text-green-600">États-Unis</span>
          </div>
        </div>
      </div>

      {/* Barre de filtres */}
      <div className="max-w-6xl mx-auto mb-12">
        <div className="bg-white rounded-[30px] p-6 shadow-lg">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <h2 className="text-2xl font-bold text-black">Filtrer les Stages</h2>
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
              placeholder="Rechercher par poste, entreprise ou description..."
              value={filters.searchQuery}
              onChange={(e) => handleFilterChange('searchQuery', e.target.value)}
              className="w-full px-4 py-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#bf5b00] focus:border-transparent"
            />
          </div>

          {/* Filtres principaux */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Type d'emploi */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Type d'emploi</label>
              <select
                value={filters.jobType}
                onChange={(e) => handleFilterChange('jobType', e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#bf5b00]"
              >
                <option value="all">Tous les types</option>
                {jobTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            {/* Salaires */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Salaire horaire</label>
              <select
                value={filters.salaryRange}
                onChange={(e) => handleFilterChange('salaryRange', e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#bf5b00]"
              >
                <option value="all">Tous les salaires</option>
                <option value="low">Moins de $15/h</option>
                <option value="medium">$15 - $25/h</option>
                <option value="high">Plus de $25/h</option>
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
                <option value="newest">Plus récents</option>
                <option value="salary">Salaire décroissant</option>
                <option value="rating">Meilleures notes</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Résultats */}
      <div className="max-w-6xl mx-auto">
        {filteredInternships.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-600 mb-2">Aucun stage trouvé</h3>
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
                Affichage de <span className="font-bold text-black">{filteredInternships.length}</span> stage{filteredInternships.length > 1 ? 's' : ''}
              </span>
            </div>

            {/* Liste des stages */}
            <div className="space-y-6">
              {filteredInternships.map((internship) => (
                <div key={internship.id} className="bg-white rounded-[30px] p-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex flex-col lg:flex-row gap-6">
                    {/* Colonne gauche : Infos principales */}
                    <div className="lg:w-2/3">
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
                        <div>
                          <h3 className="text-2xl font-bold text-black mb-2">{internship.positionName}</h3>
                          <div className="flex items-center gap-4 mb-3">
                            <span className="text-lg font-semibold text-[#bf5b00]">{internship.company}</span>
                            {internship.rating > 0 && (
                              <div className="flex items-center">
                                <span className="text-yellow-500 mr-1">★</span>
                                <span className="font-medium">{internship.rating}</span>
                                <span className="text-gray-500 text-sm ml-1">({internship.reviewsCount} avis)</span>
                              </div>
                            )}
                          </div>
                        </div>
                        <span className="px-3 py-1 bg-[#bf5b00]/10 text-[#bf5b00] rounded-full text-sm font-medium">
                          {internship.postedAt}
                        </span>
                      </div>

                      {/* Détails rapides */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <div className="flex items-center">
                          <svg className="w-5 h-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span className="text-gray-700">{internship.location}</span>
                        </div>
                        
                        <div className="flex items-center">
                          <svg className="w-5 h-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="text-gray-700">
                            {internship.salary || 'Salaire non spécifié'}
                          </span>
                        </div>

                        <div className="flex items-center">
                          <svg className="w-5 h-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          <span className="text-gray-700">
                            {internship.jobType?.join(', ') || 'Type non spécifié'}
                          </span>
                        </div>
                      </div>

                      {/* Description */}
                      <div className="mb-6">
                        <h4 className="text-lg font-bold text-black mb-3">Description</h4>
                        <div className="text-gray-700">
                          {expandedDescriptions[internship.id] ? (
                            <div>
                              {internship.description ? (
                                <p className="whitespace-pre-line">{internship.description}</p>
                              ) : (
                                <p>Aucune description disponible</p>
                              )}
                              <button
                                onClick={() => toggleDescription(internship.id)}
                                className="mt-3 text-[#bf5b00] hover:underline"
                              >
                                Voir moins
                              </button>
                            </div>
                          ) : (
                            <div>
                              <p className="line-clamp-3">
                                {internship.description 
                                  ? internship.description.substring(0, 300) + '...'
                                  : 'Aucune description disponible'
                                }
                              </p>
                              {internship.description && internship.description.length > 300 && (
                                <button
                                  onClick={() => toggleDescription(internship.id)}
                                  className="mt-2 text-[#bf5b00] hover:underline"
                                >
                                  Lire la suite
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Colonne droite : Actions */}
                    <div className="lg:w-1/3 border-l lg:border-l lg:border-gray-200 lg:pl-6">
                      <div className="sticky top-6">
                        <div className="mb-6">
                          <h4 className="font-bold text-black mb-3">Informations</h4>
                          <div className="space-y-2 text-sm">
                            <p><span className="font-medium text-gray-600">Posté le:</span> {formatDate(internship.postingDateParsed)}</p>
                            <p><span className="font-medium text-gray-600">Source:</span> Indeed.com</p>
                            {internship.searchInput && (
                              <p><span className="font-medium text-gray-600">Recherche:</span> {internship.searchInput.position}</p>
                            )}
                          </div>
                        </div>

                        {/* Boutons d'action */}
                        <div className="space-y-3">
                          {internship.url && (
                            <a
                              href={internship.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block w-full py-3 bg-[#bf5b00] text-white text-center rounded-lg font-bold hover:bg-[#a34c00] transition-colors"
                            >
                              Voir sur Indeed
                            </a>
                          )}
                          
                          {internship.externalApplyLink && (
                            <a
                              href={internship.externalApplyLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block w-full py-3 bg-gray-800 text-white text-center rounded-lg font-bold hover:bg-black transition-colors"
                            >
                              Postuler directement
                            </a>
                          )}

                          <button className="w-full py-3 border border-[#bf5b00] text-[#bf5b00] rounded-lg font-bold hover:bg-[#bf5b00]/10 transition-colors">
                            Enregistrer pour plus tard
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
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

export default Internships;