
import React, { useState } from 'react';
import { useApp } from '../store/AppContext';
import { 
  ShieldAlert, Users as UsersIcon, Wallet, Layers, Check, X, Edit, Trash2, 
  Plus, Save, Terminal, RefreshCw, BarChart3, Settings, 
  History, CreditCard, LayoutGrid, ArrowUpCircle, UserPlus, Fingerprint,
  Clock, Search, ArrowRightLeft, ChevronDown, Menu as MenuIcon
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
  const [isTabMenuOpen, setIsTabMenuOpen] = useState(false);
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<InvestmentPlan | null>(null);

  const pendingWithdrawals = transactions.filter(t => t.type === TransactionType.WITHDRAWAL && t.status === TransactionStatus.PENDING);

  const tabs = [
    { id: 'overview', label: 'Summary', icon: LayoutGrid },
    { id: 'withdrawals', label: 'Payouts', icon: CreditCard, badge: pendingWithdrawals.length },
    { id: 'users', label: 'Members', icon: UsersIcon },
    { id: 'plans', label: 'Engine', icon: Layers },
    { id: 'system', label: 'Kernel', icon: Settings },
  ];

  const currentTab = tabs.find(t => t.id === activeTab) || tabs[0];

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
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="min-w-0">
          <h2 className="text-xl sm:text-2xl md:text-4xl font-black text-white flex items-center gap-2 md:gap-3 tracking-tighter truncate">
            <ShieldAlert className="text-blue-500 w-6 h-6 sm:w-8 md:w-10 md:h-10 shrink-0" /> Command Center
          </h2>
          <p className="text-gray-500 text-[10px] sm:text-xs md:text-base font-medium mt-0.5">Real-time platform oversight & control.</p>
        </div>
        
        <div className="flex items-center gap-2 shrink-0">
           <button 
             onClick={debugTriggerProfit}
             className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 sm:gap-2 bg-emerald-600/10 hover:bg-emerald-600 text-emerald-500 hover:text-white px-3 sm:px-5 py-2.5 rounded-xl md:rounded-2xl text-[8px] sm:text-[10px] md:text-xs font-black uppercase tracking-widest transition-all border border-emerald-500/20 whitespace-nowrap"
           >
             <RefreshCw className="w-3.5 h-3.5" /> Force Profit
           </button>
           <div className="flex-1 sm:flex-none bg-blue-600/10 border border-blue-600/20 px-3 sm:px-5 py-2.5 rounded-xl md:rounded-2xl flex items-center justify-center gap-1.5 sm:gap-2">
             <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-blue-500 animate-pulse shrink-0" />
             <span className="text-[8px] sm:text-[10px] md:text-xs font-black text-blue-500 uppercase tracking-widest">Online</span>
           </div>
        </div>
      </div>

      {/* Navigation - Responsive Menu */}
      <div className="relative z-40">
        {/* Desktop Tabs */}
        <div className="hidden md:flex border-b border-gray-800 bg-[#0e121a]/60 backdrop-blur-xl sticky top-20 p-2 gap-2 rounded-[24px] shadow-2xl">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-8 py-4 rounded-2xl font-black transition-all flex items-center gap-4 whitespace-nowrap group ${
                activeTab === tab.id 
                ? 'bg-blue-600 text-white shadow-xl' 
                : 'text-gray-500 hover:text-white hover:bg-white/5'
              }`}
            >
              <tab.icon className={`w-5 h-5 ${activeTab === tab.id ? 'scale-110' : ''}`} />
              <span className="text-sm uppercase tracking-widest font-black">{tab.label}</span>
              {tab.badge ? (
                <span className={`text-[10px] px-1.5 py-0.5 rounded-lg font-black ${
                  activeTab === tab.id ? 'bg-white text-blue-600' : 'bg-red-500 text-white animate-pulse'
                }`}>
                  {tab.badge}
                </span>
              ) : null}
            </button>
          ))}
        </div>

        {/* Mobile Hamburger / Dropdown */}
        <div className="md:hidden">
          <button 
            onClick={() => setIsTabMenuOpen(!isTabMenuOpen)}
            className="w-full bg-[#0e121a] border border-gray-800 px-6 py-4 rounded-2xl flex items-center justify-between group active:scale-[0.98] transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-600/10 rounded-lg text-blue-500">
                <currentTab.icon className="w-5 h-5" />
              </div>
              <span className="text-sm font-black uppercase tracking-widest text-white">{currentTab.label}</span>
            </div>
            <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform ${isTabMenuOpen ? 'rotate-180' : ''}`} />
          </button>

          {isTabMenuOpen && (
            <>
              <div 
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
                onClick={() => setIsTabMenuOpen(false)}
              />
              <div className="absolute top-full left-0 right-0 mt-2 bg-[#0e121a] border border-gray-800 rounded-2xl shadow-2xl overflow-hidden z-50 animate-in slide-in-from-top-2 duration-200">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id as any);
                      setIsTabMenuOpen(false);
                    }}
                    className={`w-full px-6 py-4 flex items-center justify-between text-left transition-colors ${
                      activeTab === tab.id ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <tab.icon className="w-4 h-4" />
                      <span className="text-xs font-bold uppercase tracking-widest">{tab.label}</span>
                    </div>
                    {tab.badge ? (
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-lg font-black ${
                        activeTab === tab.id ? 'bg-white/20' : 'bg-red-500/20 text-red-500'
                      }`}>
                        {tab.badge}
                      </span>
                    ) : null}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Main Tab Content */}
      <div className="min-h-[400px]">
        {activeTab === 'overview' && (
          <div className="space-y-6 md:space-y-12 animate-in slide-in-from-bottom-6 duration-500">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-8">
              <StatCard label="TVL" value={`$${platformStats.platformBalance.toLocaleString()}`} icon={Wallet} color="text-blue-500" bg="bg-blue-500/10" />
              <StatCard label="Stake" value={`$${platformStats.totalInvested.toLocaleString()}`} icon={Layers} color="text-purple-500" bg="bg-purple-500/10" />
              <StatCard label="Paid" value={`$${platformStats.totalWithdrawals.toLocaleString()}`} icon={ArrowUpCircle} color="text-emerald-500" bg="bg-emerald-500/10" />
              <StatCard label="Nodes" value={platformStats.totalUsers} icon={UsersIcon} color="text-amber-500" bg="bg-amber-500/10" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
              <ActionModule 
                title="Liquidity Ops" description="Process pending cash-out requests and audit capital flow." icon={CreditCard} colorClass="text-emerald-500" bgClass="bg-emerald-500/10"
                primaryAction={{ label: `Approve (${pendingWithdrawals.length})`, onClick: () => setActiveTab('withdrawals') }}
                secondaryAction={{ icon: History, onClick: () => setIsHistoryModalOpen(true) }}
              />
              <ActionModule 
                title="Yield Engine" description="Refine ROI packages and automated yield engines." icon={Layers} colorClass="text-blue-500" bgClass="bg-blue-500/10"
                primaryAction={{ label: 'Optimize Packs', onClick: () => setActiveTab('plans') }}
              />
              <ActionModule 
                title="Node Security" description="Audit user accounts and calibrate member governance." icon={Fingerprint} colorClass="text-purple-500" bgClass="bg-purple-500/10"
                primaryAction={{ label: 'Audit Members', onClick: () => setActiveTab('users') }}
              />
            </div>
          </div>
        )}

        {activeTab === 'withdrawals' && (
          <AdminTable title="Payout Queue" subtitle="Manual verification required" headers={['User', 'Amount', 'Network', 'Process']}>
            {pendingWithdrawals.length === 0 ? (
              <tr><td colSpan={4} className="p-20 text-center text-gray-600 text-[10px] md:text-sm font-black uppercase tracking-widest opacity-50">Queue Empty</td></tr>
            ) : (
              pendingWithdrawals.map(tx => {
                const user = users.find(u => u.id === tx.userId);
                return (
                  <tr key={tx.id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="px-4 md:px-8 py-4 md:py-6 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-blue-600 flex items-center justify-center font-black text-xs text-white overflow-hidden shadow-lg">
                          {user?.avatar ? (
                            <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                          ) : (
                            user?.name[0]
                          )}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[10px] md:text-sm font-black text-white">{user?.name}</span>
                          <span className="text-[8px] md:text-[10px] text-gray-600 font-mono uppercase">{user?.referralCode}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 md:px-8 py-4 md:py-6 font-mono font-black text-amber-500 text-xs sm:text-sm md:text-lg">${tx.amount.toLocaleString()}</td>
                    <td className="px-4 md:px-8 py-4 md:py-6">
                      <StatusBadge status={tx.method || 'CRYPTO'} variant="info" />
                    </td>
                    <td className="px-4 md:px-8 py-4 md:py-6 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5 md:gap-2">
                         <button onClick={() => adminApproveWithdrawal(tx.id)} className="p-1.5 sm:p-2 md:p-3 bg-emerald-500/10 text-emerald-500 rounded-xl hover:bg-emerald-500 hover:text-white transition-all"><Check className="w-3.5 h-3.5 sm:w-4 sm:h-4" /></button>
                         <button onClick={() => adminRejectWithdrawal(tx.id)} className="p-1.5 sm:p-2 md:p-3 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all"><X className="w-3.5 h-3.5 sm:w-4 sm:h-4" /></button>
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
            title={`Nodes (${users.length})`} 
            headers={['Profile', 'Balance', 'Status', 'Kernel']}
            action={<button className="flex items-center gap-1.5 sm:gap-2 bg-blue-600/10 hover:bg-blue-600 border border-blue-500/20 text-blue-500 hover:text-white px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-xl text-[8px] sm:text-[10px] font-black transition-all shadow-lg"><UserPlus className="w-3 h-3 sm:w-4 sm:h-4" /> Add Node</button>}
          >
            {users.map(u => (
              <tr key={u.id} className="hover:bg-white/[0.02] transition-colors group">
                <td className="px-4 md:px-8 py-4 md:py-6 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 md:w-12 md:h-12 rounded-xl flex items-center justify-center font-black text-xs overflow-hidden shadow-2xl ${u.role === UserRole.ADMIN && !u.avatar ? 'bg-amber-600' : 'bg-blue-600'}`}>
                      {u.avatar ? (
                        <img src={u.avatar} alt={u.name} className="w-full h-full object-cover" />
                      ) : (
                        u.role === UserRole.ADMIN ? <ShieldAlert className="w-4 h-4 md:w-5 md:h-5 text-white" /> : u.name[0]
                      )}
                    </div>
                    <div className="flex flex-col">
                       <span className="text-[10px] md:text-sm font-black text-white">{u.name}</span>
                       <span className="text-[8px] md:text-[10px] text-gray-600 font-mono truncate max-w-[60px] sm:max-w-none">{u.email}</span>
                    </div>
                  </div>
                </td>
                <td className="px-4 md:px-8 py-4 md:py-6">
                  <div className="flex items-center gap-1.5 cursor-pointer group/bal" onClick={() => handleEditUserBalance(u.id)}>
                    <span className="font-mono font-black text-emerald-500 text-xs sm:text-sm md:text-lg">${u.balance.toLocaleString()}</span>
                  </div>
                </td>
                <td className="px-4 md:px-8 py-4 md:py-6">
                  <StatusBadge status={u.isBlocked ? 'Blocked' : 'Live'} variant={u.isBlocked ? 'danger' : 'success'} />
                </td>
                <td className="px-4 md:px-8 py-4 md:py-6 text-right whitespace-nowrap">
                   <div className="flex items-center justify-end gap-1.5 md:gap-2">
                     <button className="p-1.5 sm:p-2 bg-white/5 rounded-xl text-gray-500 hover:text-white transition-all"><Edit className="w-3.5 h-3.5 sm:w-4 sm:h-4" /></button>
                     {u.role !== UserRole.ADMIN && (
                        <button onClick={() => adminUpdateUser(u.id, { isBlocked: !u.isBlocked })} className={`p-1.5 sm:p-2 rounded-xl border border-white/5 transition-all ${u.isBlocked ? 'text-emerald-500 hover:bg-emerald-500 hover:text-white' : 'text-red-500 hover:bg-red-500 hover:text-white'}`}>
                          {u.isBlocked ? <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <ShieldAlert className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                        </button>
                     )}
                   </div>
                </td>
              </tr>
            ))}
          </AdminTable>
        )}

        {activeTab === 'plans' && (
          <div className="space-y-6 md:space-y-10 animate-in zoom-in-95 duration-300">
            <div className="bg-[#0e121a] border border-blue-500/10 p-6 md:p-14 rounded-[32px] md:rounded-[64px] flex flex-col lg:flex-row justify-between items-center gap-6 text-center lg:text-left shadow-2xl overflow-hidden relative">
               <div className="flex-1 z-10">
                  <h4 className="text-xl sm:text-3xl md:text-5xl font-black text-white mb-1 md:mb-2 tracking-tighter">Asset Engine</h4>
                  <p className="text-[10px] sm:text-sm md:text-lg text-gray-500 font-medium">Engineer high-yield investment structures.</p>
               </div>
               <button onClick={() => handleOpenPlanModal()} className="w-full lg:w-auto flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 px-6 py-3.5 sm:py-4 rounded-2xl text-xs sm:text-sm md:text-xl font-black transition-all z-10">
                 <Plus className="w-4 h-4 md:w-8 md:h-8" /> New Strategy
               </button>
               <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 blur-3xl rounded-full" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-10">
              {plans.map(p => (
                <div key={p.id} className="bg-[#0e121a] border border-gray-800 p-6 md:p-10 rounded-[32px] md:rounded-[56px] relative group overflow-hidden shadow-2xl">
                  <div className="absolute top-4 right-4 flex gap-1.5">
                    <button onClick={() => handleOpenPlanModal(p)} className="p-2 bg-gray-800 rounded-xl hover:bg-blue-600 text-white"><Edit className="w-3.5 h-3.5" /></button>
                    <button onClick={() => adminDeletePlan(p.id)} className="p-2 bg-gray-800 rounded-xl hover:bg-red-600 text-white"><Trash2 className="w-3.5 h-3.5" /></button>
                  </div>
                  <div className="mb-6 md:mb-10">
                    <h5 className="font-black text-base md:text-2xl text-white mb-1 uppercase tracking-tighter">{p.name}</h5>
                    <div className="flex items-center gap-1.5 text-gray-600 text-[8px] md:text-xs font-black uppercase tracking-widest"><Clock className="w-3 h-3" /> {p.durationDays} Days</div>
                  </div>
                  <div className="mb-6 md:mb-10">
                     <p className="text-blue-500 font-black text-4xl sm:text-5xl md:text-7xl font-mono tracking-tighter">{p.roi}%</p>
                     <p className="text-[8px] text-gray-600 font-black uppercase tracking-widest mt-1">Daily Yield</p>
                  </div>
                  <div className="space-y-3 pt-6 border-t border-gray-800/80 text-[10px] md:text-sm">
                    <div className="flex justify-between items-center"><span className="text-gray-500 font-black uppercase tracking-widest">Entry</span> <span className="text-white font-mono font-black text-sm md:text-lg">${p.minAmount}</span></div>
                    <div className="flex justify-between items-center"><span className="text-gray-500 font-black uppercase tracking-widest">Cap</span> <span className="text-white font-mono font-black text-sm md:text-lg">${p.maxAmount}</span></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'system' && (
          <div className="max-w-4xl mx-auto space-y-6 md:space-y-16 animate-in slide-in-from-bottom-8 duration-700">
             <div className="text-center bg-[#0e121a] border border-gray-800 p-10 md:p-24 rounded-[32px] md:rounded-[80px] shadow-3xl">
                <Terminal className="w-12 h-12 md:w-20 md:h-20 text-blue-500 mx-auto mb-6 md:mb-10 animate-pulse" />
                <h3 className="text-2xl md:text-7xl font-black mb-2 md:mb-3 tracking-tighter uppercase text-white">Kernel</h3>
                <p className="text-[10px] md:text-xl text-gray-500 font-medium leading-relaxed">Direct system-level execution commands.</p>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-10">
                <div className="bg-[#0e121a] p-8 md:p-12 rounded-[32px] md:rounded-[48px] border border-blue-500/20 space-y-6">
                   <div className="flex items-center gap-4">
                      <div className="p-3 bg-blue-500/10 rounded-2xl text-blue-500"><RefreshCw className="w-6 h-6 md:w-10 md:h-10" /></div>
                      <h4 className="font-black text-xl md:text-3xl tracking-tighter uppercase">ROI Pulse</h4>
                   </div>
                   <button onClick={debugTriggerProfit} className="w-full py-4 md:py-6 bg-blue-600 hover:bg-blue-700 rounded-2xl font-black text-xs md:text-lg shadow-2xl transition-all">Distribute All Yields</button>
                </div>

                <div className="bg-[#0e121a] p-8 md:p-12 rounded-[32px] md:rounded-[48px] border border-red-500/20 space-y-6">
                   <div className="flex items-center gap-4">
                      <div className="p-3 bg-red-500/10 rounded-2xl text-red-500"><BarChart3 className="w-6 h-6 md:w-10 md:h-10" /></div>
                      <h4 className="font-black text-xl md:text-3xl tracking-tighter uppercase">Wipe</h4>
                   </div>
                   <button onClick={() => { if(confirm("Permanently PURGE ALL DATA?")) { localStorage.clear(); window.location.reload(); } }} className="w-full py-4 md:py-6 bg-red-600/10 hover:bg-red-600 text-red-500 hover:text-white border border-red-500/20 rounded-2xl font-black text-xs md:text-lg transition-all">Nuclear Reset</button>
                </div>
             </div>
          </div>
        )}
      </div>

      {/* History Modal - Adaptive Auditor */}
      {isHistoryModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-2 md:p-8 backdrop-blur-2xl bg-black/70 animate-in fade-in duration-300">
          <div className="bg-[#0e121a] border border-white/10 w-full max-w-5xl rounded-3xl md:rounded-[48px] shadow-3xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-4 sm:p-6 md:p-12 border-b border-white/5 flex justify-between items-center bg-[#141922]/60">
              <div className="flex items-center gap-3 md:gap-4 min-w-0">
                 <div className="p-2 md:p-3 bg-blue-500/10 rounded-xl text-blue-500 shrink-0"><History className="w-5 h-5 md:w-6 md:h-6" /></div>
                 <div className="min-w-0">
                    <h3 className="text-sm sm:text-lg md:text-3xl font-black uppercase tracking-tighter truncate">Audit Ledger</h3>
                 </div>
              </div>
              <button onClick={() => setIsHistoryModalOpen(false)} className="text-gray-500 hover:text-white bg-white/5 p-2 rounded-lg transition-all shrink-0"><X className="w-4 h-4 md:w-5 md:h-5" /></button>
            </div>
            
            <div className="p-0 overflow-y-auto flex-1 bg-black/10 no-scrollbar">
              <AdminTable headers={['Identity', 'Action', 'Flow', 'Timestamp']}>
                {transactions.map(tx => {
                  const user = users.find(u => u.id === tx.userId);
                  return (
                    <tr key={tx.id} className="hover:bg-white/[0.01] transition-colors group">
                      <td className="px-4 md:px-10 py-4 md:py-6 whitespace-nowrap">
                        <span className="text-[10px] md:text-sm font-black text-white">{user?.name || 'SYS'}</span>
                        <span className="block text-[7px] text-gray-700 font-mono mt-0.5">#{tx.id.substr(0,8)}</span>
                      </td>
                      <td className="px-4 md:px-10 py-4 md:py-6 text-[8px] md:text-[10px] font-black uppercase text-gray-500 tracking-widest">
                         {tx.type}
                      </td>
                      <td className="px-4 md:px-10 py-4 md:py-6">
                         <span className={`text-xs md:text-lg font-black font-mono ${tx.type === TransactionType.WITHDRAWAL ? 'text-red-500' : 'text-emerald-500'}`}>
                           {tx.type === TransactionType.WITHDRAWAL ? '-' : '+'}${tx.amount.toLocaleString()}
                         </span>
                      </td>
                      <td className="px-4 md:px-10 py-4 md:py-6 text-[8px] md:text-[10px] text-gray-600 font-mono uppercase">{new Date(tx.date).toLocaleDateString()}</td>
                    </tr>
                  );
                })}
              </AdminTable>
            </div>
            
            <div className="p-4 sm:p-5 border-t border-white/5 bg-[#141922]/50 flex justify-end">
               <button onClick={() => setIsHistoryModalOpen(false)} className="px-6 py-2.5 bg-white/5 hover:bg-blue-600 rounded-xl font-black text-[10px] sm:text-xs transition-all hover:text-white">Close Auditor</button>
            </div>
          </div>
        </div>
      )}

      {/* Plan Modal - Strategy Configuration */}
      {isPlanModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-2 md:p-8 backdrop-blur-3xl bg-black/60 animate-in fade-in duration-300">
          <div className="bg-[#0e121a] border border-white/10 w-full max-w-2xl rounded-3xl md:rounded-[48px] shadow-3xl overflow-hidden flex flex-col max-h-[95vh]">
            <div className="p-5 md:p-14 border-b border-white/5 flex justify-between items-center bg-[#141922]/60">
              <h3 className="text-xl md:text-4xl font-black tracking-tighter uppercase text-white">{editingPlan ? 'Refactor' : 'New Pack'}</h3>
              <button onClick={() => setIsPlanModalOpen(false)} className="text-gray-500 hover:text-white bg-white/5 p-2 rounded-lg shrink-0"><X className="w-4 h-4 md:w-5 md:h-5" /></button>
            </div>
            <form onSubmit={handleSavePlan} className="p-5 md:p-14 space-y-6 md:space-y-10 overflow-y-auto no-scrollbar">
              <div className="space-y-2">
                <label className="text-[8px] sm:text-[9px] font-black text-gray-600 uppercase tracking-widest ml-1">Plan Descriptor</label>
                <input required name="name" defaultValue={editingPlan?.name} className="w-full bg-[#141922] border border-white/5 rounded-xl md:rounded-2xl px-4 py-2.5 md:py-5 outline-none focus:border-blue-500 text-white font-black text-sm md:text-xl" />
              </div>
              <div className="grid grid-cols-2 gap-3 md:gap-8">
                <div className="space-y-2">
                  <label className="text-[8px] sm:text-[9px] font-black text-gray-600 uppercase tracking-widest ml-1">Yield (%)</label>
                  <input required type="number" step="0.1" name="roi" defaultValue={editingPlan?.roi} className="w-full bg-[#141922] border border-white/5 rounded-xl px-4 py-2.5 md:py-5 outline-none focus:border-blue-500 text-blue-500 font-mono font-black text-sm md:text-3xl" />
                </div>
                <div className="space-y-2">
                  <label className="text-[8px] sm:text-[9px] font-black text-gray-600 uppercase tracking-widest ml-1">Lock (Days)</label>
                  <input required type="number" name="durationDays" defaultValue={editingPlan?.durationDays} className="w-full bg-[#141922] border border-white/5 rounded-xl px-4 py-2.5 md:py-5 outline-none focus:border-blue-500 text-white font-mono font-black text-sm md:text-3xl" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 md:gap-8">
                <div className="space-y-2">
                  <label className="text-[8px] sm:text-[9px] font-black text-gray-600 uppercase tracking-widest ml-1">Min ($)</label>
                  <input required type="number" name="minAmount" defaultValue={editingPlan?.minAmount} className="w-full bg-[#141922] border border-white/5 rounded-xl px-4 py-2.5 md:py-5 outline-none focus:border-blue-500 text-emerald-500 font-mono font-black text-sm md:text-3xl" />
                </div>
                <div className="space-y-2">
                  <label className="text-[8px] sm:text-[9px] font-black text-gray-600 uppercase tracking-widest ml-1">Max ($)</label>
                  <input required type="number" name="maxAmount" defaultValue={editingPlan?.maxAmount} className="w-full bg-[#141922] border border-white/5 rounded-xl px-4 py-2.5 md:py-5 outline-none focus:border-blue-500 text-emerald-500 font-mono font-black text-sm md:text-3xl" />
                </div>
              </div>
              <button type="submit" className="w-full py-4 md:py-6 bg-blue-600 hover:bg-blue-700 rounded-2xl font-black text-xs md:text-xl shadow-xl flex items-center justify-center gap-2">
                <Save className="w-4 h-4 md:w-7 md:h-7" /> Commit Strategy
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
