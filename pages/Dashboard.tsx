
import React, { useState, useEffect } from 'react';
import { useApp } from '../store/AppContext.tsx';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Activity, Zap, TrendingUp, ArrowDownRight, Wallet, Globe, Calculator, Newspaper, ShieldCheck } from 'lucide-react';
import { TransactionType } from '../types.ts';

const CountdownTimer: React.FC<{ targetDate: number }> = ({ targetDate }) => {
  const [timeLeft, setTimeLeft] = useState<number>(Math.max(0, targetDate - Date.now()));
  useEffect(() => {
    const interval = setInterval(() => setTimeLeft(Math.max(0, targetDate - Date.now())), 1000);
    return () => clearInterval(interval);
  }, [targetDate]);
  const seconds = Math.floor((timeLeft / 1000) % 60);
  const minutes = Math.floor((timeLeft / 1000 / 60) % 60);
  return (
    <div className="flex items-center gap-1.5 text-[10px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/5 px-2 py-1 rounded-lg border border-blue-100 dark:border-blue-500/10">
      <Zap className="w-3 h-3 animate-pulse" /> NEXT ROI: {minutes}:{seconds.toString().padStart(2, '0')}s
    </div>
  );
};

export const UserDashboard = () => {
  const { currentUser, investments, transactions, plans, theme, marketData, investInPlan, addToast } = useApp();
  const [calcAmount, setCalcAmount] = useState<number>(1000);

  if (!currentUser) return null;

  const userInvestments = investments.filter(i => i.userId === currentUser.id);
  const activeInvestments = userInvestments.filter(i => i.status === 'ACTIVE');
  const recentLedger = transactions.filter(t => t.userId === currentUser.id).slice(0, 5);
  const totalYield = userInvestments.reduce((acc, inv) => acc + inv.earnedSoFar, 0);

  const chartData = [
    { name: '01', profit: 10 }, { name: '02', profit: 45 }, { name: '03', profit: 30 },
    { name: '04', profit: 80 }, { name: '05', profit: 60 }, { name: '06', profit: 110 }, { name: '07', profit: 140 }
  ];

  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500 pb-20">
      <div className="bg-white dark:bg-brand-darkSecondary border border-slate-200 dark:border-white/5 rounded-2xl p-4 flex items-center gap-4 overflow-hidden shadow-sm">
        <div className="flex items-center gap-2 text-blue-600 font-black text-[10px] uppercase tracking-widest shrink-0"><Newspaper className="w-4 h-4" /> PULSE:</div>
        <div className="flex-1 overflow-hidden relative h-5"><div className="absolute whitespace-nowrap animate-[marquee_25s_linear_infinite] text-[11px] font-bold text-slate-500 dark:text-gray-400">
             • BTC Arbitrage Efficiency +15% • System Kernel 4.5 Deploying • Node Sharding Complete • Asia-Pacific Liquidity Bridge Optimized • Global Payout Batch #49102 Verified •
        </div></div>
      </div>
      <style>{`@keyframes marquee { 0% { transform: translateX(100%); } 100% { transform: translateX(-100%); } }`}</style>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {[
          { label: 'Active Capital', value: `$${currentUser.totalInvested.toLocaleString()}`, icon: TrendingUp, color: 'text-blue-500', bg: 'bg-blue-500/10' },
          { label: 'Total Yield', value: `$${totalYield.toFixed(2)}`, icon: Activity, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
          { label: 'Total Withdrawn', value: `$${currentUser.totalWithdrawn.toLocaleString()}`, icon: ArrowDownRight, color: 'text-rose-500', bg: 'bg-rose-500/10' },
          { label: 'Protocol Health', value: '100%', icon: ShieldCheck, color: 'text-amber-500', bg: 'bg-amber-500/10' },
        ].map((s, i) => (
          <div key={i} className="bg-white dark:bg-brand-darkSecondary border border-slate-200/60 dark:border-gray-800 p-5 rounded-3xl group">
            <div className="flex justify-between items-start mb-4"><div className={`p-3 rounded-2xl ${s.bg}`}><s.icon className={`w-5 h-5 ${s.color}`} /></div><span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{s.label}</span></div>
            <h3 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white font-mono">{s.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6 md:gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white dark:bg-brand-darkSecondary border border-slate-200/60 dark:border-gray-800 p-6 rounded-3xl shadow-sm">
            <div className="flex items-center justify-between mb-8"><div><h3 className="text-lg font-black text-slate-900 dark:text-white">Yield Performance</h3><p className="text-xs text-slate-500 mt-1 uppercase tracking-widest font-bold">Protocol Arbitrage Efficiency</p></div><span className="px-3 py-1 bg-emerald-500/10 text-emerald-500 rounded-lg text-[10px] font-black animate-pulse">LIVE NODE</span></div>
            <div className="h-64 w-full"><ResponsiveContainer width="100%" height="100%"><AreaChart data={chartData}><defs><linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/><stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/></linearGradient></defs><CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#1f2937' : '#f1f5f9'} vertical={false} /><XAxis dataKey="name" stroke="#6b7280" fontSize={10} axisLine={false} tickLine={false}/><YAxis stroke="#6b7280" fontSize={10} axisLine={false} tickLine={false}/><Tooltip contentStyle={{ backgroundColor: theme === 'dark' ? '#141922' : '#ffffff', border: 'none', borderRadius: '16px' }}/><Area type="monotone" dataKey="profit" stroke="#3b82f6" fillOpacity={1} fill="url(#colorProfit)" strokeWidth={3} /></AreaChart></ResponsiveContainer></div>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            {plans.map(plan => (
              <div key={plan.id} className="bg-white dark:bg-brand-darkSecondary border border-slate-200/60 dark:border-gray-800 p-6 rounded-[32px] hover:border-blue-500/50 transition-all flex flex-col justify-between group">
                <div><h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{plan.name}</h4><p className="text-2xl font-black text-blue-600 font-mono mb-6">{plan.roi}%</p></div>
                <button onClick={() => investInPlan(plan.id, plan.minAmount)} className="w-full py-2.5 bg-slate-100 dark:bg-white/5 group-hover:bg-blue-600 group-hover:text-white text-slate-600 dark:text-gray-400 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">Stake ${plan.minAmount}</button>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white dark:bg-brand-darkSecondary border border-slate-200/60 dark:border-gray-800 p-6 rounded-3xl shadow-sm"><h3 className="text-sm font-black text-slate-900 dark:text-white mb-6 uppercase tracking-widest flex items-center gap-2"><Globe className="w-4 h-4 text-blue-500" /> Market Watch</h3><div className="space-y-4">{marketData.map(coin => (
            <div key={coin.id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-black/20 rounded-2xl border border-slate-100 dark:border-white/5 group transition-all hover:border-blue-500/20">
              <div className="flex items-center gap-3"><div className="w-8 h-8 rounded-lg bg-blue-600/10 flex items-center justify-center font-black text-[10px] text-blue-600">{coin.symbol[0]}</div><div><p className="text-xs font-black text-slate-900 dark:text-white">{coin.symbol}</p><p className="text-[8px] text-slate-400 uppercase font-bold">{coin.name}</p></div></div>
              <div className="text-right"><p className="text-xs font-black text-slate-900 dark:text-white font-mono">${coin.price.toLocaleString()}</p><p className={`text-[9px] font-black ${coin.change24h >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>{coin.change24h >= 0 ? '+' : ''}{coin.change24h.toFixed(2)}%</p></div>
            </div>
          ))}</div></div>
          {/* Rest of dashboard items remain... */}
        </div>
      </div>
    </div>
  );
};
