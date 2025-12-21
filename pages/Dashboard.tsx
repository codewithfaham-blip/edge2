
import React from 'react';
import { useApp } from '../store/AppContext';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ArrowUpRight, ArrowDownRight, Activity, PieChart as PieChartIcon, Clock, CheckCircle2, Users } from 'lucide-react';
import { TransactionType } from '../types';

export const UserDashboard = () => {
  const { currentUser, investments, transactions, plans } = useApp();

  if (!currentUser) return null;

  const activeInvestments = investments.filter(i => i.userId === currentUser.id && i.status === 'ACTIVE');
  const userTransactions = transactions.filter(t => t.userId === currentUser.id).slice(0, 5);

  // Generate mock chart data
  const chartData = [
    { name: 'Mon', profit: 400 },
    { name: 'Tue', profit: 600 },
    { name: 'Wed', profit: 550 },
    { name: 'Thu', profit: 900 },
    { name: 'Fri', profit: 800 },
    { name: 'Sat', profit: 1100 },
    { name: 'Sun', profit: 1250 },
  ];

  const stats = [
    { label: 'Active Deposits', value: `$${currentUser.totalInvested.toLocaleString()}`, icon: ArrowUpRight, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { label: 'Total Earnings', value: `$${(currentUser.balance + currentUser.totalWithdrawn - 100).toLocaleString()}`, icon: Activity, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { label: 'Total Withdrawn', value: `$${currentUser.totalWithdrawn.toLocaleString()}`, icon: ArrowDownRight, color: 'text-purple-500', bg: 'bg-purple-500/10' },
    { label: 'Last Profit', value: '+$12.50', icon: Clock, color: 'text-amber-500', bg: 'bg-amber-500/10' },
    { label: 'Referral Earnings', value: '$0.00', icon: Users, color: 'text-indigo-400', bg: 'bg-indigo-400/10' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Stats Grid - Updated to xl:grid-cols-5 to accommodate the new card */}
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
            <h3 className="text-xl font-bold">Earnings Performance</h3>
            <select className="bg-[#141922] border border-gray-800 rounded-lg px-3 py-1 text-sm outline-none">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
            </select>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
                <XAxis dataKey="name" stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#141922', border: '1px solid #374151', borderRadius: '12px' }}
                  itemStyle={{ color: '#3b82f6' }}
                />
                <Area type="monotone" dataKey="profit" stroke="#3b82f6" fillOpacity={1} fill="url(#colorProfit)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Account Summary Card */}
        <div className="bg-[#0e121a] border border-gray-800 p-6 rounded-3xl flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-bold mb-6">Quick Overview</h3>
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-[#141922] rounded-2xl">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                  <span className="text-sm font-medium">Active Plans</span>
                </div>
                <span className="font-bold">{activeInvestments.length}</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-[#141922] rounded-2xl">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="text-sm font-medium">Completed Plans</span>
                </div>
                <span className="font-bold text-emerald-500">{investments.filter(i => i.status === 'COMPLETED').length}</span>
              </div>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-gray-800">
            <div className="flex items-center justify-between mb-4">
               <span className="text-sm text-gray-400">Referral Earned</span>
               <span className="font-bold text-white">$142.50</span>
            </div>
            <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden">
               <div className="bg-blue-600 h-full w-[65%]" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Active Investments */}
        <div className="bg-[#0e121a] border border-gray-800 rounded-3xl overflow-hidden">
          <div className="p-6 border-b border-gray-800 flex justify-between items-center">
            <h3 className="text-xl font-bold">Active Investments</h3>
            <Clock className="w-5 h-5 text-gray-500" />
          </div>
          <div className="p-6">
            {activeInvestments.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <PieChartIcon className="w-12 h-12 mx-auto mb-4 opacity-20" />
                <p>No active investments yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {activeInvestments.map(inv => {
                  const plan = plans.find(p => p.id === inv.planId);
                  const progress = (inv.totalPayouts / (plan?.durationDays || 30)) * 100;
                  return (
                    <div key={inv.id} className="p-4 bg-[#141922] rounded-2xl border border-gray-800">
                      <div className="flex justify-between items-center mb-4">
                        <span className="font-bold text-white">{plan?.name}</span>
                        <span className="text-xs bg-blue-600/20 text-blue-500 px-3 py-1 rounded-full font-bold">ACTIVE</span>
                      </div>
                      <div className="flex justify-between text-sm mb-2">
                         <span className="text-gray-500">Investment: <span className="text-white font-medium">${inv.amount}</span></span>
                         <span className="text-gray-500">ROI: <span className="text-emerald-500 font-bold">+{plan?.roi}% Daily</span></span>
                      </div>
                      <div className="w-full bg-gray-800 h-1.5 rounded-full overflow-hidden">
                         <div className="bg-blue-500 h-full" style={{ width: `${progress}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-[#0e121a] border border-gray-800 rounded-3xl overflow-hidden">
          <div className="p-6 border-b border-gray-800 flex justify-between items-center">
            <h3 className="text-xl font-bold">Recent Activity</h3>
            <ArrowUpRight className="w-5 h-5 text-gray-500" />
          </div>
          <div className="p-0 overflow-x-auto">
            {userTransactions.length === 0 ? (
               <div className="p-12 text-center text-gray-500">No activity recorded.</div>
            ) : (
              <table className="w-full text-left">
                <thead className="bg-[#141922] text-xs font-bold text-gray-500 uppercase tracking-widest">
                  <tr>
                    <th className="px-6 py-4">Transaction</th>
                    <th className="px-6 py-4">Amount</th>
                    <th className="px-6 py-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {userTransactions.map(tx => (
                    <tr key={tx.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-medium text-white text-sm">{tx.type}</span>
                          <span className="text-xs text-gray-500">{new Date(tx.date).toLocaleDateString()}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`font-bold font-mono ${tx.type === TransactionType.WITHDRAWAL ? 'text-red-400' : 'text-green-400'}`}>
                          {tx.type === TransactionType.WITHDRAWAL ? '-' : '+'}${tx.amount.toLocaleString()}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                          tx.status === 'COMPLETED' ? 'bg-emerald-500/20 text-emerald-500' :
                          tx.status === 'PENDING' ? 'bg-amber-500/20 text-amber-500' : 'bg-red-500/20 text-red-500'
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
