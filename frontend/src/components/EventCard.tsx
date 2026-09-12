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
      // Removed the hardcoded lg:col-span-4 and md:col-span-2 classes here
      className="group cursor-pointer h-full font-sans"
    >
      <div className="bg-[#FFFFFF] border border-gray-100 rounded-[2rem] p-3 hover:border-[#6C5CE7]/50 hover:shadow-[0_20px_60px_-15px_rgba(108,92,231,0.15)] transition-all duration-500 h-full flex flex-col relative overflow-hidden">
        
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-[#6C5CE7] rounded-full blur-[80px] opacity-0 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none"></div>

        <div className="relative rounded-[1.5rem] overflow-hidden aspect-[4/3] mb-5 bg-[#F8F9FC]">
          <div className="absolute top-3 right-3 z-10 bg-[#00B4D8] px-3 py-1.5 rounded-full text-[10px] font-[700] text-[#FFFFFF] uppercase tracking-widest shadow-[0_4px_10px_rgba(0,180,216,0.3)]">
            {event.category || 'Event'}
          </div>
          
          <img 
            src={event.image || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1000&auto=format&fit=crop'} 
            alt={event.title || event.name} 
            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500"></div>
        </div>
        
        <div className="px-3 pb-2 flex-1 flex flex-col justify-between z-10">
          <div>
            <h3 className="text-xl font-[800] text-[#172033] tracking-tight leading-tight group-hover:text-[#6C5CE7] transition-colors line-clamp-2 mb-4">
              {event.title || event.name}
            </h3>
            
            <div className="flex items-center gap-2 text-sm text-[#667085] font-[500] mb-4">
              <CalendarDays className="w-4 h-4 text-[#00B4D8]" />
              <span>{event.date ? new Date(event.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : 'TBA'}</span>
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-gray-100 pt-4 mt-auto">
            <div className="flex items-center gap-2 text-sm text-[#667085] font-[500] max-w-[60%]">
              <MapPin className="w-4 h-4 text-[#667085] shrink-0 group-hover:text-[#6C5CE7] transition-colors" />
              <span className="truncate">{event.location || 'Virtual / TBA'}</span>
            </div>
            <div className="text-sm font-[700] text-[#6C5CE7] bg-[#6C5CE7]/10 border border-[#6C5CE7]/30 px-3 py-1.5 rounded-lg group-hover:bg-[#6C5CE7] group-hover:text-[#FFFFFF] transition-colors duration-300">
              ₹{getStartingPrice(event)}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default EventCard;