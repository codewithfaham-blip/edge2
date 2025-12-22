
import React, { useState, useEffect } from 'react';
import { useApp } from '../store/AppContext';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ArrowUpRight, ArrowDownRight, Activity, PieChart as PieChartIcon, Clock, CheckCircle2, Users, Zap, TrendingUp } from 'lucide-react';
import { TransactionType, Investment } from '../types';

const CountdownTimer: React.FC<{ targetDate: number }> = ({ targetDate }) => {
  const [timeLeft, setTimeLeft] = useState<number>(Math.max(0, targetDate - Date.now()));

  useEffect(() => {
    const interval = setInterval(() => {
      const diff = Math.max(0, targetDate - Date.now());
      setTimeLeft(diff);
      if (diff <= 0) clearInterval(interval);
    }, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  const seconds = Math.floor((timeLeft / 1000) % 60);
  const minutes = Math.floor((timeLeft / 1000 / 60) % 60);

  return (
    <div className="flex items-center gap-1.5 text-[10px] font-bold text-blue-400 bg-blue-500/5 px-2 py-1 rounded-lg border border-blue-500/10">
      <Zap className="w-3 h-3 animate-pulse" />
      ROI IN {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}s
    </div>
  );
};

export const UserDashboard = () => {
  const { currentUser, investments, transactions, plans } = useApp();

  if (!currentUser) return null;

  const userInvestments = investments.filter(i => i.userId === currentUser.id);
  const activeInvestments = userInvestments.filter(i => i.status === 'ACTIVE');
  const userTransactions = transactions.filter(t => t.userId === currentUser.id).slice(0, 5);
  
  const totalProfitEarned = userInvestments.reduce((acc, inv) => acc + inv.earnedSoFar, 0);

  // Generate mock chart data based on actual profit transactions if available
  const profitTxs = transactions.filter(t => t.userId === currentUser.id && t.type === TransactionType.PROFIT);
  const chartData = profitTxs.length > 5 
    ? profitTxs.slice(0, 7).reverse().map((t, i) => ({ name: `Day ${i+1}`, profit: t.amount }))
    : [
        { name: 'Mon', profit: 10 },
        { name: 'Tue', profit: 15 },
        { name: 'Wed', profit: 12 },
        { name: 'Thu', profit: 22 },
        { name: 'Fri', profit: 18 },
        { name: 'Sat', profit: 25 },
        { name: 'Sun', profit: 30 },
      ];

  const stats = [
    { label: 'Active Capital', value: `$${currentUser.totalInvested.toLocaleString()}`, icon: TrendingUp, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { label: 'Total Yield', value: `$${totalProfitEarned.toLocaleString(undefined, { minimumFractionDigits: 2 })}`, icon: Activity, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { label: 'Total Paid Out', value: `$${currentUser.totalWithdrawn.toLocaleString()}`, icon: ArrowDownRight, color: 'text-purple-500', bg: 'bg-purple-500/10' },
    { label: 'Current Balance', value: `$${currentUser.balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}`, icon: ArrowUpRight, color: 'text-blue-400', bg: 'bg-blue-400/10' },
    { label: 'Network Points', value: '1,240 XP', icon: Zap, color: 'text-amber-500', bg: 'bg-amber-500/10' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {stats.map((s, i) => (
          <div key={i} className="bg-[#0e121a] border border-gray-800 p-6 rounded-3xl hover:border-gray-700 transition-all group">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-2xl ${s.bg} group-hover:scale-110 transition-transform`}>
                <s.icon className={`w-6 h-6 ${s.color}`} />
              </div>
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{s.label}</span>
            </div>
            <h3 className="text-2xl font-bold text-white font-mono">{s.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Chart */}
        <div className="lg:col-span-2 bg-[#0e121a] border border-gray-800 p-6 rounded-3xl">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-xl font-bold">ROI Performance Engine</h3>
              <p className="text-xs text-gray-500 mt-1">Real-time yield generation tracking</p>
            </div>
            <div className="flex gap-2">
              <span className="px-3 py-1 bg-emerald-500/10 text-emerald-500 rounded-lg text-[10px] font-bold border border-emerald-500/10">LIVE FEED</span>
            </div>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
                <XAxis dataKey="name" stroke="#6b7280" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#6b7280" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#141922', border: '1px solid #374151', borderRadius: '12px' }}
                  itemStyle={{ color: '#10b981' }}
                />
                <Area type="monotone" dataKey="profit" stroke="#10b981" fillOpacity={1} fill="url(#colorProfit)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Account Summary Card */}
        <div className="bg-[#0e121a] border border-gray-800 p-6 rounded-3xl flex flex-col justify-between overflow-hidden relative group">
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
            <TrendingUp className="w-40 h-40" />
          </div>
          <div className="relative">
            <h3 className="text-xl font-bold mb-6">Investment Pulse</h3>
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-[#141922] rounded-2xl border border-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                  <span className="text-sm font-medium">Active Strategies</span>
                </div>
                <span className="font-bold">{activeInvestments.length}</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-[#141922] rounded-2xl border border-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="text-sm font-medium">Payouts Collected</span>
                </div>
                <span className="font-bold text-emerald-500">{userInvestments.reduce((acc, inv) => acc + inv.totalPayouts, 0)}</span>
              </div>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-gray-800 relative">
            <div className="flex items-center justify-between mb-4">
               <span className="text-sm text-gray-400">Yield Maturity</span>
               <span className="font-bold text-white">65% Overall</span>
            </div>
            <div className="w-full bg-gray-800/50 h-3 rounded-full overflow-hidden border border-white/5 p-0.5">
               <div className="bg-gradient-to-r from-blue-600 to-emerald-500 h-full rounded-full w-[65%] shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* ROI Contracts Tracking */}
        <div className="bg-[#0e121a] border border-gray-800 rounded-3xl overflow-hidden shadow-2xl">
          <div className="p-6 border-b border-gray-800 flex justify-between items-center bg-[#141922]/30">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <Zap className="w-5 h-5 text-blue-500" /> Live ROI Contracts
            </h3>
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">REAL-TIME SYNC</span>
          </div>
          <div className="p-6">
            {activeInvestments.length === 0 ? (
              <div className="text-center py-16 text-gray-500">
                <PieChartIcon className="w-16 h-16 mx-auto mb-4 opacity-10" />
                <p className="font-medium">No active yield strategies.</p>
                <p className="text-xs mt-1">Visit the 'Invest' tab to begin.</p>
              </div>
            ) : (
              <div className="space-y-5">
                {activeInvestments.map(inv => {
                  const plan = plans.find(p => p.id === inv.planId);
                  const progress = (inv.totalPayouts / (plan?.durationDays || 30)) * 100;
                  return (
                    <div key={inv.id} className="p-5 bg-[#141922] rounded-3xl border border-gray-800 group hover:border-blue-500/30 transition-all">
                      <div className="flex justify-between items-start mb-6">
                        <div>
                          <h4 className="font-bold text-white text-lg">{plan?.name}</h4>
                          <span className="text-[10px] text-gray-500 font-mono tracking-tighter">ID: #{inv.id.toUpperCase()}</span>
                        </div>
                        <CountdownTimer targetDate={inv.nextPayout} />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="bg-black/20 p-3 rounded-2xl border border-white/5">
                           <p className="text-[9px] text-gray-500 uppercase font-black mb-1">Capital Locked</p>
                           <p className="text-sm font-bold text-white font-mono">${inv.amount.toLocaleString()}</p>
                        </div>
                        <div className="bg-black/20 p-3 rounded-2xl border border-white/5">
                           <p className="text-[9px] text-gray-500 uppercase font-black mb-1">Yield Earned</p>
                           <p className="text-sm font-bold text-emerald-500 font-mono">+${inv.earnedSoFar.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                           <span className="text-gray-500">Lifecycle Progress</span>
                           <span className="text-blue-500">{inv.totalPayouts} / {plan?.durationDays} Payouts</span>
                        </div>
                        <div className="w-full bg-gray-800/80 h-2 rounded-full overflow-hidden">
                           <div className="bg-blue-500 h-full shadow-[0_0_10px_rgba(59,130,246,0.3)] transition-all duration-1000" style={{ width: `${progress}%` }} />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-[#0e121a] border border-gray-800 rounded-3xl overflow-hidden shadow-2xl">
          <div className="p-6 border-b border-gray-800 flex justify-between items-center bg-[#141922]/30">
            <h3 className="text-xl font-bold">Financial History</h3>
            <ArrowUpRight className="w-5 h-5 text-gray-500" />
          </div>
          <div className="p-0 overflow-x-auto">
            {userTransactions.length === 0 ? (
               <div className="p-20 text-center text-gray-500 font-medium">No activity recorded yet.</div>
            ) : (
              <table className="w-full text-left">
                <thead className="bg-[#141922] text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                  <tr>
                    <th className="px-8 py-5">Activity</th>
                    <th className="px-8 py-5">Delta</th>
                    <th className="px-8 py-5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800/50">
                  {userTransactions.map(tx => (
                    <tr key={tx.id} className="hover:bg-white/[0.02] transition-colors group">
                      <td className="px-8 py-6 whitespace-nowrap">
                        <div className="flex flex-col">
                          <span className="font-bold text-white text-sm">{tx.type}</span>
                          <span className="text-[10px] text-gray-500 font-medium uppercase">{new Date(tx.date).toLocaleDateString()}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className={`font-black font-mono text-lg ${tx.type === TransactionType.WITHDRAWAL ? 'text-red-500' : 'text-emerald-500'}`}>
                          {tx.type === TransactionType.WITHDRAWAL ? '-' : '+'}${tx.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <span className={`px-3 py-1.5 rounded-xl text-[10px] font-black border ${
                          tx.status === 'COMPLETED' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' :
                          tx.status === 'PENDING' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20'
                        }`}>
                          {tx.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
