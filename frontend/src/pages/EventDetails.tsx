import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Ticket,
  Calendar,
  MapPin,
  Clock,
  Share2,
  Heart,
  Loader2,
  Sparkles,
  ShieldCheck,
  Info,
  Timer,
  Globe,
  UserCheck,
  Mic2,
  Building2
} from "lucide-react";
import API from "../api/userAPI";
import toast from "react-hot-toast";

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchEventDetails = async () => {
      try {
        setIsLoading(true);
        const res = await API.get(`/event/${id}`);
        setEvent(res.data.data ? res.data.data : res.data.event);
      } catch (error: any) {
        toast.error(
          error.response?.data?.message || "Failed to load event details",
          {
            style: {
              background: "#F04438",
              color: "#FFFFFF",
              border: "1px solid rgba(240, 68, 56, 0.2)",
              borderRadius: "12px"
            },
          }
        );
        navigate("/");
      } finally {
        setIsLoading(false);
      }
    };

    if (id) fetchEventDetails();
  }, [id, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F8F9FC] flex items-center justify-center flex-col gap-4 font-sans">
        <Loader2 className="w-8 h-8 text-[#6C5CE7] animate-spin" />
        <p className="text-[#667085] text-sm tracking-widest uppercase font-[700]">
          Loading Experience...
        </p>
      </div>
    );
  }

  if (!event) return null;

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 120 } },
  };

  // Pricing Logic based on Backend's seatCategories
  const getDisplayPrice = () => {
    if (event.seatCategories && event.seatCategories.length > 0) {
      const prices = event.seatCategories.map((cat: any) => Number(cat.price));
      const minPrice = Math.min(...prices);
      return minPrice === 0 || isNaN(minPrice) ? "Free" : `₹${minPrice}`;
    }
    
    // Fallback if seatCategories is missing but price exists
    const fallbackPrice = Number(event.price);
    if (!fallbackPrice || fallbackPrice === 0 || isNaN(fallbackPrice)) return "Free";
    return `₹${fallbackPrice}`;
  };

  const getPriceLabel = () => {
    if (event.seatCategories && event.seatCategories.length > 1) {
      return "Starting Price";
    }
    return event.seatCategories?.[0]?.name || "Economy Pass";
  };

  return (
    <div className="relative min-h-screen bg-[#F8F9FC] text-[#172033] font-sans selection:bg-[#6C5CE7]/30 overflow-x-hidden pb-24">
      
      {/* Light Ambient Background Glows */}
      <div className="fixed top-[-20%] left-[-10%] w-[50%] h-[50%] bg-[#6C5CE7]/10 rounded-full blur-[120px] pointer-events-none z-0" />
      <div className="fixed bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-[#00B4D8]/10 rounded-full blur-[120px] pointer-events-none z-0" />

      {/* Floating Back Button (Aligned to match the poster aesthetic) */}
      <div className="fixed top-24 left-6 md:left-10 z-50">
        <button
          onClick={() => navigate(-1)}
          className="w-12 h-12 bg-[#FFFFFF] border border-gray-200 hover:border-[#6C5CE7] hover:bg-[#F8F9FC] hover:scale-105 rounded-full flex items-center justify-center text-[#172033] transition-all duration-300 shadow-md group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        </button>
      </div>

      {/* Main Content Layout */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pt-32 pb-12">
        
        {/* Banner Image - Corrected vibrant look with bottom fade only */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full h-[300px] sm:h-[400px] md:h-[500px] rounded-[2rem] overflow-hidden relative mb-8 shadow-sm group"
        >
          <img
            src={
              event.image ||
              "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2000&auto=format&fit=crop"
            }
            alt={event.title}
            className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
          />
          {/* Clean bottom-only fade to blend into the background, no full-cover fog */}
          <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-[#F8F9FC] via-[#F8F9FC]/80 to-transparent pointer-events-none" />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Details */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="lg:col-span-8 flex flex-col gap-6"
          >
            {/* Header Card */}
            <motion.div
              variants={itemVariants}
              className="bg-[#FFFFFF] border border-gray-100 rounded-[2rem] p-6 sm:p-8 md:p-10 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)]"
            >
              <div className="flex flex-wrap gap-3 mb-6">
                <span className="bg-[#6C5CE7]/10 border border-[#6C5CE7]/20 text-[#6C5CE7] text-xs font-[700] px-4 py-1.5 rounded-full flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  {event.category || "Premium Access"}
                </span>
                <span className="bg-[#00B4D8]/10 border border-[#00B4D8]/20 text-[#00B4D8] text-xs font-[700] px-4 py-1.5 rounded-full flex items-center gap-1.5">
                  <Mic2 className="w-3.5 h-3.5" />
                  Live Concert
                </span>
              </div>
              <h1 className="text-3xl sm:text-5xl md:text-6xl font-[800] text-[#172033] tracking-tight leading-[1.1]">
                {event.title}
              </h1>
            </motion.div>

            {/* Meta Grid */}
            <motion.div
              variants={itemVariants}
              className="grid grid-cols-2 md:grid-cols-4 gap-4"
            >
              <div className="bg-[#FFFFFF] border border-gray-100 rounded-2xl p-4 sm:p-5 flex flex-col gap-3 shadow-sm hover:border-[#6C5CE7]/30 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-[#F8F9FC] border border-gray-100 flex items-center justify-center text-[#6C5CE7]">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-[#667085] font-[700] uppercase tracking-wider mb-1">Date</p>
                  <p className="text-sm font-[700] text-[#172033]">
                    {event.date
                      ? new Date(event.date).toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })
                      : "TBA"}
                  </p>
                </div>
              </div>

              <div className="bg-[#FFFFFF] border border-gray-100 rounded-2xl p-4 sm:p-5 flex flex-col gap-3 shadow-sm hover:border-[#00B4D8]/30 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-[#F8F9FC] border border-gray-100 flex items-center justify-center text-[#00B4D8]">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-[#667085] font-[700] uppercase tracking-wider mb-1">Time</p>
                  <p className="text-sm font-[700] text-[#172033]">{event.time || "TBA"}</p>
                </div>
              </div>

              <div className="bg-[#FFFFFF] border border-gray-100 rounded-2xl p-4 sm:p-5 flex flex-col gap-3 shadow-sm hover:border-[#6C5CE7]/30 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-[#F8F9FC] border border-gray-100 flex items-center justify-center text-[#6C5CE7]">
                  <Timer className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-[#667085] font-[700] uppercase tracking-wider mb-1">Duration</p>
                  <p className="text-sm font-[700] text-[#172033]">
                    {event.duration ? `${event.duration} Mins` : "TBA"}
                  </p>
                </div>
              </div>

              <div className="bg-[#FFFFFF] border border-gray-100 rounded-2xl p-4 sm:p-5 flex flex-col gap-3 shadow-sm hover:border-[#00B4D8]/30 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-[#F8F9FC] border border-gray-100 flex items-center justify-center text-[#00B4D8]">
                  <Globe className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-[#667085] font-[700] uppercase tracking-wider mb-1">Language</p>
                  <p className="text-sm font-[700] text-[#172033]">{event.language || "TBA"}</p>
                </div>
              </div>

              <div className="col-span-2 md:col-span-4 bg-[#FFFFFF] border border-gray-100 rounded-2xl p-4 sm:p-5 flex items-center gap-4 shadow-sm hover:border-[#6C5CE7]/30 transition-colors">
                <div className="w-12 h-12 rounded-xl bg-[#F8F9FC] border border-gray-100 flex items-center justify-center text-[#667085] shrink-0">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs text-[#667085] font-[700] uppercase tracking-wider mb-1">Venue & Location</p>
                  <p className="text-base font-[700] text-[#172033]">
                    {event.venue}, {event.location}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Description & Policy */}
            <motion.div
              variants={itemVariants}
              className="bg-[#FFFFFF] border border-gray-100 rounded-[2rem] p-6 sm:p-8 md:p-10 flex flex-col gap-8 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)]"
            >
              <div>
                <h3 className="text-xl font-[800] text-[#172033] mb-4 flex items-center gap-2">
                  <Info className="w-6 h-6 text-[#00B4D8]" /> About Event
                </h3>
                <p className="text-[#667085] text-sm md:text-base leading-relaxed whitespace-pre-wrap font-[500]">
                  {event.description}
                </p>
              </div>

              <div className="pt-8 border-t border-gray-100">
                <h4 className="text-lg font-[800] text-[#172033] mb-4 flex items-center gap-2">
                  <ShieldCheck className="w-6 h-6 text-[#6C5CE7]" /> Access Policy
                </h4>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3 text-[#667085] font-[500] text-sm">
                    <UserCheck className="w-5 h-5 text-[#667085] mt-0.5 shrink-0" />
                    Minimum age limit for this event is {event.minimumAge}+ years.
                  </li>
                  <li className="flex items-start gap-3 text-[#667085] font-[500] text-sm">
                    <span className="w-2 h-2 rounded-full bg-[#6C5CE7] mt-1.5 ml-1.5 shrink-0" />
                    Tickets are strictly non-refundable and non-transferable under standard protocol.
                  </li>
                </ul>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column: Admission CTA & Extra Widgets */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="lg:col-span-4 sticky top-24 flex flex-col gap-6"
          >
            {/* Ticket Booking Card */}
            <div className="bg-[#FFFFFF] border border-gray-100 rounded-[2rem] p-6 sm:p-8 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.08)]">
              <div className="mb-8">
                <p className="text-xs text-[#00B4D8] font-[700] uppercase tracking-widest mb-2">
                  {getPriceLabel()}
                </p>
                <h2 className="text-5xl font-[800] text-[#172033] tracking-tighter mb-2">
                  {getDisplayPrice()}
                </h2>
                <p className="text-sm font-[600] text-[#667085]">
                  {event.availableTickets} Tickets Available
                </p>
              </div>

              <button
                onClick={() => navigate(`/event/${event.id}/book`)}
                className="w-full bg-[#6C5CE7] hover:bg-[#4834D4] text-[#FFFFFF] font-[700] text-base py-4 rounded-xl transition-all active:scale-[0.98] flex items-center justify-center gap-2 mb-4 shadow-[0_8px_20px_rgba(108,92,231,0.25)] uppercase tracking-wider"
              >
                <Ticket className="w-5 h-5" />
                Claim Pass
              </button>

              <div className="flex gap-3 mt-4">
                <button className="flex-1 bg-[#FFFFFF] hover:bg-[#F8F9FC] border border-gray-200 text-[#172033] py-3 rounded-xl flex justify-center items-center gap-2 text-sm font-[700] transition-colors">
                  <Heart className="w-4 h-4 text-[#667085]" /> Save
                </button>
                <button className="flex-1 bg-[#FFFFFF] hover:bg-[#F8F9FC] border border-gray-200 text-[#172033] py-3 rounded-xl flex justify-center items-center gap-2 text-sm font-[700] transition-colors">
                  <Share2 className="w-4 h-4 text-[#667085]" /> Share
                </button>
              </div>
            </div>

            {/* Organizer Widget */}
            <div className="bg-[#FFFFFF] border border-gray-100 rounded-[2rem] p-6 shadow-sm">
              <h4 className="font-[800] text-[#172033] mb-4 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-[#00B4D8]" /> Event Organized By
              </h4>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-[#F8F9FC] border border-gray-100 rounded-full flex items-center justify-center text-[#6C5CE7] font-[800] text-xl shrink-0">
                  {event.organizer ? event.organizer.charAt(0).toUpperCase() : "O"}
                </div>
                <div>
                  <p className="font-[700] text-[#172033] text-base">{event.organizer || "Official Organizer"}</p>
                  <p className="text-xs font-[600] text-[#00B4D8] flex items-center gap-1 mt-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> Verified Partner
                  </p>
                </div>
              </div>
            </div>

          </motion.div>
          
        </div>
      </main>
    </div>
  );
};

export default EventDetails;