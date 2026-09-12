import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface HeroSectionProps {
  itemVariants?: any;
}

const HeroSection: React.FC<HeroSectionProps> = ({ itemVariants }) => {
  const navigate = useNavigate();
  
  // State for search filters
  const [searchTerm, setSearchTerm] = useState('');
  const [locationTerm, setLocationTerm] = useState('');

  // Handle routing to the events page with query parameters
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    
    if (searchTerm.trim()) params.append('search', searchTerm);
    if (locationTerm.trim()) params.append('city', locationTerm);
    
    navigate(`/events?${params.toString()}`);
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center font-sans overflow-hidden bg-[#F8F9FC]">
      
      {/* Background Overlays */}
      <div 
        className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1470229722913-7c090be5c520?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')] 
        bg-cover bg-center bg-no-repeat opacity-[0.15]" 
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#F8F9FC]/80 via-[#F8F9FC]/95 to-[#F8F9FC] pointer-events-none" />
      
      <div className="absolute top-[-10%] left-[-10%] w-[40rem] h-[40rem] bg-[#6C5CE7]/15 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[30rem] h-[30rem] bg-[#00B4D8]/15 rounded-full blur-[100px] pointer-events-none" />

      {/* Main Content */}
      <div className="max-w-[1200px] w-full mx-auto px-6 lg:px-12 relative z-10 pt-32 lg:pt-20 flex flex-col items-center text-center">
        
        {/* Typography */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-4xl"
        >
          <h1 className="text-5xl md:text-7xl lg:text-[5.5rem] font-[800] text-[#172033] tracking-tight leading-[1.1] mb-6">
            Discover the <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6C5CE7] to-[#00B4D8]">Pulse</span><br />
            of Live Music
          </h1>
          
          <p className="text-[#667085] text-lg md:text-xl leading-relaxed max-w-2xl mx-auto font-[500] mb-12">
            Find your next unforgettable experience. Explore thousands of live events, festivals, and underground gigs in your city and beyond.
          </p>
        </motion.div>

        {/* Functional Search Bar */}
        <motion.form 
          onSubmit={handleSearch}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="w-full max-w-4xl bg-[#FFFFFF] rounded-[24px] p-2 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] flex flex-col md:flex-row gap-2 md:gap-3 items-center mb-10"
        >
          <div className="flex-1 w-full flex items-center gap-3 px-4 py-3.5 bg-[#F8F9FC] rounded-[16px] transition-colors">
            <Search className="w-5 h-5 text-[#667085]" />
            <input 
              type="text" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search artists, events..." 
              className="w-full bg-transparent text-[#172033] placeholder:text-[#667085] placeholder:font-[400] font-[500] outline-none focus:ring-0 text-sm"
            />
          </div>
          <div className="w-full md:w-auto flex-1 flex items-center gap-3 px-4 py-3.5 bg-[#F8F9FC] rounded-[16px] transition-colors">
            <MapPin className="w-5 h-5 text-[#667085]" />
            <input 
              type="text" 
              value={locationTerm}
              onChange={(e) => setLocationTerm(e.target.value)}
              placeholder="City or Venue (e.g., Chennai)" 
              className="w-full bg-transparent text-[#172033] placeholder:text-[#667085] placeholder:font-[400] font-[500] outline-none focus:ring-0 text-sm"
            />
          </div>
          <button 
            type="submit"
            className="w-full md:w-auto px-8 py-3.5 bg-[#6C5CE7] hover:bg-[#4834D4] rounded-[16px] text-[#FFFFFF] font-[600] uppercase tracking-wider transition-all"
          >
            Find Events
          </button>
        </motion.form>

        {/* Call to Actions (Styled from Image) */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          className="flex flex-col sm:flex-row items-center gap-4"
        >
          <button 
            onClick={() => navigate('/events')}
            className="px-8 py-3.5 bg-[#00B4D8] hover:bg-[#0092B0] text-[#FFFFFF] font-[700] rounded-full uppercase tracking-widest transition-all flex items-center gap-2 border-[2.5px] border-[#172033]"
          >
            Browse All Events <ChevronRight className="w-5 h-5" />
          </button>
          <button 
            onClick={() => navigate('/events?filter=upcoming')}
            className="px-8 py-3.5 bg-[#FFFFFF] border-[2.5px] border-gray-200 hover:border-[#6C5CE7] hover:text-[#6C5CE7] text-[#172033] font-[700] rounded-full uppercase tracking-widest transition-all"
          >
            View Upcoming Shows
          </button>
        </motion.div>

      </div>
    </div>
  );
};

export default HeroSection;