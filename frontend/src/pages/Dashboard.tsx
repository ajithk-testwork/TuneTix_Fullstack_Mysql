import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/userAPI";

// Reusing interfaces from your booking structure
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

        // Adjust this endpoint to match your backend route for fetching a user's bookings
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

  // Filter bookings based on the active tab
  // Assuming upcoming means the event date is in the future
  const currentDate = new Date();
  const displayedBookings = bookings.filter((booking) => {
    const eventDate = new Date(booking.event.date);
    return activeTab === "upcoming"
      ? eventDate >= currentDate
      : eventDate < currentDate;
  });

  return (
    <div className="min-h-screen bg-[#F8F9FC] font-sans pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Navigation / Header Section */}
        <div className="mb-8">
          {/* Back to Home Button */}
          <Link 
            to="/" 
            className="inline-flex items-center text-sm font-[700] text-[#667085] hover:text-[#6C5CE7] transition-colors mb-6"
          >
            <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7"></path>
            </svg>
            Back to Home
          </Link>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-[800] text-[#172033] tracking-tight">
                My Tickets
              </h1>
              <p className="text-[#667085] font-[500] mt-2 text-sm md:text-base">
                Manage your event bookings and access your digital passes.
              </p>
            </div>

            {/* Tabs */}
            <div className="flex bg-[#FFFFFF] border border-gray-200 p-1 rounded-xl w-full md:w-auto shadow-sm">
              <button
                onClick={() => setActiveTab("upcoming")}
                className={`flex-1 md:flex-none px-6 py-2.5 text-sm font-[700] rounded-lg transition-all ${
                  activeTab === "upcoming"
                    ? "bg-[#F8F9FC] text-[#6C5CE7] shadow-sm border border-gray-100"
                    : "text-[#667085] hover:text-[#172033]"
                }`}
              >
                Upcoming
              </button>
              <button
                onClick={() => setActiveTab("past")}
                className={`flex-1 md:flex-none px-6 py-2.5 text-sm font-[700] rounded-lg transition-all ${
                  activeTab === "past"
                    ? "bg-[#F8F9FC] text-[#6C5CE7] shadow-sm border border-gray-100"
                    : "text-[#667085] hover:text-[#172033]"
                }`}
              >
                Past Events
              </button>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <div className="w-12 h-12 border-4 border-[#6C5CE7]/20 border-t-[#6C5CE7] rounded-full animate-spin"></div>
            <p className="text-[#667085] font-[500]">Loading your tickets...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-[#F04438]/10 border border-[#F04438]/20 text-[#F04438] p-6 rounded-xl text-center shadow-sm">
            <p className="font-[700]">{error}</p>
          </div>
        )}

        {/* Tickets Grid */}
        {!loading && !error && displayedBookings.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedBookings.map((booking) => (
              <div
                key={booking.id}
                className="bg-[#FFFFFF] rounded-2xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_60px_-15px_rgba(108,92,231,0.15)] hover:border-[#6C5CE7]/30 transition-all duration-300 border border-gray-100 flex flex-col"
              >
                {/* Event Image */}
                <div className="relative h-48 w-full bg-[#F8F9FC] overflow-hidden group">
                  {booking.event.image ? (
                    <img
                      src={booking.event.image}
                      alt={booking.event.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-tr from-[#6C5CE7] to-[#00B4D8]"></div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

                  {/* Date Badge */}
                  <div className="absolute top-4 left-4 bg-[#FFFFFF]/95 backdrop-blur-sm rounded-lg text-center px-3 py-1 shadow-sm">
                    <span className="block text-xs font-[700] text-[#667085] uppercase">
                      {new Date(booking.event.date).toLocaleDateString(
                        undefined,
                        { month: "short" },
                      )}
                    </span>
                    <span className="block text-lg font-[800] text-[#6C5CE7] leading-tight">
                      {new Date(booking.event.date).toLocaleDateString(
                        undefined,
                        { day: "2-digit" },
                      )}
                    </span>
                  </div>
                </div>

                {/* Ticket Details */}
                <div className="p-5 flex-1 flex flex-col">
                  <div className="mb-4 flex-1">
                    <h3 className="text-lg font-[800] text-[#172033] leading-tight mb-1 line-clamp-2">
                      {booking.event.title}
                    </h3>
                    <p className="text-sm text-[#667085] font-[500]">
                      {booking.event.venue}, {booking.event.location}
                    </p>
                  </div>

                  <div className="flex items-center justify-between border-t border-gray-100 pt-4 mb-4">
                    <div>
                      <p className="text-[10px] text-[#667085] font-[700] uppercase tracking-wider">
                        Ticket ID
                      </p>
                      <p className="text-sm font-mono font-[700] text-[#172033]">
                        {booking.ticketNumber}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-[#667085] font-[700] uppercase tracking-wider">
                        Status
                      </p>
                      <span
                        className={`text-xs font-[700] px-2 py-0.5 rounded uppercase tracking-wide ${
                          booking.bookingStatus === "CONFIRMED"
                            ? "bg-[#12B76A]/10 text-[#12B76A]"
                            : "bg-[#00B4D8]/10 text-[#00B4D8]"
                        }`}
                      >
                        {booking.bookingStatus}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3">
                    <Link
                      to={`/ticket/${booking.id}`} // Links to a detailed single ticket view
                      className="flex-1 text-center py-2.5 px-4 bg-[#6C5CE7] hover:bg-[#4834D4] text-[#FFFFFF] shadow-[0_4px_14px_rgba(108,92,231,0.25)] text-sm font-[700] rounded-lg transition-colors"
                    >
                      View Ticket
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && displayedBookings.length === 0 && (
          <div className="bg-[#FFFFFF] rounded-3xl p-12 text-center shadow-sm border border-gray-100 mt-4">
            <div className="w-24 h-24 bg-[#F8F9FC] border border-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-10 h-10 text-[#6C5CE7]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.5"
                  d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
                ></path>
              </svg>
            </div>
            <h3 className="text-xl font-[800] text-[#172033] mb-2">
              No tickets found
            </h3>
            <p className="text-[#667085] font-[500] mb-8 max-w-sm mx-auto">
              You don't have any {activeTab} bookings at the moment. Explore
              events and secure your spot!
            </p>
            <Link
              to="/events"
              className="inline-flex items-center justify-center px-8 py-3.5 border border-transparent text-sm font-[700] rounded-xl text-[#FFFFFF] bg-[#6C5CE7] hover:bg-[#4834D4] shadow-[0_8px_20px_rgba(108,92,231,0.25)] transition-all"
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