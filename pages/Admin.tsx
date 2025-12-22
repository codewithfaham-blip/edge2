
import React, { useState } from 'react';
import { useApp } from '../store/AppContext';
import { 
  ShieldAlert, Users as UsersIcon, Wallet, Layers, Check, X, Edit, Trash2, 
  Plus, Save, Terminal, RefreshCw, BarChart3, Settings, 
  History, CreditCard, LayoutGrid, ArrowUpCircle, UserPlus, Fingerprint,
  Clock, Search, ArrowRightLeft
} from 'lucide-react';
import { TransactionStatus, UserRole, InvestmentPlan, TransactionType } from '../types';
import { StatCard, ActionModule, AdminTable, StatusBadge } from '../components/AdminShared';

export const AdminPanel = () => {
  const { 
    users, transactions, plans, platformStats,
    adminApproveWithdrawal, adminRejectWithdrawal, adminUpdateUser, 
    adminDeletePlan, adminCreatePlan, adminUpdatePlan, debugTriggerProfit 
  } = useApp();
  
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'withdrawals' | 'plans' | 'system'>('overview');
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<InvestmentPlan | null>(null);

  const pendingWithdrawals = transactions.filter(t => t.type === TransactionType.WITHDRAWAL && t.status === TransactionStatus.PENDING);

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
    <div className="space-y-6 md:space-y-10 animate-in fade-in duration-500 pb-24 md:pb-10">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl md:text-4xl font-black text-white flex items-center gap-3 tracking-tighter">
            <ShieldAlert className="text-blue-500 w-8 h-8 md:w-10 md:h-10" /> Command Center
          </h2>
          <p className="text-gray-500 text-sm md:text-base font-medium mt-1">Real-time platform oversight & global asset control.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
           <button 
             onClick={debugTriggerProfit}
             className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-emerald-600/10 hover:bg-emerald-600 text-emerald-500 hover:text-white px-5 py-3 rounded-2xl text-[10px] md:text-xs font-black uppercase tracking-widest transition-all border border-emerald-500/20 shadow-lg shadow-emerald-900/10"
           >
             <RefreshCw className="w-4 h-4 animate-spin-slow" /> Force Profit
           </button>
           <div className="flex-1 sm:flex-none bg-blue-600/10 border border-blue-600/20 px-5 py-3 rounded-2xl flex items-center justify-center gap-2">
             <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
             <span className="text-[10px] md:text-xs font-black text-blue-500 uppercase tracking-widest">Sys_Online</span>
           </div>
        </div>
      </div>

      {/* Navigation - Ultra-Responsive Tab Bar */}
      <div className="flex border-b border-gray-800 bg-[#0e121a]/60 backdrop-blur-xl sticky top-20 z-20 p-2 gap-2 overflow-x-auto scrollbar-hide rounded-[24px] no-scrollbar shadow-2xl">
        {[
          { id: 'overview', label: 'Summary', icon: LayoutGrid },
          { id: 'withdrawals', label: 'Payouts', icon: CreditCard, badge: pendingWithdrawals.length },
          { id: 'users', label: 'Members', icon: UsersIcon },
          { id: 'plans', label: 'Engine', icon: Layers },
          { id: 'system', label: 'Kernel', icon: Settings },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 md:px-8 py-3 md:py-4 rounded-xl md:rounded-2xl font-black transition-all flex items-center gap-2 md:gap-4 whitespace-nowrap group ${
              activeTab === tab.id 
              ? 'bg-blue-600 text-white shadow-xl shadow-blue-900/40 ring-2 ring-blue-400/20' 
              : 'text-gray-500 hover:text-white hover:bg-white/5'
            }`}
          >
            <tab.icon className={`w-4 h-4 md:w-5 md:h-5 ${activeTab === tab.id ? 'scale-110' : 'group-hover:scale-110 transition-transform'}`} />
            <span className="text-[10px] md:text-sm uppercase tracking-widest font-black">{tab.label}</span>
            {tab.badge ? (
              <span className={`text-[9px] md:text-[10px] px-2 py-0.5 rounded-lg font-black ${
                activeTab === tab.id ? 'bg-white text-blue-600' : 'bg-red-500 text-white animate-pulse'
              }`}>
                {tab.badge}
              </span>
            ) : null}
          </button>
        ))}
      </div>

      <div className="min-h-[500px]">
        {activeTab === 'overview' && (
          <div className="space-y-8 md:space-y-12 animate-in slide-in-from-bottom-6 duration-500">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
              <StatCard label="Total Value Lock" value={`$${platformStats.platformBalance.toLocaleString()}`} icon={Wallet} color="text-blue-500" bg="bg-blue-500/10" />
              <StatCard label="Network Stake" value={`$${platformStats.totalInvested.toLocaleString()}`} icon={Layers} color="text-purple-500" bg="bg-purple-500/10" />
              <StatCard label="Paid Out Dividends" value={`$${platformStats.totalWithdrawals.toLocaleString()}`} icon={ArrowUpCircle} color="text-emerald-500" bg="bg-emerald-500/10" />
              <StatCard label="Unique Clusters" value={platformStats.totalUsers} icon={UsersIcon} color="text-amber-500" bg="bg-amber-500/10" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              <ActionModule 
                title="Liquidity Ops" description="Process pending cash-out requests and verify proof-of-stake dividends." icon={CreditCard} colorClass="text-emerald-500" bgClass="bg-emerald-500/10"
                primaryAction={{ label: `Approve Payouts (${pendingWithdrawals.length})`, onClick: () => setActiveTab('withdrawals') }}
                secondaryAction={{ icon: History, onClick: () => setIsHistoryModalOpen(true) }}
              />
              <ActionModule 
                title="Yield Strategies" description="Fine-tune algorithmic ROI models and deploy new investment tier packages." icon={Layers} colorClass="text-blue-500" bgClass="bg-blue-500/10"
                primaryAction={{ label: `Optimize Packs (${plans.length})`, onClick: () => setActiveTab('plans') }}
              />
              <ActionModule 
                title="Member Security" description="Audit user accounts, adjust balances, and maintain network integrity." icon={Fingerprint} colorClass="text-purple-500" bgClass="bg-purple-500/10"
                primaryAction={{ label: 'Audit Members', onClick: () => setActiveTab('users') }}
              />
            </div>
          </div>
        )}

        {activeTab === 'withdrawals' && (
          <AdminTable title="Liquidity Requests" subtitle="Awaiting manual blockchain verification" headers={['User Identity', 'Amount', 'Network', 'Date', 'Actions']}>
            {pendingWithdrawals.length === 0 ? (
              <tr><td colSpan={5} className="p-32 text-center text-gray-600 text-sm font-bold uppercase tracking-widest italic opacity-50">Liquidity Queue Empty</td></tr>
            ) : (
              pendingWithdrawals.map(tx => {
                const user = users.find(u => u.id === tx.userId);
                return (
                  <tr key={tx.id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="px-6 md:px-8 py-5 md:py-7 whitespace-nowrap">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-blue-600 flex items-center justify-center font-black text-sm text-white overflow-hidden shadow-lg">
                          {user?.avatar ? (
                            <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                          ) : (
                            user?.name[0]
                          )}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm md:text-base font-black text-white">{user?.name}</span>
                          <span className="text-[10px] text-gray-600 font-black uppercase tracking-tighter">{user?.referralCode}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 md:px-8 py-5 md:py-7 font-mono font-black text-amber-500 text-base md:text-xl">${tx.amount.toLocaleString()}</td>
                    <td className="px-6 md:px-8 py-5 md:py-7">
                      <StatusBadge status={tx.method || 'BLOCKCHAIN'} variant="info" />
                    </td>
                    <td className="px-6 md:px-8 py-5 md:py-7 text-[10px] md:text-xs text-gray-500 font-black font-mono">{new Date(tx.date).toLocaleDateString()}</td>
                    <td className="px-6 md:px-8 py-5 md:py-7 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                         <button onClick={() => adminApproveWithdrawal(tx.id)} className="p-3 bg-emerald-500/10 text-emerald-500 rounded-2xl hover:bg-emerald-500 hover:text-white transition-all shadow-inner"><Check className="w-5 h-5" /></button>
                         <button onClick={() => adminRejectWithdrawal(tx.id)} className="p-3 bg-red-500/10 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all shadow-inner"><X className="w-5 h-5" /></button>
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
            title={`Registered Nodes (${users.length})`} 
            headers={['Profile', 'Liquid Balance', 'Total Stake', 'Network Status', 'Kernel Ops']}
            action={<button className="flex items-center gap-2 bg-blue-600/10 hover:bg-blue-600 border border-blue-500/20 text-blue-500 hover:text-white px-6 py-3 rounded-2xl text-xs font-black transition-all shadow-lg"><UserPlus className="w-4 h-4" /> Deploy Node</button>}
          >
            {users.map(u => (
              <tr key={u.id} className="hover:bg-white/[0.02] transition-colors group">
                <td className="px-6 md:px-8 py-5 md:py-7 whitespace-nowrap">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 md:w-14 md:h-14 rounded-2xl flex items-center justify-center font-black text-sm overflow-hidden shadow-2xl ${u.role === UserRole.ADMIN && !u.avatar ? 'bg-amber-600' : 'bg-blue-600'}`}>
                      {u.avatar ? (
                        <img src={u.avatar} alt={u.name} className="w-full h-full object-cover" />
                      ) : (
                        u.role === UserRole.ADMIN ? <ShieldAlert className="w-6 h-6 text-white" /> : u.name[0]
                      )}
                    </div>
                    <div className="flex flex-col">
                       <span className="text-sm md:text-base font-black text-white">{u.name}</span>
                       <span className="text-[10px] text-gray-600 font-mono font-black truncate max-w-[100px] md:max-w-none">{u.email}</span>
                    </div>
                  </div>
                </td>
                <td className="px-6 md:px-8 py-5 md:py-7">
                  <div className="flex items-center gap-2 cursor-pointer group/bal" onClick={() => handleEditUserBalance(u.id)}>
                    <span className="font-mono font-black text-emerald-500 text-base md:text-xl">${u.balance.toLocaleString()}</span>
                    <Edit className="w-3 h-3 text-gray-700 opacity-0 group-hover/bal:opacity-100 transition-opacity" />
                  </div>
                </td>
                <td className="px-6 md:px-8 py-5 md:py-7 font-mono text-xs md:text-sm text-gray-500 font-black tracking-tighter">${u.totalInvested.toLocaleString()}</td>
                <td className="px-6 md:px-8 py-5 md:py-7">
                  <StatusBadge status={u.isBlocked ? 'Dormant' : 'Verified'} variant={u.isBlocked ? 'danger' : 'success'} />
                </td>
                <td className="px-6 md:px-8 py-5 md:py-7 text-right whitespace-nowrap">
                   <div className="flex items-center justify-end gap-2 md:gap-3">
                     <button className="p-3 bg-white/5 rounded-2xl text-gray-500 hover:text-white transition-all"><Edit className="w-4 h-4" /></button>
                     {u.role !== UserRole.ADMIN && (
                        <button onClick={() => adminUpdateUser(u.id, { isBlocked: !u.isBlocked })} className={`p-3 rounded-2xl border border-white/5 shadow-inner transition-all ${u.isBlocked ? 'text-emerald-500 hover:bg-emerald-500 hover:text-white' : 'text-red-500 hover:bg-red-500 hover:text-white'}`}>
                          {u.isBlocked ? <Check className="w-4 h-4" /> : <ShieldAlert className="w-4 h-4" />}
                        </button>
                     )}
                   </div>
                </td>
              </tr>
            ))}
          </AdminTable>
        )}

        {activeTab === 'plans' && (
          <div className="space-y-10 animate-in zoom-in-95 duration-300">
            <div className="bg-[#0e121a] border border-blue-500/10 p-8 md:p-14 rounded-[40px] md:rounded-[64px] flex flex-col lg:flex-row justify-between items-center gap-8 text-center lg:text-left relative overflow-hidden shadow-3xl">
               <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 blur-[120px] -z-10 rounded-full" />
               <div className="flex-1">
                  <h4 className="text-3xl md:text-5xl font-black text-white mb-3 tracking-tighter">ROI Engine Kernels</h4>
                  <p className="text-sm md:text-lg text-gray-500 font-medium max-w-2xl">Engineer high-yield investment structures with variable daily payouts and locked liquidity cycles.</p>
               </div>
               <button onClick={() => handleOpenPlanModal()} className="w-full lg:w-auto flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 px-10 py-5 rounded-[28px] text-lg md:text-xl font-black transition-all shadow-2xl shadow-blue-900/50 hover:-translate-y-1">
                 <Plus className="w-6 h-6 md:w-8 md:h-8" /> Deploy Strategy
               </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
              {plans.map(p => (
                <div key={p.id} className="bg-[#0e121a] border border-gray-800 p-8 md:p-12 rounded-[40px] md:rounded-[56px] relative group overflow-hidden shadow-2xl transition-all hover:border-blue-500/40">
                  <div className="absolute top-6 right-6 flex gap-2 lg:opacity-0 group-hover:opacity-100 transition-all">
                    <button onClick={() => handleOpenPlanModal(p)} className="p-3 bg-gray-800 rounded-2xl hover:bg-blue-600 text-white shadow-xl"><Edit className="w-5 h-5" /></button>
                    <button onClick={() => adminDeletePlan(p.id)} className="p-3 bg-gray-800 rounded-2xl hover:bg-red-600 text-white shadow-xl"><Trash2 className="w-5 h-5" /></button>
                  </div>
                  <div className="mb-10">
                    <h5 className="font-black text-2xl md:text-3xl text-white mb-3 tracking-tighter uppercase">{p.name}</h5>
                    <div className="flex items-center gap-2 text-gray-600 text-xs font-black uppercase tracking-[0.2em]"><Clock className="w-4 h-4" /> {p.durationDays} Day Lifecycle</div>
                  </div>
                  <div className="mb-10">
                     <p className="text-blue-500 font-black text-6xl md:text-8xl font-mono tracking-tighter">{p.roi}%</p>
                     <p className="text-xs text-gray-600 font-black uppercase tracking-[0.3em] mt-2 ml-1">Daily Net Yield</p>
                  </div>
                  <div className="space-y-4 pt-8 border-t border-gray-800/80 text-xs md:text-sm">
                    <div className="flex justify-between items-center"><span className="text-gray-500 font-black uppercase tracking-[0.2em]">Min Entry</span> <span className="text-white font-mono font-black text-base md:text-lg">${p.minAmount}</span></div>
                    <div className="flex justify-between items-center"><span className="text-gray-500 font-black uppercase tracking-[0.2em]">Max Cap</span> <span className="text-white font-mono font-black text-base md:text-lg">${p.maxAmount}</span></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'system' && (
          <div className="max-w-6xl mx-auto space-y-8 md:space-y-16 animate-in slide-in-from-bottom-12 duration-700 px-2">
             <div className="text-center bg-[#0e121a] border border-gray-800 p-10 md:p-24 rounded-[48px] md:rounded-[80px] relative overflow-hidden shadow-3xl">
                <div className="absolute inset-0 bg-blue-600/[0.02] animate-pulse" />
                <Terminal className="w-16 h-16 md:w-24 md:h-24 text-blue-500 mx-auto mb-8 md:mb-12 animate-pulse" />
                <h3 className="text-4xl md:text-7xl font-black mb-4 md:mb-8 tracking-tighter uppercase text-white leading-none">System Kernel</h3>
                <p className="text-sm md:text-xl text-gray-500 max-w-2xl mx-auto font-medium leading-relaxed">Execute direct kernel-level commands to synchronize time clusters and manage global distributions.</p>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12">
                <div className="bg-[#0e121a] p-10 md:p-14 rounded-[40px] md:rounded-[64px] border border-blue-500/20 space-y-8 group relative overflow-hidden shadow-2xl">
                   <div className="flex items-center gap-6">
                      <div className="p-4 bg-blue-500/10 rounded-[24px] text-blue-500 group-hover:scale-110 transition-transform shadow-lg"><RefreshCw className="w-8 h-8 md:w-12 md:h-12" /></div>
                      <h4 className="font-black text-2xl md:text-4xl tracking-tighter uppercase">ROI Pulse</h4>
                   </div>
                   <p className="text-sm md:text-lg text-gray-500 leading-relaxed font-medium italic">Simulate 24h market activity and distribute yield dividends to all active member clusters instantly.</p>
                   <button onClick={debugTriggerProfit} className="w-full py-5 md:py-6 bg-blue-600 hover:bg-blue-700 rounded-[28px] font-black text-sm md:text-xl transition-all shadow-2xl shadow-blue-900/50 flex items-center justify-center gap-4 hover:-translate-y-1">Trigger Global Payout</button>
                </div>

                <div className="bg-[#0e121a] p-10 md:p-14 rounded-[40px] md:rounded-[64px] border border-red-500/20 space-y-8 group relative overflow-hidden shadow-2xl">
                   <div className="flex items-center gap-6">
                      <div className="p-4 bg-red-500/10 rounded-[24px] text-red-500 group-hover:scale-110 transition-transform shadow-lg"><BarChart3 className="w-8 h-8 md:w-12 md:h-12" /></div>
                      <h4 className="font-black text-2xl md:text-4xl tracking-tighter uppercase">Cluster Wipe</h4>
                   </div>
                   <p className="text-sm md:text-lg text-gray-500 leading-relaxed font-medium italic">Emergency purge of all volatile data clusters, resetting the platform to initial deployment state.</p>
                   <button onClick={() => { if(confirm("This will permanently PURGE ALL DATA. This action is IRREVERSIBLE. Continue?")) { localStorage.clear(); window.location.reload(); } }} className="w-full py-5 md:py-6 bg-red-600/10 hover:bg-red-600 text-red-500 hover:text-white border border-red-500/20 rounded-[28px] font-black text-sm md:text-xl transition-all hover:shadow-2xl hover:shadow-red-900/40">Full Kernel Reset</button>
                </div>
             </div>
          </div>
        )}
      </div>

      {/* History Modal - Precision Engineered Auditor */}
      {isHistoryModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 md:p-8 backdrop-blur-2xl bg-black/70 animate-in fade-in duration-300">
          <div className="bg-[#0e121a] border border-white/10 w-full max-w-6xl rounded-[40px] md:rounded-[64px] shadow-3xl overflow-hidden animate-in zoom-in-95 duration-300 max-h-[90vh] flex flex-col">
            <div className="p-8 md:p-14 border-b border-white/5 flex justify-between items-center bg-[#141922]/60">
              <div className="flex items-center gap-6">
                 <div className="p-4 bg-blue-500/10 rounded-[24px] text-blue-500 shadow-xl"><History className="w-8 h-8" /></div>
                 <div>
                    <h3 className="text-2xl md:text-4xl font-black tracking-tighter uppercase">System Audit Ledger</h3>
                    <p className="text-xs md:text-base text-gray-500 font-medium">Immutable audit trail of all capital movement and system distributions.</p>
                 </div>
              </div>
              <button onClick={() => setIsHistoryModalOpen(false)} className="text-gray-500 hover:text-white bg-white/5 hover:bg-white/10 p-4 rounded-2xl transition-all shadow-inner"><X className="w-6 h-6" /></button>
            </div>
            
            <div className="p-0 overflow-y-auto no-scrollbar flex-1 bg-black/20">
              <AdminTable headers={['Initiator', 'Transaction Hash', 'Flow Intensity', 'Node Timestamp', 'Audit Status']}>
                {transactions.length === 0 ? (
                  <tr><td colSpan={5} className="p-32 text-center text-gray-600 font-bold uppercase tracking-widest italic">Ledger Clean: No History Recorded</td></tr>
                ) : (
                  transactions.map(tx => {
                    const user = users.find(u => u.id === tx.userId);
                    return (
                      <tr key={tx.id} className="hover:bg-white/[0.01] transition-colors group">
                        <td className="px-6 md:px-10 py-5 md:py-8 whitespace-nowrap">
                          <span className="text-sm md:text-base font-black text-white">{user?.name || 'SYS_KERNEL'}</span>
                          <span className="block text-[9px] text-gray-700 font-mono font-black uppercase mt-0.5 tracking-tighter">IDENT_REF: {tx.userId.substr(0,10)}</span>
                        </td>
                        <td className="px-6 md:px-10 py-5 md:py-8">
                          <div className="flex items-center gap-2">
                             <ArrowRightLeft className="w-4 h-4 text-gray-700" />
                             <span className="text-[10px] md:text-xs font-black uppercase text-gray-500 tracking-[0.2em]">{tx.type}</span>
                          </div>
                        </td>
                        <td className="px-6 md:px-10 py-5 md:py-8">
                           <span className={`text-base md:text-xl font-black font-mono ${tx.type === TransactionType.WITHDRAWAL ? 'text-red-500' : 'text-emerald-500'}`}>
                             {tx.type === TransactionType.WITHDRAWAL ? '-' : '+'}${tx.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                           </span>
                        </td>
                        <td className="px-6 md:px-10 py-5 md:py-8 text-[10px] md:text-xs text-gray-500 font-black font-mono tracking-tighter uppercase">{new Date(tx.date).toLocaleString()}</td>
                        <td className="px-6 md:px-10 py-5 md:py-8">
                          <StatusBadge 
                            status={tx.status} 
                            variant={tx.status === 'COMPLETED' ? 'success' : tx.status === 'PENDING' ? 'warning' : 'danger'} 
                          />
                        </td>
                      </tr>
                    );
                  })
                )}
              </AdminTable>
            </div>
            
            <div className="p-8 md:p-10 border-t border-white/5 bg-[#141922]/50 flex justify-end items-center gap-6">
               <span className="text-gray-700 text-[10px] font-black uppercase tracking-[0.5em] mr-auto hidden md:block">AUDIT_VERIFIED_MMXXIV</span>
               <button onClick={() => setIsHistoryModalOpen(false)} className="px-12 py-4 bg-white/5 hover:bg-blue-600 rounded-[20px] font-black text-sm md:text-base transition-all shadow-2xl hover:text-white border border-white/5">Exit Auditor</button>
            </div>
          </div>
        </div>
      )}

      {/* Plan Modal - Strategy Configuration */}
      {isPlanModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 md:p-8 backdrop-blur-3xl bg-black/60 animate-in fade-in duration-300">
          <div className="bg-[#0e121a] border border-white/10 w-full max-w-3xl rounded-[40px] md:rounded-[80px] shadow-3xl overflow-hidden animate-in zoom-in-95 duration-300 max-h-[95vh] flex flex-col">
            <div className="p-10 md:p-20 border-b border-white/5 flex justify-between items-center bg-[#141922]/60">
              <h3 className="text-3xl md:text-6xl font-black tracking-tighter uppercase text-white">{editingPlan ? 'Refactor' : 'New Pack'}</h3>
              <button onClick={() => setIsPlanModalOpen(false)} className="text-gray-500 hover:text-white bg-white/5 p-4 rounded-3xl transition-all shadow-inner"><X className="w-6 h-6" /></button>
            </div>
            <form onSubmit={handleSavePlan} className="p-10 md:p-20 space-y-8 md:space-y-12 overflow-y-auto no-scrollbar">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-gray-600 uppercase tracking-[0.4em] ml-2">Package Descriptor</label>
                <input required name="name" placeholder="e.g. ALPHA_V3" defaultValue={editingPlan?.name} className="w-full bg-[#141922] border border-white/5 rounded-[24px] md:rounded-[32px] px-8 py-5 md:py-6 outline-none focus:border-blue-500 text-white font-black text-lg md:text-2xl tracking-tighter transition-all shadow-inner" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-gray-600 uppercase tracking-[0.4em] ml-2">Yield Intensity (%)</label>
                  <input required type="number" step="0.1" name="roi" placeholder="2.5" defaultValue={editingPlan?.roi} className="w-full bg-[#141922] border border-white/5 rounded-[24px] px-8 py-5 md:py-6 outline-none focus:border-blue-500 text-blue-500 font-mono font-black text-2xl md:text-4xl shadow-inner" />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-gray-600 uppercase tracking-[0.4em] ml-2">Liquidity Lock (Days)</label>
                  <input required type="number" name="durationDays" placeholder="30" defaultValue={editingPlan?.durationDays} className="w-full bg-[#141922] border border-white/5 rounded-[24px] px-8 py-5 md:py-6 outline-none focus:border-blue-500 text-white font-mono font-black text-2xl md:text-4xl shadow-inner" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-gray-600 uppercase tracking-[0.4em] ml-2">Min Stake ($)</label>
                  <input required type="number" name="minAmount" placeholder="100" defaultValue={editingPlan?.minAmount} className="w-full bg-[#141922] border border-white/5 rounded-[24px] px-8 py-5 md:py-6 outline-none focus:border-blue-500 text-emerald-500 font-mono font-black text-2xl md:text-4xl shadow-inner" />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-gray-600 uppercase tracking-[0.4em] ml-2">Max Stake ($)</label>
                  <input required type="number" name="maxAmount" placeholder="10000" defaultValue={editingPlan?.maxAmount} className="w-full bg-[#141922] border border-white/5 rounded-[24px] px-8 py-5 md:py-6 outline-none focus:border-blue-500 text-emerald-500 font-mono font-black text-2xl md:text-4xl shadow-inner" />
                </div>
              </div>
              <button type="submit" className="w-full py-6 md:py-8 bg-blue-600 hover:bg-blue-700 rounded-[32px] md:rounded-[48px] font-black text-lg md:text-2xl text-white shadow-3xl shadow-blue-900/60 flex items-center justify-center gap-4 transition-all hover:-translate-y-1 active:scale-95">
                <Save className="w-6 h-6 md:w-8 md:h-8" /> Commit Deployment
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
