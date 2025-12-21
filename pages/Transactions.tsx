
import React, { useState } from 'react';
import { useApp } from '../store/AppContext';
import { Wallet, ArrowDownCircle, ArrowUpCircle, Clock, CheckCircle2, XCircle } from 'lucide-react';
import { TransactionType } from '../types';

export const TransactionsPage = () => {
  const { transactions, currentUser, makeDeposit, requestWithdrawal } = useApp();
  const [amount, setAmount] = useState<number>(0);
  const [method, setMethod] = useState('BTC');

  const userTransactions = transactions.filter(t => t.userId === currentUser?.id);

  const handleDeposit = () => {
    if (amount <= 0) return;
    makeDeposit(amount, method);
    setAmount(0);
  };

  const handleWithdraw = () => {
    if (amount <= 0 || !currentUser || currentUser.balance < amount) return;
    requestWithdrawal(amount, method);
    setAmount(0);
  };

  return (
    <div className="space-y-10">
      <div className="grid md:grid-cols-2 gap-8">
        {/* Actions Card */}
        <div className="bg-[#0e121a] border border-gray-800 p-8 rounded-[40px] space-y-8">
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 bg-blue-600/10 rounded-2xl flex items-center justify-center text-blue-500">
               <Wallet className="w-6 h-6" />
             </div>
             <h3 className="text-2xl font-bold">Transfer Funds</h3>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase">Amount (USD)</label>
              <input 
                type="number" 
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full bg-[#141922] border border-gray-800 rounded-2xl px-6 py-4 text-xl font-bold text-white focus:border-blue-500 outline-none transition-all"
                placeholder="0.00"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase">Currency / Network</label>
              <select 
                value={method}
                onChange={(e) => setMethod(e.target.value)}
                className="w-full bg-[#141922] border border-gray-800 rounded-2xl px-6 py-4 text-white focus:border-blue-500 outline-none transition-all appearance-none"
              >
                <option value="BTC">Bitcoin (BTC)</option>
                <option value="ETH">Ethereum (ERC20)</option>
                <option value="USDT">USDT (TRC20)</option>
                <option value="LTC">Litecoin (LTC)</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={handleDeposit}
                className="py-4 bg-emerald-600 hover:bg-emerald-700 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-900/20"
              >
                <ArrowDownCircle className="w-5 h-5" /> Deposit
              </button>
              <button 
                onClick={handleWithdraw}
                className="py-4 bg-white/5 hover:bg-red-600/20 border border-white/10 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all"
              >
                <ArrowUpCircle className="w-5 h-5 text-red-500" /> Withdraw
              </button>
            </div>
          </div>
        </div>

        {/* Balance Card */}
        <div className="bg-gradient-to-br from-blue-600 to-indigo-900 p-8 rounded-[40px] text-white flex flex-col justify-between shadow-2xl shadow-blue-900/20 relative overflow-hidden group">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 blur-[60px] rounded-full group-hover:w-60 group-hover:h-60 transition-all duration-700" />
          <div className="relative">
            <p className="text-blue-200 text-sm font-bold uppercase tracking-widest mb-2">Available Balance</p>
            <h2 className="text-5xl font-bold font-mono">${currentUser?.balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</h2>
          </div>
          <div className="grid grid-cols-2 gap-4 relative mt-12">
            <div className="bg-white/10 p-4 rounded-3xl backdrop-blur-md">
               <p className="text-xs text-blue-200 mb-1">Lifetime Deposits</p>
               <p className="text-xl font-bold">${currentUser?.totalInvested.toLocaleString()}</p>
            </div>
            <div className="bg-white/10 p-4 rounded-3xl backdrop-blur-md">
               <p className="text-xs text-blue-200 mb-1">Lifetime Withdrawals</p>
               <p className="text-xl font-bold">${currentUser?.totalWithdrawn.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* History Table */}
      <div className="bg-[#0e121a] border border-gray-800 rounded-[40px] overflow-hidden">
        <div className="p-8 border-b border-gray-800 flex justify-between items-center">
          <h3 className="text-2xl font-bold">Transaction History</h3>
          <div className="flex gap-2">
            <span className="px-3 py-1 bg-white/5 rounded-full text-xs font-bold text-gray-500">All Time</span>
          </div>
        </div>
        <div className="overflow-x-auto">
           {userTransactions.length === 0 ? (
             <div className="p-20 text-center text-gray-500">No transactions recorded yet.</div>
           ) : (
             <table className="w-full text-left">
               <thead className="bg-[#141922] text-xs font-bold text-gray-500 uppercase tracking-widest">
                 <tr>
                    <th className="px-8 py-5">Date & ID</th>
                    <th className="px-8 py-5">Type</th>
                    <th className="px-8 py-5">Amount</th>
                    <th className="px-8 py-5">Method</th>
                    <th className="px-8 py-5">Status</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-gray-800">
                 {userTransactions.map(tx => (
                    <tr key={tx.id} className="hover:bg-white/5 transition-colors group">
                      <td className="px-8 py-6">
                         <div className="flex flex-col">
                            <span className="text-white font-medium text-sm">{new Date(tx.date).toLocaleDateString()}</span>
                            <span className="text-xs text-gray-600 font-mono">#{tx.id}</span>
                         </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                          tx.type === TransactionType.PROFIT ? 'bg-emerald-500/10 text-emerald-500' :
                          tx.type === TransactionType.WITHDRAWAL ? 'bg-red-500/10 text-red-500' : 'bg-blue-500/10 text-blue-500'
                        }`}>
                          {tx.type}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                         <span className={`text-lg font-bold font-mono ${tx.type === TransactionType.WITHDRAWAL ? 'text-red-400' : 'text-green-400'}`}>
                           {tx.type === TransactionType.WITHDRAWAL ? '-' : '+'}${tx.amount.toLocaleString()}
                         </span>
                      </td>
                      <td className="px-8 py-6 text-sm text-gray-500 font-medium">{tx.method || '-'}</td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-2">
                          {tx.status === 'COMPLETED' ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : 
                           tx.status === 'PENDING' ? <Clock className="w-4 h-4 text-amber-500" /> : <XCircle className="w-4 h-4 text-red-500" />}
                          <span className={`text-xs font-bold uppercase ${
                            tx.status === 'COMPLETED' ? 'text-emerald-500' :
                            tx.status === 'PENDING' ? 'text-amber-500' : 'text-red-500'
                          }`}>
                            {tx.status}
                          </span>
                        </div>
                      </td>
                    </tr>
                 ))}
               </tbody>
             </table>
           )}
        </div>
      </div>
    </div>
  );
};
