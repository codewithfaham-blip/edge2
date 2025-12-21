
import React, { useState } from 'react';
import { useApp } from '../store/AppContext';
import { Users, Link as LinkIcon, Copy, Check, TrendingUp, Gift, Share2, Rocket, Coins, ArrowRight } from 'lucide-react';

export const ReferralsPage = () => {
  const { currentUser } = useApp();
  const [copied, setCopied] = useState(false);

  const referralLink = `https://cryptoyield.io/?ref=${currentUser?.referralCode}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const steps = [
    { 
      title: 'Share Link', 
      desc: 'Send your unique invitation link to friends, family, or your social network.',
      icon: Share2,
      color: 'text-blue-500',
      bg: 'bg-blue-500/10'
    },
    { 
      title: 'They Invest', 
      desc: 'Once your associate makes their first capital allocation, it is tracked to you.',
      icon: Rocket,
      color: 'text-purple-500',
      bg: 'bg-purple-500/10'
    },
    { 
      title: 'Earn Dividends', 
      desc: 'Receive an instant 5% commission credited directly to your balance.',
      icon: Coins,
      color: 'text-emerald-500',
      bg: 'bg-emerald-500/10'
    }
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Hero Header Section */}
      <div className="bg-[#0e121a] p-8 md:p-16 rounded-[48px] border border-white/5 text-center relative overflow-hidden shadow-2xl">
        {/* Animated Background Gradients */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-600/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-emerald-600/10 blur-[120px] rounded-full animate-pulse duration-1000" />

        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-widest mb-8">
            <Gift className="w-4 h-4" />
            Affiliate Program
          </div>

          <h2 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight text-white leading-tight">
            Build Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">Wealth Network</span>
          </h2>
          
          <p className="text-gray-400 mb-12 max-w-2xl mx-auto text-base md:text-lg leading-relaxed">
            Invite your circle to join the future of automated ROI. Earn institutional-grade commissions for every verified member you bring into the ecosystem.
          </p>

          {/* Referral Link Input Area */}
          <div className="max-w-2xl mx-auto">
            <div className="p-3 bg-[#141922] border border-white/5 rounded-[32px] flex flex-col sm:flex-row items-center gap-3 shadow-2xl">
              <div className="flex-1 px-5 py-4 bg-[#0b0e14]/80 rounded-2xl border border-white/5 w-full flex items-center gap-3 group/input">
                <LinkIcon className="w-5 h-5 text-blue-500 flex-shrink-0 group-hover/input:scale-110 transition-transform" />
                <span className="font-mono text-blue-400/80 truncate text-sm select-all">
                  {referralLink}
                </span>
              </div>
              <button 
                onClick={handleCopy}
                className={`w-full sm:w-auto px-10 py-4 rounded-2xl text-sm font-bold shadow-2xl transition-all flex items-center justify-center gap-2 group ${
                  copied ? 'bg-emerald-600 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-900/40 hover:-translate-y-1'
                }`}
              >
                {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5 group-hover:rotate-12 transition-transform" />}
                {copied ? 'Link Copied' : 'Copy Invitation Link'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Quick View */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="group p-10 bg-[#0e121a] rounded-[40px] border border-white/5 hover:border-blue-500/30 transition-all relative overflow-hidden">
          <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
            <Users className="w-20 h-20 text-blue-500" />
          </div>
          <div className="relative">
            <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-4">Total Referrals</p>
            <div className="flex items-end gap-3">
              <span className="text-5xl font-bold font-mono text-white">0</span>
              <span className="text-blue-500 font-bold text-xs mb-2">+0 this week</span>
            </div>
            <p className="text-[10px] text-gray-600 mt-4 uppercase font-bold tracking-tighter">Verified Network Associates</p>
          </div>
        </div>

        <div className="group p-10 bg-[#0e121a] rounded-[40px] border border-white/5 hover:border-emerald-500/30 transition-all relative overflow-hidden">
          <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
            <Coins className="w-20 h-20 text-emerald-500" />
          </div>
          <div className="relative">
            <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-4">Total Commission</p>
            <div className="flex items-end gap-3">
              <span className="text-5xl font-bold font-mono text-emerald-500">$0.00</span>
              <span className="text-gray-600 font-bold text-xs mb-2">USD Earned</span>
            </div>
            <p className="text-[10px] text-gray-600 mt-4 uppercase font-bold tracking-tighter">Instant Dividend Payouts</p>
          </div>
        </div>
      </div>

      {/* How it Works Section */}
      <div className="space-y-8">
        <div className="text-center">
          <h3 className="text-2xl font-bold mb-2">Simplified Earnings Process</h3>
          <p className="text-gray-500 text-sm">Follow three easy steps to start generating passive network income.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, idx) => (
            <div key={idx} className="bg-[#0e121a] border border-white/5 p-8 rounded-[32px] hover:bg-white/[0.02] transition-colors relative group">
              <div className={`w-14 h-14 ${step.bg} ${step.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 shadow-lg`}>
                <step.icon className="w-7 h-7" />
              </div>
              <h4 className="text-xl font-bold mb-3 text-white flex items-center gap-2">
                {idx + 1}. {step.title}
                {idx < 2 && <ArrowRight className="hidden md:block w-4 h-4 text-gray-800 ml-auto group-hover:translate-x-2 transition-transform" />}
              </h4>
              <p className="text-gray-500 text-sm leading-relaxed">{step.desc}</p>
              
              {/* Vertical connector for mobile */}
              {idx < 2 && (
                <div className="md:hidden flex justify-center py-4">
                  <div className="w-px h-8 bg-gradient-to-b from-gray-800 to-transparent" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Bonus Tier Info */}
      <div className="bg-gradient-to-br from-blue-600/5 to-purple-600/5 border border-blue-500/10 p-10 rounded-[40px] flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex items-center gap-6 text-center md:text-left">
          <div className="w-20 h-20 bg-blue-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-blue-900/40 rotate-3 group hover:rotate-0 transition-transform">
             <TrendingUp className="w-10 h-10 text-white" />
          </div>
          <div>
            <h4 className="text-2xl font-bold text-white mb-2">Network Commission Tier: <span className="text-blue-500 uppercase tracking-widest">ALPHA</span></h4>
            <p className="text-gray-400 text-sm max-w-sm">You are currently on the Standard Tier. Reach 10 active referrals to unlock the <b>7% PLATINUM tier</b>.</p>
          </div>
        </div>
        <div className="flex flex-col items-center md:items-end">
          <div className="text-4xl font-extrabold text-blue-500 mb-2">5.0%</div>
          <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Instant Cashback</div>
        </div>
      </div>
    </div>
  );
};
