import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar2 from './Navbar2';
import axios from 'axios';

const Courses = () => {
  const [filters, setFilters] = useState({
    provider: 'all',
    sortBy: 'newest',
    searchQuery: '',
  });

  const [courses, setCourses] = useState([]);
  const [counts, setCounts] = useState({ coursera: 0, udemy: 0, total: 0 });

  // Fetch courses from backend
  useEffect(() => {
    let mounted = true;
    const fetchCourses = async () => {
      try {
        const [cRes, uRes] = await Promise.all([
          axios.get('http://localhost:8000/courses/coursera?limit=10000'),
          axios.get('http://localhost:8000/courses/udemy?limit=10000')
        ]);
        const cData = Array.isArray(cRes.data) ? cRes.data : [];
        const uData = Array.isArray(uRes.data) ? uRes.data : [];
        if (mounted) {
          const allCourses = [...cData, ...uData];
          setCourses(allCourses);
          // Calculate counts
          setCounts({
            coursera: cData.length,
            udemy: uData.length,
            total: allCourses.length
          });
        }
      } catch (err) {
        console.error('Failed to fetch courses from backend', err);
        if (mounted) setCourses([]);
      }
    };
    fetchCourses();
    return () => { mounted = false };
  }, []);

  // Compute filtered courses
  const filteredCourses = useMemo(() => {
    let results = [...courses];

    // Search filter
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      results = results.filter(item =>
        (item.title && item.title.toLowerCase().includes(query)) ||
        (item.provider && item.provider.toLowerCase().includes(query))
      );
    }

    // Provider filter
    if (filters.provider !== 'all') {
      results = results.filter(item => (item.provider || 'Unknown') === filters.provider);
    }

    // Sort
    if (filters.sortBy === 'newest') {
      results.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
    }

    return results;
  }, [filters, courses]);

  // Get unique providers for dropdown
  const providers = useMemo(() => {
    return ['all', ...new Set(courses.map(c => c.provider || 'Unknown'))];
  }, [courses]);

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

  return (
    <>
      <Navbar2 />
      <section className="w-full min-h-screen bg-[#fdf2e9] py-16 px-4 md:px-10">
        
        {/* Back Button */}
        <div className="max-w-6xl mx-auto mb-10">
          <Link to="/" className="inline-flex items-center text-[#bf5b00] hover:opacity-80 transition-opacity">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </Link>
        </div>

        {/* Title and Stats */}
        <div className="max-w-6xl mx-auto mb-8">
          <h1 className="text-[#bf5b00] text-4xl md:text-5xl font-serif italic text-center mb-6">
            Courses
          </h1>
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <div className="bg-white rounded-full px-4 py-2 shadow-sm">
              <span className="text-gray-600">Total Courses: </span>
              <span className="font-bold text-[#bf5b00]">{counts.total}</span>
            </div>
            <div className="bg-white rounded-full px-4 py-2 shadow-sm">
              <span className="text-gray-600">Coursera: </span>
              <span className="font-bold text-blue-600">{counts.coursera}</span>
            </div>
            <div className="bg-white rounded-full px-4 py-2 shadow-sm">
              <span className="text-gray-600">Udemy: </span>
              <span className="font-bold text-green-600">{counts.udemy}</span>
            </div>
          </div>
        </div>

        {/* Filters */}
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

            {/* Search */}
            <div className="mb-6">
              <input
                type="text"
                placeholder="Rechercher par titre ou partenaire..."
                value={filters.searchQuery}
                onChange={(e) => handleFilterChange('searchQuery', e.target.value)}
                className="w-full px-4 py-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#bf5b00] focus:border-transparent"
              />
            </div>

            {/* Filter Dropdowns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Partenaire</label>
                <select
                  value={filters.provider}
                  onChange={(e) => handleFilterChange('provider', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#bf5b00]"
                >
                  {providers.map(p => (
                    <option key={p} value={p}>
                      {p === 'all' ? 'Tous les partenaires' : p}
                    </option>
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

        {/* Results */}
        <div className="max-w-6xl mx-auto">
          {filteredCourses.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-xl font-bold text-gray-600 mb-2">Aucun cours trouvé</h3>
              <button 
                onClick={clearFilters} 
                className="px-6 py-2 bg-[#bf5b00] text-white rounded-full hover:bg-[#a04e00] transition-colors"
              >
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
                  <div 
                    key={item.id || item.link || index} 
                    className="bg-white rounded-[30px] p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col h-full"
                  >
                    {/* Provider Badge */}
                    <div className="mb-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        item.provider === 'Coursera' 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-purple-100 text-purple-800'
                      }`}>
                        {item.provider || 'Unknown'}
                      </span>
                    </div>
                    
                    {/* Title */}
                    <h3 className="text-xl font-bold text-black mb-3 grow line-clamp-3">
                      {item.title}
                    </h3>
                    
                    {/* Course Details */}
                    <div className="space-y-2 text-sm mb-4">
                      <p>
                        <span className="font-bold text-[#bf5b00]">Hôte: </span>
                        {item.provider || 'Unknown'}
                      </p>
                      <p>
                        <span className="font-bold text-[#bf5b00]">Prix: </span>
                        Gratuit
                      </p>
                    </div>
                    
                    {/* View Course Button */}
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