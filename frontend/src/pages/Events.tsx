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
    // Base Dark Slate Background
    <div className="min-h-screen bg-[#020617] font-sans pt-24 pb-32">
      
      {/* ================= TOP HERO SECTION ================= */}
      <div className="bg-gradient-to-b from-[#0F172A] to-[#020617] border-b border-[#1E293B] py-16 px-4 sm:px-6 lg:px-12 mb-12 relative overflow-hidden">
        {/* Ambient Neon Glows */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#6C5CE7]/15 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#00B4D8]/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-[1400px] mx-auto relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#6C5CE7]/10 border border-[#6C5CE7]/30 text-[#6C5CE7] text-xs font-[800] uppercase tracking-widest mb-4 shadow-[0_0_15px_rgba(108,92,231,0.2)]">
              <Music className="w-3.5 h-3.5" /> Concert Directory
            </div>
            <h1 className="text-4xl sm:text-5xl font-[900] text-[#F8FAFC] tracking-tight mb-4 drop-shadow-md">
              Explore Live Events {cityQuery && <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6C5CE7] to-[#00B4D8] drop-shadow-[0_0_10px_rgba(108,92,231,0.3)]">in {cityQuery}</span>}
            </h1>
            <p className="text-[#94A3B8] font-[500] text-base max-w-xl leading-relaxed">
              Browse upcoming arena shows, stadium concerts, and music festivals. Secure your passes early.
            </p>
          </div>

          {/* Dark Glass Search Box */}
          <div className="w-full md:w-[400px] bg-[#0F172A]/80 backdrop-blur-xl border border-[#1E293B] rounded-2xl p-2 shadow-[0_10px_30px_rgba(0,0,0,0.5)] focus-within:border-[#6C5CE7]/50 focus-within:ring-2 focus-within:ring-[#6C5CE7]/20 transition-all">
            <div className="flex items-center gap-3 px-4 py-3 w-full">
              <Search className="w-5 h-5 text-[#64748B] shrink-0" />
              <input 
                type="text" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search events or venues..." 
                className="w-full bg-transparent text-[#F8FAFC] placeholder-[#64748B] font-[500] text-sm outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12">
        
        {/* ================= CATEGORY FILTER PILLS ================= */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10">
          <div className="flex items-center gap-2 bg-[#0F172A] border border-[#1E293B] p-1.5 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.2)] overflow-x-auto hide-scrollbar max-w-full">
            <Filter className="w-4 h-4 text-[#64748B] ml-3 shrink-0 hidden sm:block" />
            {uniqueCategories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-6 py-2.5 rounded-xl text-xs font-[800] tracking-wider transition-all shrink-0 ${
                  selectedCategory === cat 
                    ? 'bg-[#6C5CE7] text-[#FFFFFF] shadow-[0_0_15px_rgba(108,92,231,0.4)]' 
                    : 'text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#1E293B]/50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <p className="text-sm font-[600] text-[#94A3B8] px-2 shrink-0 bg-[#0F172A] border border-[#1E293B] py-2 px-4 rounded-xl">
            Showing <span className="text-[#F8FAFC] font-[800]">{filteredEvents.length}</span> events
          </p>
        </div>

        {/* ================= EVENT CARDS GRID ================= */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-4 bg-[#0F172A] border border-[#1E293B] rounded-[2.5rem] shadow-lg">
            <Loader2 className="w-10 h-10 text-[#6C5CE7] animate-spin drop-shadow-[0_0_10px_rgba(108,92,231,0.5)]" />
            <p className="text-[#94A3B8] font-[600] text-sm">Syncing live event schedules...</p>
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
          <div className="text-center py-24 bg-[#0F172A] border border-[#1E293B] rounded-[2.5rem] shadow-lg">
            <div className="w-16 h-16 bg-[#1E293B] rounded-full flex items-center justify-center mx-auto mb-5">
              <CalendarDays className="w-8 h-8 text-[#334155]" />
            </div>
            <h3 className="text-2xl font-[900] text-[#F8FAFC] tracking-tight mb-2">No events found</h3>
            <p className="text-sm text-[#94A3B8] font-[500]">Try adjusting your search keywords or category filters.</p>
          </div>
        )}

      </div>
    </div>
  );
};

export default Events;