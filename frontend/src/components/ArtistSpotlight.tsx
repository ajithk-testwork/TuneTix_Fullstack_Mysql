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
    // Dark Slate Background
    <section className="w-full bg-[#020617] py-20 border-t border-[#1E293B] relative overflow-hidden font-sans">
      
      {/* Ambient Neon Glows */}
      <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#6C5CE7]/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 translate-x-1/4 -translate-y-1/2 w-[500px] h-[300px] bg-[#F43F5E]/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
        
        {/* ================= SECTION HEADER ================= */}
        <div className="flex flex-col items-center text-center mb-12">
          {/* Glowing Pill Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#6C5CE7]/10 text-[#6C5CE7] text-xs font-[800] uppercase tracking-widest mb-4 border border-[#6C5CE7]/30 shadow-[0_0_15px_rgba(108,92,231,0.2)]">
            <Sparkles className="w-4 h-4 animate-pulse" /> Artist Spotlight
          </div>
          
          <h2 className="text-3xl md:text-5xl font-[900] text-[#F8FAFC] tracking-tight mb-4">
            Trending <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6C5CE7] to-[#F43F5E] drop-shadow-[0_0_10px_rgba(108,92,231,0.4)]">Performers</span>
          </h2>
          
          <p className="text-[#94A3B8] font-[500] text-base max-w-2xl">
            Track your favorite artists and get notified the moment they announce a new live show or stadium tour.
          </p>
        </div>

        {/* ================= EXPANDING FLEX GALLERY ================= */}
        <div className="flex flex-col lg:flex-row gap-4 h-[600px] lg:h-[450px] w-full">
          {SPOTLIGHT_ARTISTS.map((artist) => {
            const isActive = activeId === artist.id;

            return (
              <motion.div
                key={artist.id}
                layout
                onMouseEnter={() => setActiveId(artist.id)}
                onClick={() => navigate('/artists')}
                className={`relative rounded-[2rem] overflow-hidden cursor-pointer border border-[#1E293B] shadow-[0_15px_40px_rgba(0,0,0,0.5)] hover:border-[#6C5CE7]/50 transition-all duration-500 ease-out group flex-shrink-0 ${
                  isActive ? 'flex-[4] lg:flex-[3]' : 'flex-[1] lg:flex-[1]'
                }`}
              >
                {/* Background Image */}
                <img
                  src={artist.image}
                  alt={artist.name}
                  className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out opacity-80 group-hover:opacity-100"
                />
                
                {/* Dark Gradient Overlays */}
                <div className="absolute inset-0 bg-[#020617]/30 transition-opacity duration-500" />
                <div 
                  className={`absolute inset-0 bg-gradient-to-t from-[#020617] via-[#020617]/50 to-transparent transition-opacity duration-500 ${
                    isActive ? 'opacity-95' : 'opacity-70'
                  }`} 
                />

                {/* Content Container */}
                <div className="absolute inset-0 p-6 flex flex-col justify-end">
                  
                  {/* Vertical Text (Visible when collapsed on Desktop) */}
                  {!isActive && (
                    <div className="hidden lg:flex h-full items-end justify-center pb-4">
                      <h3 className="text-[#F8FAFC] font-[800] text-xl tracking-widest transform -rotate-90 whitespace-nowrap origin-bottom pb-10 opacity-50 group-hover:opacity-100 transition-opacity drop-shadow-md">
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
                    {/* Badges */}
                    <div className="flex items-center gap-2 mb-4">
                      <span className="bg-[#F43F5E] text-[#FFFFFF] px-3 py-1.5 rounded-full text-[10px] font-[800] uppercase tracking-wider flex items-center gap-1.5 shadow-[0_0_10px_rgba(244,63,94,0.5)]">
                        <Music className="w-3 h-3" /> {artist.genre}
                      </span>
                      <span className="bg-[#1E293B]/60 backdrop-blur-md border border-[#334155] text-[#F8FAFC] px-3 py-1.5 rounded-full text-[10px] font-[800] flex items-center gap-1.5">
                        <Star className="w-3 h-3 fill-[#F59E0B] text-[#F59E0B]" /> {artist.followers}
                      </span>
                    </div>

                    <h3 className="text-3xl sm:text-4xl font-[900] text-[#F8FAFC] tracking-tight mb-5 leading-tight drop-shadow-lg">
                      {artist.name}
                    </h3>

                    {/* Glowing View Profile Button */}
                    <button className="flex items-center gap-3 text-[#94A3B8] text-sm font-[800] uppercase tracking-wider hover:text-[#F43F5E] transition-colors w-fit group/btn">
                      View Profile 
                      <div className="w-10 h-10 rounded-full bg-[#1E293B]/60 backdrop-blur-md border border-[#334155] flex items-center justify-center group-hover/btn:bg-[#F43F5E] group-hover/btn:border-[#F43F5E] group-hover/btn:shadow-[0_0_15px_rgba(244,63,94,0.5)] transition-all">
                        <ArrowRight className="w-4 h-4 text-[#F8FAFC] transform group-hover/btn:translate-x-1 transition-transform" />
                      </div>
                    </button>
                  </motion.div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* ================= VIEW ALL BUTTON ================= */}
        <div className="mt-14 flex justify-center">
          <button 
            onClick={() => navigate('/artists')}
            className="px-10 py-4 bg-[#0F172A] border border-[#1E293B] hover:border-[#6C5CE7]/60 text-[#F8FAFC] font-[800] uppercase tracking-wider rounded-xl shadow-[0_10px_20px_rgba(0,0,0,0.3)] hover:shadow-[0_0_25px_rgba(108,92,231,0.3)] transition-all flex items-center gap-3"
          >
            Explore All Artists <ArrowRight className="w-5 h-5 text-[#6C5CE7]" />
          </button>
        </div>

      </div>
    </section>
  );
};

export default ArtistSpotlight;