import React, { useState, useEffect } from 'react';
import { motion, useReducedMotion, AnimatePresence } from 'framer-motion';
import { Search, Sparkles, MapPin, Loader2, AlertCircle, Calendar } from 'lucide-react';

export interface TrendingEvent {
  id: string;
  title: string;
  date: string;
  location: string;
  image: string;
}

interface HeroShowcaseProps {
  onSearch: (query: string) => void;
  fetchTrendingEvents: () => Promise<TrendingEvent[]>;
}

const getFadeUpVariants = (shouldReduceMotion: boolean | null) => ({
  hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 30 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.8, ease: "easeOut" } 
  }
});

const HeroShowcase: React.FC<HeroShowcaseProps> = ({ onSearch, fetchTrendingEvents }) => {
  const shouldReduceMotion = useReducedMotion();
  const fadeUp = getFadeUpVariants(shouldReduceMotion);

  const [searchQuery, setSearchQuery] = useState("");
  const [events, setEvents] = useState<TrendingEvent[]>([]);
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'empty'>('loading');

  useEffect(() => {
    let isMounted = true;
    const loadEvents = async () => {
      try {
        setStatus('loading');
        const data = await fetchTrendingEvents();
        if (!isMounted) return;
        
        if (data.length === 0) {
          setStatus('empty');
        } else {
          setEvents(data);
          setStatus('success');
        }
      } catch (error) {
        if (isMounted) setStatus('error');
      }
    };
    loadEvents();
    return () => { isMounted = false; };
  }, [fetchTrendingEvents]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) onSearch(searchQuery);
  };

  return (
    <section 
      className="relative w-full min-h-[90vh] flex items-center justify-center pt-24 pb-20 px-4 sm:px-6 lg:px-12 overflow-hidden bg-[#F8F9FC]"
      aria-label="Find upcoming live events"
    >
      {/* --- Ambient Gradient Mesh --- */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50rem] h-[50rem] bg-[#6C5CE7]/15 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40rem] h-[40rem] bg-[#00B4D8]/15 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-[1400px] w-full mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* --- Left Column: Hero Copy & Search --- */}
        <motion.div 
          className="lg:col-span-7 flex flex-col items-start"
          initial="hidden"
          animate="visible"
          variants={fadeUp}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FFFFFF] border border-gray-200 text-[#00B4D8] text-xs font-[800] uppercase tracking-widest mb-6 shadow-sm">
            <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Premium Live Music Platform</span>
          </div>
          
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-[800] text-[#172033] tracking-tight leading-[1.1] mb-6">
            Secure Tickets To <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6C5CE7] to-[#00B4D8]">
              Unforgettable Shows
            </span>
          </h1>
          
          <p className="text-[#667085] font-[500] text-lg sm:text-xl max-w-2xl mb-10 leading-relaxed">
            Discover headline tours, exclusive artist performances, and epic festival lineups near you.
          </p>

          <form 
            onSubmit={handleSearchSubmit}
            className="w-full max-w-2xl flex flex-col sm:flex-row items-center gap-3 bg-[#FFFFFF] border border-gray-200 rounded-2xl p-2 shadow-[0_20px_60px_-15px_rgba(23,32,51,0.08)] transition-all focus-within:ring-4 focus-within:ring-[#6C5CE7]/10 focus-within:border-[#6C5CE7]"
          >
            <div className="flex items-center gap-3 px-4 py-3 w-full">
              <Search className="w-5 h-5 text-[#667085] shrink-0" aria-hidden="true" />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search artists, venues, or cities..." 
                aria-label="Search events"
                className="w-full bg-transparent text-[#172033] placeholder-[#667085] font-[500] text-base outline-none"
              />
            </div>
            <button 
              type="submit"
              aria-label="Submit search"
              className="w-full sm:w-auto px-8 py-4 bg-[#6C5CE7] hover:bg-[#4834D4] text-[#FFFFFF] font-[800] rounded-xl shadow-[0_8px_20px_rgba(108,92,231,0.25)] transition-all active:scale-95 focus:outline-none"
            >
              Search
            </button>
          </form>
        </motion.div>

        {/* --- Right Column: Dynamic Bento Widget --- */}
        <motion.div 
          className="lg:col-span-5 relative"
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          transition={{ delay: shouldReduceMotion ? 0 : 0.2 }}
        >
          <div className="bg-[#FFFFFF] border border-gray-100 rounded-[2.5rem] p-6 shadow-[0_20px_60px_-15px_rgba(23,32,51,0.08)]">
            <div className="flex items-center justify-between mb-6 px-2">
              <h2 className="text-lg font-[800] text-[#172033] flex items-center gap-2">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#12B76A] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-[#12B76A]"></span>
                </span>
                Trending Now
              </h2>
            </div>

            <div className="min-h-[300px] flex flex-col gap-4">
              <AnimatePresence mode="wait">
                
                {/* Loading State */}
                {status === 'loading' && (
                  <motion.div 
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center flex-1 h-full py-12"
                  >
                    <Loader2 className="w-8 h-8 text-[#6C5CE7] animate-spin mb-4" aria-label="Loading trending events" />
                    <p className="text-sm font-[600] text-[#667085]">Curating top events...</p>
                  </motion.div>
                )}

                {/* Error State */}
                {status === 'error' && (
                  <motion.div 
                    key="error"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center flex-1 h-full py-12 text-center px-4"
                  >
                    <AlertCircle className="w-10 h-10 text-[#F04438] mb-3" aria-hidden="true" />
                    <p className="text-sm font-[800] text-[#172033] mb-1">Failed to load trends</p>
                    <p className="text-xs font-[500] text-[#667085]">Please check your connection and try again.</p>
                  </motion.div>
                )}

                {/* Empty State */}
                {status === 'empty' && (
                  <motion.div 
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center flex-1 h-full py-12 text-center px-4"
                  >
                    <Calendar className="w-10 h-10 text-gray-300 mb-3" aria-hidden="true" />
                    <p className="text-sm font-[800] text-[#172033] mb-1">No trending events</p>
                    <p className="text-xs font-[500] text-[#667085]">Check back later for new live shows.</p>
                  </motion.div>
                )}

                {/* Success Data State */}
                {status === 'success' && (
                  <motion.div 
                    key="success"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col gap-4"
                  >
                    {events.slice(0, 3).map((event) => (
                      <a 
                        key={event.id}
                        href={`/event/${event.id}`}
                        className="group flex items-center gap-4 bg-[#F8F9FC] p-3 rounded-2xl border border-gray-100 hover:border-[#00B4D8]/50 hover:bg-[#FFFFFF] transition-all shadow-sm hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] focus:outline-none"
                        aria-label={`View details for ${event.title}`}
                      >
                        <div className="w-20 h-20 shrink-0 rounded-xl overflow-hidden bg-[#FFFFFF]">
                          <img 
                            src={event.image} 
                            alt="" 
                            loading="lazy"
                            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500 ease-out"
                            aria-hidden="true"
                          />
                        </div>
                        <div className="flex flex-col overflow-hidden">
                          <h3 className="font-[800] text-sm text-[#172033] truncate group-hover:text-[#6C5CE7] transition-colors">
                            {event.title}
                          </h3>
                          <div className="flex items-center gap-1.5 mt-2 text-xs font-[600] text-[#667085]">
                            <MapPin className="w-3.5 h-3.5 text-[#00B4D8]" />
                            <span className="truncate">{event.location}</span>
                          </div>
                        </div>
                      </a>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default HeroShowcase;