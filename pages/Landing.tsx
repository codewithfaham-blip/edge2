
import React from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, Shield, Zap, CircleDollarSign, BarChart3, Clock } from 'lucide-react';
import { INITIAL_PLANS } from '../constants';
import { PublicNavbar } from '../components/Navbar';

export const LandingPage = () => {
  return (
    <div className="bg-[#0b0e14] text-white overflow-hidden pt-20">
      <PublicNavbar />

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 pt-20 pb-32 text-center relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-blue-600/10 blur-[120px] -z-10 rounded-full" />
        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-blue-400 text-sm font-medium mb-8">
          <Zap className="w-4 h-4 fill-current" />
          The most reliable HYIP of 2024
        </span>
        <h1 className="text-5xl md:text-7xl font-bold mb-8 tracking-tight leading-[1.1]">
          Maximize Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">Crypto Assets</span><br />
          with Automated ROI
        </h1>
        <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-12">
          Secure, transparent, and high-yielding investment strategies for everyone. Start with as little as $100 and earn up to 4% daily.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/register" className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 px-10 py-4 rounded-xl font-bold text-lg transition-all shadow-xl shadow-blue-900/20">Start Investing Now</Link>
          <Link to="/public-plans" className="w-full sm:w-auto bg-white/5 hover:bg-white/10 px-10 py-4 rounded-xl font-bold text-lg border border-white/10 transition-all">View Plans</Link>
        </div>

        {/* Stats Ticker */}
        <div className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-0 divide-x-0 md:divide-x divide-white/10 border-t border-white/5 pt-12">
          {[
            { label: 'Total Members', val: '12.4k+' },
            { label: 'Deposited', val: '$4.2M+' },
            { label: 'Withdrawn', val: '$1.8M+' },
            { label: 'Running Days', val: '248' }
          ].map((s, idx) => (
            <div key={idx} className="px-8">
              <p className="text-gray-500 text-sm uppercase tracking-widest font-semibold mb-2">{s.label}</p>
              <h3 className="text-3xl font-bold font-mono">{s.val}</h3>
            </div>
          ))}
        </div>
      </section>

      {/* Plans Preview */}
      <section className="bg-[#0e121a] py-32 border-y border-white/5" id="plans">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 tracking-tight">Investment Packages</h2>
            <p className="text-gray-400 max-w-xl mx-auto">Choose a strategy that fits your budget and financial goals with guaranteed daily returns.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {INITIAL_PLANS.map((plan) => (
              <div key={plan.id} className="bg-[#141922] border border-white/5 rounded-[32px] p-8 hover:border-blue-500/50 transition-all group relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 blur-3xl rounded-full" />
                <div className="flex justify-between items-start mb-6 relative">
                  <div>
                    <h3 className="text-xl font-bold mb-1">{plan.name}</h3>
                    <p className="text-blue-500 font-bold text-4xl font-mono">{plan.roi}% <span className="text-base font-normal text-gray-500">/ Day</span></p>
                  </div>
                  <div className="p-3 bg-blue-500/10 rounded-2xl">
                    <TrendingUp className="w-6 h-6 text-blue-500" />
                  </div>
                </div>
                <div className="space-y-4 mb-8 relative">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Min Deposit:</span>
                    <span className="font-semibold text-white font-mono">${plan.minAmount}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Max Deposit:</span>
                    <span className="font-semibold text-white font-mono">${plan.maxAmount}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Duration:</span>
                    <span className="font-semibold text-white">{plan.durationDays} Days</span>
                  </div>
                </div>
                <Link to="/register" className="block w-full text-center py-4 bg-white/5 hover:bg-blue-600 rounded-2xl font-bold transition-all border border-white/10 group-hover:border-blue-600 group-hover:text-white">Invest Now</Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-32 max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl font-bold mb-8 tracking-tight leading-tight">Elite Infrastructure for<br />Professional Investors</h2>
            <div className="space-y-8">
              {[
                { icon: Shield, title: 'Secure Platform', desc: 'Enterprise-grade encryption and automated security protocols to keep your funds safe at all times.' },
                { icon: Clock, title: 'Instant Withdrawals', desc: 'No manual processing waits. Get your earnings back to your wallet instantly upon request.' },
                { icon: BarChart3, title: 'Detailed Analytics', desc: 'Track every cent with our intuitive dashboard featuring real-time profit visualization.' }
              ].map((f, i) => (
                <div key={i} className="flex gap-6">
                  <div className="flex-shrink-0 w-14 h-14 bg-blue-600/10 rounded-2xl flex items-center justify-center text-blue-500 shadow-inner">
                    <f.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold mb-2 text-white">{f.title}</h4>
                    <p className="text-gray-400 leading-relaxed text-sm">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
             <div className="absolute -inset-4 bg-blue-600/10 blur-3xl rounded-full" />
             <div className="relative bg-[#0e121a] p-8 rounded-[48px] border border-white/5 shadow-2xl">
               <div className="space-y-8">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 font-bold uppercase tracking-widest text-xs">Profit Calculator</span>
                    <CircleDollarSign className="text-blue-500" />
                  </div>
                  <div className="space-y-3">
                    <label className="text-xs text-gray-500 font-bold uppercase">Investment Amount</label>
                    <div className="relative">
                      <input type="number" readOnly value="1000" className="w-full bg-[#0b0e14] border border-white/10 rounded-3xl px-6 py-5 text-3xl font-bold text-white outline-none font-mono" />
                      <span className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-600 font-bold">USD</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-[#0b0e14] p-5 rounded-3xl border border-white/10">
                      <p className="text-[10px] text-gray-500 mb-1 font-bold uppercase">Daily Profit</p>
                      <p className="text-2xl font-bold text-emerald-500 font-mono">$15.00</p>
                    </div>
                    <div className="bg-[#0b0e14] p-5 rounded-3xl border border-white/10">
                      <p className="text-[10px] text-gray-500 mb-1 font-bold uppercase">Total Maturity</p>
                      <p className="text-2xl font-bold text-blue-500 font-mono">$1,450.00</p>
                    </div>
                  </div>
                  <button className="w-full py-5 bg-blue-600 hover:bg-blue-700 rounded-3xl font-bold text-lg shadow-xl shadow-blue-900/40 transition-all">Start Earning Today</button>
               </div>
             </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-20 bg-[#0e121a]">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <Link to="/" className="flex items-center gap-2 justify-center mb-8">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white">C</div>
            <span className="text-xl font-bold text-white">CryptoYield</span>
          </Link>
          <p className="text-gray-500 text-sm mb-10 max-w-md mx-auto">Providing institutional grade investment opportunities for the digital asset economy.</p>
          <div className="flex justify-center gap-12 text-sm font-semibold mb-12">
            <a href="#" className="text-gray-400 hover:text-white transition-colors">Terms</a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy</a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">FAQ</a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">Support</a>
          </div>
          <p className="text-[10px] text-gray-700 uppercase tracking-widest font-bold">© 2024 CryptoYield International Ltd. All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  );
};
