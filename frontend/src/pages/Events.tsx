import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, CalendarDays, Loader2, Music, Filter } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import API from '../api/userAPI';
import EventCard from '../components/EventCard';

const FALLBACK_EVENTS = [
  {
    id: "1",
    title: "Rockstar Anirudh Live Tour 2026",
    category: "Live Concert",
    date: "2026-04-15",
    location: "Jawaharlal Nehru Stadium, Chennai",
    price: 999,
    image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1000&q=80"
  },
  {
    id: "2",
    title: "A.R. Rahman Symphony & Fusion",
    category: "Classical",
    date: "2026-04-22",
    location: "YMCA Grounds, Chennai",
    price: 1499,
    image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1000&q=80"
  },
  {
    id: "3",
    title: "Sid Sriram Acoustic Night",
    category: "Acoustic",
    date: "2026-05-05",
    location: "Sir Mutha Hall, Chennai",
    price: 799,
    image: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?auto=format&fit=crop&w=1000&q=80"
  },
  {
    id: "4",
    title: "Electronic Sunset Festival",
    category: "Festival",
    date: "2026-05-18",
    location: "Phoenix MarketCity, Chennai",
    price: 1299,
    image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1000&q=80"
  }
];

const Events = () => {
  const [searchParams] = useSearchParams();
  
  const [events, setEvents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  
  const searchQuery = searchParams.get("search") || "";
  const cityQuery = searchParams.get("city") || "";
  const [searchTerm, setSearchTerm] = useState(searchQuery);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchEvents = async () => {
      try {
        setIsLoading(true);
        const res = await API.get("/event/all").catch(() => API.get("/events"));
        const fetchedData = res.data?.data || res.data?.events || res.data || [];
        
        if (Array.isArray(fetchedData) && fetchedData.length > 0) {
          setEvents(fetchedData);
        } else {
          setEvents(FALLBACK_EVENTS);
        }
      } catch (err) {
        setEvents(FALLBACK_EVENTS);
      } finally {
        setIsLoading(false);
      }
    };
    fetchEvents();
  }, []);

  // Safely extract unique categories using optional chaining so it never crashes
  const uniqueCategories = [
    "All", 
    ...Array.from(new Set(events.map(e => e?.category).filter(Boolean)))
  ];

  const filteredEvents = events.filter(event => {
    const title = event?.title || event?.name || "";
    const location = event?.location || event?.venue || "";
    const category = event?.category || "General";
    
    const matchesSearch = title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCity = cityQuery ? location.toLowerCase().includes(cityQuery.toLowerCase()) : true;
    const matchesCategory = selectedCategory === "All" || category === selectedCategory;
    
    return matchesSearch && matchesCity && matchesCategory;
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FC] font-sans pt-32 pb-32">
      
      {/* ================= TOP HERO SECTION ================= */}
      <div className="bg-[#172033] text-white py-16 px-4 sm:px-6 lg:px-12 mb-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#6C5CE7]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#00B4D8]/20 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-[1400px] mx-auto relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-[#00B4D8] text-xs font-[700] uppercase tracking-widest mb-4">
              <Music className="w-3.5 h-3.5" /> Concert Directory
            </div>
            <h1 className="text-4xl sm:text-5xl font-[800] tracking-tight mb-3">
              Explore Live Events {cityQuery && <span className="text-[#00B4D8]">in {cityQuery}</span>}
            </h1>
            <p className="text-gray-300 font-[500] text-base max-w-xl">
              Browse upcoming arena shows, stadium concerts, and music festivals. Secure your passes early.
            </p>
          </div>

          {/* Search Box */}
          <div className="w-full md:w-96 bg-white/10 backdrop-blur-xl border border-white/15 rounded-2xl p-2 shadow-inner">
            <div className="flex items-center gap-3 px-4 py-3 w-full">
              <Search className="w-5 h-5 text-gray-400 shrink-0" />
              <input 
                type="text" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search events or venues..." 
                className="w-full bg-transparent text-white placeholder-gray-400 font-[500] text-sm outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12">
        
        {/* ================= CATEGORY FILTER PILLS ================= */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
          <div className="flex items-center gap-2 bg-[#FFFFFF] border border-gray-200 p-1.5 rounded-2xl shadow-sm overflow-x-auto hide-scrollbar max-w-full">
            <Filter className="w-4 h-4 text-[#667085] ml-3 shrink-0 hidden sm:block" />
            {uniqueCategories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-6 py-2.5 rounded-xl text-xs font-[700] transition-all shrink-0 ${
                  selectedCategory === cat 
                    ? 'bg-[#6C5CE7] text-white shadow-[0_4px_12px_rgba(108,92,231,0.25)]' 
                    : 'text-[#667085] hover:text-[#172033]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <p className="text-sm font-[600] text-[#667085] px-2 shrink-0">
            Showing <span className="text-[#172033] font-[800]">{filteredEvents.length}</span> events
          </p>
        </div>

        {/* ================= EVENT CARDS GRID ================= */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-4 bg-white border border-gray-100 rounded-[2.5rem] shadow-sm">
            <Loader2 className="w-10 h-10 text-[#6C5CE7] animate-spin" />
            <p className="text-[#667085] font-[600] text-sm">Syncing live event schedules...</p>
          </div>
        ) : filteredEvents.length > 0 ? (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {filteredEvents.map(event => (
              <EventCard key={event.id || event._id} event={event} />
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-24 bg-[#FFFFFF] border border-gray-200 rounded-[2.5rem] shadow-sm">
            <CalendarDays className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-[800] text-[#172033]">No events found</h3>
            <p className="text-sm text-[#667085] mt-1">Try adjusting your search keywords or category filters.</p>
          </div>
        )}

      </div>
    </div>
  );
};

export default Events;