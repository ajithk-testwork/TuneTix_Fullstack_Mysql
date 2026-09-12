import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, Users, Star, ArrowUpRight, Building2, Compass, ArrowLeft, Calendar, ShieldCheck, Ticket } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// REMOVED the faulty import statements for the public folder images.

const SOUTH_INDIAN_VENUES = [
  { 
    id: 1, 
    name: "Jawaharlal Nehru Stadium", 
    city: "Chennai",
    location: "Periamet, Chennai, Tamil Nadu", 
    capacity: "40,000 Seats", 
    rating: "4.8",
    tagline: "The monumental open-air arena hosting massive stadium rock tours and international music festivals.",
    image: "/image1.png", // Direct path to public folder
    type: "Stadium",
    amenities: ["VIP Hospitality Lounges", "Multi-tier Parking", "Advanced Acoustic Rigging", "Backstage Green Rooms"],
    upcomingShowsCount: 4
  },
  { 
    id: 2, 
    name: "YMCA Grounds", 
    city: "Chennai",
    location: "Nandanam, Chennai, Tamil Nadu", 
    capacity: "15,000 Seats", 
    rating: "4.5",
    tagline: "Legendary expansive concert grounds designed for high-energy live band performances and DJ nights.",
    image: "/image2.png",
    type: "Grounds",
    amenities: ["Open-Air Festival Grounds", "Food & Beverage Villages", "Express Entry Gates", "Perimeter Security"],
    upcomingShowsCount: 2
  },
  { 
    id: 3, 
    name: "Palace Grounds (Tripura Vasini)", 
    city: "Bengaluru",
    location: "Bellary Road, Bengaluru, Karnataka", 
    capacity: "25,000 Seats", 
    rating: "4.7",
    tagline: "The cultural heartbeat of Bengaluru, staging legendary rock bands and electronic music heavyweights.",
    image: "/image3.png",
    type: "Grounds",
    amenities: ["Centrally Located", "Massive Footfall Capacity", "Dedicated Artist Enclosures", "Ample Parking"],
    upcomingShowsCount: 6
  },
  { 
    id: 4, 
    name: "Hitex Exhibition Center", 
    city: "Hyderabad",
    location: "Izzatnagar, Madhapur, Hyderabad, Telangana", 
    capacity: "10,000 Seats", 
    rating: "4.8",
    tagline: "State-of-the-art indoor and open convention arena hosting high-tech arena concerts and cultural galas.",
    image: "/image4.png",
    type: "Arena",
    amenities: ["Air-Conditioned Halls", "Acoustic Wall Paneling", "VIP Valet", "Metro Connectivity"],
    upcomingShowsCount: 3
  },
  { 
    id: 5, 
    name: "Bolgatty Palace Convention Centre", 
    city: "Kochi",
    location: "Mulavukad, Kochi, Kerala", 
    capacity: "2,500 Seats", 
    rating: "4.9",
    tagline: "Scenic waterfront venue offering breathtaking backwater views paired with elite musical performances.",
    image: "/image5.jfif",
    type: "Auditorium",
    amenities: ["Waterfront Access", "Luxury Indoor Seating", "Private Boat Jetty", "World-class Lighting"],
    upcomingShowsCount: 2
  },
  { 
    id: 6, 
    name: "Sir Mutha Venkatasubba Rao Hall", 
    city: "Chennai",
    location: "Chetpet, Chennai, Tamil Nadu", 
    capacity: "1,200 Seats", 
    rating: "4.9",
    tagline: "Acoustically pristine indoor auditorium built for intimate orchestral showcases and classical fusion.",
    image: "/image6.jfif",
    type: "Auditorium",
    amenities: ["Tiered Balcony Seating", "Orchestra Pit", "Backstage Green Rooms", "High-Definition Projection"],
    upcomingShowsCount: 3
  },
];

