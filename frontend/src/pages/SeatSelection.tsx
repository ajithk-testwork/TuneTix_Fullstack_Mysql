import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2, Info, X, Lock, Armchair, Ticket } from "lucide-react";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import API from "../api/userAPI";

interface Seat {
  id: string;
  seatCode: string;
  row: string;
  number: number;
  isBooked: boolean;
  isLocked: boolean;
}

interface SeatCategory {
  id: string;
  name: string;
  price: number;
  color: string;
  rowLetter: string;
  totalSeats: number;
  seats: Seat[];
}

// Framer Motion Variants for Staggered Loading
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 120 } },
};

const SeatSelection = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [categories, setCategories] = useState<SeatCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSeats, setSelectedSeats] = useState<
    { seat: Seat; category: SeatCategory }[]
  >([]);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchSeats = async () => {
      try {
        const res = await API.get(`/seat-category/${id}`);
        setCategories(res.data.data || []);
      } catch (error: any) {
        toast.error("Failed to load live seat map", {
          style: { background: "#F04438", color: "#FFFFFF", borderRadius: "12px" }
        });
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) fetchSeats();
  }, [id]);

  const toggleSeatSelection = (seat: Seat, category: SeatCategory) => {
    if (seat.isBooked || seat.isLocked) {
      if (seat.isLocked)
        toast.error("Seat is currently being viewed by another fan.", {
          style: { background: "#172033", color: "#FFFFFF", borderRadius: "12px" },
          icon: '👀',
        });
      return;
    }

    setSelectedSeats((prev) => {
      const isSelected = prev.some((s) => s.seat.id === seat.id);
      if (isSelected) {
        return prev.filter((s) => s.seat.id !== seat.id);
      } else {
        if (prev.length >= 10) {
          toast.error("Maximum 10 seats allowed per transaction.", {
            style: { background: "#F04438", color: "#FFFFFF", borderRadius: "12px" },
          });
          return prev;
        }
        return [...prev, { seat, category }];
      }
    });
  };

  const handleCheckout = async () => {
    try {
      const bookingRes = await API.post("/booking", {
        eventId: id,
        seatIds: selectedSeats.map((seat) => seat.seat.id),
      });

      const bookingId = bookingRes.data.bookingId;

      const paymentRes = await API.post(
        "/payment/create-checkout-session",
        { bookingId }
      );

      window.location.href = paymentRes.data.checkoutUrl;
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Checkout Failed", {
        style: { background: "#F04438", color: "#FFFFFF", borderRadius: "12px" }
      });
    }
  };

  const totalPrice = selectedSeats.reduce(
    (total, item) => total + item.category.price,
    0
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F8F9FC] flex items-center justify-center flex-col gap-4 font-sans">
        <Loader2 className="w-10 h-10 text-[#6C5CE7] animate-spin" />
        <p className="text-[#6C5CE7]/80 text-sm tracking-[0.2em] uppercase font-[800] animate-pulse">
          Syncing Live Arena Map...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FC] text-[#172033] font-sans pb-48 overflow-x-hidden relative selection:bg-[#6C5CE7]/20">
      
      {/* Light Ambient Background Glows */}
      <div className="fixed top-[-20%] left-[-10%] w-[50%] h-[50%] bg-[#6C5CE7]/10 rounded-full blur-[120px] pointer-events-none z-0" />
      <div className="fixed bottom-[10%] right-[-10%] w-[40%] h-[40%] bg-[#00B4D8]/10 rounded-full blur-[120px] pointer-events-none z-0" />

      {/* Modern Header */}
      <header className="sticky top-0 z-50 bg-[#FFFFFF]/90 backdrop-blur-2xl border-b border-gray-200 px-6 py-4 flex items-center gap-4 shadow-sm">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 bg-[#FFFFFF] border border-gray-200 hover:border-[#6C5CE7] hover:bg-[#F8F9FC] hover:scale-105 rounded-full flex items-center justify-center text-[#667085] hover:text-[#172033] transition-all shadow-sm"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-lg font-[800] text-[#172033] tracking-tight">
            Select Your Seats
          </h1>
          <p className="text-xs text-[#6C5CE7] font-[700] flex items-center gap-1.5 mt-0.5 animate-pulse">
            <span className="w-2 h-2 bg-[#6C5CE7] rounded-full block shadow-[0_0_8px_rgba(108,92,231,0.8)]" /> 
            Real-time arena map active
          </p>
        </div>
      </header>

      <main className="relative z-10 max-w-6xl mx-auto px-4 pt-10">
        
        {/* Premium Stage UI */}
        <div className="w-full max-w-2xl mx-auto mb-20 relative pt-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="relative h-24 sm:h-32 bg-gradient-to-b from-[#6C5CE7]/15 via-[#6C5CE7]/5 to-transparent border-t-[6px] border-[#6C5CE7] rounded-t-[140px] flex flex-col items-center justify-start pt-6 shadow-[0_-20px_60px_-15px_rgba(108,92,231,0.25)]"
          >
            <span className="text-[#6C5CE7] font-[800] tracking-[0.4em] text-sm sm:text-base uppercase drop-shadow-sm z-10">
              Main Stage
            </span>
          </motion.div>
        </div>

        {/* Status Legend */}
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 mb-16 bg-[#FFFFFF] border border-gray-200 rounded-full py-3 px-8 w-fit mx-auto shadow-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-md border-2 border-gray-200 bg-[#FFFFFF] shadow-inner"></div>
            <span className="text-xs text-[#667085] font-[700] uppercase tracking-wider">Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-md bg-[#6C5CE7] shadow-[0_4px_10px_rgba(108,92,231,0.4)] border border-[#4834D4]"></div>
            <span className="text-xs text-[#172033] font-[700] uppercase tracking-wider">Selected</span>
          </div>
          <div className="flex items-center gap-2" title="Someone else is looking at this seat">
            <div className="w-4 h-4 rounded-md bg-amber-50 border-2 border-amber-300 flex items-center justify-center animate-pulse">
              <Lock className="w-2.5 h-2.5 text-amber-500" />
            </div>
            <span className="text-xs text-amber-600 font-[700] uppercase tracking-wider">Locked</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-md bg-[#F8F9FC] border-2 border-gray-200 flex items-center justify-center">
              <X className="w-3 h-3 text-[#667085]" />
            </div>
            <span className="text-xs text-[#667085] font-[700] uppercase tracking-wider">Sold Out</span>
          </div>
        </div>

        {/* Dynamic Stadium Layout Map */}
        {categories.length === 0 ? (
          <div className="text-center py-20 text-[#667085] flex flex-col items-center bg-[#FFFFFF] border border-gray-200 rounded-[2rem] shadow-sm max-w-2xl mx-auto">
            <Armchair className="w-12 h-12 mb-4 text-gray-300" />
            <p className="text-lg font-[800] text-[#172033]">Arena map is currently unavailable.</p>
            <p className="text-sm mt-2 font-[500]">Please check back later.</p>
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="flex flex-col items-center w-full"
          >
            {categories.map((category, index) => {
              // Simulating an arena wedge (narrow at front, wide at back)
              const widthClass =
                index === 0 ? "max-w-xl" :
                index === 1 ? "max-w-2xl" :
                index === 2 ? "max-w-4xl" : "max-w-full";

              return (
                <motion.div
                  key={category.id}
                  variants={itemVariants}
                  className={`w-full ${widthClass} mb-12`}
                >
                  {/* Category Header Card */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 px-6 py-4 bg-[#FFFFFF] border border-gray-200 rounded-2xl shadow-sm">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-4 h-4 rounded-full border-2 border-[#FFFFFF] shadow-md"
                        style={{ backgroundColor: category.color || "#6C5CE7" }}
                      />
                      <h3 className="text-lg font-[800] text-[#172033] tracking-wide uppercase">
                        {category.name} <span className="text-[#667085] font-[500] normal-case ml-2">| Row {category.rowLetter}</span>
                      </h3>
                    </div>
                    <div className="flex items-center gap-4 mt-2 sm:mt-0">
                      <span className="text-xs text-[#667085] font-[700] uppercase tracking-wider">
                        {category.seats.length} Seats
                      </span>
                      <span
                        className="text-sm font-[800] px-4 py-1.5 rounded-xl border"
                        style={{ 
                          color: category.color || "#6C5CE7",
                          backgroundColor: `${category.color}15` || "#F8F9FC",
                          borderColor: `${category.color}30` || "#gray-200"
                        }}
                      >
                        ₹{category.price}
                      </span>
                    </div>
                  </div>

                  {/* High-Fidelity Seat Grid */}
                  <div className="flex flex-wrap justify-center gap-2.5 sm:gap-3 px-2">
                    {category.seats?.map((seat) => {
                      const isSelected = selectedSeats.some((s) => s.seat.id === seat.id);

                      return (
                        <button
                          key={seat.id}
                          disabled={seat.isBooked}
                          onClick={() => toggleSeatSelection(seat, category)}
                          title={`Row ${seat.row} Seat ${seat.number} - ₹${category.price}`}
                          style={
                            isSelected
                              ? {
                                  backgroundColor: category.color,
                                  borderColor: category.color,
                                  boxShadow: `0 8px 20px ${category.color}60`,
                                }
                              : {}
                          }
                          className={`
                            relative w-9 h-9 sm:w-11 sm:h-11 rounded-[10px] sm:rounded-xl text-[10px] sm:text-xs font-[800] flex items-center justify-center transition-all duration-300
                            ${
                              seat.isBooked
                                ? "bg-[#F8F9FC] text-gray-300 border border-gray-100 cursor-not-allowed shadow-inner"
                                : seat.isLocked && !isSelected
                                  ? "bg-amber-50 border-2 border-amber-300 text-amber-500 cursor-not-allowed animate-pulse"
                                  : isSelected
                                    ? "text-[#FFFFFF] scale-110 z-10 border-2"
                                    : "bg-[#FFFFFF] border-2 border-gray-200 text-[#667085] hover:border-[#6C5CE7] hover:text-[#6C5CE7] hover:shadow-md hover:-translate-y-1"
                            }
                          `}
                        >
                          {seat.isBooked ? (
                            <X className="w-4 h-4 opacity-40" />
                          ) : seat.isLocked && !isSelected ? (
                            <Lock className="w-3.5 h-3.5 opacity-80" />
                          ) : (
                            seat.number
                          )}
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </main>

      {/* Floating Checkout Drawer */}
      <AnimatePresence>
        {selectedSeats.length > 0 && (
          <motion.div
            initial={{ y: 150, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 150, opacity: 0 }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
            className="fixed bottom-6 left-4 right-4 md:left-1/2 md:-translate-x-1/2 md:w-[90%] max-w-5xl bg-[#FFFFFF]/95 backdrop-blur-2xl border border-gray-200 rounded-[2rem] p-4 sm:p-6 z-50 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)]"
          >
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              
              <div className="w-full md:w-[65%]">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm text-[#172033] font-[800] flex items-center gap-2">
                    <Ticket className="w-4 h-4 text-[#6C5CE7]" />
                    Selected Passes
                    <span className="text-[#667085] font-[500] ml-1">
                      ({selectedSeats.length}/10 max)
                    </span>
                  </p>
                </div>

                {/* Horizontal scroll for Mini-Tickets */}
                <div className="flex gap-3 overflow-x-auto pb-2 w-full hide-scrollbar snap-x">
                  {selectedSeats.map((item) => (
                    <div
                      key={item.seat.id}
                      className="snap-start flex flex-col bg-[#F8F9FC] border border-gray-200 rounded-xl px-4 py-2 shrink-0 relative overflow-hidden shadow-sm"
                    >
                      <div
                        className="absolute left-0 top-0 w-1.5 h-full"
                        style={{ backgroundColor: item.category.color }}
                      />
                      <span className="text-[10px] uppercase tracking-wider font-[700] text-[#667085] mb-0.5">
                        {item.category.name}
                      </span>
                      <span className="text-sm font-[800] text-[#172033]">
                        {item.seat.seatCode}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between w-full md:w-auto gap-6 md:gap-8 pt-4 md:pt-0 border-t border-gray-100 md:border-none">
                <div className="text-left md:text-right">
                  <p className="text-[10px] text-[#667085] uppercase tracking-[0.2em] font-[700] mb-1">
                    Subtotal
                  </p>
                  <p className="text-3xl font-[800] text-[#172033] tracking-tight">
                    ₹{totalPrice}
                  </p>
                </div>
                <button
                  onClick={handleCheckout}
                  className="bg-[#6C5CE7] text-[#FFFFFF] px-8 py-4 rounded-xl font-[700] hover:bg-[#4834D4] transition-all active:scale-95 shadow-[0_8px_20px_rgba(108,92,231,0.25)] flex items-center gap-2"
                >
                  Checkout <ArrowLeft className="w-4 h-4 rotate-180" />
                </button>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SeatSelection;