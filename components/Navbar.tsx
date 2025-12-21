
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Zap, Menu, X } from 'lucide-react';
import { useApp } from '../store/AppContext';

export const PublicNavbar: React.FC = () => {
  const { currentUser } = useApp();
  const location = useLocation();
  const [isOpen, setIsOpen] = React.useState(false);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Plans', path: '/public-plans' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0b0e14]/80 backdrop-blur-xl border-b border-white/5">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-xl text-white shadow-lg shadow-blue-900/20">C</div>
          <span className="text-xl font-bold tracking-tight text-white hidden sm:block">CryptoYield</span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`text-sm font-semibold transition-colors ${
                isActive(link.path) ? 'text-blue-500' : 'text-gray-400 hover:text-white'
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-4">
          {currentUser ? (
            <Link to="/dashboard" className="bg-blue-600 hover:bg-blue-700 px-6 py-2.5 rounded-xl font-bold text-sm transition-all shadow-lg shadow-blue-900/20">
              Dashboard
            </Link>
          ) : (
            <>
              <Link to="/login" className="hidden sm:block text-gray-400 hover:text-white text-sm font-semibold">
                Sign In
              </Link>
              <Link to="/register" className="bg-blue-600 hover:bg-blue-700 px-6 py-2.5 rounded-xl font-bold text-sm transition-all shadow-lg shadow-blue-900/20">
                Get Started
              </Link>
            </>
          )}
          
          <button 
            className="md:hidden text-gray-400"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-[#0e121a] border-b border-white/5 p-6 flex flex-col gap-4 animate-in slide-in-from-top duration-300">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              onClick={() => setIsOpen(false)}
              className={`text-lg font-bold ${isActive(link.path) ? 'text-blue-500' : 'text-gray-400'}`}
            >
              {link.name}
            </Link>
          ))}
          {!currentUser && (
            <Link 
              to="/login" 
              onClick={() => setIsOpen(false)}
              className="text-lg font-bold text-gray-400"
            >
              Sign In
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};
