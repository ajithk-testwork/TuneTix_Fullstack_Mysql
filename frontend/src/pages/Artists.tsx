import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Star, Music, X, Play, Calendar, TrendingUp, ChevronRight, Activity } from 'lucide-react';

// Using your exact image imports
import image1 from "../../public/Artist/image1.png";
import image2 from "../../public/Artist/image2.png";
import image3 from "../../public/Artist/image3.png";
import image4 from "../../public/Artist/image4.png";
import image5 from "../../public/Artist/image5.png";
import image6 from "../../public/Artist/image6.png";
import image7 from "../../public/Artist/image7.png";
import image8 from "../../public/Artist/image8.png";
import image9 from "../../public/Artist/image9.png";

const MOCK_ARTISTS = [
  { id: 1, name: "Anirudh Ravichander", genre: "Indian Pop / Electronic", followers: "15M+", tagline: "The rockstar architect of modern electronic dance music and chart-topping soundtracks.", image: image1, trending: true, upcomingShows: 4 },
  { id: 2, name: "A.R. Rahman", genre: "Classical / Fusion", followers: "22M+", tagline: "Legendary composer bridging traditional classical roots with global cinematic soundscapes.", image: image2, trending: true, upcomingShows: 2 },
  { id: 3, name: "Sid Sriram", genre: "Carnatic Pop", followers: "8M+", tagline: "Soul-stirring vocals creating hypnotic waves across contemporary carnatic pop anthems.", image: image3, trending: false, upcomingShows: 6 },
  { id: 4, name: "Jonita Gandhi", genre: "Pop / Playback", followers: "5M+", tagline: "Versatile powerhouse delivering high-energy pop hits and unforgettable live stage presence.", image: image4, trending: false, upcomingShows: 3 },
  { id: 5, name: "Thaman S", genre: "Tollywood / Electronic", followers: "6M+", tagline: "Master of thunderous brass arrangements and electrifying stadium beat drops.", image: image5, trending: true, upcomingShows: 1 },
  { id: 6, name: "Shreya Ghoshal", genre: "Classical / Pop", followers: "30M+", tagline: "The golden voice of melody, celebrated globally for unmatched vocal precision.", image: image6, trending: false, upcomingShows: 5 },
  { id: 7, name: "Yuvan Shankar Raja", genre: "Alternative / Indie", followers: "12M+", tagline: "Pioneer of alternative indie subcultures and timeless soulful melodies.", image: image7, trending: false, upcomingShows: 2 },
  { id: 8, name: "Arijit Singh", genre: "Bollywood / Acoustic", followers: "45M+", tagline: "The undisputed king of romantic playback singing and soul-piercing live performances.", image: image8, trending: true, upcomingShows: 8 },
  { id: 9, name: "Amit Trivedi", genre: "Alternative / Fusion", followers: "4M+", tagline: "Avant-garde composer blending raw folk instruments with hard-hitting contemporary beats.", image: image9, trending: false, upcomingShows: 3 },
];

