import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, Ticket, Crown, LayoutDashboard, ChevronDown, Search, Menu, X } from 'lucide-react';

interface NavbarProps {
  user: any;
}

const Navbar: React.FC<NavbarProps> = ({ user }) => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Sticky navbar scroll listener
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <header 
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/80 backdrop-blur-md border-b border-gray-100 py-4 shadow-sm' 
          : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 flex justify-between items-center font-sans">
        
        {/* Left: Logo */}
        <div className="flex flex-col z-50">
          <Link to="/" className="flex flex-col group">
            <div className="flex items-center gap-2 text-[#172033]">
              <svg className="w-8 h-8 text-[#6C5CE7]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18V5l12-2v13"/>
                <circle cx="6" cy="18" r="3"/>
                <circle cx="18" cy="16" r="3"/>
              </svg>
              <span className="font-[800] tracking-tight text-2xl md:text-3xl text-[#172033]">
                TuneTix
              </span>
            </div>
            <span className="text-[#00B4D8] text-xs font-[700] tracking-widest uppercase mt-[-2px]">
              Live Music Platform
            </span>
          </Link>
        </div>

        {/* Center: Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-8 text-[#667085] text-sm font-[600] uppercase tracking-wider mt-1">
          <Link to="/" className="hover:text-[#6C5CE7] transition-all">Home</Link>
          <Link to="/events" className="hover:text-[#6C5CE7] transition-all flex items-center gap-1">Events <ChevronDown className="w-4 h-4" /></Link>
          <Link to="/artists" className="hover:text-[#6C5CE7] transition-all">Artists</Link>
          <Link to="/venues" className="hover:text-[#6C5CE7] transition-all">Venues</Link>
          <Link to="/dashboard" className="hover:text-[#6C5CE7] transition-all">Tickets</Link>
          
        </nav>
        
        {/* Right: User Auth / Ticket Button & Mobile Toggle */}
        <div className="flex items-center gap-4 z-50 mt-1">
          <div className="hidden md:block">
            {user ? (
              <div className="relative group cursor-pointer">
                <button className="flex items-center gap-3 px-6 py-2.5 bg-white border border-gray-200 hover:border-[#6C5CE7] rounded-full text-[#172033] text-sm font-[700] uppercase tracking-wider transition-all shadow-sm">
                  <div className="w-7 h-7 rounded-full bg-[#F8F9FC] border border-gray-100 flex items-center justify-center text-xs text-[#6C5CE7] font-bold">
                    {user?.name?.charAt(0) || 'U'}
                  </div>
                  {user?.name || 'USER'}
                  <ChevronDown className="w-4 h-4 text-[#667085] group-hover:rotate-180 transition-transform duration-300" />
                </button>

                <div className="absolute right-0 top-full pt-4 w-64 opacity-0 invisible translate-y-2 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-300 ease-out">
                  <div className="bg-white rounded-[20px] shadow-[0_10px_40px_rgba(0,0,0,0.08)] border border-gray-100 overflow-hidden flex flex-col p-2 text-[#172033]">
                    <div className="px-4 py-3 border-b border-gray-50 mb-2 bg-[#F8F9FC] rounded-xl">
                      <p className="text-sm font-[700] truncate">{user?.name || 'USER'}</p>
                      <p className="text-xs text-[#667085] font-[500] truncate mt-0.5">{user?.email || 'user@example.com'}</p>
                      {user?.role === 'ADMIN' && (
                        <div className="inline-flex items-center gap-1 mt-2 px-2 py-1 bg-[#6C5CE7]/10 border border-[#6C5CE7]/20 rounded text-[10px] font-[800] text-[#6C5CE7] uppercase tracking-wider">
                          <Crown className="w-3 h-3" /> Admin
                        </div>
                      )}
                    </div>
                    <Link to="/dashboard" className="flex items-center gap-3 px-4 py-2.5 text-sm font-[600] text-[#667085] hover:text-[#172033] hover:bg-[#F8F9FC] rounded-xl transition-colors">
                      <Ticket className="w-4 h-4 text-[#00B4D8]" /> My Tickets
                    </Link>
                    {user?.role === 'ADMIN' && (
                      <Link to="/admin/dashboard" className="flex items-center gap-3 px-4 py-2.5 text-sm font-[600] text-[#667085] hover:text-[#172033] hover:bg-[#F8F9FC] rounded-xl transition-colors">
                        <LayoutDashboard className="w-4 h-4 text-[#6C5CE7]" /> Admin Dashboard
                      </Link>
                    )}
                    <div className="h-[1px] bg-gray-100 my-2"></div>
                    <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-2.5 text-sm font-[600] text-[#F04438] hover:bg-[#F04438]/10 rounded-xl transition-colors w-full text-left">
                      <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <Link 
                to="/login" 
                className="px-8 py-3 bg-[#6C5CE7] hover:bg-[#4834D4] rounded-full text-white text-sm font-[700] uppercase tracking-wider transition-all shadow-[0_8px_20px_rgba(108,92,231,0.25)] flex items-center gap-2"
              >
                Get Tickets
              </Link>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="lg:hidden text-[#172033] p-2 hover:bg-gray-100 rounded-full transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <div className={`lg:hidden fixed inset-0 bg-[#F8F9FC]/98 backdrop-blur-xl z-40 transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col items-center justify-center h-full gap-8 text-[#172033] text-lg font-[700] uppercase tracking-widest pt-20">
          <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-[#6C5CE7] transition-colors">Home</Link>
          <Link to="/events" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-[#6C5CE7] transition-colors">Events</Link>
          <Link to="/artists" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-[#6C5CE7] transition-colors">Artists</Link>
          <Link to="/venues" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-[#6C5CE7] transition-colors">Venues</Link>
          <Link to="/dashboard" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-[#6C5CE7] transition-colors">Tickets</Link>
          
          <div className="mt-8 flex flex-col items-center gap-4 w-full px-8">
            {user ? (
              <button onClick={handleLogout} className="w-full py-4 bg-white border border-gray-200 rounded-xl text-[#F04438] flex items-center justify-center gap-2 font-[600] shadow-sm">
                <LogOut className="w-5 h-5" /> Sign Out
              </button>
            ) : (
              <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="w-full py-4 bg-[#6C5CE7] rounded-xl text-white flex items-center justify-center gap-2 font-[700] tracking-widest uppercase shadow-[0_8px_20px_rgba(108,92,231,0.25)]">
                Get Tickets
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;