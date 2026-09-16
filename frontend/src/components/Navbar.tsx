import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, Ticket, Crown, LayoutDashboard, ChevronDown, Menu, X } from 'lucide-react';

interface NavbarProps {
  user: any;
}

const Navbar: React.FC<NavbarProps> = ({ user }) => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

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
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
        isScrolled 
          ? 'bg-[#020617]/80 backdrop-blur-2xl border-b border-white/5 shadow-[0_10px_30px_rgba(0,0,0,0.5)] py-4' 
          : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 flex justify-between items-center font-sans">
        
        {/* Logo */}
        <div className="flex flex-col z-50">
          <Link to="/" className="flex flex-col group">
            <div className="flex items-center gap-2 text-[#F8FAFC]">
              <svg className="w-8 h-8 text-[#6C5CE7] drop-shadow-[0_0_12px_rgba(108,92,231,0.8)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18V5l12-2v13"/>
                <circle cx="6" cy="18" r="3"/>
                <circle cx="18" cy="16" r="3"/>
              </svg>
              <span className="font-[900] tracking-tight text-2xl md:text-3xl text-[#F8FAFC]">
                TuneTix
              </span>
            </div>
            <span className="text-[#00B4D8] text-[10px] font-[800] tracking-[0.2em] uppercase mt-[-2px] drop-shadow-[0_0_8px_rgba(0,180,216,0.5)]">
              Live Music Platform
            </span>
          </Link>
        </div>

        {/* Desktop Links */}
        <nav className="hidden lg:flex items-center gap-8 text-[#94A3B8] text-sm font-[700] uppercase tracking-wider mt-1">
          <Link to="/" className="hover:text-white transition-colors">Home</Link>
          <Link to="/events" className="hover:text-white transition-colors flex items-center gap-1 group">
            Events <ChevronDown className="w-4 h-4 group-hover:text-[#6C5CE7] transition-colors" />
          </Link>
          <Link to="/artists" className="hover:text-white transition-colors">Artists</Link>
          <Link to="/venues" className="hover:text-white transition-colors">Venues</Link>
          <Link to="/dashboard" className="hover:text-white transition-colors">Tickets</Link>
        </nav>
        
        {/* Right Section */}
        <div className="flex items-center gap-4 z-50 mt-1">
          <div className="hidden md:block">
            {user ? (
              <div className="relative group cursor-pointer">
                <button className="flex items-center gap-3 px-5 py-2 bg-white/5 hover:bg-white/10 backdrop-blur-md border border-white/10 rounded-full text-white text-sm font-[700] uppercase tracking-wider transition-all">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#6C5CE7] to-[#00B4D8] flex items-center justify-center text-xs text-white font-bold shadow-inner">
                    {user?.name?.charAt(0) || 'U'}
                  </div>
                  {user?.name || 'USER'}
                  <ChevronDown className="w-4 h-4 text-[#94A3B8] group-hover:rotate-180 transition-all duration-300" />
                </button>

                {/* Dropdown Menu */}
                <div className="absolute right-0 top-full pt-4 w-64 opacity-0 invisible translate-y-2 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-300 ease-out">
                  <div className="bg-[#0F172A]/95 backdrop-blur-2xl rounded-[20px] shadow-[0_20px_50px_rgba(0,0,0,0.8)] border border-white/10 overflow-hidden flex flex-col p-2 text-white">
                    <div className="px-4 py-3 border-b border-white/5 mb-2 bg-white/5 rounded-xl">
                      <p className="text-sm font-[700] truncate">{user?.name || 'USER'}</p>
                      <p className="text-xs text-[#94A3B8] font-[500] truncate mt-0.5">{user?.email || 'user@example.com'}</p>
                      {user?.role === 'ADMIN' && (
                        <div className="inline-flex items-center gap-1 mt-2 px-2 py-1 bg-[#6C5CE7]/20 rounded text-[10px] font-[800] text-[#6C5CE7] uppercase tracking-wider">
                          <Crown className="w-3 h-3" /> Admin
                        </div>
                      )}
                    </div>
                    <Link to="/dashboard" className="flex items-center gap-3 px-4 py-2.5 text-sm font-[600] text-[#94A3B8] hover:text-white hover:bg-white/5 rounded-xl transition-colors">
                      <Ticket className="w-4 h-4 text-[#00B4D8]" /> My Tickets
                    </Link>
                    {user?.role === 'ADMIN' && (
                      <Link to="/admin/dashboard" className="flex items-center gap-3 px-4 py-2.5 text-sm font-[600] text-[#94A3B8] hover:text-white hover:bg-white/5 rounded-xl transition-colors">
                        <LayoutDashboard className="w-4 h-4 text-[#6C5CE7]" /> Admin Dashboard
                      </Link>
                    )}
                    <div className="h-[1px] bg-white/5 my-2"></div>
                    <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-2.5 text-sm font-[600] text-[#F43F5E] hover:bg-[#F43F5E]/10 rounded-xl transition-colors w-full text-left">
                      <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <Link 
                to="/login" 
                className="px-8 py-3 bg-gradient-to-r from-[#6C5CE7] to-[#8B78FF] hover:from-[#5A4BCF] hover:to-[#6C5CE7] rounded-full text-white text-sm font-[800] uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(108,92,231,0.4)] hover:shadow-[0_0_30px_rgba(108,92,231,0.6)]"
              >
                Get Tickets
              </Link>
            )}
          </div>

          <button 
            className="lg:hidden text-white p-2 hover:bg-white/10 rounded-full transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`lg:hidden fixed inset-0 bg-[#020617]/98 backdrop-blur-3xl z-40 transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col items-center justify-center h-full gap-8 text-white text-lg font-[800] uppercase tracking-widest pt-20">
          <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-[#6C5CE7] transition-all">Home</Link>
          <Link to="/events" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-[#6C5CE7] transition-all">Events</Link>
          <Link to="/artists" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-[#6C5CE7] transition-all">Artists</Link>
          <Link to="/venues" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-[#6C5CE7] transition-all">Venues</Link>
          <Link to="/dashboard" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-[#6C5CE7] transition-all">Tickets</Link>
          
          <div className="mt-8 flex flex-col items-center gap-4 w-full px-8">
            {user ? (
              <button onClick={handleLogout} className="w-full py-4 bg-white/5 border border-white/10 rounded-xl text-[#F43F5E] flex items-center justify-center gap-2 font-[700]">
                <LogOut className="w-5 h-5" /> Sign Out
              </button>
            ) : (
              <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="w-full py-4 bg-[#6C5CE7] rounded-xl text-white flex items-center justify-center gap-2 font-[800] tracking-widest uppercase">
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