const Artists = () => {
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedArtist, setSelectedArtist] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (selectedArtist) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; }
  }, [selectedArtist]);

  const filteredArtists = MOCK_ARTISTS.filter(artist => {
    const matchesSearch = artist.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          artist.genre.toLowerCase().includes(searchQuery.toLowerCase());
    if (filter === "trending") return matchesSearch && artist.trending;
    return matchesSearch;
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <div className="min-h-screen bg-white text-zinc-900 font-sans selection:bg-fuchsia-200">
      
      {/* Background Ambient Glows */}
      <div className="fixed top-0 left-1/4 w-[500px] h-[500px] bg-fuchsia-100/50 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 w-[600px] h-[600px] bg-blue-100/50 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 pt-32 pb-32 relative z-10">
        
        {/* ================= EDITORIAL HERO ================= */}
        <div className="mb-16 flex flex-col items-start">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="w-5 h-5 text-fuchsia-600" />
            <span className="text-fuchsia-600 text-sm font-semibold tracking-[0.2em] uppercase">Featured Roster</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-none mb-6 text-zinc-900">
            The Sound <span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-500 to-blue-500">Architects</span>
          </h1>
          <p className="text-zinc-500 text-lg md:text-xl max-w-2xl font-light">
            Discover the maestros shaping global music. Dive into their discography and catch them live on their upcoming arena tours.
          </p>
        </div>

        {/* ================= UNIFIED CONTROL BAR ================= */}
        <div className="sticky top-6 z-40 mb-12 flex flex-col md:flex-row items-center justify-between gap-4 p-2 bg-zinc-100/80 border border-zinc-200 backdrop-blur-xl rounded-full shadow-lg shadow-zinc-200/50">
          
          {/* Tabs */}
          <div className="flex items-center gap-1 w-full md:w-auto p-1">
            <button
              onClick={() => setFilter("all")}
              className={`px-6 py-3 rounded-full text-sm font-semibold transition-all w-full md:w-auto ${
                filter === "all" ? 'bg-white text-zinc-900 shadow-sm border border-zinc-200' : 'text-zinc-500 hover:text-zinc-700 hover:bg-zinc-200/50 border border-transparent'
              }`}
            >
              All Artists
            </button>
            <button
              onClick={() => setFilter("trending")}
              className={`px-6 py-3 rounded-full text-sm font-semibold transition-all w-full md:w-auto flex items-center justify-center gap-2 ${
                filter === "trending" ? 'bg-white text-fuchsia-600 shadow-sm border border-fuchsia-100' : 'text-zinc-500 hover:text-zinc-700 hover:bg-zinc-200/50 border border-transparent'
              }`}
            >
              <TrendingUp className="w-4 h-4" /> Trending
            </button>
          </div>

          {/* Search */}
          <div className="relative w-full md:w-[350px] mr-2">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search artists..." 
              className="w-full bg-zinc-200/50 border border-zinc-300 text-zinc-900 placeholder-zinc-500 rounded-full py-3 pl-11 pr-4 focus:outline-none focus:bg-white focus:border-fuchsia-400 transition-colors text-sm shadow-inner"
            />
          </div>
        </div>

        {/* ================= POSTER GRID ================= */}
        {/* Adjusted grid-cols to make cards smaller on wider screens */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-7"
        >
          <AnimatePresence mode="popLayout">
            {filteredArtists.map((artist) => (
              <motion.div
                variants={itemVariants}
                key={artist.id}
                onClick={() => setSelectedArtist(artist)}
                // Changed to aspect-[4/5], reduced border radius slightly, and set max width
                className="group relative aspect-[4/5] mx-auto w-full max-w-[320px] rounded-3xl overflow-hidden cursor-pointer bg-zinc-100 ring-1 ring-zinc-200 hover:ring-fuchsia-400/50 transition-all duration-500 shadow-md hover:shadow-xl"
              >
                {/* Image */}
                <img 
                  src={artist.image} 
                  alt={artist.name} 
                  className="absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-110 grayscale-[0.2] group-hover:grayscale-0 opacity-90 group-hover:opacity-100"
                />
                
                {/* Gradient Overlays */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/80" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-60 transition-opacity duration-500" />

                {/* Content */}
                <div className="absolute inset-x-0 bottom-0 p-5 flex flex-col justify-end transform transition-transform duration-500 translate-y-3 group-hover:translate-y-0">
                  {artist.trending && (
                    <span className="w-fit bg-white text-fuchsia-600 px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest mb-2 shadow-sm">
                      Trending
                    </span>
                  )}
                  
                  {/* Reduced text sizes to fit smaller cards */}
                  <h3 className="text-xl font-bold text-white leading-tight mb-1">{artist.name}</h3>
                  <p className="text-zinc-300 text-xs font-medium mb-3">{artist.genre}</p>
                  
                  {/* Hover Reveal Stats */}
                  <div className="h-0 opacity-0 overflow-hidden group-hover:h-auto group-hover:opacity-100 transition-all duration-500 delay-100">
                    <div className="flex items-center gap-3 pt-3 border-t border-zinc-400/30">
                      <div className="flex items-center gap-1 text-[11px] text-zinc-200">
                        <Star className="w-3 h-3 text-yellow-400" /> {artist.followers}
                      </div>
                      <div className="flex items-center gap-1 text-[11px] text-zinc-200">
                        <Calendar className="w-3 h-3 text-blue-300" /> {artist.upcomingShows} Shows
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {filteredArtists.length === 0 && (
          <div className="py-20 text-center text-zinc-500">
            <p>No artists found matching your criteria.</p>
          </div>
        )}
      </div>

      {/* ================= SIDE DRAWER ================= */}
      <AnimatePresence>
        {selectedArtist && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedArtist(null)}
              className="fixed inset-0 bg-zinc-900/40 backdrop-blur-sm z-[100] cursor-pointer"
            />

            <motion.div 
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 h-full w-full md:w-[480px] bg-white border-l border-zinc-200 z-[110] shadow-2xl overflow-y-auto"
            >
              
              <button 
                onClick={() => setSelectedArtist(null)}
                className="absolute top-6 right-6 z-20 w-10 h-10 bg-white/80 border border-zinc-200 backdrop-blur-md hover:bg-white rounded-full flex items-center justify-center text-zinc-800 transition-all shadow-sm"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="relative w-full h-[400px]">
                <img 
                  src={selectedArtist.image} 
                  alt={selectedArtist.name} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white via-white/40 to-transparent" />
                
                <div className="absolute bottom-6 left-8 flex gap-2">
                  <span className="bg-white/90 backdrop-blur-md border border-zinc-200 text-zinc-800 px-3 py-1.5 rounded-full text-xs font-medium shadow-sm">
                    {selectedArtist.genre}
                  </span>
                  {selectedArtist.trending && (
                    <span className="bg-fuchsia-50/90 backdrop-blur-md border border-fuchsia-200 text-fuchsia-600 px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1 shadow-sm">
                      <TrendingUp className="w-3 h-3" /> Hot
                    </span>
                  )}
                </div>
              </div>

              <div className="p-8">
                <h2 className="text-4xl font-black text-zinc-900 mb-4">{selectedArtist.name}</h2>
                <p className="text-zinc-600 text-base leading-relaxed mb-8">
                  {selectedArtist.tagline}
                </p>

                <div className="grid grid-cols-2 gap-4 mb-10">
                  <div className="bg-zinc-50 border border-zinc-100 p-5 rounded-2xl shadow-sm">
                    <div className="text-3xl font-bold text-zinc-900 mb-1">{selectedArtist.followers}</div>
                    <div className="text-xs text-zinc-500 uppercase tracking-widest font-semibold">Listeners</div>
                  </div>
                  <div className="bg-zinc-50 border border-zinc-100 p-5 rounded-2xl shadow-sm">
                    <div className="text-3xl font-bold text-zinc-900 mb-1">{selectedArtist.upcomingShows}</div>
                    <div className="text-xs text-zinc-500 uppercase tracking-widest font-semibold">Shows</div>
                  </div>
                </div>

                <div className="space-y-3">
                  <button className="w-full group bg-gradient-to-r from-fuchsia-600 to-blue-600 hover:from-fuchsia-500 hover:to-blue-500 text-white font-bold py-4 px-6 rounded-2xl transition-all flex items-center justify-between shadow-md hover:shadow-lg">
                    <span className="flex items-center gap-2"><Calendar className="w-5 h-5" /> Tour Dates & Tickets</span>
                    <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                  <button className="w-full group bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 hover:border-zinc-300 text-zinc-800 font-bold py-4 px-6 rounded-2xl transition-all flex items-center justify-between shadow-sm">
                    <span className="flex items-center gap-2"><Play className="w-5 h-5" /> Play Artist Radio</span>
                    <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
};

export default Artists;