import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Clock,
  Loader2,
  CheckCircle2,
  Globe,
  TrendingUp,
  Ticket,
  CreditCard,
  UserCheck,
  AlertTriangle,
  X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import API from "../../api/adminAPI";

// --- Interfaces ---
interface Event {
  id: string;
  title: string;
  category: string;
  language: string;
  duration: number;
  location: string;
  venue: string;
  date: string;
  time: string;
  image: string;
  isPublished: boolean;
}

interface Statistics {
  totalTickets: number;
  soldTickets: number;
  availableTickets: number;
  bookingCount: number;
  totalBookings: number;
  revenue: number;
  isSoldOut: boolean;
}

interface CategoryStat {
  id: string;
  name: string;
  price: number;
  color: string;
  totalSeats: number;
  soldSeats: number;
  availableSeats: number;
  isSoldOut: boolean;
}

interface Booking {
  bookingId: string;
  ticketNumber: string;
  user: { name: string; email: string };
  totalAmount: number;
  paymentStatus: string;
  bookingStatus: string;
  checkedIn: boolean;
  createdAt: string;
}

const AdminEventDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // --- State ---
  const [event, setEvent] = useState<Event | null>(null);
  
  // Analytics States
  const [statistics, setStatistics] = useState<Statistics | null>(null);
  const [categoryStats, setCategoryStats] = useState<CategoryStat[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  
  // Custom Modal States
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);

  // --- Fetch Data ---
  const fetchEventData = async () => {
    try {
      setIsLoading(true);
      const headers = { Authorization: `Bearer ${localStorage.getItem("adminToken")}` };
      
      const eventRes = await API.get(`/event/${id}`, { headers });
      setEvent(eventRes.data.data);

      const adminDetailsRes = await API.get(`/admin/events/${id}/details`, { headers });
      
      if(adminDetailsRes.data?.data) {
        setStatistics(adminDetailsRes.data.data.statistics);
        setCategoryStats(adminDetailsRes.data.data.categoryStatistics);
        setBookings(adminDetailsRes.data.data.bookings || []);
      }

    } catch (error) {
      console.error("Failed to fetch event data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchEventData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // --- Handlers ---
  const triggerPublishToggle = () => {
    // Open the custom modal instead of window.confirm
    setShowConfirmModal(true);
  };

  const executePublishToggle = async () => {
    if (!event) return;
    try {
      setIsPublishing(true);
      const updatedStatus = !event.isPublished;
      
      await API.patch(
        `/events/${id}/${updatedStatus ? 'publish' : 'unpublish'}`,
        {},
        { headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` } }
      );
      
      setEvent({ ...event, isPublished: updatedStatus });
      setShowConfirmModal(false);
    } catch (error) {
      console.error("Failed to update publish status", error);
    } finally {
      setIsPublishing(false);
    }
  };

  const checkedInCount = bookings.filter(b => b.checkedIn).length;

  // --- Render Helpers ---
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#F8F9FC]">
        <Loader2 className="w-8 h-8 animate-spin text-[#6C5CE7]" />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Event not found.</p>
        <button onClick={() => navigate("/admin/manage-events")} className="text-[#6C5CE7] mt-4 underline">Go Back</button>
      </div>
    );
  }

  return (
    <div className="relative max-w-7xl mx-auto animate-in fade-in duration-500 pb-24 space-y-8 font-sans">
      
      {/* =========================================
          CUSTOM CONFIRMATION MODAL
      ========================================= */}
      <AnimatePresence>
        {showConfirmModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            {/* Backdrop with Glassmorphism */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowConfirmModal(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            
            {/* Modal Content */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 p-6"
            >
              <button 
                onClick={() => setShowConfirmModal(false)}
                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex flex-col items-center text-center mt-4 mb-6">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 ${event.isPublished ? 'bg-amber-50 text-amber-500' : 'bg-[#6C5CE7]/10 text-[#6C5CE7]'}`}>
                  {event.isPublished ? <AlertTriangle className="w-8 h-8" /> : <Globe className="w-8 h-8" />}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {event.isPublished ? "Unpublish Event?" : "Publish Event?"}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed px-4">
                  {event.isPublished 
                    ? "This event will be hidden from the public platform. Customers will no longer be able to discover or book tickets." 
                    : "This event will go live on the platform immediately. Customers will be able to view details and book tickets."}
                </p>
              </div>

              <div className="flex items-center gap-3 w-full">
                <button 
                  onClick={() => setShowConfirmModal(false)}
                  className="flex-1 px-4 py-3 rounded-xl font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={executePublishToggle}
                  disabled={isPublishing}
                  className={`flex-1 px-4 py-3 rounded-xl font-semibold text-white transition-colors flex items-center justify-center gap-2 shadow-lg ${
                    event.isPublished 
                      ? 'bg-red-500 hover:bg-red-600 shadow-red-500/20' 
                      : 'bg-[#6C5CE7] hover:bg-[#5a4bcf] shadow-[#6C5CE7]/20'
                  }`}
                >
                  {isPublishing ? <Loader2 className="w-5 h-5 animate-spin" /> : (event.isPublished ? "Yes, Unpublish" : "Yes, Publish")}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Event Dashboard</h2>
          <p className="text-sm text-gray-500 mt-1">Manage analytics, check-ins, and bookings.</p>
        </div>
      </div>

      {/* EVENT BANNER */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden flex flex-col md:flex-row">
        <div className="md:w-1/3 relative h-56 md:h-auto">
          <img src={event.image} alt={event.title} className="absolute inset-0 w-full h-full object-cover" />
        </div>
        <div className="p-6 md:p-8 flex-1 flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-4">
              <h3 className="text-2xl font-bold text-gray-900 leading-tight">{event.title}</h3>
              <span className={`shrink-0 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${
                event.isPublished ? "bg-green-50 border-green-200 text-green-700" : "bg-gray-50 border-gray-200 text-gray-700"
              }`}>
                {event.isPublished ? "Published" : "Draft"}
              </span>
            </div>
            
            <div className="flex flex-wrap gap-x-6 gap-y-3 text-sm text-gray-600 font-medium">
              <div className="flex items-center gap-2 bg-[#F8F9FC] px-4 py-2 rounded-xl border border-gray-100">
                <Calendar className="w-4 h-4 text-gray-400" />
                {new Date(event.date).toLocaleDateString()}
              </div>
              <div className="flex items-center gap-2 bg-[#F8F9FC] px-4 py-2 rounded-xl border border-gray-100">
                <Clock className="w-4 h-4 text-gray-400" />
                {event.time} ({event.duration} mins)
              </div>
              <div className="flex items-center gap-2 bg-[#F8F9FC] px-4 py-2 rounded-xl border border-gray-100">
                <MapPin className="w-4 h-4 text-gray-400" />
                {event.venue}, {event.location}
              </div>
            </div>
          </div>

          <div className="mt-8 flex items-center justify-between border-t border-gray-100 pt-6">
            <div>
              <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2"><Globe className="w-4 h-4 text-[#6C5CE7]" /> Visibility Status</h4>
              <p className="text-xs text-gray-500 mt-1">Make this event visible to customers on the main platform.</p>
            </div>
            <button
              onClick={triggerPublishToggle}
              className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors focus:outline-none ${
                event.isPublished ? 'bg-green-500' : 'bg-gray-300'
              }`}
            >
              <span className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform shadow-md ${event.isPublished ? 'translate-x-7' : 'translate-x-1'}`} />
            </button>
          </div>
        </div>
      </div>

      {/* ANALYTICS CARDS */}
      {statistics && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between group hover:shadow-md transition-all">
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center text-green-600 group-hover:scale-110 transition-transform">
                <TrendingUp className="w-6 h-6" />
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Total Revenue</p>
              <h3 className="text-3xl font-[800] text-gray-900 mt-1">₹{statistics.revenue.toLocaleString()}</h3>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between group hover:shadow-md transition-all">
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
                <Ticket className="w-6 h-6" />
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Tickets Sold</p>
              <h3 className="text-3xl font-[800] text-gray-900 mt-1">{statistics.soldTickets} <span className="text-lg text-gray-400 font-medium">/ {statistics.totalTickets}</span></h3>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between group hover:shadow-md transition-all">
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600 group-hover:scale-110 transition-transform">
                <CreditCard className="w-6 h-6" />
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Total Bookings</p>
              <h3 className="text-3xl font-[800] text-gray-900 mt-1">{statistics.bookingCount}</h3>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between group hover:shadow-md transition-all">
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 bg-teal-50 rounded-2xl flex items-center justify-center text-teal-600 group-hover:scale-110 transition-transform">
                <UserCheck className="w-6 h-6" />
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Checked In</p>
              <h3 className="text-3xl font-[800] text-gray-900 mt-1">{checkedInCount} <span className="text-lg text-gray-400 font-medium">/ {statistics.soldTickets}</span></h3>
            </div>
          </div>
        </div>
      )}

      {/* SINGLE COLUMN WRAPPER */}
      <div className="grid grid-cols-1 gap-8">
        
        {/* ENHANCED CATEGORY PROGRESS CARDS - RADIAL DESIGN */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 md:p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-xl font-bold text-gray-900 tracking-tight">Category Sales Insights</h3>
              <p className="text-sm text-gray-500 mt-1">Real-time breakdown of ticket performance</p>
            </div>
          </div>
          
          {categoryStats.length === 0 ? (
            <div className="text-center p-10 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
              <p className="text-sm text-gray-500 font-medium">No category data available.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {categoryStats.map((cat, index) => {
                const percentage = cat.totalSeats > 0 ? Math.round((cat.soldSeats / cat.totalSeats) * 100) : 0;
                
                return (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.4 }}
                    key={cat.id} 
                    className="relative p-6 rounded-2xl bg-white border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-lg transition-all flex items-center justify-between group overflow-hidden"
                  >
                    {/* Subtle gradient background accent */}
                    <div 
                      className="absolute inset-0 opacity-[0.03] transition-opacity group-hover:opacity-[0.06]"
                      style={{ background: `linear-gradient(135deg, transparent 40%, ${cat.color || '#6C5CE7'} 100%)` }}
                    />
                    
                    {/* Left Side: Details */}
                    <div className="relative z-10 flex flex-col justify-between h-full">
                      <div>
                        <div className="flex items-center gap-2 mb-1.5">
                          <span 
                            className="w-2.5 h-2.5 rounded-full shadow-sm"
                            style={{ backgroundColor: cat.color || '#6C5CE7' }}
                          />
                          <h4 className="font-bold text-gray-900 text-lg leading-none">{cat.name}</h4>
                        </div>
                        
                        <div className="inline-flex items-center px-2 py-1 rounded-md bg-gray-50 text-gray-600 text-xs font-bold border border-gray-100 mt-1">
                          ₹{cat.price}
                        </div>
                      </div>

                      <div className="flex items-baseline gap-1.5 mt-5">
                        <span className="text-3xl font-[800] text-gray-900 tracking-tight">{cat.soldSeats}</span>
                        <span className="text-sm font-medium text-gray-400">/ {cat.totalSeats} sold</span>
                      </div>
                    </div>

                    {/* Right Side: Animated Radial Progress */}
                    <div className="relative z-10 w-[84px] h-[84px] flex-shrink-0 flex items-center justify-center">
                      <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90 transform drop-shadow-sm">
                        {/* Background Ring */}
                        <path
                          className="text-gray-100"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3.5"
                        />
                        {/* Animated Progress Ring */}
                        <motion.path
                          initial={{ strokeDasharray: "0, 100" }}
                          whileInView={{ strokeDasharray: `${percentage}, 100` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke={cat.color || '#6C5CE7'}
                          strokeWidth="3.5"
                          strokeLinecap="round"
                        />
                      </svg>
                      {/* Center Text */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-sm font-bold text-gray-800">{percentage}%</span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>

        {/* CUSTOMER BOOKINGS TABLE */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 md:p-8 border-b border-gray-100">
            <h3 className="text-xl font-bold text-gray-900 tracking-tight">Recent Bookings & Check-ins</h3>
          </div>
          <div className="overflow-x-auto">
            {bookings.length === 0 ? (
              <div className="p-12 text-center text-gray-500 font-medium">No bookings have been made yet.</div>
            ) : (
              <table className="w-full text-sm text-left">
                <thead className="bg-[#F8F9FC] text-gray-500 font-[600] border-b border-gray-100 text-xs uppercase tracking-wider">
                  <tr>
                    <th className="px-8 py-5">Ticket ID</th>
                    <th className="px-8 py-5">Customer</th>
                    <th className="px-8 py-5">Date</th>
                    <th className="px-8 py-5 text-right">Amount</th>
                    <th className="px-8 py-5 text-center">Payment</th>
                    <th className="px-8 py-5 text-center">Check-In</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {bookings.slice(0, 15).map((booking) => (
                    <tr key={booking.bookingId} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-8 py-5 font-bold text-gray-900">#{booking.ticketNumber.slice(0,8)}</td>
                      <td className="px-8 py-5">
                        <p className="font-[600] text-gray-900">{booking.user.name}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{booking.user.email}</p>
                      </td>
                      <td className="px-8 py-5 text-gray-600 font-medium">
                        {new Date(booking.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-8 py-5 font-[800] text-gray-900 text-right">
                        ₹{booking.totalAmount.toLocaleString()}
                      </td>
                      <td className="px-8 py-5 text-center">
                        <span className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
                          booking.bookingStatus === 'CONFIRMED' 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {booking.bookingStatus}
                        </span>
                      </td>
                      <td className="px-8 py-5 text-center">
                        {booking.checkedIn ? (
                           <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-teal-50 text-teal-700 border border-teal-100 shadow-sm">
                             <CheckCircle2 className="w-4 h-4" /> Arrived
                           </span>
                        ) : (
                           <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-gray-100 text-gray-500 border border-gray-200">
                             Pending
                           </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminEventDetails;