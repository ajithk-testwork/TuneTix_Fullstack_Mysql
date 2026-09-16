import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
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
  event: {
    title: string;
    date: string;
    time: string;
    venue: string;
    location: string;
    image: string; // Ensure this is mapped!
  };
  seats: SeatDetail[];
}

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");

  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );
  const [bookingData, setBookingData] = useState<BookingData | null>(null);

  useEffect(() => {
    if (!sessionId) {
      console.error("❌ No Stripe session ID found");
      setStatus("error");
      return;
    }

    const verifyPayment = async () => {
      try {
        const token = localStorage.getItem("token");

        console.log("========== FRONTEND PAYMENT VERIFY ==========");
        console.log("Session ID:", sessionId);
        console.log("Token exists:", !!token);

        if (!token) {
          console.error("❌ No auth token found");
          setStatus("error");
          return;
        }

        console.log("Calling /payment/success...");

        const response = await API.post(
          "/payment/success",
          {
            sessionId,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          },
        );

        console.log("✅ Payment Success Response:", response.data);

        if (response.data?.success && response.data?.booking) {
          console.log("✅ Booking received successfully");
          setBookingData(response.data.booking);
          setStatus("success");
          return;
        }

        console.error(
          "❌ Backend returned unsuccessful response:",
          response.data,
        );

        setStatus("error");
      } catch (error: any) {
        console.error("========== PAYMENT VERIFY ERROR ==========");
        console.error("Error:", error);
        console.error("Status:", error?.response?.status);
        console.error("Response:", error?.response?.data);
        console.error("Message:", error?.message);
        console.error("==========================================");

        setStatus("error");
      }
    };

    verifyPayment();
  }, [sessionId]);

  return (
    // Deep Slate Background with Neon Selection
    <div className="min-h-screen flex items-center justify-center bg-[#020617] py-12 px-4 sm:px-6 lg:px-8 font-sans relative overflow-hidden selection:bg-[#6C5CE7]/30 selection:text-white">
      
      {/* Ambient Neon Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#6C5CE7]/10 rounded-full blur-[150px] pointer-events-none z-0" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#10B981]/5 rounded-full blur-[150px] pointer-events-none z-0" />

      <div className="relative z-10 w-full flex justify-center">
        {/* ---------------- LOADING STATE ---------------- */}
        {status === "loading" && (
          <div className="flex flex-col items-center justify-center space-y-6 max-w-md w-full bg-[#0F172A]/80 backdrop-blur-xl border border-[#1E293B] p-12 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
            <div className="relative w-24 h-24">
              <div className="absolute top-0 left-0 w-full h-full border-4 border-[#1E293B] rounded-full"></div>
              <div className="absolute top-0 left-0 w-full h-full border-4 border-[#6C5CE7] rounded-full border-t-transparent animate-spin shadow-[0_0_15px_rgba(108,92,231,0.5)]"></div>
            </div>
            <div className="text-center">
              <h2 className="text-2xl font-[900] text-[#F8FAFC] tracking-tight drop-shadow-md">
                Processing Payment
              </h2>
              <p className="text-[#00B4D8] font-[700] text-sm mt-3 uppercase tracking-widest animate-pulse">
                Verifying your ticket...
              </p>
            </div>
          </div>
        )}

        {/* ---------------- SUCCESS STATE (THE TICKET) ---------------- */}
        {status === "success" && bookingData && (
          <div className="w-full max-w-md bg-[#0F172A] border border-[#1E293B] rounded-[2.5rem] shadow-[0_20px_60px_rgba(0,0,0,0.8)] overflow-hidden relative transition-all animate-in fade-in zoom-in duration-500">
            
            {/* Top Banner with Image */}
            <div className="relative h-56 w-full bg-[#020617]">
              {bookingData.event.image ? (
                <img
                  src={bookingData.event.image}
                  alt={bookingData.event.title}
                  className="w-full h-full object-cover opacity-80"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-tr from-[#6C5CE7] to-[#00B4D8] opacity-80"></div>
              )}
              {/* Dark Gradient Overlay to blend with card */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-[#0F172A]/40 to-transparent"></div>

              {/* Glowing Success Badge */}
              <div className="absolute top-5 right-5 bg-[#10B981]/20 border border-[#10B981]/50 backdrop-blur-md text-[#10B981] flex items-center gap-1.5 px-4 py-1.5 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="3"
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
                <span className="text-[10px] font-[900] uppercase tracking-[0.15em]">
                  Confirmed
                </span>
              </div>

              {/* Event Title */}
              <div className="absolute bottom-4 left-6 right-6 text-[#F8FAFC]">
                <h2 className="text-3xl font-[900] leading-tight drop-shadow-[0_4px_10px_rgba(0,0,0,0.8)] tracking-tight">
                  {bookingData.event.title}
                </h2>
              </div>
            </div>

            {/* Ticket Body */}
            <div className="p-8 pb-4">
              {/* Date & Venue Row */}
              <div className="flex justify-between items-start text-sm mb-8 border-b border-[#1E293B] pb-8">
                <div className="flex flex-col">
                  <span className="text-[#64748B] font-[800] uppercase tracking-widest text-[10px] mb-1.5">
                    Date & Time
                  </span>
                  <span className="font-[900] text-[#F8FAFC] text-base mb-0.5">
                    {new Date(bookingData.event.date).toLocaleDateString(
                      undefined,
                      { month: "short", day: "numeric", year: "numeric" },
                    )}
                  </span>
                  <span className="text-[#00B4D8] font-[700] text-sm">
                    {bookingData.event.time}
                  </span>
                </div>
                <div className="flex flex-col text-right">
                  <span className="text-[#64748B] font-[800] uppercase tracking-widest text-[10px] mb-1.5">
                    Venue
                  </span>
                  <span className="font-[900] text-[#F8FAFC] text-base mb-0.5">
                    {bookingData.event.venue}
                  </span>
                  <span className="text-[#94A3B8] font-[600] text-xs">
                    {bookingData.event.location}
                  </span>
                </div>
              </div>

              {/* Perforated Ticket Line */}
              <div className="relative flex items-center justify-center my-8">
                <div className="absolute w-8 h-8 bg-[#020617] rounded-full -left-12 shadow-[inset_-4px_0_8px_rgba(0,0,0,0.5)]"></div>
                <div className="absolute w-8 h-8 bg-[#020617] rounded-full -right-12 shadow-[inset_4px_0_8px_rgba(0,0,0,0.5)]"></div>
                <div className="w-full border-t-[3px] border-dashed border-[#1E293B]"></div>
              </div>

              {/* QR Code & Order Details Row */}
              <div className="flex flex-row justify-between items-center mb-8">
                <div className="flex flex-col gap-6">
                  <div>
                    <span className="text-[#64748B] font-[800] uppercase tracking-widest text-[10px] block mb-2">
                      Ticket ID
                    </span>
                    <span className="font-mono font-[800] text-[#F8FAFC] bg-[#1E293B]/50 border border-[#334155] px-3 py-1.5 rounded-lg text-sm shadow-inner">
                      {bookingData.ticketNumber}
                    </span>
                  </div>
                  <div>
                    <span className="text-[#64748B] font-[800] uppercase tracking-widest text-[10px] block mb-2">
                      Total Paid
                    </span>
                    <span className="font-[900] text-[#6C5CE7] text-2xl drop-shadow-sm">
                      ₹{bookingData.totalAmount}
                    </span>
                  </div>
                </div>

                {/* QR Code Container (White BG for Scanner Readability) */}
                <div className="flex flex-col items-center bg-white p-2.5 rounded-2xl border border-[#334155] shadow-[0_0_20px_rgba(108,92,231,0.2)]">
                  <img
                    src={bookingData.qrCode}
                    alt="QR Code"
                    className="w-24 h-24 rounded-lg mix-blend-multiply"
                  />
                  <span className="text-[8px] font-[800] text-[#64748B] mt-2 uppercase tracking-[0.2em]">
                    Scan at Gate
                  </span>
                </div>
              </div>

              {/* Seats Booked Section */}
              <div className="bg-[#1E293B]/30 p-4 rounded-2xl border border-[#1E293B]">
                <span className="text-[#64748B] font-[800] uppercase tracking-widest text-[10px] block mb-3">
                  Seats Booked
                </span>
                <div className="flex flex-wrap gap-2.5">
                  {bookingData.seats.map((s, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2.5 bg-[#0F172A] border border-[#334155] px-3 py-2 rounded-xl shadow-sm"
                    >
                      <div className="w-2 h-2 rounded-full bg-[#10B981] shadow-[0_0_8px_rgba(16,185,129,0.8)]"></div>
                      <span className="text-xs font-[800] text-[#94A3B8]">
                        {s.seat.category.name}
                      </span>
                      <span className="text-xs font-[900] text-[#F8FAFC] border-l border-[#334155] pl-2">
                        {s.seat.seatCode}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer Action CTA */}
            <div className="p-8 pt-4">
              <Link
                to="/dashboard"
                className="group w-full flex items-center justify-center py-4 px-4 rounded-2xl shadow-[0_0_20px_rgba(108,92,231,0.4)] text-sm font-[800] uppercase tracking-wider text-[#FFFFFF] bg-gradient-to-r from-[#6C5CE7] to-[#8B78FF] hover:from-[#5A4BCF] hover:to-[#6C5CE7] transition-all hover:shadow-[0_0_30px_rgba(108,92,231,0.6)] active:scale-[0.98]"
              >
                Access My Tickets
                <svg
                  className="ml-3 w-5 h-5 transform transition-transform group-hover:translate-x-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2.5"
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  ></path>
                </svg>
              </Link>
            </div>
          </div>
        )}

        {/* ---------------- ERROR STATE ---------------- */}
        {status === "error" && (
          <div className="max-w-md w-full bg-[#0F172A] p-10 rounded-[2.5rem] border border-[#1E293B] shadow-[0_20px_50px_rgba(0,0,0,0.5)] text-center">
            <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-[#F43F5E]/10 border border-[#F43F5E]/20 mb-6 shadow-[0_0_20px_rgba(244,63,94,0.2)]">
              <svg
                className="h-10 w-10 text-[#F43F5E]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.5"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            </div>
            <h2 className="text-2xl font-[900] text-[#F8FAFC] drop-shadow-md">
              Verification Failed
            </h2>
            <p className="mt-3 text-sm text-[#94A3B8] font-[500] leading-relaxed">
              We couldn't verify your payment. If you were charged, please contact
              our support team immediately.
            </p>
            <div className="w-full mt-10 space-y-4">
              <Link
                to="/support"
                className="w-full flex justify-center py-4 px-4 rounded-xl text-sm font-[800] uppercase tracking-wider text-[#FFFFFF] bg-[#F43F5E] hover:bg-[#D92D20] shadow-[0_0_20px_rgba(244,63,94,0.4)] transition-all active:scale-95"
              >
                Contact Support
              </Link>
              <Link
                to="/"
                className="w-full flex justify-center py-4 px-4 rounded-xl border border-[#334155] hover:border-[#6C5CE7]/50 hover:bg-[#1E293B] text-sm font-[800] uppercase tracking-wider text-[#F8FAFC] transition-all"
              >
                Return to Home
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentSuccess;