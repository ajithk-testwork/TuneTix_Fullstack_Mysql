import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Music, ArrowRight, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SPOTLIGHT_ARTISTS = [
  {
    id: 'art-1',
    name: 'Anirudh Ravichander',
    genre: 'Indian Pop / Electronic',
    followers: '15M+',
    image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'art-2',
    name: 'A.R. Rahman',
    genre: 'Classical Fusion',
    followers: '22M+',
    image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'art-3',
    name: 'Sid Sriram',
    genre: 'Carnatic Pop',
    followers: '8M+',
    image: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'art-4',
    name: 'Jonita Gandhi',
    genre: 'Pop / Playback',
    followers: '5M+',
    image: 'https://images.unsplash.com/photo-1502773860571-211a597d6e4b?auto=format&fit=crop&w=1200&q=80',
  },
];

const ArtistSpotlight = () => {
  const navigate = useNavigate();
  // Default the first artist to be expanded
  const [activeId, setActiveId] = useState<string>(SPOTLIGHT_ARTISTS[0].id);

  return (
    <section className="w-full bg-[#FFFFFF] py-20 border-t border-gray-100 relative overflow-hidden">
      
      {/* Subtle Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[300px] bg-[#6C5CE7]/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#F8F9FC] text-[#6C5CE7] text-xs font-[800] uppercase tracking-widest mb-4 border border-gray-100 shadow-sm">
            <Sparkles className="w-4 h-4" /> Artist Spotlight
          </div>
          <h2 className="text-3xl md:text-5xl font-[800] text-[#172033] tracking-tight mb-4">
            Trending <span className="text-[#00B4D8]">Performers</span>
          </h2>
          <p className="text-[#667085] font-[500] text-base max-w-2xl">
            Track your favorite artists and get notified the moment they announce a new live show or stadium tour.
          </p>
        </div>

        {/* Expanding Flex Gallery */}
        <div className="flex flex-col lg:flex-row gap-4 h-[600px] lg:h-[450px] w-full">
          {SPOTLIGHT_ARTISTS.map((artist) => {
            const isActive = activeId === artist.id;

            return (
              <motion.div
                key={artist.id}
                layout
                onMouseEnter={() => setActiveId(artist.id)}
                onClick={() => navigate('/artists')}
                className={`relative rounded-[2rem] overflow-hidden cursor-pointer shadow-sm transition-all duration-500 ease-out group flex-shrink-0 ${
                  isActive ? 'flex-[4] lg:flex-[3]' : 'flex-[1] lg:flex-[1]'
                }`}
              >
                {/* Background Image */}
                <img
                  src={artist.image}
                  alt={artist.name}
                  className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                
                {/* Gradient Overlays */}
                <div className="absolute inset-0 bg-[#172033]/20 transition-opacity duration-500" />
                <div 
                  className={`absolute inset-0 bg-gradient-to-t from-[#172033] via-[#172033]/40 to-transparent transition-opacity duration-500 ${
                    isActive ? 'opacity-90' : 'opacity-60'
                  }`} 
                />

                {/* Content Container */}
                <div className="absolute inset-0 p-6 flex flex-col justify-end">
                  {/* Vertical Text (Visible when collapsed on Desktop) */}
                  {!isActive && (
                    <div className="hidden lg:flex h-full items-end justify-center pb-4">
                      <h3 className="text-[#FFFFFF] font-[800] text-xl tracking-widest transform -rotate-90 whitespace-nowrap origin-bottom pb-10 opacity-70 group-hover:opacity-100 transition-opacity">
                        {artist.name}
                      </h3>
                    </div>
                  )}

                  {/* Expanded Content */}
                  <motion.div 
                    initial={false}
                    animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : 20 }}
                    transition={{ duration: 0.3, delay: isActive ? 0.2 : 0 }}
                    className={`flex flex-col ${isActive ? 'block' : 'hidden lg:hidden'}`}
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <span className="bg-[#00B4D8] text-[#FFFFFF] px-3 py-1 rounded-full text-[10px] font-[800] uppercase tracking-wider flex items-center gap-1.5 shadow-sm">
                        <Music className="w-3 h-3" /> {artist.genre}
                      </span>
                      <span className="bg-[#FFFFFF]/20 backdrop-blur-md border border-[#FFFFFF]/30 text-[#FFFFFF] px-3 py-1 rounded-full text-[10px] font-[800] flex items-center gap-1">
                        <Star className="w-3 h-3 fill-[#FFFFFF]" /> {artist.followers}
                      </span>
                    </div>

                    <h3 className="text-3xl sm:text-4xl font-[800] text-[#FFFFFF] tracking-tight mb-4 leading-tight">
                      {artist.name}
                    </h3>

                    <button className="flex items-center gap-2 text-[#FFFFFF] text-sm font-[700] hover:text-[#00B4D8] transition-colors w-fit group/btn">
                      View Profile 
                      <div className="w-8 h-8 rounded-full bg-[#FFFFFF]/10 backdrop-blur-md border border-[#FFFFFF]/20 flex items-center justify-center group-hover/btn:bg-[#00B4D8] group-hover/btn:border-[#00B4D8] transition-all">
                        <ArrowRight className="w-4 h-4 transform group-hover/btn:translate-x-0.5 transition-transform" />
                      </div>
                    </button>
                  </motion.div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* View All Button */}
        <div className="mt-12 flex justify-center">
          <button 
            onClick={() => navigate('/artists')}
            className="px-8 py-3.5 bg-[#FFFFFF] border border-gray-200 hover:border-[#6C5CE7] text-[#172033] font-[800] rounded-xl shadow-sm hover:shadow-[0_8px_20px_rgba(108,92,231,0.15)] transition-all flex items-center gap-2"
          >
            Explore All Artists <ArrowRight className="w-4 h-4 text-[#6C5CE7]" />
          </button>
        </div>

      </div>
    </section>
  );
};

export default ArtistSpotlight;