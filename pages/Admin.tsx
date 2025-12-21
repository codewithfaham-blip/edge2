
import React, { useState } from 'react';
import { useApp } from '../store/AppContext';
import { ShieldAlert, Users as UsersIcon, Wallet, Layers, Check, X, Edit, Trash2, Plus, ListOrdered, Save } from 'lucide-react';
import { TransactionStatus, UserRole, InvestmentPlan } from '../types';

export const AdminPanel = () => {
  const { users, transactions, plans, adminApproveWithdrawal, adminRejectWithdrawal, adminUpdateUser, adminDeletePlan, adminCreatePlan, adminUpdatePlan } = useApp();
  const [activeTab, setActiveTab] = useState<'users' | 'withdrawals' | 'plans' | 'transactions'>('withdrawals');
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<InvestmentPlan | null>(null);

  const pendingWithdrawals = transactions.filter(t => t.type === 'WITHDRAWAL' && t.status === TransactionStatus.PENDING);
  const totalUsers = users.length;
  const totalVolume = transactions.reduce((acc, t) => acc + t.amount, 0);

  const stats = [
    { label: 'Total Users', val: totalUsers, icon: UsersIcon, color: 'text-blue-500' },
    { label: 'Total Volume', val: `$${totalVolume.toLocaleString()}`, icon: Wallet, color: 'text-emerald-500' },
    { label: 'Active Plans', val: plans.length, icon: Layers, color: 'text-purple-500' },
    { label: 'Pending Payouts', val: pendingWithdrawals.length, icon: ShieldAlert, color: 'text-amber-500' },
  ];

  const handleOpenPlanModal = (plan?: InvestmentPlan) => {
    setEditingPlan(plan || null);
    setIsPlanModalOpen(true);
  };

  const handleSavePlan = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const planData = {
      name: formData.get('name') as string,
      minAmount: Number(formData.get('minAmount')),
      maxAmount: Number(formData.get('maxAmount')),
      roi: Number(formData.get('roi')),
      period: 'DAILY' as const,
      durationDays: Number(formData.get('durationDays')),
    };

    if (editingPlan) {
      adminUpdatePlan({ ...planData, id: editingPlan.id });
    } else {
      adminCreatePlan(planData);
    }
    setIsPlanModalOpen(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((s, i) => (
          <div key={i} className="bg-[#0e121a] border border-gray-800 p-6 rounded-3xl">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">{s.label}</span>
              <s.icon className={`w-5 h-5 ${s.color}`} />
            </div>
            <h3 className="text-2xl font-bold font-mono text-white">{s.val}</h3>
          </div>
        ))}
      </div>

      <div className="bg-[#0e121a] border border-gray-800 rounded-3xl overflow-hidden shadow-2xl">
        {/* Tabs */}
        <div className="flex border-b border-gray-800 bg-[#141922]/50 p-2 gap-2 overflow-x-auto">
          {[
            { id: 'withdrawals', label: 'Withdrawals', count: pendingWithdrawals.length },
            { id: 'users', label: 'Users', count: totalUsers },
            { id: 'plans', label: 'Plans', count: plans.length },
            { id: 'transactions', label: 'History', count: transactions.length },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-6 py-3 rounded-xl font-bold transition-all flex items-center gap-3 whitespace-nowrap ${
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
              <thead className="bg-[#141922] text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">
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
                   <tr><td colSpan={5} className="p-16 text-center text-gray-500">No pending withdrawal requests.</td></tr>
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
                        <td className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-tighter">{tx.method || 'Default'}</td>
                        <td className="px-6 py-4 text-sm text-gray-400">{new Date(tx.date).toLocaleDateString()}</td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                             <button 
                               onClick={() => adminApproveWithdrawal(tx.id)}
                               className="p-2 bg-emerald-500/10 text-emerald-500 rounded-lg hover:bg-emerald-500 hover:text-white transition-all"
                               title="Approve"
                             >
                               <Check className="w-4 h-4" />
                             </button>
                             <button 
                               onClick={() => adminRejectWithdrawal(tx.id)}
                               className="p-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all"
                               title="Reject"
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
              <thead className="bg-[#141922] text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">
                <tr>
                  <th className="px-6 py-4">User Details</th>
                  <th className="px-6 py-4">Balance</th>
                  <th className="px-6 py-4">Invested</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {users.map(u => (
                  <tr key={u.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center font-bold text-xs">{u.name[0]}</div>
                        <div className="flex flex-col">
                           <span className="text-sm font-bold text-white">{u.name}</span>
                           <span className="text-xs text-gray-500 font-mono">{u.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-mono font-bold text-emerald-400">${u.balance.toLocaleString()}</td>
                    <td className="px-6 py-4 font-mono text-xs text-gray-400">${u.totalInvested.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      {u.isBlocked ? (
                        <span className="px-2 py-0.5 rounded-full bg-red-500/10 text-red-500 text-[9px] font-bold uppercase">Blocked</span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 text-[9px] font-bold uppercase">Active</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                       <button 
                        onClick={() => adminUpdateUser(u.id, { isBlocked: !u.isBlocked })}
                        className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-lg border border-white/5 ${u.isBlocked ? 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white' : 'bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white'} transition-all`}
                       >
                         {u.isBlocked ? 'Unblock' : 'Block'}
                       </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {activeTab === 'plans' && (
            <div className="p-8">
              <div className="flex justify-between items-center mb-10">
                 <div>
                    <h4 className="text-xl font-bold text-white">Investment Portfolios</h4>
                    <p className="text-sm text-gray-500">Configure ROI packages and deposit limits.</p>
                 </div>
                 <button 
                  onClick={() => handleOpenPlanModal()}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-2xl text-sm font-bold transition-all shadow-xl shadow-blue-900/40"
                 >
                   <Plus className="w-4 h-4" /> Add Package
                 </button>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {plans.map(p => (
                  <div key={p.id} className="bg-[#141922] border border-gray-800 p-8 rounded-[32px] relative group hover:border-blue-500/30 transition-all">
                    <div className="absolute top-6 right-6 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => handleOpenPlanModal(p)}
                        className="p-2 bg-gray-800 rounded-xl hover:bg-blue-600 transition-colors"
                      ><Edit className="w-4 h-4" /></button>
                      <button 
                        onClick={() => adminDeletePlan(p.id)}
                        className="p-2 bg-gray-800 rounded-xl hover:bg-red-600 transition-colors"
                      ><Trash2 className="w-4 h-4" /></button>
                    </div>
                    <div className="mb-6">
                      <h5 className="font-bold text-xl text-white mb-1">{p.name}</h5>
                      <span className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em]">{p.durationDays} Days Duration</span>
                    </div>
                    <p className="text-blue-500 font-bold text-3xl mb-8">{p.roi}% <span className="text-xs text-gray-500 font-normal">ROI / Day</span></p>
                    <div className="space-y-4 text-sm">
                      <div className="flex justify-between items-center text-gray-400"><span>Min Deposit:</span> <span className="text-white font-mono font-bold">${p.minAmount}</span></div>
                      <div className="flex justify-between items-center text-gray-400"><span>Max Deposit:</span> <span className="text-white font-mono font-bold">${p.maxAmount}</span></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'transactions' && (
            <table className="w-full text-left">
              <thead className="bg-[#141922] text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">
                <tr>
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4">Type</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {transactions.slice(0, 50).map(tx => {
                  const user = users.find(u => u.id === tx.userId);
                  return (
                    <tr key={tx.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4">
                        <span className="text-sm font-medium text-white">{user?.name || 'Deleted User'}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">{tx.type}</span>
                      </td>
                      <td className="px-6 py-4 font-mono font-bold text-white">${tx.amount.toLocaleString()}</td>
                      <td className="px-6 py-4 text-xs text-gray-500">{new Date(tx.date).toLocaleString()}</td>
                      <td className="px-6 py-4">
                         <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                          tx.status === 'COMPLETED' ? 'bg-emerald-500/10 text-emerald-500' :
                          tx.status === 'PENDING' ? 'bg-amber-500/10 text-amber-500' : 'bg-red-500/10 text-red-500'
                        }`}>
                          {tx.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Plan Modal */}
      {isPlanModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 backdrop-blur-md bg-black/60">
          <div className="bg-[#0e121a] border border-gray-800 w-full max-w-lg rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in duration-300">
            <div className="p-8 border-b border-gray-800 flex justify-between items-center">
              <h3 className="text-2xl font-bold">{editingPlan ? 'Edit Package' : 'New Package'}</h3>
              <button onClick={() => setIsPlanModalOpen(false)} className="text-gray-500 hover:text-white"><X /></button>
            </div>
            <form onSubmit={handleSavePlan} className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Package Name</label>
                <input required name="name" defaultValue={editingPlan?.name} className="w-full bg-[#141922] border border-gray-800 rounded-2xl px-6 py-3 outline-none focus:border-blue-500 transition-all" placeholder="e.g. Bitcoin Gold" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Daily ROI (%)</label>
                  <input required type="number" step="0.1" name="roi" defaultValue={editingPlan?.roi} className="w-full bg-[#141922] border border-gray-800 rounded-2xl px-6 py-3 outline-none focus:border-blue-500 transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Duration (Days)</label>
                  <input required type="number" name="durationDays" defaultValue={editingPlan?.durationDays} className="w-full bg-[#141922] border border-gray-800 rounded-2xl px-6 py-3 outline-none focus:border-blue-500 transition-all" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Min Deposit ($)</label>
                  <input required type="number" name="minAmount" defaultValue={editingPlan?.minAmount} className="w-full bg-[#141922] border border-gray-800 rounded-2xl px-6 py-3 outline-none focus:border-blue-500 transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Max Deposit ($)</label>
                  <input required type="number" name="maxAmount" defaultValue={editingPlan?.maxAmount} className="w-full bg-[#141922] border border-gray-800 rounded-2xl px-6 py-3 outline-none focus:border-blue-500 transition-all" />
                </div>
              </div>
              <button type="submit" className="w-full py-5 bg-blue-600 hover:bg-blue-700 rounded-[24px] font-bold text-lg shadow-xl shadow-blue-900/40 transition-all flex items-center justify-center gap-2">
                <Save className="w-5 h-5" /> Save Package
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
