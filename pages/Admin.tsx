
import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../store/AppContext.tsx';
import { useLocation } from 'react-router-dom';
import { 
  ShieldAlert, Users as UsersIcon, Wallet, Layers, Check, X, Edit, Trash2, 
  Plus, Save, RefreshCw, CreditCard, 
  UserPlus, Fingerprint, Clock, ArrowDownCircle, AlertCircle, ShieldCheck,
  Server, Database, Link as LinkIcon, Activity, Globe, Zap, Loader2, Sparkles, Terminal,
  Search, Filter, ChevronRight, MoreHorizontal, DatabaseBackup
} from 'lucide-react';
import { TransactionStatus, UserRole, InvestmentPlan, TransactionType, Transaction } from '../types.ts';
import { StatCard, ActionModule, AdminTable, StatusBadge } from '../components/AdminShared.tsx';

// AdminPanel was previously incomplete and did not return JSX. 
// This fix implements the full component logic and returns a valid dashboard layout.
export const AdminPanel = () => {
  const { 
    users, transactions, plans, platformStats, systemIntegration, updateSystemIntegration, addToast,
    adminApproveWithdrawal, adminRejectWithdrawal, 
    adminApproveDeposit, adminRejectDeposit,
    adminUpdateUser, adminDeletePlan, adminCreatePlan, adminUpdatePlan, debugTriggerProfit 
  } = useApp();

  const location = useLocation();
  const currentTab = new URLSearchParams(location.search).get('tab') || 'overview';

  const pendingWithdrawals = transactions.filter(t => t.type === TransactionType.WITHDRAWAL && t.status === TransactionStatus.PENDING);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight flex items-center gap-3">
            <ShieldAlert className="w-8 h-8 text-blue-600" /> Admin Kernel
          </h2>
          <p className="text-slate-500 dark:text-gray-400 font-medium mt-1 uppercase tracking-widest text-xs">Authorization Level: Protocol Root Access</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={debugTriggerProfit}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-lg shadow-blue-500/30 hover:bg-blue-700 transition-all active:scale-95"
          >
            <Zap className="w-4 h-4" /> Trigger Payout Batch
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <StatCard label="System Deposits" value={`$${platformStats.totalDeposits.toLocaleString()}`} icon={Wallet} color="text-blue-500" bg="bg-blue-500/10" />
        <StatCard label="Active Nodes" value={platformStats.totalUsers} icon={UsersIcon} color="text-emerald-500" bg="bg-emerald-500/10" />
        <StatCard label="Total Invested" value={`$${platformStats.totalInvested.toLocaleString()}`} icon={Activity} color="text-purple-500" bg="bg-purple-500/10" />
        <StatCard label="Pending Withdrawal" value={platformStats.pendingWithdrawals} icon={Clock} color="text-amber-500" bg="bg-amber-500/10" />
      </div>

      {currentTab === 'overview' && (
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <AdminTable 
              title="Settlement Queue" 
              subtitle="Pending withdrawal requests requiring protocol clearance"
              headers={['Associate', 'Volume', 'Method', 'Timestamp', 'Control']}
            >
              {pendingWithdrawals.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-8 py-24 text-center">
                    <div className="flex flex-col items-center gap-3 opacity-20">
                      <ShieldCheck className="w-12 h-12 text-slate-400" />
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Queue Nominal: No pending actions</p>
                    </div>
                  </td>
                </tr>
              ) : (
                pendingWithdrawals.map(tx => (
                  <tr key={tx.id} className="hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex flex-col">
                        <span className="text-slate-900 dark:text-white font-black text-sm">{users.find(u => u.id === tx.userId)?.name || 'Unknown Node'}</span>
                        <span className="text-[10px] text-slate-400 font-mono">ID: {tx.userId.slice(0, 8)}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6 font-mono font-black text-rose-500">-${tx.amount.toLocaleString()}</td>
                    <td className="px-8 py-6 text-[10px] font-black uppercase text-slate-500">{tx.method}</td>
                    <td className="px-8 py-6 text-[10px] font-mono text-slate-400">{new Date(tx.date).toLocaleString()}</td>
                    <td className="px-8 py-6 text-right space-x-2">
                      <button 
                        onClick={() => adminApproveWithdrawal(tx.id)}
                        className="p-2.5 bg-emerald-500/10 text-emerald-500 rounded-xl hover:bg-emerald-500 hover:text-white transition-all shadow-sm"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => adminRejectWithdrawal(tx.id)}
                        className="p-2.5 bg-rose-500/10 text-rose-500 rounded-xl hover:bg-rose-500 hover:text-white transition-all shadow-sm"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </AdminTable>
          </div>

          <div className="space-y-8">
            <ActionModule 
              title="Engine Health" 
              description="Monitor synchronization between the main ledger and arbitrage nodes."
              icon={Server} colorClass="text-blue-500" bgClass="bg-blue-500/10"
              primaryAction={{ label: 'Diagnostics', onClick: () => addToast('Neural sync at 100% efficiency.', 'success', 'Kernel Healthy') }}
            />
            <div className="bg-brand-lightSecondary dark:bg-brand-darkSecondary border border-slate-200 dark:border-gray-800 p-8 rounded-[40px] shadow-sm">
               <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase mb-6 tracking-widest flex items-center gap-2"><Activity className="w-4 h-4 text-emerald-500" /> Pulse Stream</h4>
               <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex gap-3 text-[10px] font-mono border-l-2 border-blue-500 pl-4 py-1">
                      <span className="text-blue-500/60">[{new Date().toLocaleTimeString()}]</span>
                      <span className="text-slate-400 dark:text-gray-500">Node_ID_{i + 104} handshake verified.</span>
                    </div>
                  ))}
               </div>
            </div>
          </div>
        </div>
      )}

      {currentTab === 'withdrawals' && (
        <AdminTable title="Outflow Ledger" subtitle="Complete history of all capital settlements" headers={['ID', 'Associate', 'Volume', 'Method', 'Status']}>
           {transactions.filter(t => t.type === TransactionType.WITHDRAWAL).map(tx => (
             <tr key={tx.id} className="hover:bg-slate-50 dark:hover:bg-white/[0.02]">
                <td className="px-8 py-6 font-mono text-xs text-slate-400">{tx.id.toUpperCase()}</td>
                <td className="px-8 py-6 font-bold text-slate-900 dark:text-white">{users.find(u => u.id === tx.userId)?.name}</td>
                <td className="px-8 py-6 font-mono font-black text-slate-900 dark:text-white">${tx.amount.toLocaleString()}</td>
                <td className="px-8 py-6 text-xs uppercase font-black text-slate-500">{tx.method}</td>
                <td className="px-8 py-6">
                  <StatusBadge status={tx.status} variant={tx.status === TransactionStatus.COMPLETED ? 'success' : tx.status === TransactionStatus.PENDING ? 'warning' : 'danger'} />
                </td>
             </tr>
           ))}
        </AdminTable>
      )}

      {currentTab === 'users' && (
        <AdminTable title="Network Entities" subtitle="Registered associates and system nodes" headers={['Identity', 'Clearance', 'Balance', 'TVL', 'Control']}>
           {users.map(user => (
             <tr key={user.id} className="hover:bg-slate-50 dark:hover:bg-white/[0.02]">
                <td className="px-8 py-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-600/10 flex items-center justify-center font-black text-blue-600 text-sm">{user.name[0]}</div>
                    <div className="flex flex-col">
                      <span className="text-slate-900 dark:text-white font-black text-sm">{user.name}</span>
                      <span className="text-[10px] text-slate-400 font-mono uppercase">{user.email}</span>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-6"><StatusBadge status={user.role} variant={user.role === UserRole.ADMIN ? 'danger' : 'info'} /></td>
                <td className="px-8 py-6 font-mono font-black text-emerald-600">${user.balance.toLocaleString()}</td>
                <td className="px-8 py-6 font-mono text-slate-400">${user.totalInvested.toLocaleString()}</td>
                <td className="px-8 py-6 text-right">
                   <button 
                    onClick={() => adminUpdateUser(user.id, { isBlocked: !user.isBlocked })}
                    className={`p-2.5 rounded-xl transition-all ${user.isBlocked ? 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500' : 'bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white'}`}
                   >
                     {user.isBlocked ? <Check className="w-4 h-4" /> : <ShieldAlert className="w-4 h-4" />}
                   </button>
                </td>
             </tr>
           ))}
        </AdminTable>
      )}

      {currentTab === 'plans' && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
           {plans.map(plan => (
             <div key={plan.id} className="bg-brand-lightSecondary dark:bg-brand-darkSecondary border border-slate-200 dark:border-gray-800 p-8 rounded-[48px] shadow-sm flex flex-col justify-between group">
                <div>
                  <div className="flex justify-between items-start mb-6">
                    <h4 className="text-xl font-black uppercase tracking-tight text-slate-900 dark:text-white">{plan.name}</h4>
                    <button onClick={() => adminDeletePlan(plan.id)} className="p-2 text-slate-300 hover:text-rose-500 transition-colors opacity-0 group-hover:opacity-100"><Trash2 className="w-4 h-4" /></button>
                  </div>
                  <div className="text-5xl font-black text-blue-600 font-mono mb-8">{plan.roi}%</div>
                  <div className="space-y-4 text-[10px] font-black uppercase tracking-widest text-slate-400 mb-10">
                    <div className="flex justify-between"><span>Minimum Threshold</span> <span className="text-slate-900 dark:text-white font-mono">${plan.minAmount}</span></div>
                    <div className="flex justify-between"><span>Maximum Cap</span> <span className="text-slate-900 dark:text-white font-mono">${plan.maxAmount}</span></div>
                    <div className="flex justify-between"><span>Duration</span> <span className="text-slate-900 dark:text-white">{plan.durationDays} Cycles</span></div>
                  </div>
                </div>
                <button className="w-full py-4 bg-slate-100 dark:bg-white/5 hover:bg-blue-600 hover:text-white text-slate-900 dark:text-white rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all">Edit Strategy</button>
             </div>
           ))}
           <button 
            onClick={() => addToast('Architecture mode restricted in demo.', 'info')}
            className="border-2 border-dashed border-slate-200 dark:border-gray-800 rounded-[48px] p-10 flex flex-col items-center justify-center gap-4 hover:border-blue-600 transition-all group"
           >
              <Plus className="w-12 h-12 text-slate-200 dark:text-gray-800 group-hover:text-blue-600 transition-colors" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-300 dark:text-gray-700 group-hover:text-blue-600">Initialize Module</span>
           </button>
        </div>
      )}
    </div>
  );
};
