
import React, { useState } from 'react';
import { useApp } from '../store/AppContext';
import { ShieldAlert, Users as UsersIcon, Wallet, Layers, Check, X, Edit, Trash2, Plus, Save, Activity, Terminal, RefreshCw } from 'lucide-react';
import { TransactionStatus, UserRole, InvestmentPlan } from '../types';

export const AdminPanel = () => {
  // Added 'investments' to the destructuring of useApp()
  const { 
    users, transactions, plans, platformStats, investments,
    adminApproveWithdrawal, adminRejectWithdrawal, adminUpdateUser, 
    adminDeletePlan, adminCreatePlan, adminUpdatePlan, debugTriggerProfit 
  } = useApp();
  
  const [activeTab, setActiveTab] = useState<'users' | 'withdrawals' | 'plans' | 'transactions' | 'debug'>('withdrawals');
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<InvestmentPlan | null>(null);

  const pendingWithdrawals = transactions.filter(t => t.type === 'WITHDRAWAL' && t.status === TransactionStatus.PENDING);

  const statCards = [
    { label: 'Total Members', val: platformStats.totalUsers, icon: UsersIcon, color: 'text-blue-500' },
    { label: 'Platform Balance', val: `$${platformStats.platformBalance.toLocaleString()}`, icon: Wallet, color: 'text-emerald-500' },
    { label: 'Capital Invested', val: `$${platformStats.totalInvested.toLocaleString()}`, icon: Layers, color: 'text-purple-500' },
    { label: 'Pending Payouts', val: platformStats.pendingWithdrawals, icon: ShieldAlert, color: 'text-amber-500' },
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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white flex items-center gap-3">
            <Activity className="text-blue-500 w-8 h-8" /> Platform Administration
          </h2>
          <p className="text-gray-500 text-sm">System oversight and financial control panel</p>
        </div>
        <div className="bg-blue-600/10 border border-blue-600/20 px-4 py-2 rounded-xl flex items-center gap-2">
           <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
           <span className="text-xs font-bold text-blue-500 uppercase tracking-widest">System Online</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((s, i) => (
          <div key={i} className="bg-[#0e121a] border border-gray-800 p-6 rounded-3xl hover:bg-[#141922] transition-colors group">
            <div className="flex justify-between items-center mb-4">
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">{s.label}</span>
              <s.icon className={`w-5 h-5 ${s.color} group-hover:scale-110 transition-transform`} />
            </div>
            <h3 className="text-2xl font-bold font-mono text-white">{s.val}</h3>
          </div>
        ))}
      </div>

      <div className="bg-[#0e121a] border border-gray-800 rounded-[32px] overflow-hidden shadow-2xl">
        {/* Navigation Tabs */}
        <div className="flex border-b border-gray-800 bg-[#141922]/30 p-2 gap-1 overflow-x-auto scrollbar-hide">
          {[
            { id: 'withdrawals', label: 'Withdrawals', count: pendingWithdrawals.length },
            { id: 'users', label: 'User Directory', count: users.length },
            { id: 'plans', label: 'ROI Packages', count: plans.length },
            { id: 'transactions', label: 'Ledger History', count: transactions.length },
            { id: 'debug', label: 'Developer Console', icon: Terminal },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-5 py-3 rounded-2xl font-bold transition-all flex items-center gap-3 whitespace-nowrap ${
                activeTab === tab.id ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-500 hover:text-white hover:bg-white/5'
              }`}
            >
              {tab.icon && <tab.icon className="w-4 h-4" />}
              {tab.label}
              {tab.count !== undefined && (
                <span className={`text-[9px] px-2 py-0.5 rounded-full ${activeTab === tab.id ? 'bg-white/20' : 'bg-gray-800'}`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="p-0">
          {activeTab === 'withdrawals' && (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-[#141922]/50 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                  <tr>
                    <th className="px-8 py-5">Initiator</th>
                    <th className="px-8 py-5">Requested Amount</th>
                    <th className="px-8 py-5">Payment Method</th>
                    <th className="px-8 py-5">Date</th>
                    <th className="px-8 py-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800/50">
                  {pendingWithdrawals.length === 0 ? (
                    <tr><td colSpan={5} className="p-24 text-center text-gray-500">No pending withdrawal requests found in queue.</td></tr>
                  ) : (
                    pendingWithdrawals.map(tx => {
                      const user = users.find(u => u.id === tx.userId);
                      return (
                        <tr key={tx.id} className="hover:bg-white/[0.02] transition-colors">
                          <td className="px-8 py-6">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center font-bold text-xs">{user?.name[0]}</div>
                              <div className="flex flex-col">
                                <span className="text-sm font-bold text-white">{user?.name}</span>
                                <span className="text-[10px] text-gray-500">{user?.email}</span>
                              </div>
                            </div>
                          </td>
                          <td className="px-8 py-6 text-amber-400 font-mono font-bold">${tx.amount.toLocaleString()}</td>
                          <td className="px-8 py-6">
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-gray-800/50 px-3 py-1 rounded-lg">
                              {tx.method || 'CRYPTO'}
                            </span>
                          </td>
                          <td className="px-8 py-6 text-xs text-gray-500">{new Date(tx.date).toLocaleDateString()}</td>
                          <td className="px-8 py-6 text-right">
                            <div className="flex items-center justify-end gap-3">
                               <button 
                                 onClick={() => adminApproveWithdrawal(tx.id)}
                                 className="p-3 bg-emerald-500/10 text-emerald-500 rounded-xl hover:bg-emerald-500 hover:text-white transition-all shadow-lg hover:shadow-emerald-500/20"
                                 title="Process Payout"
                               >
                                 <Check className="w-4 h-4" />
                               </button>
                               <button 
                                 onClick={() => adminRejectWithdrawal(tx.id)}
                                 className="p-3 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-lg hover:shadow-red-500/20"
                                 title="Reject Request"
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
            </div>
          )}

          {activeTab === 'users' && (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-[#141922]/50 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                  <tr>
                    <th className="px-8 py-5">Network Member</th>
                    <th className="px-8 py-5">Wallet Balance</th>
                    <th className="px-8 py-5">Total Stakes</th>
                    <th className="px-8 py-5">Account Status</th>
                    <th className="px-8 py-5 text-right">Management</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800/50">
                  {users.map(u => (
                    <tr key={u.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${u.role === UserRole.ADMIN ? 'bg-amber-600' : 'bg-blue-600'}`}>
                            {u.role === UserRole.ADMIN ? <ShieldAlert className="w-5 h-5" /> : u.name[0]}
                          </div>
                          <div className="flex flex-col">
                             <span className="text-sm font-bold text-white">{u.name}</span>
                             <span className="text-xs text-gray-600 font-mono">{u.email}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6 font-mono font-bold text-emerald-400 text-sm">${u.balance.toLocaleString()}</td>
                      <td className="px-8 py-6 font-mono text-xs text-gray-500">${u.totalInvested.toLocaleString()}</td>
                      <td className="px-8 py-6">
                        <span className={`px-3 py-1 rounded-lg text-[9px] font-bold uppercase tracking-widest ${u.isBlocked ? 'bg-red-500/10 text-red-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
                          {u.isBlocked ? 'Terminated' : 'Operational'}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-right">
                         {u.role !== UserRole.ADMIN && (
                            <button 
                             onClick={() => adminUpdateUser(u.id, { isBlocked: !u.isBlocked })}
                             className={`text-[9px] font-bold uppercase tracking-[0.2em] px-4 py-2 rounded-xl border border-white/5 transition-all ${u.isBlocked ? 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white' : 'bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white'}`}
                            >
                              {u.isBlocked ? 'Activate' : 'Suspend'}
                            </button>
                         )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'plans' && (
            <div className="p-8">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
                 <div>
                    <h4 className="text-xl font-bold text-white">Investment Asset Configuration</h4>
                    <p className="text-sm text-gray-500">Define ROI metrics and capital requirements for the public.</p>
                 </div>
                 <button 
                  onClick={() => handleOpenPlanModal()}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-8 py-4 rounded-2xl text-sm font-bold transition-all shadow-xl shadow-blue-900/30"
                 >
                   <Plus className="w-5 h-5" /> Deploy New Package
                 </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {plans.map(p => (
                  <div key={p.id} className="bg-[#141922] border border-gray-800 p-8 rounded-[40px] relative group hover:border-blue-500/40 transition-all shadow-lg">
                    <div className="absolute top-6 right-6 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => handleOpenPlanModal(p)} className="p-3 bg-gray-800 rounded-xl hover:bg-blue-600 text-white transition-colors"><Edit className="w-4 h-4" /></button>
                      <button onClick={() => adminDeletePlan(p.id)} className="p-3 bg-gray-800 rounded-xl hover:bg-red-600 text-white transition-colors"><Trash2 className="w-4 h-4" /></button>
                    </div>
                    <div className="mb-6">
                      <h5 className="font-bold text-xl text-white mb-2">{p.name}</h5>
                      <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest bg-white/5 px-3 py-1 rounded-full">{p.durationDays} Day Cycle</span>
                    </div>
                    <p className="text-blue-500 font-bold text-4xl mb-8">{p.roi}% <span className="text-xs text-gray-600 font-normal">DAILY YIELD</span></p>
                    <div className="space-y-4 text-xs font-medium">
                      <div className="flex justify-between items-center text-gray-400"><span>Minimum Deposit</span> <span className="text-white font-mono font-bold text-sm">${p.minAmount}</span></div>
                      <div className="flex justify-between items-center text-gray-400"><span>Maximum Deposit</span> <span className="text-white font-mono font-bold text-sm">${p.maxAmount}</span></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'transactions' && (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-[#141922]/50 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                  <tr>
                    <th className="px-8 py-5">Beneficiary</th>
                    <th className="px-8 py-5">Ledger Type</th>
                    <th className="px-8 py-5">Amount</th>
                    <th className="px-8 py-5">Timestamp</th>
                    <th className="px-8 py-5">Confirmation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800/50">
                  {transactions.slice(0, 50).map(tx => {
                    const user = users.find(u => u.id === tx.userId);
                    return (
                      <tr key={tx.id} className="hover:bg-white/[0.01] transition-colors">
                        <td className="px-8 py-6">
                          <span className="text-sm font-medium text-white">{user?.name || 'TERMINATED_USER'}</span>
                        </td>
                        <td className="px-8 py-6">
                          <span className="text-[9px] font-bold uppercase tracking-widest text-gray-500 border border-white/5 px-2 py-1 rounded">{tx.type}</span>
                        </td>
                        <td className="px-8 py-6 font-mono font-bold text-white text-sm">${tx.amount.toLocaleString()}</td>
                        <td className="px-8 py-6 text-[10px] text-gray-600 uppercase tracking-tighter">{new Date(tx.date).toLocaleString()}</td>
                        <td className="px-8 py-6">
                           <span className={`px-2 py-1 rounded-lg text-[8px] font-bold uppercase tracking-[0.2em] ${
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
            </div>
          )}

          {activeTab === 'debug' && (
            <div className="p-12 space-y-10 max-w-4xl mx-auto">
               <div className="text-center">
                  <Terminal className="w-16 h-16 text-blue-500 mx-auto mb-6" />
                  <h3 className="text-2xl font-bold mb-4">Internal Debugging Console</h3>
                  <p className="text-gray-400">Developer tools to manipulate system clock and simulate platform events.</p>
               </div>

               <div className="grid md:grid-cols-2 gap-8">
                  <div className="bg-[#141922] p-8 rounded-[40px] border border-blue-500/20 space-y-6">
                     <div className="flex items-center gap-3 mb-2">
                        <RefreshCw className="w-6 h-6 text-blue-500" />
                        <h4 className="font-bold text-lg">Simulator Time Warp</h4>
                     </div>
                     <p className="text-sm text-gray-500 leading-relaxed">
                        Forces the investment calculator to process immediately by setting all active investment 'nextPayout' timestamps to the past.
                     </p>
                     <button 
                        onClick={debugTriggerProfit}
                        className="w-full py-4 bg-blue-600 hover:bg-blue-700 rounded-2xl font-bold text-sm transition-all shadow-xl shadow-blue-900/20 flex items-center justify-center gap-2"
                     >
                        Force Global Profit Cycle
                     </button>
                  </div>

                  <div className="bg-[#141922] p-8 rounded-[40px] border border-amber-500/20 space-y-6">
                     <div className="flex items-center gap-3 mb-2">
                        <ShieldAlert className="w-6 h-6 text-amber-500" />
                        <h4 className="font-bold text-lg">System Audit</h4>
                     </div>
                     <p className="text-sm text-gray-500 leading-relaxed">
                        Current Memory state contains <b>{transactions.length}</b> records and <b>{investments.length}</b> active contracts.
                     </p>
                     <button 
                        onClick={() => {
                          localStorage.clear();
                          window.location.reload();
                        }}
                        className="w-full py-4 bg-red-600/10 hover:bg-red-600 text-red-500 hover:text-white border border-red-500/20 rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2"
                     >
                        Nuke Storage (Reset Platform)
                     </button>
                  </div>
               </div>
            </div>
          )}
        </div>
      </div>

      {/* Plan Modal Overlay */}
      {isPlanModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 backdrop-blur-xl bg-black/60">
          <div className="bg-[#0e121a] border border-gray-800 w-full max-w-xl rounded-[48px] shadow-2xl overflow-hidden animate-in zoom-in slide-in-from-bottom-4 duration-300">
            <div className="p-10 border-b border-gray-800 flex justify-between items-center bg-[#141922]/50">
              <h3 className="text-3xl font-bold">{editingPlan ? 'Edit Package' : 'New Strategic Asset'}</h3>
              <button onClick={() => setIsPlanModalOpen(false)} className="text-gray-500 hover:text-white bg-white/5 p-2 rounded-xl transition-all"><X /></button>
            </div>
            <form onSubmit={handleSavePlan} className="p-10 space-y-8">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Asset Nomenclature</label>
                <input required name="name" defaultValue={editingPlan?.name} className="w-full bg-[#141922] border border-gray-800 rounded-[20px] px-6 py-4 outline-none focus:border-blue-500 transition-all font-bold" placeholder="e.g. Ethereum Gold Plus" />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Target Daily ROI (%)</label>
                  <input required type="number" step="0.1" name="roi" defaultValue={editingPlan?.roi} className="w-full bg-[#141922] border border-gray-800 rounded-[20px] px-6 py-4 outline-none focus:border-blue-500 transition-all font-mono" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Lifecycle (Days)</label>
                  <input required type="number" name="durationDays" defaultValue={editingPlan?.durationDays} className="w-full bg-[#141922] border border-gray-800 rounded-[20px] px-6 py-4 outline-none focus:border-blue-500 transition-all font-mono" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Minimum Stake ($)</label>
                  <input required type="number" name="minAmount" defaultValue={editingPlan?.minAmount} className="w-full bg-[#141922] border border-gray-800 rounded-[20px] px-6 py-4 outline-none focus:border-blue-500 transition-all font-mono" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Maximum Stake ($)</label>
                  <input required type="number" name="maxAmount" defaultValue={editingPlan?.maxAmount} className="w-full bg-[#141922] border border-gray-800 rounded-[20px] px-6 py-4 outline-none focus:border-blue-500 transition-all font-mono" />
                </div>
              </div>
              <button type="submit" className="w-full py-6 bg-blue-600 hover:bg-blue-700 rounded-[24px] font-bold text-lg shadow-2xl shadow-blue-900/50 transition-all flex items-center justify-center gap-3">
                <Save className="w-6 h-6" /> Deploy Configuration
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
