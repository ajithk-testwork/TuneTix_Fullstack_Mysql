import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { CalendarDays, MapPin } from 'lucide-react';

interface EventCardProps {
  event: any;
  itemVariants?: any;
}

const EventCard: React.FC<EventCardProps> = ({ event, itemVariants }) => {
  const navigate = useNavigate();

  const getStartingPrice = (event: any) => {
    if (event.seatCategories && event.seatCategories.length > 0) {
      const economy = event.seatCategories.find((c: any) => c.name.toLowerCase().includes('economy'));
      if (economy) return economy.price;
      
      const prices = event.seatCategories.map((c: any) => c.price);
      return Math.min(...prices);
    }
    return event.price || event.startingPrice || 999;
  };

  return (
    <motion.div 
      layout
      variants={itemVariants}
      initial="hidden"
      animate="show"
      exit="exit"
      onClick={() => navigate(`/event/${event.id || event._id}`)}
      className="group cursor-pointer h-full font-sans"
    >
      {/* Dark Theme Card Container with Hover Glow */}
      <div className="bg-[#0F172A] border border-[#1E293B] rounded-[2rem] p-3 hover:border-[#6C5CE7]/50 hover:shadow-[0_0_30px_rgba(108,92,231,0.25)] transition-all duration-500 h-full flex flex-col relative overflow-hidden">
        
        {/* Ambient Hover Glow inside the card */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-[#6C5CE7] rounded-full blur-[80px] opacity-0 group-hover:opacity-20 transition-opacity duration-500 pointer-events-none"></div>

        {/* Image Container */}
        <div className="relative rounded-[1.5rem] overflow-hidden aspect-[4/3] mb-5 bg-[#020617]">
          {/* Neon Category Badge */}
          <div className="absolute top-3 right-3 z-10 bg-[#F43F5E] px-3 py-1.5 rounded-full text-[10px] font-[800] text-[#FFFFFF] uppercase tracking-widest shadow-[0_0_15px_rgba(244,63,94,0.5)]">
            {event.category || 'Event'}
          </div>
          
          <img 
            src={event.image || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1000&auto=format&fit=crop'} 
            alt={event.title || event.name} 
            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out opacity-90 group-hover:opacity-100" 
          />
          
          {/* Dark Gradient Overlay to blend with card body */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-[#0F172A]/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-500"></div>
        </div>
        
        {/* Content Section */}
        <div className="px-3 pb-2 flex-1 flex flex-col justify-between z-10">
          <div>
            <h3 className="text-xl font-[800] text-[#F8FAFC] tracking-tight leading-tight group-hover:text-[#6C5CE7] transition-colors line-clamp-2 mb-4 drop-shadow-sm">
              {event.title || event.name}
            </h3>
            
            <div className="flex items-center gap-2 text-sm text-[#94A3B8] font-[500] mb-4">
              <CalendarDays className="w-4 h-4 text-[#00B4D8]" />
              <span>{event.date ? new Date(event.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : 'TBA'}</span>
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-[#1E293B] pt-4 mt-auto">
            <div className="flex items-center gap-2 text-sm text-[#94A3B8] font-[500] max-w-[60%]">
              <MapPin className="w-4 h-4 text-[#00B4D8] shrink-0 group-hover:text-[#F43F5E] transition-colors" />
              <span className="truncate">{event.location || 'Virtual / TBA'}</span>
            </div>
            
            {/* Price Badge with Neon Hover */}
            <div className="text-sm font-[800] text-[#6C5CE7] bg-[#6C5CE7]/10 border border-[#6C5CE7]/30 px-3 py-1.5 rounded-lg group-hover:bg-[#6C5CE7] group-hover:text-[#FFFFFF] group-hover:shadow-[0_0_15px_rgba(108,92,231,0.5)] transition-all duration-300">
              ₹{getStartingPrice(event)}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default EventCard;