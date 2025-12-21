
import React, { useState } from 'react';
import { useApp } from '../store/AppContext';
import { Users, Link as LinkIcon, Copy, Check, TrendingUp, Gift } from 'lucide-react';

export const ReferralsPage = () => {
  const { currentUser } = useApp();
  const [copied, setCopied] = useState(false);

  const referralLink = `https://cryptoyield.io/?ref=${currentUser?.referralCode}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-[#0e121a] p-6 md:p-12 rounded-[32px] md:rounded-[56px] border border-white/5 text-center relative overflow-hidden">
        {/* Abstract Background Decoration */}
        <div className="absolute -top-24 -left-24 w-64 h-64 bg-blue-600/10 blur-[100px] rounded-full" />
        <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-emerald-600/10 blur-[100px] rounded-full" />

        <div className="relative">
          <div className="w-16 h-16 md:w-20 md:h-20 bg-blue-600/10 rounded-[24px] md:rounded-[32px] flex items-center justify-center mx-auto mb-6 md:mb-8 text-blue-500 border border-blue-500/20">
            <Users className="w-8 h-8 md:w-10 md:h-10" />
          </div>

          <h2 className="text-3xl md:text-5xl font-bold mb-4 md:mb-6 tracking-tight text-white">Referral Ecosystem</h2>
          <p className="text-gray-400 mb-10 md:mb-12 max-w-lg mx-auto text-sm md:text-base leading-relaxed">
            Expand the CryptoYield network and earn institutional-grade commissions. Earn <span className="text-emerald-500 font-bold">5% instant commission</span> on every capital allocation made by your invited associates.
          </p>

          <div className="max-w-xl mx-auto">
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-3 text-left ml-2">Your Unique Invitation Link</p>
            <div className="p-2 md:p-3 bg-[#141922] border border-white/5 rounded-[24px] md:rounded-[32px] flex flex-col sm:flex-row items-center gap-3 shadow-inner">
              <div className="flex-1 px-4 py-3 bg-[#0b0e14]/50 rounded-2xl border border-white/5 w-full overflow-hidden flex items-center gap-3">
                <LinkIcon className="w-4 h-4 text-blue-500 flex-shrink-0" />
                <span className="font-mono text-blue-500/80 truncate text-xs md:text-sm">
                  {referralLink}
                </span>
              </div>
              <button 
                onClick={handleCopy}
                className={`w-full sm:w-auto px-8 py-4 rounded-2xl text-sm font-bold shadow-lg transition-all flex items-center justify-center gap-2 group ${
                  copied ? 'bg-emerald-600 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-900/20'
                }`}
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4 group-hover:scale-110 transition-transform" />}
                {copied ? 'Copied!' : 'Copy Link'}
              </button>
            </div>
          </div>

          <div className="mt-16 md:mt-24 grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-8 text-center max-w-3xl mx-auto">
            <div className="group p-8 md:p-10 bg-[#141922] rounded-[32px] md:rounded-[40px] border border-white/5 hover:border-blue-500/30 transition-all relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <TrendingUp className="w-12 h-12 text-blue-500" />
              </div>
              <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-3">Active Network</p>
              <p className="text-4xl md:text-5xl font-bold font-mono text-white">0</p>
              <p className="text-[10px] text-gray-600 mt-2">Verified Associates</p>
            </div>
            <div className="group p-8 md:p-10 bg-[#141922] rounded-[32px] md:rounded-[40px] border border-white/5 hover:border-emerald-500/30 transition-all relative overflow-hidden">
               <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Gift className="w-12 h-12 text-emerald-500" />
              </div>
              <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-3">Total Commission</p>
              <p className="text-4xl md:text-5xl font-bold font-mono text-emerald-500">$0.00</p>
              <p className="text-[10px] text-gray-600 mt-2">Earned Dividends</p>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-white/5 flex flex-col items-center gap-2">
            <p className="text-gray-600 text-[10px] uppercase font-bold tracking-widest">Commission Tier</p>
            <div className="px-4 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-xs font-bold">
              Standard: 5.0%
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
