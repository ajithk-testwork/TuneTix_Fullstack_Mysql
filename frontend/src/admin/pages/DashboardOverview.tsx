import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  CalendarDays, 
  Users, 
  IndianRupee, 
  TrendingUp, 
  ArrowUpRight, 
  Ticket, 
  Activity, 
  AlertCircle,
  Loader2
} from 'lucide-react';
import { motion } from 'framer-motion';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';
import API from '../../api/adminAPI';

// --- Interfaces ---
interface DashboardStats {
  totalEvents: number;
  publishedEvents: number;
  totalCapacity: number;
  ticketsSold: number;
  totalBookings: number;
  totalRevenue: number;
}

interface EventPerformance {
  id: string;
  title: string;
  capacity: number;
  sold: number;
  revenue: number;
  date: string;
}

interface Booking {
  id: string;
  ticketNumber: string;
  customerName: string;
  customerEmail: string;
  amount: number;
  date: string;
  status: string;
}

interface ChartData {
  name: string;
  revenue?: number;
  bookings?: number;
}

const DashboardOverview = () => {
  const [isLoading, setIsLoading] = useState(true);
  
  // State for all dashboard sections
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [eventPerformance, setEventPerformance] = useState<EventPerformance[]>([]);
  const [recentBookings, setRecentBookings] = useState<Booking[]>([]);
  const [revenueData, setRevenueData] = useState<ChartData[]>([]);
  const [bookingData, setBookingData] = useState<ChartData[]>([]);

  // Fetch all dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        const headers = { Authorization: `Bearer ${localStorage.getItem("adminToken")}` };
        
        const response = await API.get('/admin/dashboard-stats', { headers }).catch(() => null);

        if (response && response.data) {
          const { data } = response.data;
          setStats(data.stats);
          setEventPerformance(data.performance);
          setRecentBookings(data.recentBookings);
          setRevenueData(data.revenueChart);
          setBookingData(data.bookingChart);
        } else {
          // FALLBACK MOCK DATA
          setStats({ totalEvents: 12, publishedEvents: 8, totalCapacity: 2500, ticketsSold: 1248, totalBookings: 345, totalRevenue: 842500 });
          setRevenueData([
            { name: 'Jan', revenue: 40000 }, { name: 'Feb', revenue: 65000 }, { name: 'Mar', revenue: 120000 },
            { name: 'Apr', revenue: 180000 }, { name: 'May', revenue: 240000 }, { name: 'Jun', revenue: 450000 }
          ]);
          setBookingData([
            { name: 'Mon', bookings: 12 }, { name: 'Tue', bookings: 25 }, { name: 'Wed', bookings: 18 },
            { name: 'Thu', bookings: 40 }, { name: 'Fri', bookings: 85 }, { name: 'Sat', bookings: 120 }, { name: 'Sun', bookings: 45 }
          ]);
          setEventPerformance([
            { id: '1', title: 'Vijay Antony Live', capacity: 500, sold: 320, revenue: 450000, date: '2026-09-30' },
            { id: '2', title: 'Music Festival', capacity: 1000, sold: 780, revenue: 780000, date: '2026-10-05' },
            { id: '3', title: 'Tech Conference', capacity: 300, sold: 295, revenue: 442500, date: '2026-11-12' },
            { id: '4', title: 'Comedy Night', capacity: 250, sold: 230, revenue: 120000, date: '2026-12-01' },
          ]);
          setRecentBookings([
            { id: '1', ticketNumber: 'EVT-2026-001', customerName: 'Prasanth', customerEmail: 'prasanth@example.com', amount: 9463, date: '2026-09-11', status: 'CONFIRMED' },
            { id: '2', ticketNumber: 'EVT-2026-002', customerName: 'Rahul', customerEmail: 'rahul@example.com', amount: 4000, date: '2026-09-11', status: 'CONFIRMED' },
            { id: '3', ticketNumber: 'EVT-2026-003', customerName: 'Anitha', customerEmail: 'anitha@example.com', amount: 2000, date: '2026-09-10', status: 'PENDING' },
            { id: '4', ticketNumber: 'EVT-2026-004', customerName: 'Karthik', customerEmail: 'karthik@example.com', amount: 3500, date: '2026-09-09', status: 'CONFIRMED' },
          ]);
        }
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (isLoading || !stats) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#F8F9FC]">
        <Loader2 className="w-8 h-8 animate-spin text-[#6C5CE7]" />
      </div>
    );
  }

  // --- Derived Data ---
  // Helper to determine status based on sales percentage
  const getEventStatus = (sold: number, capacity: number) => {
    if (capacity === 0) return { label: 'N/A', color: 'bg-gray-100 text-gray-700' };
    const percentage = (sold / capacity) * 100;
    if (percentage >= 100) return { label: 'Sold Out', color: 'bg-red-100 text-red-700' };
    if (percentage >= 80) return { label: 'Selling Fast', color: 'bg-amber-100 text-amber-700' };
    return { label: 'Available', color: 'bg-green-100 text-green-700' };
  };

  // Filter events that are nearly sold out (between 80% and 99% sold)
  const almostSoldOutEvents = [...eventPerformance]
    .map(evt => ({ ...evt, percentage: Math.round((evt.sold / evt.capacity) * 100) }))
    .filter(evt => evt.percentage >= 80 && evt.percentage < 100)
    .sort((a, b) => b.percentage - a.percentage);

  // --- Animation Variants ---
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-7xl mx-auto pb-24 font-sans space-y-6"
    >
      {/* Header */}
      <div className="flex justify-between items-end mb-2">
        <div>
          <h2 className="text-3xl font-[800] text-gray-900 tracking-tight">Dashboard</h2>
          <p className="text-sm text-gray-500 mt-1 font-medium">Welcome back, here's what's happening today.</p>
        </div>
        <button className="px-5 py-2.5 bg-[#172033] hover:bg-[#2c3954] text-white text-sm font-semibold rounded-xl transition-colors shadow-sm flex items-center gap-2">
          Download Report
        </button>
      </div>
      
      {/* =========================================
          ROW 1: STATS METRIC CARDS (4 Columns)
      ========================================= */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-[0_2px_10px_rgb(0,0,0,0.02)]">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Total Events</p>
              <h3 className="text-2xl font-[800] text-gray-900">{stats.totalEvents}</h3>
            </div>
            <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl"><CalendarDays size={20} /></div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-[0_2px_10px_rgb(0,0,0,0.02)]">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Tickets Sold</p>
              <h3 className="text-2xl font-[800] text-gray-900">{stats.ticketsSold.toLocaleString()} <span className="text-base text-gray-400 font-medium">/ {stats.totalCapacity.toLocaleString()}</span></h3>
            </div>
            <div className="p-3 bg-[#6C5CE7]/10 text-[#6C5CE7] rounded-2xl"><Ticket size={20} /></div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-[0_2px_10px_rgb(0,0,0,0.02)]">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Total Bookings</p>
              <h3 className="text-2xl font-[800] text-gray-900">{stats.totalBookings.toLocaleString()}</h3>
            </div>
            <div className="p-3 bg-teal-50 text-teal-600 rounded-2xl"><Users size={20} /></div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-[0_2px_10px_rgb(0,0,0,0.02)]">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Revenue</p>
              <h3 className="text-2xl font-[800] text-gray-900">₹{stats.totalRevenue.toLocaleString()}</h3>
            </div>
            <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl"><IndianRupee size={20} /></div>
          </div>
        </div>
      </motion.div>

      {/* =========================================
          ROW 2: CHARTS SECTION (2 Columns)
      ========================================= */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Revenue Area Chart */}
        <div className="bg-[#172033] rounded-3xl p-6 shadow-lg relative overflow-hidden flex flex-col h-[340px]">
          <div className="relative z-10 mb-6 flex justify-between items-center">
            <h3 className="text-white font-bold text-lg">Revenue Overview</h3>
            <Activity className="text-[#6C5CE7] opacity-50 w-6 h-6" />
          </div>
          <div className="flex-1 w-full relative z-10">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6C5CE7" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#6C5CE7" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#2c3954" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `₹${val/1000}k`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px', color: '#fff' }}
                  itemStyle={{ color: '#fff', fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#6C5CE7" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Weekly Bookings Bar Chart */}
        <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-[0_2px_10px_rgb(0,0,0,0.02)] flex flex-col h-[340px]">
          <div className="mb-6 flex justify-between items-center">
            <h3 className="text-gray-900 font-bold text-lg">Booking Overview</h3>
            <div className="p-2 bg-gray-50 rounded-xl"><Ticket className="text-gray-400 w-5 h-5" /></div>
          </div>
          <div className="flex-1 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={bookingData} margin={{ top: 10, right: 0, left: -30, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px' }}
                />
                <Bar dataKey="bookings" fill="#172033" radius={[4, 4, 0, 0]} barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </motion.div>

      {/* =========================================
          ROW 3: EVENT PERFORMANCE TABLE (1 Column)
      ========================================= */}
      <motion.div variants={itemVariants} className="bg-white rounded-3xl border border-gray-100 shadow-[0_2px_10px_rgb(0,0,0,0.02)] overflow-hidden">
        <div className="px-6 py-6 flex justify-between items-center border-b border-gray-50">
          <h3 className="text-lg font-bold text-gray-900">Event Performance</h3>
          <Link to="/admin/manage-events" className="text-sm font-bold text-[#6C5CE7] hover:text-[#5a4bcf] flex items-center gap-1 transition-colors">
            View All <ArrowUpRight size={16} />
          </Link>
        </div>
        
        <div className="overflow-x-auto p-2">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="text-gray-400 font-bold text-xs uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Event</th>
                <th className="px-6 py-4">Sold</th>
                <th className="px-6 py-4">Revenue</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {eventPerformance.map((evt) => {
                const statusInfo = getEventStatus(evt.sold, evt.capacity);
                return (
                  <tr key={evt.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 font-bold text-gray-900">{evt.title}</td>
                    <td className="px-6 py-4 text-gray-900 font-bold">
                      {evt.sold}<span className="text-gray-400 font-medium">/{evt.capacity}</span>
                    </td>
                    <td className="px-6 py-4 font-[800] text-gray-900">₹{evt.revenue.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider ${statusInfo.color}`}>
                        {statusInfo.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* =========================================
          ROW 4: RECENT BOOKINGS & ALMOST SOLD OUT (2 Columns)
      ========================================= */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Recent Bookings List */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_2px_10px_rgb(0,0,0,0.02)] overflow-hidden flex flex-col">
          <div className="px-6 py-6 border-b border-gray-50">
            <h3 className="text-lg font-bold text-gray-900">Recent Bookings</h3>
          </div>
          
          <div className="overflow-x-auto p-2">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <tbody className="divide-y divide-gray-50">
                {recentBookings.slice(0, 4).map((booking) => (
                  <tr key={booking.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-bold text-gray-900">{booking.customerName}</p>
                    </td>
                    <td className="px-6 py-4 font-[800] text-gray-900">
                      ₹{booking.amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className={`inline-flex items-center px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
                        booking.status === 'CONFIRMED' ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'
                      }`}>
                        {booking.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Almost Sold Out List */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_2px_10px_rgb(0,0,0,0.02)] p-6">
          <div className="flex items-center gap-2 mb-6">
            <AlertCircle className="w-5 h-5 text-amber-500" />
            <h3 className="text-lg font-bold text-gray-900">Almost Sold Out</h3>
          </div>
          
          {almostSoldOutEvents.length === 0 ? (
            <div className="text-center py-8 text-sm text-gray-500 font-medium bg-gray-50 rounded-2xl border border-dashed border-gray-200">
              No events are currently near capacity.
            </div>
          ) : (
            <div className="space-y-5">
              {almostSoldOutEvents.map((evt) => (
                <div key={evt.id} className="flex flex-col gap-2">
                  <div className="flex justify-between items-end">
                    <h4 className="font-bold text-gray-900">{evt.title}</h4>
                    <span className="font-[800] text-[#172033]">{evt.percentage}%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      whileInView={{ width: `${evt.percentage}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className="bg-amber-400 h-full rounded-full" 
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </motion.div>
    </motion.div>
  );
};

export default DashboardOverview;