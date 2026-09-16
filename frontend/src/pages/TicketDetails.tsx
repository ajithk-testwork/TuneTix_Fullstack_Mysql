import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import API from "../api/userAPI";
import { ArrowLeft, Download, ZoomIn, X, CircleAlert } from "lucide-react";

interface SeatDetail {
  seat: {
    seatCode: string;
    category: {
      name: string;
    };
  };
}

interface BookingData {
  id: string;
  ticketNumber: string;
  totalAmount: number;
  qrCode: string;
  bookingStatus: string;
  user: {
    name: string;
    email: string;
  };
  event: {
    title: string;
    date: string;
    time: string;
    venue: string;
    location: string;
    image: string;
  };
  seats: SeatDetail[];
}

const TicketDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [bookingData, setBookingData] = useState<BookingData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Controls the QR code full-screen popup
  const [isQrModalOpen, setIsQrModalOpen] = useState<boolean>(false);

  useEffect(() => {
    const fetchTicketDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Please log in to view this ticket.");
          setLoading(false);
          return;
        }

        const response = await API.get(`/booking/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data && response.data.success) {
          setBookingData(response.data.data);
        } else {
          setError("Failed to load ticket details.");
        }
      } catch (err: any) {
        console.error("Error fetching ticket:", err);
        if (err.response && err.response.status === 404) {
          setError("Ticket not found.");
        } else {
          setError("Something went wrong while fetching the ticket.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTicketDetails();
  }, [id]);

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (isQrModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isQrModalOpen]);

  const handlePrint = () => {
    window.print();
  };

  // ================= LOADING STATE =================
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#020617] font-sans">
        <div className="w-16 h-16 border-4 border-[#1E293B] border-t-[#6C5CE7] rounded-full animate-spin shadow-[0_0_15px_rgba(108,92,231,0.5)]"></div>
        <p className="mt-6 text-[#94A3B8] font-[700] uppercase tracking-widest text-sm">Retrieving your ticket...</p>
      </div>
    );
  }

  // ================= ERROR STATE =================
  if (error || !bookingData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#020617] px-4 font-sans">
        <div className="max-w-md w-full bg-[#0F172A] p-10 rounded-[2rem] shadow-[0_10px_40px_rgba(0,0,0,0.5)] border border-[#1E293B] text-center">
          <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-[#F43F5E]/10 mb-6 border border-[#F43F5E]/20 shadow-[0_0_15px_rgba(244,63,94,0.2)]">
            <CircleAlert className="h-10 w-10 text-[#F43F5E]" />
          </div>
          <h2 className="text-2xl font-[900] text-[#F8FAFC] tracking-tight">{error || "Ticket not found"}</h2>
          <Link to="/dashboard" className="mt-8 w-full flex justify-center py-4 px-4 rounded-xl text-sm font-[800] uppercase tracking-wider text-[#FFFFFF] bg-[#6C5CE7] hover:bg-[#5A4BCF] transition-all shadow-[0_0_20px_rgba(108,92,231,0.4)]">
            Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  // ================= SUCCESS STATE (THE TICKET) =================
  return (
    <div className="min-h-screen bg-[#020617] py-24 px-4 sm:px-6 lg:px-8 font-sans flex flex-col items-center justify-center relative overflow-hidden">
      
      {/* Ambient Neon Glows */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[#6C5CE7]/10 rounded-full blur-[150px] pointer-events-none print:hidden" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-[#00B4D8]/10 rounded-full blur-[150px] pointer-events-none print:hidden" />

      {/* ---------------- QR CODE FULLSCREEN MODAL ---------------- */}
      {isQrModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#020617]/90 backdrop-blur-xl p-4 print:hidden"
          onClick={() => setIsQrModalOpen(false)} 
        >
          <div 
            className="bg-[#0F172A] border border-[#1E293B] rounded-[2.5rem] p-8 max-w-sm w-full shadow-[0_0_50px_rgba(108,92,231,0.2)] flex flex-col items-center relative"
            onClick={(e) => e.stopPropagation()} 
          >
            {/* Close Button */}
            <button 
              onClick={() => setIsQrModalOpen(false)}
              className="absolute top-4 right-4 bg-[#1E293B] hover:bg-[#334155] text-[#94A3B8] hover:text-[#F8FAFC] rounded-full p-2 transition-colors focus:outline-none"
            >
              <X className="w-5 h-5" />
            </button>
            
            <h3 className="text-xl font-[900] text-[#F8FAFC] mb-6 tracking-tight drop-shadow-md">Scan at Entry</h3>
            
            {/* QR Container with White Background for Scanner Readability */}
            <div className="p-4 border-[4px] border-[#6C5CE7]/50 rounded-[2rem] shadow-[0_0_30px_rgba(108,92,231,0.3)] bg-white mb-6 w-full aspect-square flex items-center justify-center relative">
              {/* Corner Accents */}
              <div className="absolute -top-1 -left-1 w-6 h-6 border-t-4 border-l-4 border-[#6C5CE7] rounded-tl-[1.8rem]"></div>
              <div className="absolute -top-1 -right-1 w-6 h-6 border-t-4 border-r-4 border-[#6C5CE7] rounded-tr-[1.8rem]"></div>
              <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-4 border-l-4 border-[#6C5CE7] rounded-bl-[1.8rem]"></div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-4 border-r-4 border-[#6C5CE7] rounded-br-[1.8rem]"></div>
              
              <img src={bookingData.qrCode} alt="Enlarged QR Code" className="w-full h-full object-contain" />
            </div>
            
            <div className="bg-[#1E293B] px-4 py-2 rounded-lg border border-[#334155]">
              <p className="text-sm font-[800] text-[#00B4D8] uppercase tracking-[0.2em]">{bookingData.ticketNumber}</p>
            </div>
          </div>
        </div>
      )}

      {/* ---------------- ACTION BAR (Hidden on Print) ---------------- */}
      <div className="w-full max-w-md flex justify-between items-center mb-6 print:hidden relative z-10">
        <Link to="/dashboard" className="flex items-center gap-2 text-sm font-[800] uppercase tracking-wider text-[#94A3B8] hover:text-[#6C5CE7] transition-colors group">
          <div className="w-8 h-8 rounded-full bg-[#0F172A] border border-[#1E293B] flex items-center justify-center group-hover:border-[#6C5CE7]/50 transition-colors">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          </div>
          Dashboard
        </Link>
        <button 
          onClick={handlePrint}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#0F172A] hover:bg-[#1E293B] text-[#F8FAFC] border border-[#1E293B] hover:border-[#6C5CE7]/50 rounded-xl shadow-[0_4px_15px_rgba(0,0,0,0.3)] text-xs font-[800] uppercase tracking-wider transition-all"
        >
          <Download className="w-4 h-4 text-[#00B4D8]" />
          Save PDF
        </button>
      </div>

      {/* ---------------- THE DIGITAL TICKET ---------------- */}
      <div className="w-full max-w-md bg-[#0F172A] rounded-[2.5rem] shadow-[0_20px_60px_rgba(0,0,0,0.8)] overflow-hidden relative border border-[#1E293B] print:shadow-none print:border print:border-gray-300 z-10">
        
        {/* Top Banner with Image */}
        <div className="relative h-64 w-full bg-[#020617]">
          {bookingData.event.image ? (
            <img src={bookingData.event.image} alt={bookingData.event.title} className="w-full h-full object-cover opacity-80" />
          ) : (
            <div className="w-full h-full bg-gradient-to-tr from-[#6C5CE7] to-[#00B4D8] opacity-80"></div>
          )}
          {/* Gradient overlay to blend with dark ticket body */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-[#0F172A]/40 to-transparent"></div>
          
          {/* Status Badge */}
          <div className={`absolute top-6 right-6 backdrop-blur-md border px-4 py-1.5 rounded-full shadow-[0_0_15px_rgba(0,0,0,0.5)] ${
            bookingData.bookingStatus === 'CONFIRMED' 
              ? 'bg-[#10B981]/20 border-[#10B981]/50 text-[#10B981]' 
              : 'bg-[#00B4D8]/20 border-[#00B4D8]/50 text-[#00B4D8]'
          }`}>
            <span className="text-[10px] font-[900] uppercase tracking-[0.15em]">{bookingData.bookingStatus}</span>
          </div>

          {/* Event Title */}
          <div className="absolute bottom-6 left-8 right-8 text-[#F8FAFC]">
            <h2 className="text-3xl font-[900] leading-tight tracking-tight drop-shadow-[0_4px_10px_rgba(0,0,0,0.8)]">
              {bookingData.event.title}
            </h2>
          </div>
        </div>

        {/* Ticket Body */}
        <div className="p-8">
          
          {/* Date & Venue Row */}
          <div className="flex justify-between items-start text-sm mb-8 border-b border-[#1E293B] pb-8">
            <div className="flex flex-col">
              <span className="text-[#64748B] font-[800] uppercase tracking-widest text-[10px] mb-1.5">Date & Time</span>
              <span className="font-[900] text-[#F8FAFC] text-base mb-0.5">
                {new Date(bookingData.event.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
              <span className="text-[#00B4D8] font-[700] text-sm">{bookingData.event.time}</span>
            </div>
            <div className="flex flex-col text-right">
              <span className="text-[#64748B] font-[800] uppercase tracking-widest text-[10px] mb-1.5">Venue</span>
              <span className="font-[900] text-[#F8FAFC] text-base mb-0.5">{bookingData.event.venue}</span>
              <span className="text-[#94A3B8] font-[600] text-xs">{bookingData.event.location}</span>
            </div>
          </div>

          {/* Attendee Info */}
          <div className="bg-[#020617] rounded-2xl p-5 mb-8 border border-[#1E293B] shadow-inner flex justify-between items-center">
            <div>
              <span className="text-[#64748B] font-[800] uppercase tracking-widest text-[10px] block mb-1">Ticket Holder</span>
              <span className="font-[900] text-[#F8FAFC] text-lg tracking-tight">{bookingData.user.name}</span>
            </div>
            <div className="text-right">
              <span className="text-[#64748B] font-[800] uppercase tracking-widest text-[10px] block mb-1">Total Amount</span>
              <span className="font-[900] text-[#6C5CE7] text-xl">₹{bookingData.totalAmount}</span>
            </div>
          </div>

          {/* Perforated Ticket Line (The tear-off effect) */}
          <div className="relative flex items-center justify-center my-8">
            <div className="absolute w-8 h-8 bg-[#020617] print:bg-white rounded-full -left-12 shadow-[inset_-4px_0_8px_rgba(0,0,0,0.5)]"></div>
            <div className="absolute w-8 h-8 bg-[#020617] print:bg-white rounded-full -right-12 shadow-[inset_4px_0_8px_rgba(0,0,0,0.5)]"></div>
            <div className="w-full border-t-[3px] border-dashed border-[#1E293B]"></div>
          </div>

          {/* QR Code & ID Row */}
          <div className="flex flex-row justify-between items-center mb-8">
            <div className="flex flex-col gap-4">
              <div>
                <span className="text-[#64748B] font-[800] uppercase tracking-widest text-[10px] block mb-2">Ticket ID</span>
                <span className="font-mono font-[800] text-[#F8FAFC] bg-[#1E293B]/50 px-3 py-1.5 rounded-lg text-sm border border-[#334155] shadow-inner">
                  {bookingData.ticketNumber}
                </span>
              </div>
            </div>
            
            {/* CLICKABLE QR CODE */}
            <div 
              onClick={() => setIsQrModalOpen(true)}
              className="flex flex-col items-center bg-white p-2 rounded-2xl shadow-[0_0_20px_rgba(108,92,231,0.2)] cursor-pointer hover:shadow-[0_0_30px_rgba(108,92,231,0.4)] hover:scale-105 transition-all group relative"
            >
              <img src={bookingData.qrCode} alt="QR Code" className="w-24 h-24 rounded-xl mix-blend-multiply" />
              <div className="absolute -bottom-3 bg-[#0F172A] border border-[#1E293B] px-3 py-1 rounded-full flex items-center gap-1.5 shadow-md">
                <ZoomIn className="w-3 h-3 text-[#6C5CE7]" />
                <span className="text-[8px] font-[800] text-[#F8FAFC] uppercase tracking-[0.2em]">Enlarge</span>
              </div>
            </div>
          </div>

          {/* Seats Booked Section */}
          <div className="bg-[#1E293B]/30 p-4 rounded-2xl border border-[#1E293B]">
            <span className="text-[#64748B] font-[800] uppercase tracking-widest text-[10px] block mb-3">Reserved Seats</span>
            <div className="flex flex-wrap gap-2.5">
              {bookingData.seats.map((s, idx) => (
                <div key={idx} className="flex items-center gap-2.5 bg-[#0F172A] border border-[#334155] px-3 py-2 rounded-xl shadow-sm">
                  <div className="w-2 h-2 rounded-full bg-[#00B4D8] shadow-[0_0_8px_rgba(0,180,216,0.8)]"></div>
                  <span className="text-xs font-[800] text-[#94A3B8]">{s.seat.category.name}</span>
                  <span className="text-xs font-[900] text-[#F8FAFC] border-l border-[#334155] pl-2">{s.seat.seatCode}</span>
                </div>
              ))}
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default TicketDetails;