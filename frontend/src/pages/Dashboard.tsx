import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/userAPI";
import { Ticket, ArrowLeft, Loader2, CalendarX2 } from "lucide-react";

interface EventDetail {
  id: string;
  title: string;
  date: string;
  time: string;
  venue: string;
  location: string;
  image: string;
}

interface Booking {
  id: string;
  ticketNumber: string;
  totalAmount: number;
  qrCode: string;
  bookingStatus: string;
  paymentStatus: string;
  event: EventDetail;
}

const Dashboard = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"upcoming" | "past">("upcoming");

  useEffect(() => {
    const fetchMyTickets = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Please log in to view your tickets.");
          setLoading(false);
          return;
        }

        const response = await API.get("/booking/my", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data && response.data.success) {
          setBookings(response.data.data);
        } else {
          setError("Failed to load your tickets.");
        }
      } catch (err) {
        console.error("Error fetching tickets:", err);
        setError("Something went wrong while fetching your tickets.");
      } finally {
        setLoading(false);
      }
    };

    fetchMyTickets();
  }, []);

  const currentDate = new Date();
  const displayedBookings = bookings.filter((booking) => {
    const eventDate = new Date(booking.event.date);
    return activeTab === "upcoming"
      ? eventDate >= currentDate
      : eventDate < currentDate;
  });

  return (
    // Base Dark Slate Background
    <div className="min-h-screen bg-[#020617] font-sans pt-28 pb-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      
      {/* Ambient Neon Glows */}
      <div className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-[#6C5CE7]/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-[#00B4D8]/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* ================= HEADER SECTION ================= */}
        <div className="mb-10">
          {/* Back to Home Button */}
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-sm font-[800] uppercase tracking-wider text-[#94A3B8] hover:text-[#6C5CE7] transition-colors mb-8 group"
          >
            <div className="w-8 h-8 rounded-full bg-[#0F172A] border border-[#1E293B] flex items-center justify-center group-hover:border-[#6C5CE7]/50 transition-colors">
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            </div>
            Back to Home
          </Link>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-[900] text-[#F8FAFC] tracking-tight drop-shadow-md">
                My Tickets
              </h1>
              <p className="text-[#94A3B8] font-[500] mt-3 text-base">
                Manage your event bookings and access your digital passes.
              </p>
            </div>

            {/* Dark Glass Tabs */}
            <div className="flex bg-[#0F172A] border border-[#1E293B] p-1.5 rounded-2xl w-full md:w-auto shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
              <button
                onClick={() => setActiveTab("upcoming")}
                className={`flex-1 md:flex-none px-8 py-3 text-xs font-[800] uppercase tracking-wider rounded-xl transition-all ${
                  activeTab === "upcoming"
                    ? "bg-[#6C5CE7] text-[#FFFFFF] shadow-[0_0_15px_rgba(108,92,231,0.4)]"
                    : "text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#1E293B]/50"
                }`}
              >
                Upcoming
              </button>
              <button
                onClick={() => setActiveTab("past")}
                className={`flex-1 md:flex-none px-8 py-3 text-xs font-[800] uppercase tracking-wider rounded-xl transition-all ${
                  activeTab === "past"
                    ? "bg-[#6C5CE7] text-[#FFFFFF] shadow-[0_0_15px_rgba(108,92,231,0.4)]"
                    : "text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#1E293B]/50"
                }`}
              >
                Past Events
              </button>
            </div>
          </div>
        </div>

        {/* ================= LOADING STATE ================= */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-32 space-y-4 bg-[#0F172A] border border-[#1E293B] rounded-[2.5rem] shadow-lg">
            <Loader2 className="w-10 h-10 text-[#6C5CE7] animate-spin drop-shadow-[0_0_10px_rgba(108,92,231,0.5)]" />
            <p className="text-[#94A3B8] font-[700] uppercase tracking-widest text-sm">Loading your tickets...</p>
          </div>
        )}

        {/* ================= ERROR STATE ================= */}
        {error && !loading && (
          <div className="bg-[#F43F5E]/10 border border-[#F43F5E]/20 text-[#F43F5E] p-6 rounded-2xl text-center shadow-[0_0_15px_rgba(244,63,94,0.1)]">
            <p className="font-[800] tracking-wide">{error}</p>
          </div>
        )}

        {/* ================= TICKETS GRID ================= */}
        {!loading && !error && displayedBookings.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayedBookings.map((booking) => (
              <div
                key={booking.id}
                className="bg-[#0F172A] rounded-[2rem] overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.3)] hover:shadow-[0_0_30px_rgba(108,92,231,0.25)] border border-[#1E293B] hover:border-[#6C5CE7]/50 transition-all duration-500 flex flex-col group relative"
              >
                {/* Event Image */}
                <div className="relative h-56 w-full bg-[#020617] overflow-hidden">
                  {booking.event.image ? (
                    <img
                      src={booking.event.image}
                      alt={booking.event.title}
                      className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 ease-out"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-tr from-[#6C5CE7] to-[#00B4D8] opacity-80"></div>
                  )}
                  {/* Dark gradient to blend with the card body */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-[#0F172A]/40 to-transparent"></div>

                  {/* Date Badge */}
                  <div className="absolute top-5 left-5 bg-[#020617]/80 backdrop-blur-md border border-[#334155] rounded-xl text-center px-4 py-2 shadow-lg">
                    <span className="block text-[10px] font-[800] text-[#94A3B8] uppercase tracking-widest mb-0.5">
                      {new Date(booking.event.date).toLocaleDateString(undefined, { month: "short" })}
                    </span>
                    <span className="block text-2xl font-[900] text-[#F8FAFC] leading-none drop-shadow-[0_0_8px_rgba(248,250,252,0.5)]">
                      {new Date(booking.event.date).toLocaleDateString(undefined, { day: "2-digit" })}
                    </span>
                  </div>
                </div>

                {/* Ticket Details */}
                <div className="p-6 flex-1 flex flex-col relative z-10">
                  <div className="mb-6 flex-1">
                    <h3 className="text-2xl font-[900] text-[#F8FAFC] leading-tight mb-2 line-clamp-2 group-hover:text-[#6C5CE7] transition-colors drop-shadow-sm">
                      {booking.event.title}
                    </h3>
                    <p className="text-sm text-[#94A3B8] font-[500] flex items-center gap-1.5">
                      {booking.event.venue}, {booking.event.location}
                    </p>
                  </div>

                  {/* Info Row */}
                  <div className="flex items-center justify-between border-t border-[#1E293B] pt-5 mb-6">
                    <div>
                      <p className="text-[10px] text-[#64748B] font-[800] uppercase tracking-widest mb-1.5">
                        Ticket ID
                      </p>
                      <p className="text-sm font-mono font-[800] text-[#F8FAFC] bg-[#1E293B]/50 px-2.5 py-1 rounded border border-[#334155] shadow-inner">
                        {booking.ticketNumber}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-[#64748B] font-[800] uppercase tracking-widest mb-1.5">
                        Status
                      </p>
                      <span
                        className={`text-[10px] font-[900] px-3 py-1.5 rounded-md uppercase tracking-wider shadow-sm border ${
                          booking.bookingStatus === "CONFIRMED"
                            ? "bg-[#10B981]/10 text-[#10B981] border-[#10B981]/30"
                            : "bg-[#00B4D8]/10 text-[#00B4D8] border-[#00B4D8]/30"
                        }`}
                      >
                        {booking.bookingStatus}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3">
                    <Link
                      to={`/ticket/${booking.id}`} 
                      className="flex-1 text-center py-3.5 px-4 bg-[#6C5CE7] hover:bg-[#5A4BCF] text-[#FFFFFF] shadow-[0_0_15px_rgba(108,92,231,0.4)] hover:shadow-[0_0_25px_rgba(108,92,231,0.6)] text-sm font-[800] uppercase tracking-wider rounded-xl transition-all"
                    >
                      View Ticket
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ================= EMPTY STATE ================= */}
        {!loading && !error && displayedBookings.length === 0 && (
          <div className="bg-[#0F172A] rounded-[3rem] p-12 md:p-20 text-center shadow-lg border border-[#1E293B] mt-6">
            <div className="w-24 h-24 bg-[#1E293B] border border-[#334155] rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
              <Ticket className="w-10 h-10 text-[#6C5CE7] drop-shadow-[0_0_10px_rgba(108,92,231,0.5)]" />
            </div>
            <h3 className="text-2xl md:text-3xl font-[900] text-[#F8FAFC] tracking-tight mb-3">
              No tickets found
            </h3>
            <p className="text-[#94A3B8] font-[500] text-base md:text-lg mb-10 max-w-md mx-auto">
              You don't have any {activeTab} bookings at the moment. Explore the hottest events and secure your spot!
            </p>
            <Link
              to="/events"
              className="inline-flex items-center justify-center px-10 py-4 text-sm font-[800] uppercase tracking-wider rounded-xl text-[#FFFFFF] bg-[#6C5CE7] hover:bg-[#5A4BCF] shadow-[0_0_20px_rgba(108,92,231,0.4)] hover:shadow-[0_0_30px_rgba(108,92,231,0.6)] transition-all"
            >
              Browse Events
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;