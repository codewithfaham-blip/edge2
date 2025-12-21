
import React from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, Shield, Zap, CircleDollarSign, BarChart3, Clock } from 'lucide-react';
import { INITIAL_PLANS } from '../constants';

export const LandingPage = () => {
  return (
    <div className="bg-[#0b0e14] text-white overflow-hidden">
      {/* Nav */}
      <nav className="max-w-7xl mx-auto px-6 py-8 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-xl">C</div>
          <span className="text-xl font-bold tracking-tight">CryptoYield</span>
        </div>
        <div className="flex items-center gap-6">
          <Link to="/login" className="text-gray-400 hover:text-white font-medium transition-colors">Sign In</Link>
          <Link to="/register" className="bg-blue-600 hover:bg-blue-700 px-6 py-2.5 rounded-full font-semibold transition-all shadow-lg shadow-blue-900/20">Get Started</Link>
        </div>
      </nav>

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
          <Link to="/register" className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 px-10 py-4 rounded-xl font-bold text-lg transition-all">Start Investing Now</Link>
          <Link to="/plans" className="w-full sm:w-auto bg-white/5 hover:bg-white/10 px-10 py-4 rounded-xl font-bold text-lg border border-white/10 transition-all">View Plans</Link>
        </div>

        {/* Stats Ticker */}
        <div className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-0 divide-x-0 md:divide-x divide-white/10">
          {[
            { label: 'Total Members', val: '12.4k+' },
            { label: 'Deposited', val: '$4.2M+' },
            { label: 'Withdrawn', val: '$1.8M+' },
            { label: 'Running Days', val: '248' }
          ].map((s, idx) => (
            <div key={idx} className="px-8">
              <p className="text-gray-500 text-sm uppercase tracking-widest font-semibold mb-2">{s.label}</p>
              <h3 className="text-3xl font-bold">{s.val}</h3>
            </div>
          ))}
        </div>
      </section>

      {/* Plans Preview */}
      <section className="bg-[#0e121a] py-32 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Investment Packages</h2>
            <p className="text-gray-400">Choose a strategy that fits your budget and financial goals.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {INITIAL_PLANS.map((plan) => (
              <div key={plan.id} className="bg-[#141922] border border-white/5 rounded-3xl p-8 hover:border-blue-500/50 transition-all group">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-xl font-bold mb-1">{plan.name}</h3>
                    <p className="text-blue-500 font-bold text-4xl">{plan.roi}% <span className="text-base font-normal text-gray-500">/ Day</span></p>
                  </div>
                  <div className="p-3 bg-blue-500/10 rounded-2xl">
                    <TrendingUp className="w-6 h-6 text-blue-500" />
                  </div>
                </div>
                <div className="space-y-4 mb-8">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Min Deposit:</span>
                    <span className="font-semibold text-white">${plan.minAmount}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Max Deposit:</span>
                    <span className="font-semibold text-white">${plan.maxAmount}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Duration:</span>
                    <span className="font-semibold text-white">{plan.durationDays} Days</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Capital Return:</span>
                    <span className="font-semibold text-green-500">Yes, Included</span>
                  </div>
                </div>
                <Link to="/register" className="block w-full text-center py-4 bg-white/5 hover:bg-blue-600 rounded-xl font-bold transition-all border border-white/10 group-hover:border-blue-600">Invest Now</Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-32 max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl font-bold mb-8">Why Choose CryptoYield?</h2>
            <div className="space-y-8">
              {[
                { icon: Shield, title: 'Secure Platform', desc: 'Enterprise-grade encryption and 2FA to keep your funds safe at all times.' },
                { icon: Clock, title: 'Instant Withdrawals', desc: 'No manual processing waits. Get your earnings back to your wallet instantly.' },
                { icon: BarChart3, title: 'Detailed Analytics', desc: 'Track every cent with our intuitive dashboard and real-time graphs.' }
              ].map((f, i) => (
                <div key={i} className="flex gap-6">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-600/10 rounded-xl flex items-center justify-center text-blue-500">
                    <f.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold mb-2">{f.title}</h4>
                    <p className="text-gray-400 leading-relaxed">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
             <div className="absolute -inset-4 bg-blue-600/20 blur-3xl rounded-full" />
             <div className="relative bg-gradient-to-br from-[#1c2431] to-[#121821] p-8 rounded-[40px] border border-white/5 shadow-2xl">
               <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 font-medium">Profit Calculator</span>
                    <CircleDollarSign className="text-blue-500" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-gray-500 font-medium">Investment Amount ($)</label>
                    <input type="number" readOnly value="1000" className="w-full bg-[#0b0e14] border border-white/10 rounded-2xl px-6 py-4 text-2xl font-bold text-white outline-none" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-[#0b0e14] p-4 rounded-2xl border border-white/10">
                      <p className="text-xs text-gray-500 mb-1">Daily Profit</p>
                      <p className="text-xl font-bold text-emerald-500">$15.00</p>
                    </div>
                    <div className="bg-[#0b0e14] p-4 rounded-2xl border border-white/10">
                      <p className="text-xs text-gray-500 mb-1">Total ROI</p>
                      <p className="text-xl font-bold text-blue-500">$1,450.00</p>
                    </div>
                  </div>
                  <button className="w-full py-4 bg-blue-600 rounded-2xl font-bold shadow-xl shadow-blue-900/40">Recalculate Profit</button>
               </div>
             </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 bg-[#0e121a]">
        <div className="max-w-7xl mx-auto px-6 text-center text-gray-500 text-sm">
          <p>© 2024 CryptoYield. Built for high performance digital asset management.</p>
          <div className="mt-4 flex justify-center gap-8">
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Legal Disclaimer</a>
          </div>
        </div>
      </footer>
    </div>
  );
};
