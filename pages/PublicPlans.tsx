
import React from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, CheckCircle2 } from 'lucide-react';
import { INITIAL_PLANS } from '../constants';
import { PublicNavbar } from '../components/Navbar';

export const PublicPlansPage = () => {
  return (
    <div className="min-h-screen bg-[#0b0e14] text-white pt-32 pb-20 px-6">
      <PublicNavbar />
      
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h1 className="text-5xl font-bold mb-6 tracking-tight">Select Your Strategy</h1>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed">
            From entry-level packages to professional institution-grade funds, we offer a range of investment plans designed to maximize your digital asset ROI.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {INITIAL_PLANS.map((plan) => (
            <div key={plan.id} className="bg-[#0e121a] border border-white/5 rounded-[48px] p-10 flex flex-col hover:border-blue-500/40 transition-all shadow-2xl relative overflow-hidden group">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-600/5 blur-3xl rounded-full" />
              
              <div className="mb-8">
                <span className="text-blue-500 text-xs font-bold uppercase tracking-widest mb-4 block">{plan.period} RETURNS</span>
                <h3 className="text-3xl font-bold mb-4">{plan.name}</h3>
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-6xl font-bold text-white font-mono">{plan.roi}%</span>
                  <span className="text-gray-500 font-bold uppercase tracking-tighter">ROI / DAY</span>
                </div>
              </div>

              <div className="space-y-6 flex-grow mb-10">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-blue-500" />
                  <span className="text-gray-400">Min: <b className="text-white font-mono">${plan.minAmount}</b></span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-blue-500" />
                  <span className="text-gray-400">Max: <b className="text-white font-mono">${plan.maxAmount}</b></span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-blue-500" />
                  <span className="text-gray-400">Duration: <b className="text-white">{plan.durationDays} Days</b></span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-blue-500" />
                  <span className="text-gray-400">Principal Refunded: <b className="text-emerald-500">YES</b></span>
                </div>
              </div>

              <Link 
                to="/register" 
                className="w-full py-5 bg-white/5 hover:bg-blue-600 rounded-3xl text-center font-bold text-lg transition-all border border-white/10 group-hover:border-blue-600 shadow-xl"
              >
                Join Now
              </Link>
            </div>
          ))}
        </div>

        <div className="bg-[#141922] rounded-[48px] p-12 border border-white/5 flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="text-center md:text-left">
            <h2 className="text-3xl font-bold mb-4">Institutional Requirements?</h2>
            <p className="text-gray-400 max-w-md">For investments exceeding $50,000, please contact our OTC desk for custom yield optimization and dedicated support.</p>
          </div>
          <a href="#" className="bg-emerald-600 hover:bg-emerald-700 px-10 py-5 rounded-3xl font-bold shadow-xl shadow-emerald-900/20 whitespace-nowrap transition-all">
            Contact OTC Desk
          </a>
        </div>
      </div>
    </div>
  );
};
