
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { User, Menu, X, LayoutDashboard } from 'lucide-react';
import { useApp } from '../store/AppContext';

export const PublicNavbar: React.FC = () => {
  const { currentUser } = useApp();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll effect for premium glass look
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Investment Plans', path: '/public-plans' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${
        scrolled 
          ? 'bg-[#0b0e14]/90 backdrop-blur-2xl py-3 border-white/10 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.5)]' 
          : 'bg-transparent py-5 border-white/5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        
        {/* Left: Branding */}
        <div className="flex items-center">
          <Link to="/" className="group transition-transform active:scale-95">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center font-bold text-xl text-white shadow-[0_0_20px_rgba(37,99,235,0.4)] group-hover:shadow-[0_0_25px_rgba(37,99,235,0.6)] transition-all">
              C
            </div>
          </Link>
        </div>

        {/* Center: Desktop Navigation Only */}
        <div className="hidden md:flex flex-1 justify-center">
          <div className="flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`text-xs font-bold uppercase tracking-[0.15em] transition-all hover:text-white ${
                  isActive(link.path) ? 'text-blue-500' : 'text-gray-400'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Right: Actions & Menu Toggle */}
        <div className="flex items-center gap-3">
          
          {/* Action Button (Login or Dashboard) */}
          {currentUser ? (
            <Link 
              to="/dashboard" 
              className="bg-blue-600 hover:bg-blue-700 md:px-8 px-4 md:py-3 py-2.5 rounded-xl md:rounded-2xl font-bold text-xs md:text-sm transition-all shadow-xl shadow-blue-900/30 flex items-center gap-2"
            >
              <LayoutDashboard className="w-4 h-4 md:w-5 md:h-5" />
              <span className="hidden sm:inline">Portal Access</span>
              <span className="sm:hidden">Dashboard</span>
            </Link>
          ) : (
            <Link 
              to="/login" 
              className="bg-blue-600 border border-blue-400/30 md:px-8 px-5 md:py-3 py-2.5 rounded-xl md:rounded-2xl font-bold text-xs md:text-sm text-white flex items-center gap-2 shadow-lg shadow-blue-600/20 active:scale-95 transition-all"
            >
              <User className="w-4 h-4" />
              Login
            </Link>
          )}

          {/* Hamburger Menu Icon - Mobile Only */}
          <button 
            className="text-gray-300 hover:text-white p-2 transition-colors md:hidden border border-white/5 bg-white/5 rounded-xl"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle navigation"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Desktop Register Button (If not logged in) */}
          {!currentUser && (
            <Link 
              to="/register" 
              className="hidden md:block bg-white/5 hover:bg-white/10 px-8 py-3 rounded-2xl font-bold text-sm transition-all border border-white/10"
            >
              Get Started
            </Link>
          )}
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-[#0e121a]/95 backdrop-blur-3xl border-b border-white/5 p-8 flex flex-col gap-6 animate-in slide-in-from-top-4 duration-300 shadow-2xl">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              onClick={() => setIsOpen(false)}
              className={`text-xl font-bold tracking-tight flex items-center justify-between ${
                isActive(link.path) ? 'text-blue-500' : 'text-gray-400 hover:text-white'
              }`}
            >
              {link.name}
              <div className={`w-1.5 h-1.5 rounded-full bg-blue-500 transition-opacity ${isActive(link.path) ? 'opacity-100' : 'opacity-0'}`} />
            </Link>
          ))}
          {!currentUser && (
            <Link 
              to="/register" 
              onClick={() => setIsOpen(false)}
              className="mt-4 w-full py-4 bg-white/5 hover:bg-white/10 border border-white/5 rounded-2xl text-center font-bold text-white transition-all"
            >
              Register Now
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};
