import { useState, useEffect } from "react";
import { Routes, Route, Outlet, useLocation } from "react-router-dom"; // <-- Added useLocation
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// User Pages
import Register from "./pages/Auth/Register";
import Login from "./pages/Auth/Login";
import Home from "./pages/Home";
import EventDetails from "./pages/EventDetails";
import SeatSelection from "./pages/SeatSelection";
import PaymentSuccess from "./pages/PaymentSuccess";
import Dashboard from "./pages/Dashboard";
import TicketDetails from "./pages/TicketDetails";
import Artists from "./pages/Artists";
import Venues from "./pages/Venues";
import Events from "./pages/Events";

// Admin Pages
import AdminLayout from "./admin/AdminLayout";
import DashboardOverview from "./admin/pages/DashboardOverview";
import AdminProtectedRoute from "./admin/AdminProtectedRoute";
import CreateEvent from "./admin/pages/CreateEvent";
import ManageEvents from "./admin/pages/ManageEvents";
import AdminEventDetails from "./admin/pages/AdminEventDetails";
import PublishedEvents from "./admin/pages/PublishedEvents";
import VerifyEmail from "./pages/Auth/VerifyEmail";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import ResetPassword from "./pages/Auth/ResetPassword";
import AdminLogin from "./admin/pages/Auth/AdminLogin";
import AdminForgotPassword from "./admin/pages/Auth/AdminForgotPassword";
import AdminResetPassword from "./admin/pages/Auth/AdminResetPassword";

const UserLayout = ({ user }: { user: any }) => {
  return (
    <>
      <Navbar user={user} />
      <div className="min-h-screen">
        <Outlet />
      </div>
      <Footer />
    </>
  );
};

const BlankLayout = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center">
      <Outlet />
    </div>
  );
};

function App() {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user") || "null"),
  );

  const location = useLocation();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user") || "null");
    setUser(storedUser);
  }, [location.pathname]);
  return (
    <div className="min-h-screen bg-[#F8F9FC] font-sans">
      <Routes>
        // USER ROUTES (Has Navbar & Footer)
        <Route element={<UserLayout user={user} />}>
          <Route path="/" element={<Home />} />
          <Route path="/artists" element={<Artists />} />
          <Route path="/venues" element={<Venues />} />
          <Route path="/events" element={<Events />} />
          <Route path="/event/:id" element={<EventDetails />} />

          <Route
            path="*"
            element={
              <h1 className="text-center pt-40 font-bold text-2xl">
                404 Page Not Found
              </h1>
            }
          />
        </Route>
        // AUTH ROUTES (NO Navbar, NO Footer)
        <Route element={<BlankLayout />}>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/payment-success" element={<PaymentSuccess />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/ticket/:id" element={<TicketDetails />} />
          <Route path="/event/:id/book" element={<SeatSelection />} />
        </Route>




        // Admin Login


        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/forgot-password" element={<AdminForgotPassword />} />
        <Route path="/admin/reset-password" element={<AdminResetPassword />} />




       
          //  ADMIN ROUTES (NO Navbar, NO Footer) 
    
        <Route
          path="/admin"
          element={
            <AdminProtectedRoute>
              <AdminLayout />
            </AdminProtectedRoute>
          }
        >
          <Route index element={<DashboardOverview />} />
          <Route path="create-event" element={<CreateEvent />} />
          <Route path="manage-events" element={<ManageEvents />} />
          <Route path="events/:id" element={<AdminEventDetails />} />
          <Route path="published-events" element={<PublishedEvents />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
