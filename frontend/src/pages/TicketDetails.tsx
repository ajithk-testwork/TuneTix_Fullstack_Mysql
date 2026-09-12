import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import API from "../api/userAPI";

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

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F8F9FC] font-sans">
        <div className="w-16 h-16 border-4 border-[#6C5CE7]/20 border-t-[#6C5CE7] rounded-full animate-spin"></div>
        <p className="mt-4 text-[#667085] font-[600]">Retrieving your ticket...</p>
      </div>
    );
  }

  if (error || !bookingData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8F9FC] px-4 font-sans">
        <div className="max-w-md w-full bg-[#FFFFFF] p-10 rounded-[2rem] shadow-sm border border-gray-100 text-center">
          <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-[#F04438]/10 mb-6">
            <svg className="h-10 w-10 text-[#F04438]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
            </svg>
          </div>
          <h2 className="text-2xl font-[800] text-[#172033]">{error || "Ticket not found"}</h2>
          <Link to="/dashboard" className="mt-8 w-full flex justify-center py-3.5 px-4 rounded-xl text-sm font-[700] text-[#FFFFFF] bg-[#6C5CE7] hover:bg-[#4834D4] transition-all shadow-[0_8px_20px_rgba(108,92,231,0.25)]">
            Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FC] py-12 px-4 sm:px-6 lg:px-8 font-sans flex flex-col items-center justify-center">
      
      {/* ---------------- QR CODE FULLSCREEN MODAL ---------------- */}
      {isQrModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 print:hidden animate-fade-in"
          onClick={() => setIsQrModalOpen(false)} 
        >
          <div 
            className="bg-[#FFFFFF] rounded-3xl p-8 max-w-sm w-full shadow-2xl flex flex-col items-center transform transition-transform scale-100 animate-scale-up relative"
            onClick={(e) => e.stopPropagation()} 
          >
            {/* Close Button */}
            <button 
              onClick={() => setIsQrModalOpen(false)}
              className="absolute top-4 right-4 bg-[#F8F9FC] hover:bg-gray-200 text-[#667085] hover:text-[#172033] rounded-full p-2 transition-colors focus:outline-none"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
            
            <h3 className="text-xl font-[800] text-[#172033] mb-6 tracking-tight">Scan at Entry</h3>
            <div className="p-4 border-2 border-gray-100 rounded-2xl shadow-inner bg-[#F8F9FC] mb-4 w-full aspect-square flex items-center justify-center">
              <img src={bookingData.qrCode} alt="Enlarged QR Code" className="w-full h-full object-contain mix-blend-multiply" />
            </div>
            <p className="text-sm font-[700] text-[#667085] uppercase tracking-widest">{bookingData.ticketNumber}</p>
          </div>
        </div>
      )}

      {/* ---------------- ACTION BAR (Hidden on Print) ---------------- */}
      <div className="w-full max-w-md flex justify-between items-center mb-6 print:hidden">
        <Link to="/dashboard" className="flex items-center text-sm font-[700] text-[#667085] hover:text-[#6C5CE7] transition-colors">
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
          Back to Dashboard
        </Link>
        <button 
          onClick={handlePrint}
          className="flex items-center gap-2 px-4 py-2 bg-[#FFFFFF] text-[#172033] border border-gray-200 rounded-lg shadow-sm hover:bg-[#F8F9FC] text-sm font-[700] transition-all"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
          Save PDF
        </button>
      </div>

      {/* ---------------- THE DIGITAL TICKET ---------------- */}
      <div className="w-full max-w-md bg-[#FFFFFF] rounded-[2rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.08)] overflow-hidden relative print:shadow-none print:border print:border-gray-300">
        
        {/* Top Banner with Image */}
        <div className="relative h-56 w-full bg-[#F8F9FC]">
          {bookingData.event.image ? (
            <img src={bookingData.event.image} alt={bookingData.event.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-tr from-[#6C5CE7] to-[#00B4D8]"></div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
          
          {/* Status Badge */}
          <div className={`absolute top-5 right-5 backdrop-blur-sm text-[#FFFFFF] flex items-center gap-1.5 px-3 py-1.5 rounded-full shadow-md ${bookingData.bookingStatus === 'CONFIRMED' ? 'bg-[#12B76A]/90' : 'bg-[#00B4D8]/90'}`}>
            <span className="text-xs font-[700] uppercase tracking-wider">{bookingData.bookingStatus}</span>
          </div>

          {/* Event Title */}
          <div className="absolute bottom-4 left-6 right-6 text-[#FFFFFF]">
            <h2 className="text-2xl font-[800] leading-tight drop-shadow-md">{bookingData.event.title}</h2>
          </div>
        </div>

        {/* Ticket Body */}
        <div className="p-6">
          
          {/* Date & Venue Row */}
          <div className="flex justify-between items-start text-sm mb-6">
            <div className="flex flex-col">
              <span className="text-[#667085] font-[700] uppercase tracking-widest text-[10px] mb-1">Date & Time</span>
              <span className="font-[800] text-[#172033]">
                {new Date(bookingData.event.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
              <span className="text-[#667085] font-[600]">{bookingData.event.time}</span>
            </div>
            <div className="flex flex-col text-right">
              <span className="text-[#667085] font-[700] uppercase tracking-widest text-[10px] mb-1">Venue</span>
              <span className="font-[800] text-[#172033]">{bookingData.event.venue}</span>
              <span className="text-[#667085] font-[600]">{bookingData.event.location}</span>
            </div>
          </div>

          {/* Attendee Info */}
          <div className="bg-[#F8F9FC] rounded-xl p-4 mb-6 border border-gray-100 flex justify-between items-center">
            <div>
              <span className="text-[#667085] font-[700] uppercase tracking-widest text-[10px] block mb-1">Ticket Holder</span>
              <span className="font-[800] text-[#172033]">{bookingData.user.name}</span>
            </div>
            <div className="text-right">
              <span className="text-[#667085] font-[700] uppercase tracking-widest text-[10px] block mb-1">Total Amount</span>
              <span className="font-[800] text-[#6C5CE7]">₹{bookingData.totalAmount}</span>
            </div>
          </div>

          {/* Perforated Ticket Line */}
          <div className="relative flex items-center justify-center my-6">
            <div className="absolute w-8 h-8 bg-[#F8F9FC] print:bg-white rounded-full -left-10 shadow-inner"></div>
            <div className="absolute w-8 h-8 bg-[#F8F9FC] print:bg-white rounded-full -right-10 shadow-inner"></div>
            <div className="w-full border-t-2 border-dashed border-gray-200"></div>
          </div>

          {/* QR Code & ID Row */}
          <div className="flex flex-row justify-between items-center mb-6">
            <div className="flex flex-col gap-4">
              <div>
                <span className="text-[#667085] font-[700] uppercase tracking-widest text-[10px] block mb-1">Ticket ID</span>
                <span className="font-mono font-[700] text-[#172033] bg-[#F8F9FC] px-2.5 py-1 rounded-md text-sm border border-gray-100">
                  {bookingData.ticketNumber}
                </span>
              </div>
            </div>
            
            {/* CLICKABLE QR CODE */}
            <div 
              onClick={() => setIsQrModalOpen(true)}
              className="flex flex-col items-center bg-[#FFFFFF] p-2.5 rounded-xl border border-gray-200 shadow-sm cursor-pointer hover:shadow-md hover:border-[#6C5CE7]/40 transition-all group"
            >
              <img src={bookingData.qrCode} alt="QR Code" className="w-24 h-24 rounded-lg group-hover:opacity-90 transition-opacity" />
              <div className="flex items-center gap-1 mt-2 text-[#6C5CE7]">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"></path></svg>
                <span className="text-[9px] font-[800] uppercase tracking-[0.2em]">Tap to enlarge</span>
              </div>
            </div>
          </div>

          {/* Seats Booked Section */}
          <div>
            <span className="text-[#667085] font-[700] uppercase tracking-widest text-[10px] block mb-2">Reserved Seats</span>
            <div className="flex flex-wrap gap-2">
              {bookingData.seats.map((s, idx) => (
                <div key={idx} className="flex items-center gap-2 bg-[#6C5CE7]/10 border border-[#6C5CE7]/20 px-3 py-1.5 rounded-lg shadow-sm">
                  <div className="w-2 h-2 rounded-full bg-[#6C5CE7]"></div>
                  <span className="text-xs font-[700] text-[#172033]">{s.seat.category.name}</span>
                  <span className="text-xs font-[700] text-[#6C5CE7] border-l border-[#6C5CE7]/20 pl-2">{s.seat.seatCode}</span>
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