import { useState, useEffect } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  CalendarPlus,
  List,
  LogOut,
  Settings,
  Bell,
  Globe, // Imported Globe icon for the new menu item
} from "lucide-react";

const AdminLayout = () => {
  const location = useLocation();

  // State to hold the admin's dynamic details
  const [adminName, setAdminName] = useState("Admin User");
  const [adminEmail, setAdminEmail] = useState("admin@events.com");

  // Fetch admin details from localStorage when the layout loads
  useEffect(() => {
    const storedDetails = localStorage.getItem("adminDetails");
    if (storedDetails) {
      try {
        const parsedDetails = JSON.parse(storedDetails);
        // Adjust '.name' and '.email' based on what your backend actually sends in the user object
        setAdminName(
          parsedDetails.name || parsedDetails.username || "Admin User",
        );
        setAdminEmail(parsedDetails.email || "admin@events.com");
      } catch (error) {
        console.error("Failed to parse admin details from local storage.");
      }
    }
  }, []);

  // Helper function to check if the link is active
  const isActive = (path: string) => location.pathname === path;

  // Logout Handler
  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminRole");
    localStorage.removeItem("adminDetails");
    // Force a reload and send back to the admin root (which will trigger the login popup)
    window.location.href = "/admin";
  };

  return (
    <div className="flex h-screen bg-[#F8FAFC]">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col shadow-sm">
        <div className="h-16 flex items-center px-6 border-b border-gray-100">
          <div className="flex items-center gap-2">
           
            <svg className="w-8 h-8 text-[#6C5CE7]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18V5l12-2v13"/>
                <circle cx="6" cy="18" r="3"/>
                <circle cx="18" cy="16" r="3"/>
              </svg>
            <span className="text-xl font-bold text-gray-800 tracking-tight">
              TuneTix_Dashboard
            </span>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          <p className="px-2 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
            Menu
          </p>

          <Link
            to="/admin"
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
              isActive("/admin")
                ? "bg-blue-50 text-blue-700 font-medium"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            }`}
          >
            <LayoutDashboard
              size={20}
              className={isActive("/admin") ? "text-blue-600" : "text-gray-400"}
            />
            Dashboard
          </Link>

          <Link
            to="/admin/create-event"
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
              isActive("/admin/create-event")
                ? "bg-blue-50 text-blue-700 font-medium"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            }`}
          >
            <CalendarPlus
              size={20}
              className={
                isActive("/admin/create-event")
                  ? "text-blue-600"
                  : "text-gray-400"
              }
            />
            Create Event
          </Link>

          <Link
            to="/admin/manage-events"
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
              isActive("/admin/manage-events")
                ? "bg-blue-50 text-blue-700 font-medium"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            }`}
          >
            <List
              size={20}
              className={
                isActive("/admin/manage-events")
                  ? "text-blue-600"
                  : "text-gray-400"
              }
            />
            Manage Events
          </Link>

          {/* NEW: Published Events Link */}
          <Link
            to="/admin/published-events"
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
              isActive("/admin/published-events")
                ? "bg-blue-50 text-blue-700 font-medium"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            }`}
          >
            <Globe
              size={20}
              className={
                isActive("/admin/published-events")
                  ? "text-blue-600"
                  : "text-gray-400"
              }
            />
            Published Events
          </Link>
          
        </nav>

        {/* User Profile & Logout Bottom Section */}
        <div className="p-4 border-t border-gray-100">
          <div className="flex items-center gap-3 px-3 py-3 mb-2 rounded-lg bg-gray-50 border border-gray-200">
            <div className="w-9 h-9 rounded-full bg-gray-300 overflow-hidden flex-shrink-0">
              {/* Dynamically generate avatar based on the admin's name */}
              <img
                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(adminName)}&background=0D8ABC&color=fff`}
                alt={adminName}
              />
            </div>
            <div className="flex-1 min-w-0">
              {/* Display Dynamic Name and Email */}
              <p
                className="text-sm font-medium text-gray-900 truncate"
                title={adminName}
              >
                {adminName}
              </p>
              <p className="text-xs text-gray-500 truncate" title={adminEmail}>
                {adminEmail}
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 w-full px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 z-10">
          <h1 className="text-lg font-semibold text-gray-800">Overview</h1>
          <div className="flex items-center gap-4">
            <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors relative">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
            </button>
            <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
              <Settings size={20} />
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;