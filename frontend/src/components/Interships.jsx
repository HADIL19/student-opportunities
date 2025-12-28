import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Navbar2 from './Navbar2';

const Internships = () => {
  const [filters, setFilters] = useState({
    jobType: 'all',
    location: 'all',
    salaryRange: 'all',
    searchQuery: '',
    sortBy: 'newest',
  });

  const [internshipsData, setInternshipsData] = useState([]);
  const [expandedDescriptions, setExpandedDescriptions] = useState({});

  useEffect(() => {
    const fetchInternships = async () => {
      try {
        const res = await axios.get('http://localhost:8000/internships/');
        setInternshipsData(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error('Error fetching internships:', err);
      }
    };
    fetchInternships();
  }, []);

  const extractMinSalary = (salaryString) => {
    if (!salaryString) return 0;
    const match = salaryString.match(/\$?(\d+[,.]?\d*)/);
    if (match) {
      const num = parseFloat(match[1].replace(',', ''));
      return isNaN(num) ? 0 : num;
    }
    return 0;
  };

  const filteredInternships = useMemo(() => {
    let results = [...internshipsData];

    if (filters.jobType !== 'all') {
      results = results.filter(item => item.jobType && item.jobType.includes(filters.jobType));
    }

    if (filters.searchQuery) {
      const q = filters.searchQuery.toLowerCase();
      results = results.filter(item =>
        (item.positionName && item.positionName.toLowerCase().includes(q)) ||
        (item.company && item.company.toLowerCase().includes(q)) ||
        (item.description && item.description.toLowerCase().includes(q))
      );
    }

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

    results.sort((a, b) => {
      switch (filters.sortBy) {
        case 'salary':
          return extractMinSalary(b.salary) - extractMinSalary(a.salary);
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        case 'newest':
        default: {
          const dateA = new Date(a.postingDateParsed || 0);
          const dateB = new Date(b.postingDateParsed || 0);
          return dateB - dateA;
        }
      }
    });

    return results;
  }, [filters, internshipsData]);

  const jobTypes = useMemo(() => [...new Set(internshipsData.flatMap(item => item.jobType || []))].filter(Boolean), [internshipsData]);
  const locations = useMemo(() => [...new Set(internshipsData.map(item => item.location?.split(',')[0] || item.location))].filter(Boolean), [internshipsData]);

  const handleFilterChange = (key, value) => setFilters(prev => ({ ...prev, [key]: value }));
  const clearFilters = () => setFilters({ jobType: 'all', location: 'all', salaryRange: 'all', searchQuery: '', sortBy: 'newest' });
  const toggleDescription = (id) => setExpandedDescriptions(prev => ({ ...prev, [id]: !prev[id] }));

  const formatDate = (dateString) => {
    if (!dateString) return 'Date non disponible';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  // Calculate stats
  const uniqueCompanies = useMemo(() => new Set(internshipsData.map(item => item.company)).size, [internshipsData]);
  const uniqueCountries = useMemo(() => new Set(internshipsData.map(item => item.location?.split(',').pop()?.trim())).size, [internshipsData]);

  return (
    <>
      <Navbar2 />
      <section className="w-full min-h-screen bg-[#f5ebe0] py-12 px-4 md:px-10">
        <div className="max-w-7xl mx-auto">
          {/* Back to Home Link */}
          <div className="mb-8">
            <Link to="/" className="inline-flex items-center text-[#d97706] hover:text-[#b45309] font-medium transition-colors">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Home
            </Link>
          </div>

          {/* Page Title */}
          <div className="text-center mb-8">
            <h1 className="text-5xl md:text-6xl font-serif italic text-[#d97706] mb-6">Internships</h1>
            
            {/* Stats Badges */}
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <div className="bg-white px-6 py-3 rounded-full shadow-sm">
                <span className="text-gray-600">Total: </span>
                <span className="font-bold text-[#d97706]">{internshipsData.length}</span>
              </div>
              <div className="bg-white px-6 py-3 rounded-full shadow-sm">
                <span className="text-gray-600">Entreprises: </span>
                <span className="font-bold text-blue-600">{uniqueCompanies}</span>
              </div>
              <div className="bg-white px-6 py-3 rounded-full shadow-sm">
                <span className="text-gray-600">Pays: </span>
                <span className="font-bold text-green-600">{uniqueCountries}</span>
              </div>
            </div>
          </div>

          {/* Filter Section */}
          <div className="bg-white rounded-3xl p-8 shadow-sm mb-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Filtrer les Stages</h2>
              <button 
                onClick={clearFilters} 
                className="text-gray-600 hover:text-gray-800 font-medium transition-colors"
              >
                Réinitialiser
              </button>
            </div>

            {/* Search Bar */}
            <div className="mb-6">
              <input
                type="text"
                placeholder="Rechercher par poste, entreprise ou description..."
                value={filters.searchQuery}
                onChange={(e) => handleFilterChange('searchQuery', e.target.value)}
                className="w-full px-6 py-4 rounded-2xl border border-gray-200 focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
              />
            </div>

            {/* Filter Dropdowns */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Type d'emploi</label>
                <select 
                  value={filters.jobType} 
                  onChange={(e) => handleFilterChange('jobType', e.target.value)} 
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                >
                  <option value="all">Tous les types</option>
                  {jobTypes.map(j => <option key={j} value={j}>{j}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                <select
                  value={filters.location}
                  onChange={(e) => handleFilterChange('location', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                >
                  <option value="all">Tous les lieux</option>
                  {locations.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Trier par</label>
                <select 
                  value={filters.sortBy} 
                  onChange={(e) => handleFilterChange('sortBy', e.target.value)} 
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                >
                  <option value="newest">Plus récents</option>
                  <option value="salary">Salaire</option>
                  <option value="rating">Évaluation</option>
                </select>
              </div>
            </div>
          </div>

          {/* Results Count */}
          <div className="mb-6">
            <p className="text-gray-700 font-medium">
              Affichage de <span className="font-bold text-gray-900">{filteredInternships.length}</span> stages
            </p>
          </div>

          {/* Internships List */}
          <div className="space-y-6">
            {filteredInternships.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-3xl shadow-sm">
                <p className="text-gray-500 text-lg">Aucun stage trouvé.</p>
              </div>
            ) : (
              filteredInternships.map((item, idx) => (
                <div key={item.id || item.link || idx} className="bg-white rounded-3xl p-8 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex flex-col lg:flex-row gap-8">
                    {/* Left Column - Main Content */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-2xl font-bold text-gray-900 mb-3">Intern</h3>
                          <div className="flex items-center gap-3 mb-2">
                            <span className="text-[#d97706] font-bold text-lg">{item.company}</span>
                            {item.rating && (
                              <div className="flex items-center gap-1">
                                <span className="text-[#d97706]">★</span>
                                <span className="font-bold text-gray-900">{item.rating}</span>
                                <span className="text-gray-500 text-sm">
                                  ({item.reviews || item.review_count || (item.rating ? Math.max(10, Math.round(item.rating * 10)) : 12)} avis)
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                        {new Date() - new Date(item.postingDateParsed) < 7 * 24 * 60 * 60 * 1000 && (
                          <span className="bg-[#fff3e0] text-[#d97706] px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap">
                            Just posted
                          </span>
                        )}
                      </div>

                      {/* Job Details */}
                      <div className="flex flex-wrap gap-6 mb-6 text-gray-600">
                        {item.location && (
                          <div className="flex items-center gap-2">
                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span>{item.location}</span>
                          </div>
                        )}
                        {item.salary && (
                          <div className="flex items-center gap-2">
                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>{item.salary}</span>
                          </div>
                        )}
                        {item.jobType && (
                          <div className="flex items-center gap-2">
                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            <span>{Array.isArray(item.jobType) ? item.jobType.join(', ') : item.jobType}</span>
                          </div>
                        )}
                      </div>

                      {/* Description */}
                      <div className="mb-4">
                        <h4 className="font-bold text-gray-900 mb-3 text-lg">Description</h4>
                        <p className="text-gray-700 leading-relaxed">
                          {expandedDescriptions[item.id] 
                            ? item.description 
                            : `${(item.description || '').slice(0, 300)}${item.description?.length > 300 ? '...' : ''}`
                          }
                        </p>
                        {item.description?.length > 300 && (
                          <button 
                            onClick={() => toggleDescription(item.id)} 
                            className="text-[#d97706] hover:text-[#b45309] font-medium mt-2 transition-colors"
                          >
                            {expandedDescriptions[item.id] ? 'Lire moins' : 'Lire la suite'}
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Right Column - Info Panel */}
                    <div className="lg:w-80 shrink-0">
                      <div className="bg-[#fafafa] rounded-2xl p-6 border border-gray-100">
                        <h4 className="font-bold text-gray-900 mb-4 text-lg">Informations</h4>
                        <div className="space-y-3 mb-6">
                          <div>
                            <p className="text-sm text-gray-500 mb-1">Posté le:</p>
                            <p className="font-medium text-gray-900">{formatDate(item.postingDateParsed)}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500 mb-1">Source:</p>
                            <p className="font-medium text-gray-900">Indeed.com</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500 mb-1">Recherche:</p>
                            <p className="font-medium text-gray-900">internship student</p>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <a 
                            href={item.link} 
                            target="_blank" 
                            rel="noreferrer" 
                            className="block w-full bg-[#d97706] hover:bg-[#b45309] text-white text-center font-semibold py-3 rounded-xl transition-colors"
                          >
                            Voir sur Indeed
                          </a>
                          <button className="block w-full bg-[#2d2d2d] hover:bg-[#1a1a1a] text-white text-center font-semibold py-3 rounded-xl transition-colors">
                            Postuler directement
                          </button>
                          <button className="block w-full border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 text-gray-700 text-center font-semibold py-3 rounded-xl transition-colors">
                            Enregistrer pour plus tard
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default Internships;