
import React, { useState } from 'react';
import { useApp } from '../store/AppContext';
import { 
  ShieldAlert, Users as UsersIcon, Wallet, Layers, Check, X, Edit, Trash2, 
  Plus, Save, Terminal, RefreshCw, BarChart3, Settings, 
  History, CreditCard, LayoutGrid, ArrowUpCircle, UserPlus, Fingerprint,
  Clock
} from 'lucide-react';
import { TransactionStatus, UserRole, InvestmentPlan } from '../types';
import { StatCard, ActionModule, AdminTable, StatusBadge } from '../components/AdminShared';

export const AdminPanel = () => {
  const { 
    users, transactions, plans, platformStats, investments,
    adminApproveWithdrawal, adminRejectWithdrawal, adminUpdateUser, 
    adminDeletePlan, adminCreatePlan, adminUpdatePlan, debugTriggerProfit 
  } = useApp();
  
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'withdrawals' | 'plans' | 'ledger' | 'system'>('overview');
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<InvestmentPlan | null>(null);

  const pendingWithdrawals = transactions.filter(t => t.type === 'WITHDRAWAL' && t.status === TransactionStatus.PENDING);

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

  const handleEditUserBalance = (userId: string) => {
    const newBalanceStr = prompt("Enter new balance amount:");
    if (newBalanceStr !== null) {
      const amount = parseFloat(newBalanceStr);
      if (!isNaN(amount)) {
        adminUpdateUser(userId, { balance: amount });
      }
    }
  };

  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in duration-500 pb-20 md:pb-0">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-black text-white flex items-center gap-3">
            <ShieldAlert className="text-blue-500 w-6 h-6 md:w-8 md:h-8" /> Command Center
          </h2>
          <p className="text-gray-500 text-xs md:text-sm font-medium">Platform Management & Oversight</p>
        </div>
        <div className="flex items-center gap-2 md:gap-3">
           <button 
             onClick={debugTriggerProfit}
             className="flex items-center gap-2 bg-emerald-600/10 hover:bg-emerald-600 text-emerald-500 hover:text-white px-3 md:px-4 py-2 md:py-2.5 rounded-xl text-[9px] md:text-[10px] font-bold uppercase tracking-widest transition-all border border-emerald-500/20"
           >
             <RefreshCw className="w-3 md:w-3.5 h-3 md:h-3.5" /> Force Profit
           </button>
           <div className="bg-blue-600/10 border border-blue-600/20 px-3 md:px-4 py-2 rounded-xl flex items-center gap-2">
             <div className="w-1.5 md:w-2 h-1.5 md:h-2 rounded-full bg-blue-500 animate-pulse" />
             <span className="text-[9px] md:text-[10px] font-bold text-blue-500 uppercase tracking-widest">Active</span>
           </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex border-b border-gray-800 bg-[#0e121a]/50 backdrop-blur-md sticky top-20 z-20 p-1.5 gap-1 overflow-x-auto scrollbar-hide rounded-2xl no-scrollbar">
        {[
          { id: 'overview', label: 'Dashboard', icon: LayoutGrid },
          { id: 'withdrawals', label: 'Queue', icon: CreditCard, badge: pendingWithdrawals.length },
          { id: 'users', label: 'Members', icon: UsersIcon },
          { id: 'plans', label: 'Assets', icon: Layers },
          { id: 'ledger', label: 'Ledger', icon: History },
          { id: 'system', label: 'System', icon: Settings },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-3 md:px-5 py-2 md:py-3 rounded-xl font-bold transition-all flex items-center gap-2 md:gap-3 whitespace-nowrap ${
              activeTab === tab.id ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-500 hover:text-white hover:bg-white/5'
            }`}
          >
            <tab.icon className="w-3.5 md:w-4 h-3.5 md:h-4" />
            <span className="text-[10px] md:text-sm uppercase tracking-tight">{tab.label}</span>
            {tab.badge ? (
              <span className={`text-[8px] md:text-[9px] px-1.5 py-0.5 rounded-full ${activeTab === tab.id ? 'bg-white text-blue-600' : 'bg-red-500 text-white animate-pulse'}`}>
                {tab.badge}
              </span>
            ) : null}
          </button>
        ))}
      </div>

      <div className="min-h-[400px]">
        {activeTab === 'overview' && (
          <div className="space-y-6 md:space-y-8 animate-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              <StatCard label="Network Value" value={`$${platformStats.platformBalance.toLocaleString()}`} icon={Wallet} color="text-blue-500" bg="bg-blue-500/10" />
              <StatCard label="Active Capital" value={`$${platformStats.totalInvested.toLocaleString()}`} icon={Layers} color="text-purple-500" bg="bg-purple-500/10" />
              <StatCard label="Withdrawals" value={`$${platformStats.totalWithdrawals.toLocaleString()}`} icon={ArrowUpCircle} color="text-emerald-500" bg="bg-emerald-500/10" />
              <StatCard label="Network Size" value={platformStats.totalUsers} icon={UsersIcon} color="text-amber-500" bg="bg-amber-500/10" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              <ActionModule 
                title="Financial Ops" description="Approve or reject capital extraction requests from members." icon={CreditCard} colorClass="text-emerald-500" bgClass="bg-emerald-500/10"
                primaryAction={{ label: `Withdrawals (${pendingWithdrawals.length})`, onClick: () => setActiveTab('withdrawals') }}
                secondaryAction={{ icon: History, onClick: () => setActiveTab('ledger') }}
              />
              <ActionModule 
                title="ROI Packages" description="Define and optimize investment tiers and daily interest engines." icon={Layers} colorClass="text-blue-500" bgClass="bg-blue-500/10"
                primaryAction={{ label: `Manage Plans (${plans.length})`, onClick: () => setActiveTab('plans') }}
              />
              <ActionModule 
                title="User Audit" description="Real-time control over account status and verified balances." icon={Fingerprint} colorClass="text-purple-500" bgClass="bg-purple-500/10"
                primaryAction={{ label: 'Database Access', onClick: () => setActiveTab('users') }}
              />
            </div>
          </div>
        )}

        {activeTab === 'withdrawals' && (
          <AdminTable title="Withdrawal Queue" subtitle="Action Required" headers={['Entity', 'Amount', 'Method', 'Date', 'Process']}>
            {pendingWithdrawals.length === 0 ? (
              <tr><td colSpan={5} className="p-20 md:p-32 text-center text-gray-500 text-sm font-medium">Queue is currently clear.</td></tr>
            ) : (
              pendingWithdrawals.map(tx => {
                const user = users.find(u => u.id === tx.userId);
                return (
                  <tr key={tx.id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="px-5 md:px-8 py-4 md:py-6 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-blue-600 flex items-center justify-center font-black text-xs md:text-sm text-white">{user?.name[0]}</div>
                        <div className="flex flex-col">
                          <span className="text-xs md:text-sm font-bold text-white">{user?.name}</span>
                          <span className="text-[8px] md:text-[10px] text-gray-500 font-mono uppercase">{user?.referralCode}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 md:px-8 py-4 md:py-6 font-mono font-black text-amber-500 text-sm md:text-lg">${tx.amount.toLocaleString()}</td>
                    <td className="px-5 md:px-8 py-4 md:py-6">
                      <StatusBadge status={tx.method || 'CRYPTO'} variant="info" />
                    </td>
                    <td className="px-5 md:px-8 py-4 md:py-6 text-[10px] text-gray-500 font-medium">{new Date(tx.date).toLocaleDateString()}</td>
                    <td className="px-5 md:px-8 py-4 md:py-6 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5 md:gap-2">
                         <button onClick={() => adminApproveWithdrawal(tx.id)} className="p-2 md:p-3 bg-emerald-500/10 text-emerald-500 rounded-lg md:rounded-xl hover:bg-emerald-500 hover:text-white transition-all"><Check className="w-4 h-4 md:w-5 md:h-5" /></button>
                         <button onClick={() => adminRejectWithdrawal(tx.id)} className="p-2 md:p-3 bg-red-500/10 text-red-500 rounded-lg md:rounded-xl hover:bg-red-500 hover:text-white transition-all"><X className="w-4 h-4 md:w-5 md:h-5" /></button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </AdminTable>
        )}

        {activeTab === 'users' && (
          <AdminTable 
            title={`Network Directory (${users.length})`} 
            headers={['User Profile', 'Balance', 'Stakes', 'Status', 'Ops']}
            action={<button className="flex items-center gap-2 bg-white/5 hover:bg-white/10 px-4 py-2 rounded-xl text-[10px] md:text-xs font-bold transition-all border border-white/10"><UserPlus className="w-4 h-4" /> New User</button>}
          >
            {users.map(u => (
              <tr key={u.id} className="hover:bg-white/[0.02] transition-colors group">
                <td className="px-5 md:px-8 py-4 md:py-6 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 md:w-12 md:h-12 rounded-lg md:rounded-2xl flex items-center justify-center font-black text-xs md:text-sm ${u.role === UserRole.ADMIN ? 'bg-amber-600' : 'bg-blue-600'}`}>
                      {u.role === UserRole.ADMIN ? <ShieldAlert className="w-4 h-4 md:w-6 md:h-6 text-white" /> : u.name[0]}
                    </div>
                    <div className="flex flex-col">
                       <span className="text-xs md:text-sm font-bold text-white">{u.name}</span>
                       <span className="text-[8px] md:text-[10px] text-gray-600 font-mono truncate max-w-[120px] md:max-w-none">{u.email}</span>
                    </div>
                  </div>
                </td>
                <td className="px-5 md:px-8 py-4 md:py-6">
                  <div className="flex items-center gap-1.5 cursor-pointer" onClick={() => handleEditUserBalance(u.id)}>
                    <span className="font-mono font-black text-emerald-500 text-sm md:text-lg">${u.balance.toLocaleString()}</span>
                  </div>
                </td>
                <td className="px-5 md:px-8 py-4 md:py-6 font-mono text-xs text-gray-500 font-bold">${u.totalInvested.toLocaleString()}</td>
                <td className="px-5 md:px-8 py-4 md:py-6">
                  <StatusBadge status={u.isBlocked ? 'Blocked' : 'Live'} variant={u.isBlocked ? 'danger' : 'success'} />
                </td>
                <td className="px-5 md:px-8 py-4 md:py-6 text-right whitespace-nowrap">
                   <div className="flex items-center justify-end gap-1.5 md:gap-2">
                     <button className="p-2 bg-white/5 rounded-lg text-gray-500"><Edit className="w-3.5 h-3.5 md:w-4 md:h-4" /></button>
                     {u.role !== UserRole.ADMIN && (
                        <button onClick={() => adminUpdateUser(u.id, { isBlocked: !u.isBlocked })} className={`p-2 rounded-lg border border-white/5 ${u.isBlocked ? 'text-emerald-500 hover:bg-emerald-500 hover:text-white' : 'text-red-500 hover:bg-red-500 hover:text-white'}`}>
                          {u.isBlocked ? <Check className="w-3.5 h-3.5 md:w-4 md:h-4" /> : <ShieldAlert className="w-3.5 h-3.5 md:w-4 md:h-4" />}
                        </button>
                     )}
                   </div>
                </td>
              </tr>
            ))}
          </AdminTable>
        )}

        {activeTab === 'plans' && (
          <div className="space-y-6 md:space-y-8 animate-in zoom-in-95 duration-300">
            <div className="bg-[#0e121a] border border-gray-800 p-6 md:p-10 rounded-[32px] md:rounded-[48px] flex flex-col sm:flex-row justify-between items-center gap-6 text-center sm:text-left">
               <div>
                  <h4 className="text-2xl md:text-3xl font-black text-white mb-2">ROI Engine</h4>
                  <p className="text-xs md:text-sm text-gray-500 font-medium">Platform-wide yield configuration center.</p>
               </div>
               <button onClick={() => handleOpenPlanModal()} className="w-full sm:w-auto flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 px-8 py-4 md:py-5 rounded-2xl md:rounded-[24px] text-sm md:text-lg font-black transition-all shadow-xl">
                 <Plus className="w-5 h-5 md:w-6 md:h-6" /> Create Plan
               </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
              {plans.map(p => (
                <div key={p.id} className="bg-[#0e121a] border border-gray-800 p-8 md:p-10 rounded-[32px] md:rounded-[48px] relative group overflow-hidden">
                  <div className="absolute top-4 right-4 flex gap-2 sm:opacity-0 group-hover:opacity-100 transition-all">
                    <button onClick={() => handleOpenPlanModal(p)} className="p-2 md:p-3 bg-gray-800 rounded-xl hover:bg-blue-600 text-white"><Edit className="w-4 h-4 md:w-5 md:h-5" /></button>
                    <button onClick={() => adminDeletePlan(p.id)} className="p-2 md:p-3 bg-gray-800 rounded-xl hover:bg-red-600 text-white"><Trash2 className="w-4 h-4 md:w-5 md:h-5" /></button>
                  </div>
                  <div className="mb-8">
                    <h5 className="font-black text-xl md:text-2xl text-white mb-2">{p.name}</h5>
                    <div className="flex items-center gap-2 text-gray-600 text-[10px] font-bold uppercase tracking-widest"><Clock className="w-3 h-3" /> {p.durationDays} Days</div>
                  </div>
                  <div className="mb-8">
                     <p className="text-blue-500 font-black text-4xl md:text-6xl font-mono tracking-tighter">{p.roi}%</p>
                     <p className="text-[9px] md:text-[10px] text-gray-600 font-black uppercase tracking-widest mt-1">Daily Yield</p>
                  </div>
                  <div className="space-y-3 pt-6 border-t border-gray-800/50 text-[10px] md:text-xs">
                    <div className="flex justify-between items-center"><span className="text-gray-500 font-bold uppercase tracking-widest">Min</span> <span className="text-white font-mono font-black text-sm md:text-base">${p.minAmount}</span></div>
                    <div className="flex justify-between items-center"><span className="text-gray-500 font-bold uppercase tracking-widest">Max</span> <span className="text-white font-mono font-black text-sm md:text-base">${p.maxAmount}</span></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'ledger' && (
          <AdminTable title="System Ledger" headers={['Target', 'Type', 'Amount', 'Time', 'Status']}>
            {transactions.slice(0, 50).map(tx => {
              const user = users.find(u => u.id === tx.userId);
              return (
                <tr key={tx.id} className="hover:bg-white/[0.01] transition-colors group">
                  <td className="px-5 md:px-8 py-4 md:py-6 whitespace-nowrap">
                    <span className="text-xs md:text-sm font-bold text-white">{user?.name || 'SYS'}</span>
                    <span className="block text-[8px] text-gray-600 font-mono">#{tx.id.substr(0,8)}</span>
                  </td>
                  <td className="px-5 md:px-8 py-4 md:py-6">
                    <span className="text-[8px] md:text-[10px] font-black uppercase text-gray-500 border border-white/5 px-2 py-1 rounded-lg">{tx.type}</span>
                  </td>
                  <td className="px-5 md:px-8 py-4 md:py-6">
                     <span className={`text-sm md:text-base font-black font-mono ${tx.type === 'WITHDRAWAL' ? 'text-red-500' : 'text-emerald-500'}`}>
                       {tx.type === 'WITHDRAWAL' ? '-' : '+'}${tx.amount.toLocaleString()}
                     </span>
                  </td>
                  <td className="px-5 md:px-8 py-4 md:py-6 text-[9px] md:text-[10px] text-gray-600 font-bold">{new Date(tx.date).toLocaleString()}</td>
                  <td className="px-5 md:px-8 py-4 md:py-6">
                    <StatusBadge 
                      status={tx.status} 
                      variant={tx.status === 'COMPLETED' ? 'success' : tx.status === 'PENDING' ? 'warning' : 'danger'} 
                    />
                  </td>
                </tr>
              );
            })}
          </AdminTable>
        )}

        {activeTab === 'system' && (
          <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-8 md:space-y-12 animate-in slide-in-from-bottom-8 duration-700">
             <div className="text-center bg-[#0e121a] border border-gray-800 p-8 md:p-16 rounded-[40px] md:rounded-[64px] relative overflow-hidden">
                <Terminal className="w-12 h-12 md:w-20 md:h-20 text-blue-500 mx-auto mb-6 md:mb-8 animate-pulse" />
                <h3 className="text-2xl md:text-4xl font-black mb-2 md:mb-4">Internal Mainframe</h3>
                <p className="text-xs md:text-gray-500 max-w-xl mx-auto font-medium">Reset environment or force distribution cycles.</p>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
                <div className="bg-[#0e121a] p-8 md:p-10 rounded-[32px] md:rounded-[48px] border border-blue-500/20 space-y-6">
                   <div className="flex items-center gap-4">
                      <div className="p-3 bg-blue-500/10 rounded-2xl text-blue-500"><RefreshCw className="w-6 h-6 md:w-8 md:h-8" /></div>
                      <h4 className="font-black text-xl md:text-2xl">Time Warp</h4>
                   </div>
                   <p className="text-[10px] md:text-sm text-gray-500 leading-relaxed">Trigger immediate profit payouts for all active contracts.</p>
                   <button onClick={debugTriggerProfit} className="w-full py-4 bg-blue-600 hover:bg-blue-700 rounded-2xl font-black text-xs md:text-lg transition-all shadow-lg flex items-center justify-center gap-3">Force Cycle</button>
                </div>

                <div className="bg-[#0e121a] p-8 md:p-10 rounded-[32px] md:rounded-[48px] border border-red-500/20 space-y-6">
                   <div className="flex items-center gap-4">
                      <div className="p-3 bg-red-500/10 rounded-2xl text-red-500"><BarChart3 className="w-6 h-6 md:w-8 md:h-8" /></div>
                      <h4 className="font-black text-xl md:text-2xl">Purge Data</h4>
                   </div>
                   <p className="text-[10px] md:text-sm text-gray-500 leading-relaxed">Wipe all users, logs and assets from local storage.</p>
                   <button onClick={() => { if(confirm("Nuke data?")) { localStorage.clear(); window.location.reload(); } }} className="w-full py-4 bg-red-600/10 hover:bg-red-600 text-red-500 hover:text-white border border-red-500/20 rounded-2xl font-black text-xs md:text-lg transition-all">Nuclear Reset</button>
                </div>
             </div>
          </div>
        )}
      </div>

      {isPlanModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 md:p-6 backdrop-blur-2xl bg-black/60">
          <div className="bg-[#0e121a] border border-white/10 w-full max-w-2xl rounded-[32px] md:rounded-[64px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 max-h-[90vh] flex flex-col">
            <div className="p-6 md:p-12 border-b border-white/5 flex justify-between items-center bg-[#141922]/50">
              <h3 className="text-2xl md:text-4xl font-black">{editingPlan ? 'Refactor' : 'New Plan'}</h3>
              <button onClick={() => setIsPlanModalOpen(false)} className="text-gray-500 hover:text-white bg-white/5 p-3 rounded-xl"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSavePlan} className="p-6 md:p-12 space-y-6 md:space-y-10 overflow-y-auto no-scrollbar">
              <div className="space-y-2">
                <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest ml-1">Plan Name</label>
                <input required name="name" defaultValue={editingPlan?.name} className="w-full bg-[#141922] border border-white/5 rounded-2xl px-5 md:px-8 py-4 md:py-5 outline-none focus:border-blue-500 text-white font-bold" />
              </div>
              <div className="grid grid-cols-2 gap-4 md:gap-8">
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest ml-1">Yield (%)</label>
                  <input required type="number" step="0.1" name="roi" defaultValue={editingPlan?.roi} className="w-full bg-[#141922] border border-white/5 rounded-2xl px-5 md:px-8 py-4 md:py-5 outline-none focus:border-blue-500 text-blue-500 font-mono font-black" />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest ml-1">Days</label>
                  <input required type="number" name="durationDays" defaultValue={editingPlan?.durationDays} className="w-full bg-[#141922] border border-white/5 rounded-2xl px-5 md:px-8 py-4 md:py-5 outline-none focus:border-blue-500 text-white font-mono font-black" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 md:gap-8">
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest ml-1">Min ($)</label>
                  <input required type="number" name="minAmount" defaultValue={editingPlan?.minAmount} className="w-full bg-[#141922] border border-white/5 rounded-2xl px-5 md:px-8 py-4 md:py-5 outline-none focus:border-blue-500 text-emerald-500 font-mono font-black" />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest ml-1">Max ($)</label>
                  <input required type="number" name="maxAmount" defaultValue={editingPlan?.maxAmount} className="w-full bg-[#141922] border border-white/5 rounded-2xl px-5 md:px-8 py-4 md:py-5 outline-none focus:border-blue-500 text-emerald-500 font-mono font-black" />
                </div>
              </div>
              <button type="submit" className="w-full py-5 md:py-7 bg-blue-600 hover:bg-blue-700 rounded-2xl md:rounded-[32px] font-black text-sm md:text-xl shadow-xl flex items-center justify-center gap-3">
                <Save className="w-5 h-5 md:w-7 md:h-7" /> Save Asset
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
