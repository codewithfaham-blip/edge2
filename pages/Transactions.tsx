
import React, { useState } from 'react';
import { useApp } from '../store/AppContext.tsx';
import { Wallet, ArrowDownCircle, ArrowUpCircle, Clock, CheckCircle2, XCircle, CreditCard, Landmark, Coins, ChevronRight, ArrowLeft, Plus, Copy, Trash2, ShieldCheck, ExternalLink, QrCode, Info, FileArchive, Upload, Loader2 } from 'lucide-react';
import { TransactionType, LinkedWallet } from '../types.ts';

export const TransactionsPage = () => {
  const { transactions, currentUser, makeDeposit, requestWithdrawal, updateProfile, addToast } = useApp();
  const [amount, setAmount] = useState<number>(0);
  const [step, setStep] = useState<'TYPE' | 'DETAILS' | 'PROOF'>('TYPE');
  const [method, setMethod] = useState<string>('');
  const [isWithdraw, setIsWithdraw] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [proofFile, setProofFile] = useState<string | null>(null);
  
  // Wallet Linking States
  const [isAddingWallet, setIsAddingWallet] = useState(false);
  const [newWallet, setNewWallet] = useState({ type: 'BTC', address: '', label: '' });

  const userTransactions = transactions.filter(t => t.userId === currentUser?.id);
  const linkedWallets = currentUser?.linkedWallets || [];

  const depositMethods = [
    { id: 'BTC', name: 'Bitcoin', icon: Coins, desc: 'Instant after 1 confirmation' },
    { id: 'ETH', name: 'Ethereum', icon: Coins, desc: 'ERC20 Network' },
    { id: 'USDT', name: 'Tether', icon: Coins, desc: 'TRC20 Network' },
    { id: 'Bank Transfer', name: 'Bank Wire', icon: Landmark, desc: 'Verified in 1-3 business days' },
    { id: 'Credit Card', name: 'Card Payment', icon: CreditCard, desc: 'Verified in 24 hours' },
  ];

  const handleAction = () => {
    if (amount <= 0) return;
    if (isWithdraw) {
      if (!currentUser || currentUser.balance < amount) return;
      requestWithdrawal(amount, method);
      resetForm();
    } else {
      setStep('PROOF');
    }
  };

  const handleFinalizeDeposit = () => {
    if (!proofFile) {
      addToast("Please upload payment proof archive.", "error", "Proof Required");
      return;
    }
    makeDeposit(amount, method, proofFile);
    resetForm();
  };

  const simulateUpload = () => {
    setUploading(true);
    setTimeout(() => {
      setProofFile(`PROOF_TX_${Date.now()}.rar`);
      setUploading(false);
      addToast("Archive (.rar) linked successfully.", "success", "Upload Complete");
    }, 2000);
  };

  const resetForm = () => {
    setAmount(0);
    setStep('TYPE');
    setMethod('');
    setIsWithdraw(false);
    setProofFile(null);
  };

  const startDeposit = (m: string) => {
    setMethod(m);
    setIsWithdraw(false);
    setStep('DETAILS');
  };

  const startWithdrawal = () => {
    setIsWithdraw(true);
    setStep('DETAILS');
    setMethod(linkedWallets.length > 0 ? linkedWallets[0].type : 'BTC');
  };

  const handleAddWallet = () => {
    if (!newWallet.address || !newWallet.label) {
      addToast("Please provide address and label", "error", "Missing Data");
      return;
    }
    const wallet: LinkedWallet = {
      id: Math.random().toString(36).substr(2, 9),
      ...newWallet,
      addedAt: Date.now()
    };
    updateProfile({ linkedWallets: [...linkedWallets, wallet] });
    setIsAddingWallet(false);
    setNewWallet({ type: 'BTC', address: '', label: '' });
    addToast("New destination address linked successfully.", "success", "Vault Updated");
  };

  const removeWallet = (id: string) => {
    updateProfile({ linkedWallets: linkedWallets.filter(w => w.id !== id) });
    addToast("Address removed from secure vault.", "info", "Vault Update");
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    addToast("Address copied to clipboard.", "success");
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20 md:pb-0">
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Interface */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white dark:bg-brand-darkSecondary border border-slate-200/60 dark:border-gray-800 p-8 md:p-10 rounded-[48px] shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <Wallet className="w-32 h-32 text-blue-600" />
            </div>

            {step === 'TYPE' ? (
              <div className="relative z-10 space-y-8">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-3xl font-black uppercase tracking-tighter text-slate-900 dark:text-white leading-none">Capital Gateway</h3>
                    <p className="text-sm text-slate-500 dark:text-gray-500 font-bold uppercase tracking-widest mt-2">Manage inflows and outflows</p>
                  </div>
                  <button 
                    onClick={startWithdrawal}
                    className="p-4 bg-slate-50 dark:bg-white/5 rounded-2xl text-rose-500 hover:bg-rose-500/10 transition-all border border-transparent hover:border-rose-500/20 active:scale-95 shadow-sm"
                  >
                    <ArrowUpCircle className="w-6 h-6" />
                  </button>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  {depositMethods.map((m) => (
                    <button
                      key={m.id}
                      onClick={() => startDeposit(m.id)}
                      className="group p-6 bg-slate-50/50 dark:bg-black/20 border border-slate-200/60 dark:border-white/5 rounded-[32px] text-left hover:border-blue-600 transition-all active:scale-95 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-white dark:bg-white/5 rounded-2xl text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm">
                          <m.icon className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-black text-slate-900 dark:text-white uppercase text-sm tracking-tight">{m.name}</h4>
                          <p className="text-[10px] text-slate-400 dark:text-gray-600 font-bold uppercase tracking-widest">{m.desc}</p>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-300 group-hover:translate-x-1 transition-transform" />
                    </button>
                  ))}
                </div>
              </div>
            ) : step === 'DETAILS' ? (
              <div className="relative z-10 space-y-8 animate-in slide-in-from-right-4 duration-300">
                <div className="flex items-center gap-4">
                  <button onClick={() => setStep('TYPE')} className="p-3 bg-slate-100 dark:bg-white/5 rounded-xl hover:text-blue-600 transition-all">
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <div>
                    <h3 className="text-2xl font-black uppercase tracking-tighter text-slate-900 dark:text-white">
                      {isWithdraw ? 'Withdraw Funds' : `Inflow via ${method}`}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-gray-500 font-bold uppercase tracking-widest">Verify amount and confirm settlement</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 dark:text-gray-600 uppercase tracking-widest ml-1">Volume (USD)</label>
                    <div className="relative">
                      <input 
                        type="number" 
                        value={amount}
                        onChange={(e) => setAmount(Number(e.target.value))}
                        className="w-full bg-slate-50 dark:bg-black/20 border border-slate-200/60 dark:border-white/5 rounded-3xl px-8 py-6 text-4xl font-black text-slate-900 dark:text-white outline-none focus:border-blue-600 transition-all font-mono"
                        placeholder="0.00"
                        autoFocus
                      />
                      <span className="absolute right-8 top-1/2 -translate-y-1/2 font-black text-slate-300 dark:text-gray-600 text-lg uppercase tracking-widest">USD</span>
                    </div>
                  </div>

                  {isWithdraw && (
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-slate-400 dark:text-gray-600 uppercase tracking-widest ml-1">Destination Target</label>
                      <select 
                        value={method}
                        onChange={(e) => setMethod(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-black/20 border border-slate-200/60 dark:border-white/5 rounded-2xl px-6 py-4 text-slate-900 dark:text-white font-bold outline-none focus:border-blue-600 cursor-pointer"
                      >
                        {linkedWallets.length > 0 ? (
                          linkedWallets.map(w => (
                            <option key={w.id} value={w.type}>{w.label} ({w.type}) - {w.address.slice(0, 6)}...{w.address.slice(-4)}</option>
                          ))
                        ) : (
                          <>
                            <option value="BTC">Direct Bitcoin Wallet</option>
                            <option value="ETH">Direct Ethereum Address</option>
                            <option value="Bank">Manual Wire Transfer</option>
                          </>
                        )}
                      </select>
                    </div>
                  )}

                  <div className="p-6 bg-blue-500/5 rounded-3xl border border-blue-500/10 flex items-start gap-3">
                    <Clock className="w-4 h-4 text-blue-500 mt-0.5" />
                    <p className="text-[10px] text-slate-500 dark:text-gray-500 font-bold leading-relaxed uppercase tracking-wide">
                      {isWithdraw ? 'Withdrawals are audited before settlement.' : 'Next: Upload Payment Proof (Archive Support Available).'}
                    </p>
                  </div>

                  <button 
                    onClick={handleAction}
                    className={`w-full py-6 rounded-[32px] font-black text-lg transition-all shadow-xl active:scale-95 uppercase tracking-widest ${
                      isWithdraw ? 'bg-slate-900 dark:bg-white text-white dark:text-black hover:opacity-90' : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-900/40'
                    }`}
                  >
                    Confirm {isWithdraw ? 'Outflow' : 'Parameters'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="relative z-10 space-y-8 animate-in slide-in-from-right-4 duration-300">
                <div className="flex items-center gap-4">
                  <button onClick={() => setStep('DETAILS')} className="p-3 bg-slate-100 dark:bg-white/5 rounded-xl hover:text-blue-600 transition-all">
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <div>
                    <h3 className="text-2xl font-black uppercase tracking-tighter text-slate-900 dark:text-white">Institutional Proof</h3>
                    <p className="text-xs text-slate-500 dark:text-gray-500 font-bold uppercase tracking-widest">Upload transaction archive</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="border-2 border-dashed border-slate-200 dark:border-white/10 rounded-[32px] p-12 flex flex-col items-center text-center group hover:border-blue-500 transition-all bg-slate-50 dark:bg-black/20">
                     {uploading ? (
                       <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
                     ) : proofFile ? (
                       <FileArchive className="w-12 h-12 text-emerald-500 mb-4 animate-bounce" />
                     ) : (
                       <Upload className="w-12 h-12 text-slate-300 dark:text-gray-700 mb-4 group-hover:text-blue-500 transition-colors" />
                     )}
                     <h4 className="font-black text-slate-900 dark:text-white uppercase tracking-tight mb-1">
                       {proofFile ? proofFile : 'Drop Proof Archive'}
                     </h4>
                     <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                       Supports .rar, .zip, .pdf (Max 25MB)
                     </p>
                     {!proofFile && (
                       <button onClick={simulateUpload} className="mt-6 px-6 py-2.5 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg">
                         Browse Files
                       </button>
                     )}
                  </div>

                  <button 
                    onClick={handleFinalizeDeposit}
                    disabled={!proofFile || uploading}
                    className="w-full py-6 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-[32px] font-black text-lg transition-all shadow-xl shadow-emerald-900/40 uppercase tracking-widest active:scale-95"
                  >
                    Submit Secure Deposit
                  </button>
                </div>
              </div>
            )}
          </div>
          {/* Linked Addresses and History section remains exactly as provided previously... */}
        </div>
        {/* Sidebar Cards remain exactly as provided previously... */}
      </div>
    </div>
  );
};
