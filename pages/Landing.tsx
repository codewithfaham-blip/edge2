
import React from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, Shield, Zap, CircleDollarSign, BarChart3, Clock } from 'lucide-react';
import { INITIAL_PLANS } from '../constants';
import { PublicNavbar } from '../components/Navbar';

export const LandingPage = () => {
  return (
    <div className="bg-[#0b0e14] text-white overflow-hidden pt-20">
      <PublicNavbar />

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 pt-32 pb-40 flex flex-col items-center relative">
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-blue-600/10 blur-[120px] -z-10 rounded-full" />
        
        {/* Boxed Hero Container based on Screenshot */}
        <div className="relative border-2 border-blue-400/20 bg-blue-500/[0.02] p-12 md:p-20 rounded-[20px] max-w-5xl w-full flex flex-col items-center">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-10">
            <Zap className="w-4 h-4 fill-current" />
            The most reliable HYIP of 2024
          </span>

          <h1 className="text-6xl md:text-8xl font-extrabold mb-4 tracking-tight leading-none text-center flex flex-col items-center">
            <span className="uppercase">Maximize Your</span>
            <div className="h-20 md:h-24 w-full max-w-[580px] bg-gradient-to-r from-blue-500 via-emerald-400 to-blue-400 my-6 rounded-md shadow-[0_0_50px_rgba(59,130,246,0.3)]" />
            <span className="uppercase">with Automated ROI</span>
          </h1>
        </div>

        <p className="text-xl text-gray-400 max-w-2xl mx-auto mt-12 mb-12 text-center leading-relaxed">
          Secure, transparent, and high-yielding investment strategies for everyone. <br className="hidden md:block" /> Start with as little as $100 and earn up to 4% daily.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          <Link to="/register" className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 px-12 py-5 rounded-2xl font-bold text-xl transition-all shadow-2xl shadow-blue-900/40">
            Start Investing Now
          </Link>
          <Link to="/public-plans" className="w-full sm:w-auto bg-white/5 hover:bg-white/10 px-12 py-5 rounded-2xl font-bold text-xl border border-white/10 transition-all">
            View Plans
          </Link>
        </div>

        {/* Stats Section */}
        <div className="mt-32 w-full grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-0 divide-x-0 md:divide-x divide-white/10 border-t border-white/5 pt-16">
          {[
            { label: 'Total Members', val: '12.4k+' },
            { label: 'Deposited', val: '$4.2M+' },
            { label: 'Withdrawn', val: '$1.8M+' },
            { label: 'Running Days', val: '248' }
          ].map((s, idx) => (
            <div key={idx} className="px-8 text-center md:text-left">
              <p className="text-gray-500 text-xs uppercase tracking-[0.2em] font-bold mb-3">{s.label}</p>
              <h3 className="text-4xl font-bold font-mono tracking-tighter">{s.val}</h3>
            </div>
          ))}
        </div>
      </section>

      {/* Plans Preview */}
      <section className="bg-[#0e121a] py-32 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 tracking-tight">Investment Packages</h2>
            <p className="text-gray-400 max-w-xl mx-auto">Choose a strategy that fits your budget and financial goals with guaranteed daily returns.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {INITIAL_PLANS.map((plan) => (
              <div key={plan.id} className="bg-[#141922] border border-white/5 rounded-[40px] p-8 hover:border-blue-500/50 transition-all group relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 blur-3xl rounded-full" />
                <div className="flex justify-between items-start mb-8 relative">
                  <div>
                    <h3 className="text-xl font-bold mb-2 uppercase tracking-wide text-gray-400">{plan.name}</h3>
                    <p className="text-blue-500 font-extrabold text-5xl font-mono">{plan.roi}% <span className="text-base font-normal text-gray-600">/ Day</span></p>
                  </div>
                  <div className="p-4 bg-blue-500/10 rounded-2xl">
                    <TrendingUp className="w-8 h-8 text-blue-500" />
                  </div>
                </div>
                <div className="space-y-4 mb-10 relative">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 uppercase font-bold tracking-widest text-[10px]">Min Deposit</span>
                    <span className="font-bold text-white font-mono">${plan.minAmount}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 uppercase font-bold tracking-widest text-[10px]">Max Deposit</span>
                    <span className="font-bold text-white font-mono">${plan.maxAmount}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 uppercase font-bold tracking-widest text-[10px]">Duration</span>
                    <span className="font-bold text-white">{plan.durationDays} Days</span>
                  </div>
                </div>
                <Link to="/register" className="block w-full text-center py-5 bg-blue-600/10 hover:bg-blue-600 rounded-2xl font-bold transition-all border border-blue-500/20 group-hover:bg-blue-600 group-hover:text-white">Invest Now</Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-24 bg-[#0e121a]">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <Link to="/" className="flex items-center gap-2 justify-center mb-10">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white">C</div>
          </Link>
          <p className="text-gray-500 text-sm mb-12 max-w-md mx-auto leading-relaxed">Providing institutional grade investment opportunities for the digital asset economy through advanced ROI strategies.</p>
          <div className="flex justify-center gap-12 text-sm font-bold uppercase tracking-widest mb-16">
            <a href="#" className="text-gray-500 hover:text-white transition-colors">Terms</a>
            <a href="#" className="text-gray-500 hover:text-white transition-colors">Privacy</a>
            <a href="#" className="text-gray-500 hover:text-white transition-colors">FAQ</a>
          </div>
          <p className="text-[10px] text-gray-700 uppercase tracking-[0.3em] font-bold">© 2024 CryptoYield International Ltd.</p>
        </div>
      </footer>
    </div>
  );
};
