import React from 'react';
import { motion } from 'framer-motion';
import { Flame, Ticket, ArrowRight, Clock, MapPin, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const FEATURED_EVENT = {
  id: 'feat-1',
  title: 'Rockstar Anirudh: The Final Tour',
  subtitle: 'The biggest stadium production of the year.',
  date: 'Oct 15, 2026',
  location: 'Jawaharlal Nehru Stadium, Chennai',
  image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1200&q=80',
};

const FAST_SELLING_EVENTS = [
  {
    id: 'fs-1',
    title: 'A.R. Rahman Live in Concert',
    location: 'YMCA Grounds',
    soldPercentage: 85,
    image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'fs-2',
    title: 'Sid Sriram: Acoustic Sunset',
    location: 'Sir Mutha Hall',
    soldPercentage: 92,
    image: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'fs-3',
    title: 'Sunburn Arena ft. Alan Walker',
    location: 'Phoenix MarketCity',
    soldPercentage: 78,
    image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=400&q=80',
  },
];

const LiveRadar = () => {
  const navigate = useNavigate();

  return (
    // Deep Slate Background
    <section className="w-full bg-[#020617] py-20 relative overflow-hidden font-sans">
      
      {/* Ambient Glow Effects */}
      <div className="absolute top-[-20%] left-[-10%] w-[40rem] h-[40rem] bg-[#6C5CE7]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[30rem] h-[30rem] bg-[#F43F5E]/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
        
        {/* ================= SECTION HEADER ================= */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#F43F5E]/10 border border-[#F43F5E]/20 text-[#F43F5E] text-xs font-[800] uppercase tracking-widest mb-4 shadow-[0_0_10px_rgba(244,63,94,0.2)]">
              <Flame className="w-4 h-4 animate-pulse" /> Live Radar
            </div>
            <h2 className="text-3xl md:text-5xl font-[900] text-[#F8FAFC] tracking-tight">
              High Demand <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6C5CE7] to-[#00B4D8] drop-shadow-[0_0_10px_rgba(108,92,231,0.3)]">Experiences</span>
            </h2>
          </div>
          <button 
            onClick={() => navigate('/events')}
            className="hidden md:inline-flex items-center gap-2 text-sm font-[800] text-[#00B4D8] hover:text-[#F8FAFC] transition-colors uppercase tracking-wider group"
          >
            Explore All Events <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* ================= SPLIT LAYOUT CONTAINER ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          
          {/* ================= LEFT SIDE: FEATURED MEGA CARD ================= */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            onClick={() => navigate(`/event/${FEATURED_EVENT.id}`)}
            className="lg:col-span-7 group relative bg-[#0F172A] rounded-[2rem] border border-[#1E293B] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] hover:shadow-[0_0_30px_rgba(108,92,231,0.3)] hover:border-[#6C5CE7]/50 transition-all duration-500 cursor-pointer min-h-[400px] sm:min-h-[480px] flex flex-col justify-end"
          >
            {/* Background Image */}
            <img 
              src={FEATURED_EVENT.image} 
              alt={FEATURED_EVENT.title}
              className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out opacity-80"
            />
            {/* Dark Gradient Overlay matching Background */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-[#020617]/60 to-transparent opacity-95" />

            {/* Top Badges */}
            <div className="absolute top-6 left-6 flex items-center gap-2">
              <span className="bg-[#6C5CE7] text-[#FFFFFF] px-4 py-1.5 rounded-full text-xs font-[800] uppercase tracking-wider shadow-[0_0_15px_rgba(108,92,231,0.5)] border border-[#6C5CE7]/50">
                Featured
              </span>
            </div>

            {/* Content */}
            <div className="relative z-10 p-8 sm:p-10 w-full">
              <h3 className="text-3xl sm:text-4xl lg:text-5xl font-[900] text-[#F8FAFC] tracking-tight mb-3 group-hover:text-[#6C5CE7] transition-colors leading-tight">
                {FEATURED_EVENT.title}
              </h3>
              <p className="text-[#94A3B8] font-[500] text-sm sm:text-base mb-6 max-w-lg">
                {FEATURED_EVENT.subtitle}
              </p>

              <div className="flex flex-col sm:flex-row sm:items-center gap-4 border-t border-[#1E293B] pt-6">
                <div className="flex items-center gap-2 text-sm font-[600] text-[#F8FAFC]">
                  <Clock className="w-4 h-4 text-[#00B4D8]" /> {FEATURED_EVENT.date}
                </div>
                <div className="hidden sm:block w-1.5 h-1.5 rounded-full bg-[#334155]"></div>
                <div className="flex items-center gap-2 text-sm font-[600] text-[#F8FAFC]">
                  <MapPin className="w-4 h-4 text-[#00B4D8]" /> {FEATURED_EVENT.location}
                </div>
              </div>
            </div>
          </motion.div>

          {/* ================= RIGHT SIDE: SELLING FAST LIST ================= */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-5 flex flex-col gap-4"
          >
            {/* Header Badge */}
            <div className="bg-[#0F172A]/80 backdrop-blur-md border border-[#1E293B] rounded-[1.5rem] p-5 flex items-center gap-3 shadow-md mb-2">
              <div className="p-2 bg-[#F43F5E]/10 rounded-lg">
                <TrendingUp className="w-5 h-5 text-[#F43F5E]" />
              </div>
              <span className="text-sm font-[800] text-[#F8FAFC] uppercase tracking-wider">Selling Fast Near You</span>
            </div>

            {/* List Items */}
            {FAST_SELLING_EVENTS.map((event, index) => (
              <div 
                key={event.id}
                onClick={() => navigate(`/event/${event.id}`)}
                className="group bg-[#0F172A]/60 backdrop-blur-sm rounded-[1.5rem] border border-[#1E293B] p-4 flex items-center gap-5 cursor-pointer hover:border-[#6C5CE7]/40 hover:bg-[#1E293B]/40 hover:shadow-[0_8px_30px_rgba(108,92,231,0.15)] transition-all duration-300"
              >
                {/* Thumbnail */}
                <div className="w-20 h-20 sm:w-24 sm:h-24 shrink-0 rounded-xl overflow-hidden bg-[#020617]">
                  <img 
                    src={event.image} 
                    alt={event.title}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                  />
                </div>

                {/* Details & Scarcity Bar */}
                <div className="flex-1 min-w-0">
                  <h4 className="text-base font-[800] text-[#F8FAFC] truncate group-hover:text-[#6C5CE7] transition-colors mb-1">
                    {event.title}
                  </h4>
                  <p className="text-xs font-[600] text-[#94A3B8] flex items-center gap-1.5 mb-4">
                    <MapPin className="w-3.5 h-3.5 text-[#00B4D8]" /> {event.location}
                  </p>

                  {/* Progress Bar (Neon Pink for Urgency) */}
                  <div className="w-full">
                    <div className="flex justify-between items-center text-[10px] font-[800] uppercase tracking-wider mb-1.5">
                      <span className="text-[#F43F5E] flex items-center gap-1 drop-shadow-[0_0_5px_rgba(244,63,94,0.5)]">
                        <Ticket className="w-3 h-3" /> {event.soldPercentage}% Sold
                      </span>
                      <span className="text-[#64748B]">Few left</span>
                    </div>
                    <div className="w-full h-1.5 bg-[#1E293B] rounded-full overflow-hidden shadow-inner">
                      <motion.div 
                        initial={{ width: 0 }}
                        whileInView={{ width: `${event.soldPercentage}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="h-full bg-gradient-to-r from-[#F43F5E] to-[#FF79C6] rounded-full shadow-[0_0_10px_rgba(244,63,94,0.6)]"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default LiveRadar;