const Venues = () => {
  const navigate = useNavigate();
  const [selectedCity, setSelectedCity] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeVenue, setActiveVenue] = useState<any>(null); // State for detailed view flow

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [activeVenue]);

  const filteredVenues = SOUTH_INDIAN_VENUES.filter(venue => {
    const matchesSearch = venue.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          venue.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          venue.city.toLowerCase().includes(searchQuery.toLowerCase());
    if (selectedCity !== "all" && venue.city.toLowerCase() !== selectedCity.toLowerCase()) {
      return false;
    }
    return matchesSearch;
  });

  // ================= VIEW 2: INDIVIDUAL VENUE DETAILS WORKFLOW =================
  if (activeVenue) {
    return (
      <div className="min-h-screen bg-[#F8F9FC] font-sans pt-32 pb-32 px-4 sm:px-6 lg:px-12 relative overflow-hidden">
        <div className="max-w-5xl mx-auto relative z-10">
          
          {/* Back Button */}
          <button
            onClick={() => setActiveVenue(null)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#FFFFFF] border border-gray-200 text-[#172033] font-[700] text-sm shadow-sm hover:bg-gray-50 transition-all mb-8 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Venues
          </button>

          {/* Venue Showcase Header Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#FFFFFF] border border-gray-100 rounded-[2.5p] sm:rounded-[3rem] overflow-hidden shadow-[0_20px_60px_-15px_rgba(0,0,0,0.06)] mb-8"
          >
            <div className="relative w-full h-[320px] sm:h-[450px]">
              <img src={activeVenue.image} alt={activeVenue.name} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#172033]/90 via-[#172033]/30 to-transparent" />
              
              <div className="absolute top-6 right-6 bg-white/90 backdrop-blur-md text-[#172033] px-4 py-2 rounded-full flex items-center gap-1.5 text-sm font-[800] shadow-md">
                <Star className="w-4 h-4 fill-[#00B4D8] text-[#00B4D8]" /> {activeVenue.rating} Rating
              </div>

              <div className="absolute bottom-8 left-8 right-8 text-white">
                <span className="bg-[#00B4D8] text-white px-3.5 py-1.5 rounded-full text-xs font-[800] uppercase tracking-wider mb-3 inline-block">
                  {activeVenue.type} • {activeVenue.city}
                </span>
                <h1 className="text-3xl sm:text-5xl font-[800] tracking-tight">{activeVenue.name}</h1>
              </div>
            </div>

            <div className="p-8 sm:p-12">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10 pb-10 border-b border-gray-100">
                <div className="flex items-start gap-3">
                  <div className="p-3 bg-[#F8F9FC] rounded-2xl text-[#6C5CE7]"><MapPin className="w-6 h-6" /></div>
                  <div>
                    <p className="text-xs font-[700] text-[#667085] uppercase tracking-wider">Exact Address</p>
                    <p className="text-sm font-[700] text-[#172033] mt-1">{activeVenue.location}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-3 bg-[#F8F9FC] rounded-2xl text-[#00B4D8]"><Users className="w-6 h-6" /></div>
                  <div>
                    <p className="text-xs font-[700] text-[#667085] uppercase tracking-wider">Seating Capacity</p>
                    <p className="text-sm font-[700] text-[#172033] mt-1">{activeVenue.capacity}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-3 bg-[#F8F9FC] rounded-2xl text-[#6C5CE7]"><Calendar className="w-6 h-6" /></div>
                  <div>
                    <p className="text-xs font-[700] text-[#667085] uppercase tracking-wider">Active Shows</p>
                    <p className="text-sm font-[700] text-[#172033] mt-1">{activeVenue.upcomingShowsCount} concerts scheduled</p>
                  </div>
                </div>
              </div>

              <h3 className="text-xl font-[800] text-[#172033] mb-4">About Venue & Facilities</h3>
              <p className="text-[#667085] font-[500] text-base leading-relaxed mb-8">{activeVenue.tagline}</p>

              <h4 className="text-sm font-[700] text-[#172033] uppercase tracking-wider mb-4">Venue Amenities</h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
                {activeVenue.amenities.map((amenity: string, idx: number) => (
                  <div key={idx} className="bg-[#F8F9FC] border border-gray-100 p-4 rounded-2xl flex items-center gap-2.5 text-xs font-[700] text-[#172033]">
                    <ShieldCheck className="w-4 h-4 text-[#00B4D8] shrink-0" /> {amenity}
                  </div>
                ))}
              </div>

              {/* Action Trigger */}
              <button
                onClick={() => navigate(`/events?city=${activeVenue.city}`)}
                className="w-full sm:w-auto px-8 py-4 bg-[#6C5CE7] hover:bg-[#4834D4] text-white font-[700] rounded-2xl shadow-[0_8px_20px_rgba(108,92,231,0.25)] flex items-center justify-center gap-2 uppercase tracking-wider transition-all"
              >
                <Ticket className="w-5 h-5" /> Browse Events at {activeVenue.name}
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // ================= VIEW 1: MAIN VENUES DIRECTORY =================
  return (
    <div className="min-h-screen bg-[#F8F9FC] font-sans pt-36 pb-32 px-4 sm:px-6 lg:px-12 relative overflow-hidden">
      
      {/* Cinematic Ambient Glows */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-br from-[#00B4D8]/15 to-[#6C5CE7]/15 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-[1400px] mx-auto relative z-10">
        
        {/* ================= CINEMATIC HERO BANNER ================= */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative bg-gradient-to-r from-[#172033] to-[#25334d] rounded-[2.5rem] p-8 md:p-14 text-white overflow-hidden mb-12 shadow-[0_20px_60px_-15px_rgba(23,32,51,0.3)]"
        >
          <div className="absolute right-0 top-0 w-96 h-96 bg-[#00B4D8]/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute right-20 bottom-0 w-72 h-72 bg-[#6C5CE7]/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-[#00B4D8] text-xs font-[700] uppercase tracking-widest mb-6">
              <Compass className="w-3.5 h-3.5" /> South India Stage Hubs
            </div>
            <h1 className="text-4xl sm:text-6xl font-[800] tracking-tight leading-[1.1] mb-4">
              Iconic Arenas Across <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00B4D8] to-[#95afc0]">South India</span>
            </h1>
            <p className="text-gray-300 font-[500] text-base sm:text-lg mb-8 leading-relaxed">
              Explore premier concert destinations in Chennai, Bengaluru, Hyderabad, and Kochi engineered for massive live music spectacles.
            </p>

            {/* Integrated Search Bar inside Banner */}
            <div className="flex flex-col sm:flex-row items-center gap-3 bg-white/10 backdrop-blur-xl border border-white/15 rounded-2xl p-2 shadow-inner">
              <div className="flex items-center gap-3 px-4 py-3 w-full">
                <Search className="w-5 h-5 text-gray-400 shrink-0" />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by venue name or city (e.g., Chennai, Bengaluru)..." 
                  className="w-full bg-transparent text-white placeholder-gray-400 font-[500] text-sm outline-none"
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* ================= CITY FILTER TABS ================= */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-2 bg-[#FFFFFF] border border-gray-200 p-1.5 rounded-2xl shadow-sm overflow-x-auto hide-scrollbar">
            {["all", "Chennai", "Bengaluru", "Hyderabad", "Kochi"].map((city) => (
              <button
                key={city}
                onClick={() => setSelectedCity(city)}
                className={`px-5 py-2.5 rounded-xl text-xs font-[700] transition-all shrink-0 ${
                  selectedCity.toLowerCase() === city.toLowerCase()
                    ? 'bg-[#6C5CE7] text-white shadow-[0_4px_12px_rgba(108,92,231,0.25)]' 
                    : 'text-[#667085] hover:text-[#172033]'
                }`}
              >
                {city === "all" ? "All Cities" : city}
              </button>
            ))}
          </div>

          <p className="text-sm font-[600] text-[#667085] px-2">
            Showing <span className="text-[#172033] font-[800]">{filteredVenues.length}</span> venues
          </p>
        </div>

        {/* ================= VENUES EDITORIAL GRID ================= */}
        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          <AnimatePresence>
            {filteredVenues.map((venue) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                key={venue.id}
                onClick={() => setActiveVenue(venue)} // Triggers click-through view flow
                className="group relative bg-[#FFFFFF] border border-gray-100 rounded-[2.5rem] overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.04)] hover:shadow-[0_25px_60px_-15px_rgba(108,92,231,0.18)] hover:border-[#6C5CE7]/30 transition-all duration-500 flex flex-col sm:flex-row cursor-pointer"
              >
                {/* Image Section */}
                <div className="relative w-full sm:w-2/5 h-64 sm:h-auto overflow-hidden bg-[#F8F9FC]">
                  <img 
                    src={venue.image} 
                    alt={venue.name} 
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#172033]/70 to-transparent opacity-60" />

                  {/* Rating Badge */}
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md text-[#172033] px-3.5 py-1.5 rounded-full flex items-center gap-1.5 text-xs font-[800] shadow-sm">
                    <Star className="w-3.5 h-3.5 fill-[#00B4D8] text-[#00B4D8]" />
                    {venue.rating}
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between bg-[#FFFFFF]">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2 text-xs font-[700] text-[#00B4D8] uppercase tracking-wider">
                        <Building2 className="w-4 h-4" /> {venue.type}
                      </div>
                      <span className="text-xs font-[800] text-[#6C5CE7] bg-[#6C5CE7]/10 px-2.5 py-1 rounded-lg">
                        {venue.city}
                      </span>
                    </div>

                    <h3 className="text-2xl font-[800] text-[#172033] tracking-tight mb-2 group-hover:text-[#6C5CE7] transition-colors">
                      {venue.name}
                    </h3>

                    <div className="flex items-center gap-1.5 text-[#667085] font-[600] text-sm mb-3">
                      <MapPin className="w-4 h-4 text-[#6C5CE7] shrink-0" />
                      <span>{venue.location}</span>
                    </div>

                    <p className="text-[#667085] font-[500] text-sm leading-relaxed mb-6 line-clamp-2">
                      {venue.tagline}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-[700] text-[#172033] bg-[#F8F9FC] px-3.5 py-2 rounded-xl border border-gray-100">
                      <Users className="w-4 h-4 text-[#00B4D8]" /> {venue.capacity}
                    </div>
                    <div className="w-10 h-10 rounded-2xl bg-[#F8F9FC] border border-gray-100 flex items-center justify-center text-[#172033] group-hover:bg-[#6C5CE7] group-hover:text-[#FFFFFF] transition-colors shadow-sm">
                      <ArrowUpRight className="w-5 h-5" />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Empty state if search returns nothing */}
        {filteredVenues.length === 0 && (
          <div className="text-center py-24 bg-[#FFFFFF] border border-gray-200 rounded-[2.5rem] mt-6 shadow-sm">
            <Building2 className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-[800] text-[#172033]">No venues found</h3>
            <p className="text-sm text-[#667085] mt-1">Try searching with a different keyword or city.</p>
          </div>
        )}

      </div>
    </div>
  );
};

export default Venues;