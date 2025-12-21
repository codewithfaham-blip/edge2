
import React, { useState } from 'react';
import { useApp } from '../store/AppContext';
import { ShieldAlert, Users as UsersIcon, Wallet, Layers, Check, X, Edit, Trash2, Plus } from 'lucide-react';
import { TransactionStatus, UserRole } from '../types';

export const AdminPanel = () => {
  const { users, transactions, plans, adminApproveWithdrawal, adminRejectWithdrawal, adminUpdateUser, adminDeletePlan } = useApp();
  const [activeTab, setActiveTab] = useState<'users' | 'withdrawals' | 'plans'>('withdrawals');

  const pendingWithdrawals = transactions.filter(t => t.type === 'WITHDRAWAL' && t.status === TransactionStatus.PENDING);
  const totalUsers = users.length;
  const totalVolume = transactions.reduce((acc, t) => acc + t.amount, 0);

  const stats = [
    { label: 'Total Users', val: totalUsers, icon: UsersIcon, color: 'text-blue-500' },
    { label: 'Total Volume', val: `$${totalVolume.toLocaleString()}`, icon: Wallet, color: 'text-emerald-500' },
    { label: 'Active Plans', val: plans.length, icon: Layers, color: 'text-purple-500' },
    { label: 'Pending Payouts', val: pendingWithdrawals.length, icon: ShieldAlert, color: 'text-amber-500' },
  ];

  return (
    <div className="space-y-8">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((s, i) => (
          <div key={i} className="bg-[#0e121a] border border-gray-800 p-6 rounded-3xl">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-bold text-gray-500 uppercase">{s.label}</span>
              <s.icon className={`w-5 h-5 ${s.color}`} />
            </div>
            <h3 className="text-2xl font-bold font-mono">{s.val}</h3>
          </div>
        ))}
      </div>

      <div className="bg-[#0e121a] border border-gray-800 rounded-3xl overflow-hidden">
        {/* Tabs */}
        <div className="flex border-b border-gray-800 bg-[#141922]/50 p-2 gap-2">
          {[
            { id: 'withdrawals', label: 'Withdrawal Requests', count: pendingWithdrawals.length },
            { id: 'users', label: 'User Management', count: totalUsers },
            { id: 'plans', label: 'Investment Plans', count: plans.length },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-6 py-3 rounded-xl font-bold transition-all flex items-center gap-3 ${
                activeTab === tab.id ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-500 hover:text-white hover:bg-white/5'
              }`}
            >
              {tab.label}
              <span className={`text-[10px] px-2 py-0.5 rounded-full ${activeTab === tab.id ? 'bg-white/20' : 'bg-gray-800'}`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        <div className="p-0 overflow-x-auto">
          {activeTab === 'withdrawals' && (
            <table className="w-full text-left">
              <thead className="bg-[#141922] text-xs font-bold text-gray-500 uppercase">
                <tr>
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Method</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {pendingWithdrawals.length === 0 ? (
                   <tr><td colSpan={5} className="p-12 text-center text-gray-500">No pending withdrawal requests.</td></tr>
                ) : (
                  pendingWithdrawals.map(tx => {
                    const user = users.find(u => u.id === tx.userId);
                    return (
                      <tr key={tx.id} className="hover:bg-white/5 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="text-sm font-bold text-white">{user?.name}</span>
                            <span className="text-xs text-gray-500">{user?.email}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-amber-400 font-mono font-bold">${tx.amount.toLocaleString()}</td>
                        <td className="px-6 py-4 text-sm text-gray-400">{tx.method || 'Default'}</td>
                        <td className="px-6 py-4 text-sm text-gray-400">{new Date(tx.date).toLocaleDateString()}</td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                             <button 
                               onClick={() => adminApproveWithdrawal(tx.id)}
                               className="p-2 bg-emerald-500/10 text-emerald-500 rounded-lg hover:bg-emerald-500 hover:text-white transition-all"
                             >
                               <Check className="w-4 h-4" />
                             </button>
                             <button 
                               onClick={() => adminRejectWithdrawal(tx.id)}
                               className="p-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all"
                             >
                               <X className="w-4 h-4" />
                             </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          )}

          {activeTab === 'users' && (
            <table className="w-full text-left">
              <thead className="bg-[#141922] text-xs font-bold text-gray-500 uppercase">
                <tr>
                  <th className="px-6 py-4">User Details</th>
                  <th className="px-6 py-4">Balance</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {users.map(u => (
                  <tr key={u.id} className="hover:bg-white/5">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center font-bold text-xs">{u.name[0]}</div>
                        <div className="flex flex-col">
                           <span className="text-sm font-bold">{u.name}</span>
                           <span className="text-xs text-gray-500">{u.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-mono font-bold text-emerald-400">${u.balance.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${u.role === UserRole.ADMIN ? 'bg-purple-500/20 text-purple-500' : 'bg-blue-500/20 text-blue-500'}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {u.isBlocked ? (
                        <span className="text-red-500 text-xs font-bold">BLOCKED</span>
                      ) : (
                        <span className="text-emerald-500 text-xs font-bold">ACTIVE</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                       <button 
                        onClick={() => adminUpdateUser(u.id, { isBlocked: !u.isBlocked })}
                        className={`text-xs font-bold ${u.isBlocked ? 'text-emerald-500' : 'text-red-500'} hover:underline`}
                       >
                         {u.isBlocked ? 'Unblock' : 'Block User'}
                       </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {activeTab === 'plans' && (
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                 <h4 className="font-bold text-gray-400">Manage Investment Packages</h4>
                 <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-lg shadow-blue-900/20">
                   <Plus className="w-4 h-4" /> Add New Plan
                 </button>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {plans.map(p => (
                  <div key={p.id} className="bg-[#141922] border border-gray-800 p-6 rounded-2xl relative group">
                    <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 bg-gray-800 rounded-lg hover:bg-blue-600 transition-colors"><Edit className="w-3 h-3" /></button>
                      <button 
                        onClick={() => adminDeletePlan(p.id)}
                        className="p-2 bg-gray-800 rounded-lg hover:bg-red-600 transition-colors"
                      ><Trash2 className="w-3 h-3" /></button>
                    </div>
                    <h5 className="font-bold text-xl mb-1">{p.name}</h5>
                    <p className="text-blue-500 font-bold text-2xl mb-4">{p.roi}% <span className="text-xs text-gray-500">ROI / Day</span></p>
                    <div className="space-y-2 text-sm text-gray-400">
                      <div className="flex justify-between"><span>Min:</span> <span className="text-white">${p.minAmount}</span></div>
                      <div className="flex justify-between"><span>Max:</span> <span className="text-white">${p.maxAmount}</span></div>
                      <div className="flex justify-between"><span>Duration:</span> <span className="text-white">{p.durationDays} Days</span></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
