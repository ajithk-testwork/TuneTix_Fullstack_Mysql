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
    <div className="min-h-screen flex items-center justify-center bg-[#F8F9FC] py-12 px-4 sm:px-6 lg:px-8 font-sans">
      {/* ---------------- LOADING STATE ---------------- */}
      {status === "loading" && (
        <div className="flex flex-col items-center justify-center space-y-6 max-w-md w-full bg-[#FFFFFF] border border-gray-100 p-12 rounded-[2rem] shadow-sm">
          <div className="relative w-24 h-24">
            <div className="absolute top-0 left-0 w-full h-full border-4 border-[#6C5CE7]/20 rounded-full"></div>
            <div className="absolute top-0 left-0 w-full h-full border-4 border-[#6C5CE7] rounded-full border-t-transparent animate-spin"></div>
          </div>
          <div className="text-center">
            <h2 className="text-2xl font-[800] text-[#172033] tracking-tight">
              Processing Payment
            </h2>

            <p className="text-[#667085] font-[500] mt-2 animate-pulse">
              Verifying your payment...
            </p>
          </div>
        </div>
      )}

      {/* ---------------- SUCCESS STATE (THE TICKET) ---------------- */}
      {status === "success" && bookingData && (
        <div className="w-full max-w-md mx-auto bg-[#FFFFFF] rounded-[2rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.08)] overflow-hidden relative animate-fade-in-up">
          {/* Top Banner with Image */}
          <div className="relative h-56 w-full bg-[#F8F9FC]">
            {bookingData.event.image ? (
              <img
                src={bookingData.event.image}
                alt={bookingData.event.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-tr from-[#6C5CE7] to-[#00B4D8]"></div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

            {/* Status Badge */}
            <div className="absolute top-5 right-5 bg-[#12B76A]/90 backdrop-blur-sm text-[#FFFFFF] flex items-center gap-1.5 px-3 py-1.5 rounded-full shadow-sm">
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
              <span className="text-xs font-[700] uppercase tracking-wider">
                Confirmed
              </span>
            </div>

            {/* Event Title */}
            <div className="absolute bottom-4 left-6 right-6 text-[#FFFFFF]">
              <h2 className="text-2xl font-[800] leading-tight drop-shadow-md">
                {bookingData.event.title}
              </h2>
            </div>
          </div>

          {/* Ticket Body */}
          <div className="p-6 pb-2">
            {/* Date & Venue Row */}
            <div className="flex justify-between items-start text-sm mb-6">
              <div className="flex flex-col">
                <span className="text-[#667085] font-[700] uppercase tracking-widest text-[10px] mb-1">
                  Date & Time
                </span>
                <span className="font-[800] text-[#172033]">
                  {new Date(bookingData.event.date).toLocaleDateString(
                    undefined,
                    { month: "short", day: "numeric", year: "numeric" },
                  )}
                </span>
                <span className="text-[#667085] font-[600]">
                  {bookingData.event.time}
                </span>
              </div>
              <div className="flex flex-col text-right">
                <span className="text-[#667085] font-[700] uppercase tracking-widest text-[10px] mb-1">
                  Venue
                </span>
                <span className="font-[800] text-[#172033]">
                  {bookingData.event.venue}
                </span>
                <span className="text-[#667085] font-[600]">
                  {bookingData.event.location}
                </span>
              </div>
            </div>

            {/* Perforated Ticket Line */}
            <div className="relative flex items-center justify-center my-6">
              {/* Matches the Very Light Gray page background to create the cutout illusion */}
              <div className="absolute w-8 h-8 bg-[#F8F9FC] rounded-full -left-10 shadow-inner"></div>
              <div className="absolute w-8 h-8 bg-[#F8F9FC] rounded-full -right-10 shadow-inner"></div>
              <div className="w-full border-t-2 border-dashed border-gray-200"></div>
            </div>

            {/* QR Code & Order Details Row */}
            <div className="flex flex-row justify-between items-center mb-6">
              <div className="flex flex-col gap-4">
                <div>
                  <span className="text-[#667085] font-[700] uppercase tracking-widest text-[10px] block mb-1">
                    Ticket ID
                  </span>
                  <span className="font-mono font-[700] text-[#172033] bg-[#F8F9FC] border border-gray-100 px-2.5 py-1 rounded-md text-sm">
                    {bookingData.ticketNumber}
                  </span>
                </div>
                <div>
                  <span className="text-[#667085] font-[700] uppercase tracking-widest text-[10px] block mb-1">
                    Total Paid
                  </span>
                  <span className="font-[800] text-[#6C5CE7] text-xl">
                    ₹{bookingData.totalAmount}
                  </span>
                </div>
              </div>

              <div className="flex flex-col items-center bg-[#FFFFFF] p-2.5 rounded-xl border border-gray-200 shadow-sm">
                <img
                  src={bookingData.qrCode}
                  alt="QR Code"
                  className="w-24 h-24 rounded-lg mix-blend-multiply"
                />
                <span className="text-[9px] font-[700] text-[#667085] mt-2 uppercase tracking-[0.2em]">
                  Scan at Gate
                </span>
              </div>
            </div>

            {/* Seats Booked Section */}
            <div>
              <span className="text-[#667085] font-[700] uppercase tracking-widest text-[10px] block mb-2">
                Seats Booked
              </span>
              <div className="flex flex-wrap gap-2">
                {bookingData.seats.map((s, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 bg-[#6C5CE7]/10 border border-[#6C5CE7]/20 px-3 py-1.5 rounded-lg shadow-sm"
                  >
                    <div className="w-2 h-2 rounded-full bg-[#6C5CE7]"></div>
                    <span className="text-xs font-[700] text-[#172033]">
                      {s.seat.category.name}
                    </span>
                    <span className="text-xs font-[700] text-[#6C5CE7] border-l border-[#6C5CE7]/20 pl-2">
                      {s.seat.seatCode}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Footer Action */}
          <div className="p-6 pt-6">
            <Link
              to="/dashboard"
              className="group w-full flex items-center justify-center py-4 px-4 rounded-xl shadow-[0_8px_20px_rgba(108,92,231,0.25)] text-sm font-[700] text-[#FFFFFF] bg-[#6C5CE7] hover:bg-[#4834D4] transform transition-all duration-200 hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#6C5CE7]"
            >
              Access My Tickets
              <svg
                className="ml-2 w-4 h-4 transform transition-transform group-hover:translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                ></path>
              </svg>
            </Link>
          </div>
        </div>
      )}

      {/* ---------------- ERROR STATE ---------------- */}
      {status === "error" && (
        <div className="max-w-md w-full bg-[#FFFFFF] p-10 rounded-[2rem] border border-gray-100 shadow-sm text-center">
          <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-[#F04438]/10 mb-6">
            <svg
              className="h-10 w-10 text-[#F04438]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </div>
          <h2 className="text-2xl font-[800] text-[#172033]">
            Verification Failed
          </h2>
          <p className="mt-3 text-sm text-[#667085] font-[500] leading-relaxed">
            We couldn't verify your payment. If you were charged, please contact
            our support team immediately.
          </p>
          <div className="w-full mt-8 space-y-3">
            <Link
              to="/support"
              className="w-full flex justify-center py-3.5 px-4 rounded-xl text-sm font-[700] text-[#FFFFFF] bg-[#F04438] hover:bg-[#D92D20] shadow-[0_8px_20px_rgba(240,68,56,0.25)] transition-all"
            >
              Contact Support
            </Link>
            <Link
              to="/"
              className="w-full flex justify-center py-3.5 px-4 rounded-xl border border-gray-200 text-sm font-[700] text-[#172033] bg-[#FFFFFF] hover:bg-[#F8F9FC] transition-all"
            >
              Return to Home
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentSuccess;
