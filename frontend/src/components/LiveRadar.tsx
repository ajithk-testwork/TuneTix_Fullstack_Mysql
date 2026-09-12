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
    <section className="w-full bg-[#F8F9FC] py-16 relative overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#F04438]/10 text-[#F04438] text-xs font-[800] uppercase tracking-widest mb-3">
              <Flame className="w-4 h-4" /> Live Radar
            </div>
            <h2 className="text-3xl md:text-4xl font-[800] text-[#172033] tracking-tight">
              High Demand <span className="text-[#6C5CE7]">Experiences</span>
            </h2>
          </div>
          <button 
            onClick={() => navigate('/events')}
            className="hidden md:inline-flex items-center gap-2 text-sm font-[800] text-[#00B4D8] hover:text-[#6C5CE7] transition-colors uppercase tracking-wider"
          >
            Explore All Events <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Split Layout Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          
          {/* ================= LEFT SIDE: FEATURED MEGA CARD ================= */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            onClick={() => navigate(`/event/${FEATURED_EVENT.id}`)}
            className="lg:col-span-7 group relative bg-[#FFFFFF] rounded-[2rem] overflow-hidden shadow-sm hover:shadow-[0_20px_60px_-15px_rgba(108,92,231,0.15)] transition-all duration-500 cursor-pointer min-h-[400px] sm:min-h-[450px] flex flex-col justify-end"
          >
            {/* Background Image */}
            <img 
              src={FEATURED_EVENT.image} 
              alt={FEATURED_EVENT.title}
              className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#172033] via-[#172033]/40 to-transparent opacity-90" />

            {/* Top Badges */}
            <div className="absolute top-6 left-6 flex items-center gap-2">
              <span className="bg-[#6C5CE7] text-[#FFFFFF] px-3.5 py-1.5 rounded-full text-xs font-[800] uppercase tracking-wider shadow-md">
                Featured
              </span>
            </div>

            {/* Content */}
            <div className="relative z-10 p-8 sm:p-10 w-full">
              <h3 className="text-3xl sm:text-4xl font-[800] text-[#FFFFFF] tracking-tight mb-2 group-hover:text-[#00B4D8] transition-colors leading-tight">
                {FEATURED_EVENT.title}
              </h3>
              <p className="text-[#FFFFFF]/80 font-[500] text-sm sm:text-base mb-6 max-w-lg">
                {FEATURED_EVENT.subtitle}
              </p>

              <div className="flex flex-col sm:flex-row sm:items-center gap-4 border-t border-[#FFFFFF]/20 pt-6">
                <div className="flex items-center gap-2 text-sm font-[600] text-[#FFFFFF]">
                  <Clock className="w-4 h-4 text-[#00B4D8]" /> {FEATURED_EVENT.date}
                </div>
                <div className="hidden sm:block w-1.5 h-1.5 rounded-full bg-[#FFFFFF]/30"></div>
                <div className="flex items-center gap-2 text-sm font-[600] text-[#FFFFFF]">
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
            <div className="bg-[#FFFFFF] border border-gray-200 rounded-2xl p-4 flex items-center gap-3 shadow-sm mb-2">
              <TrendingUp className="w-5 h-5 text-[#6C5CE7]" />
              <span className="text-sm font-[800] text-[#172033] uppercase tracking-wider">Selling Fast Near You</span>
            </div>

            {FAST_SELLING_EVENTS.map((event, index) => (
              <div 
                key={event.id}
                onClick={() => navigate(`/event/${event.id}`)}
                className="group bg-[#FFFFFF] rounded-[1.5rem] border border-gray-100 p-4 flex items-center gap-5 cursor-pointer hover:border-[#00B4D8]/30 hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-all duration-300"
              >
                {/* Thumbnail */}
                <div className="w-20 h-20 sm:w-24 sm:h-24 shrink-0 rounded-xl overflow-hidden bg-[#F8F9FC]">
                  <img 
                    src={event.image} 
                    alt={event.title}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                  />
                </div>

                {/* Details & Scarcity Bar */}
                <div className="flex-1 min-w-0">
                  <h4 className="text-base font-[800] text-[#172033] truncate group-hover:text-[#6C5CE7] transition-colors mb-1">
                    {event.title}
                  </h4>
                  <p className="text-xs font-[600] text-[#667085] flex items-center gap-1.5 mb-4">
                    <MapPin className="w-3.5 h-3.5" /> {event.location}
                  </p>

                  {/* Progress Bar */}
                  <div className="w-full">
                    <div className="flex justify-between items-center text-[10px] font-[800] uppercase tracking-wider mb-1.5">
                      <span className="text-[#F04438] flex items-center gap-1">
                        <Ticket className="w-3 h-3" /> {event.soldPercentage}% Sold
                      </span>
                      <span className="text-[#667085]">Few left</span>
                    </div>
                    <div className="w-full h-1.5 bg-[#F8F9FC] rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        whileInView={{ width: `${event.soldPercentage}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="h-full bg-gradient-to-r from-[#6C5CE7] to-[#00B4D8] rounded-full"
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