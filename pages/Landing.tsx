
import React from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, Shield, Zap, CircleDollarSign, BarChart3, Clock } from 'lucide-react';
import { INITIAL_PLANS } from '../constants';
import { PublicNavbar } from '../components/Navbar';

export const LandingPage = () => {
  return (
    <div className="bg-[#0b0e14] text-white overflow-hidden">
      <PublicNavbar />

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 pt-44 pb-40 flex flex-col items-center relative">
        <div className="absolute top-40 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-blue-600/10 blur-[120px] -z-10 rounded-full" />
        
        {/* Boxed Hero Container - Precision Refinement */}
        <div className="relative border-2 border-blue-400/20 bg-blue-500/[0.01] p-10 md:p-24 rounded-[32px] max-w-5xl w-full flex flex-col items-center shadow-[inset_0_0_80px_rgba(59,130,246,0.02)]">
          <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] mb-12 animate-pulse">
            <Zap className="w-4 h-4 fill-current" />
            The most reliable HYIP of 2024
          </span>

          <h1 className="text-5xl md:text-8xl font-black mb-4 tracking-tight leading-[0.9] text-center flex flex-col items-center">
            <span className="uppercase text-white">Maximize Your</span>
            <div className="h-16 md:h-24 w-[280px] md:w-[600px] bg-gradient-to-r from-blue-600 via-emerald-400 to-blue-500 my-8 rounded-2xl shadow-[0_0_60px_rgba(37,99,235,0.3)] border border-white/10" />
            <span className="uppercase text-white">with Automated ROI</span>
          </h1>
        </div>

        <p className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto mt-16 mb-12 text-center leading-relaxed font-medium">
          Institutional-grade investment strategies accessible to everyone. <br className="hidden md:block" /> Start with as little as $100 and scale to 4.0% daily yields.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          <Link to="/register" className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 px-12 py-5 rounded-[24px] font-bold text-xl transition-all shadow-2xl shadow-blue-900/50 hover:-translate-y-1">
            Start Investing
          </Link>
          <Link to="/public-plans" className="w-full sm:w-auto bg-white/5 hover:bg-white/10 px-12 py-5 rounded-[24px] font-bold text-xl border border-white/10 transition-all">
            View Strategies
          </Link>
        </div>

        {/* Stats Section */}
        <div className="mt-40 w-full grid grid-cols-2 md:grid-cols-4 gap-12 border-t border-white/5 pt-20">
          {[
            { label: 'Network Members', val: '12.4k+' },
            { label: 'Capital Pooled', val: '$4.2M+' },
            { label: 'Dividends Paid', val: '$1.8M+' },
            { label: 'System Uptime', val: '248 Days' }
          ].map((s, idx) => (
            <div key={idx} className="text-center md:text-left">
              <p className="text-gray-600 text-[10px] uppercase tracking-[0.3em] font-black mb-4">{s.label}</p>
              <h3 className="text-3xl md:text-5xl font-black font-mono tracking-tighter text-white">{s.val}</h3>
            </div>
          ))}
        </div>
      </section>

      {/* Plans Preview */}
      <section className="bg-[#0e121a] py-32 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight">Active ROI Packages</h2>
            <p className="text-gray-500 max-w-xl mx-auto font-medium">Guaranteed daily returns backed by our automated algorithmic arbitrage engine.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {INITIAL_PLANS.map((plan) => (
              <div key={plan.id} className="bg-[#141922] border border-white/5 rounded-[48px] p-10 hover:border-blue-500/50 transition-all group relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 blur-3xl rounded-full" />
                <div className="flex justify-between items-start mb-10 relative">
                  <div>
                    <h3 className="text-gray-500 text-[10px] font-black uppercase tracking-[0.2em] mb-4">{plan.name}</h3>
                    <p className="text-blue-500 font-black text-6xl font-mono tracking-tighter">{plan.roi}% <span className="text-xs font-bold text-gray-700 block mt-1 tracking-widest uppercase">Per 24h Cycle</span></p>
                  </div>
                  <div className="p-4 bg-blue-500/10 rounded-[20px] shadow-inner shadow-blue-500/10">
                    <TrendingUp className="w-8 h-8 text-blue-500" />
                  </div>
                </div>
                <div className="space-y-5 mb-12 relative">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-600 uppercase font-black tracking-widest text-[9px]">Min Stake</span>
                    <span className="font-black text-white font-mono text-sm">${plan.minAmount}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-600 uppercase font-black tracking-widest text-[9px]">Max Stake</span>
                    <span className="font-black text-white font-mono text-sm">${plan.maxAmount}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-600 uppercase font-black tracking-widest text-[9px]">Lifecycle</span>
                    <span className="font-black text-white text-sm">{plan.durationDays} Days</span>
                  </div>
                </div>
                <Link to="/register" className="block w-full text-center py-6 bg-blue-600/10 hover:bg-blue-600 rounded-[28px] font-bold text-lg transition-all border border-blue-500/20 group-hover:bg-blue-600 group-hover:text-white shadow-xl shadow-blue-900/10">Configure Plan</Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-32 bg-[#0e121a]">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <Link to="/" className="flex items-center gap-2 justify-center mb-12">
            <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center font-black text-2xl text-white shadow-2xl shadow-blue-900/40">C</div>
          </Link>
          <p className="text-gray-600 text-sm mb-16 max-w-md mx-auto leading-relaxed font-medium">Standardizing institutional investment for the decentralized digital economy.</p>
          <div className="flex justify-center gap-16 text-[10px] font-black uppercase tracking-[0.3em] mb-20 text-gray-700">
            <a href="#" className="hover:text-blue-500 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-blue-500 transition-colors">Risk Disclosure</a>
            <a href="#" className="hover:text-blue-500 transition-colors">Whitepaper</a>
          </div>
          <p className="text-[10px] text-gray-800 uppercase tracking-[0.5em] font-black">© MMXXIV CryptoYield Intelligence</p>
        </div>
      </footer>
    </div>
  );
};
