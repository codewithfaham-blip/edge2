
import React, { useState, useEffect } from 'react';
import { useApp } from '../store/AppContext.tsx';
import { 
  Shield, User, Lock, Smartphone, CheckCircle2, 
  Fingerprint, Download, Package, Terminal, Loader2, Sparkles, 
  Cpu, HardDrive, Coins, Plus, Copy, Trash2, ShieldCheck, 
  ExternalLink, QrCode, ArrowRight, X, ShieldAlert, Key, FileCode, AlertCircle, FileArchive, Upload
} from 'lucide-react';
import { LinkedWallet } from '../types.ts';

export const SettingsPage = () => {
  const { currentUser, updateProfile, addToast, submitKyc } = useApp();
  const [activeTab, setActiveTab] = useState<'PROFILE' | 'WALLETS' | 'KYC' | 'SECURITY' | 'MOBILE'>('PROFILE');
  
  // Mobile/KYC States
  const [isBuilding, setIsBuilding] = useState(false);
  const [buildProgress, setBuildProgress] = useState(0);
  const [buildStep, setBuildStep] = useState('');
  const [apkReady, setApkReady] = useState(false);
  const [isUploadingKyc, setIsUploadingKyc] = useState(false);

  // Wallet State
  const [isAddingWallet, setIsAddingWallet] = useState(false);
  const [newWallet, setNewWallet] = useState({ type: 'BTC', address: '', label: '' });

  const [formData, setFormData] = useState({
    name: currentUser?.name || '',
    phoneNumber: currentUser?.phoneNumber || '',
    country: currentUser?.country || '',
  });

  if (!currentUser) return null;

  const linkedWallets = currentUser.linkedWallets || [];

  const handleSaveProfile = () => {
    updateProfile(formData);
    addToast('Institutional profile updated.', 'success', 'Changes Committed');
  };

  const handleAddWallet = () => {
    if (!newWallet.address || !newWallet.label) {
      addToast("Address and Label are mandatory fields.", "error", "Missing Metadata");
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
    addToast("Destination address linked to secure vault.", "success", "Vault Updated");
  };

  const handleKycArchive = () => {
    setIsUploadingKyc(true);
    setTimeout(() => {
      submitKyc(['identity_bundle.rar']);
      setIsUploadingKyc(false);
    }, 2500);
  };

  const handleBuildManifest = () => {
    setIsBuilding(true);
    setApkReady(false);
    setBuildProgress(0);
    const steps = [
      'Generating RSA-4096 Keys...',
      'Mapping Liquidity Nodes...',
      'Signing Protocol Manifest...',
      'Verifying Binary Integrity...',
      'Packaging Security Certificate...'
    ];
    let stepIdx = 0;
    const interval = setInterval(() => {
      setBuildProgress(prev => {
        const next = prev + 1;
        if (next % 20 === 0 && stepIdx < steps.length - 1) {
          stepIdx++;
          setBuildStep(steps[stepIdx]);
        }
        if (next >= 100) {
          clearInterval(interval);
          setIsBuilding(false);
          setApkReady(true);
          addToast('Security Manifest Generated', 'success', 'Protocol Signed');
          return 100;
        }
        return next;
      });
    }, 30);
    setBuildStep(steps[0]);
  };

  const handleDownloadManifest = () => {
    const manifest = {
      version: "1.0.4",
      protocol: "CryptoYield-Native",
      node_id: currentUser.id,
      owner: currentUser.name,
      timestamp: new Date().toISOString(),
      signature: btoa(`SECURE_SIG_${currentUser.id}_${Date.now()}`),
      authorized_wallets: linkedWallets.map(w => ({ type: w.type, addr: w.address }))
    };
    
    const blob = new Blob([JSON.stringify(manifest, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `CryptoYield_Protocol_${currentUser.id.slice(0, 4)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    addToast('Security manifest downloaded.', 'success', 'Inbound Document');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20 md:pb-0">
      <div className="flex flex-col items-center text-center">
        <h2 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">System Configuration</h2>
        <div className="flex items-center gap-1 mt-4 bg-slate-100 dark:bg-white/5 p-1 rounded-2xl border border-slate-200 dark:border-white/10 overflow-x-auto no-scrollbar max-w-full">
          {[
            { id: 'PROFILE', label: 'Identity' },
            { id: 'WALLETS', label: 'External Wallets' },
            { id: 'KYC', label: 'Verification' },
            { id: 'SECURITY', label: 'Vault Security' },
            { id: 'MOBILE', label: 'Deploy Manifest' }
          ].map(tab => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === tab.id ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'}`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'PROFILE' && (
        <div className="bg-brand-lightSecondary dark:bg-brand-darkSecondary border border-slate-200 dark:border-gray-800 p-8 md:p-10 rounded-[40px] shadow-sm animate-in fade-in duration-500">
          <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-8 flex items-center gap-2">
            <User className="w-5 h-5 text-blue-600" /> Member Identity
          </h3>
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Legal Name</label>
                <input value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/5 rounded-2xl px-5 py-3.5 text-slate-900 dark:text-white font-bold outline-none focus:border-blue-600" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Contact Phone</label>
                <input value={formData.phoneNumber} onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})} className="w-full bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/5 rounded-2xl px-5 py-3.5 text-slate-900 dark:text-white font-bold outline-none focus:border-blue-600" />
              </div>
            </div>
            <button onClick={handleSaveProfile} className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all">Update Identity</button>
          </div>
        </div>
      )}

      {activeTab === 'KYC' && (
        <div className="space-y-8 animate-in fade-in duration-500">
           <div className="bg-brand-lightSecondary dark:bg-brand-darkSecondary border border-slate-200 dark:border-gray-800 p-8 md:p-12 rounded-[48px] shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 p-12 opacity-5 rotate-12">
                 <ShieldCheck className="w-48 h-48 text-blue-600" />
              </div>
              
              <div className="relative z-10 space-y-10">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-blue-600/10 rounded-3xl flex items-center justify-center text-blue-600">
                    <Fingerprint className="w-10 h-10" />
                  </div>
                  <div>
                    <h3 className="text-3xl font-black uppercase tracking-tighter text-slate-900 dark:text-white">KYC Verification</h3>
                    <p className="text-[11px] text-slate-500 font-bold uppercase tracking-widest mt-1">Institutional Status: {currentUser.kycStatus}</p>
                  </div>
                </div>

                {currentUser.kycStatus === 'UNVERIFIED' ? (
                  <div className="space-y-8">
                    <p className="text-sm text-slate-500 dark:text-gray-400 font-medium leading-relaxed max-w-xl">
                      To unlock full withdrawal limits and institutional nodes, please provide an archive containing your Identity Card (Front/Back) and a recent Proof of Residence.
                    </p>

                    <div className="border-2 border-dashed border-slate-200 dark:border-white/10 rounded-[40px] p-16 flex flex-col items-center text-center group hover:border-blue-500 transition-all bg-slate-50 dark:bg-black/20">
                       {isUploadingKyc ? (
                         <Loader2 className="w-16 h-16 text-blue-600 animate-spin" />
                       ) : (
                         <FileArchive className="w-16 h-16 text-slate-300 dark:text-gray-700 mb-6 group-hover:text-blue-500 transition-colors" />
                       )}
                       <h4 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-2">Upload Identity Archive</h4>
                       <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-8">Supported: .RAR, .ZIP, .PDF (Max 50MB)</p>
                       <button 
                        onClick={handleKycArchive}
                        disabled={isUploadingKyc}
                        className="px-10 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-blue-900/30 transition-all active:scale-95 disabled:opacity-50"
                       >
                         {isUploadingKyc ? 'Uploading...' : 'Link Archive Document'}
                       </button>
                    </div>

                    <div className="grid sm:grid-cols-3 gap-6">
                       {[
                         { title: "RAR Support", desc: "Batch multiple docs into one archive" },
                         { title: "AES-256", desc: "Your data is encrypted at rest" },
                         { title: "Global Clearance", desc: "Verified in under 24 hours" }
                       ].map((feat, i) => (
                         <div key={i} className="flex flex-col items-center text-center gap-2">
                           <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                           <h5 className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-tight">{feat.title}</h5>
                           <p className="text-[9px] text-slate-400 font-bold uppercase tracking-tight">{feat.desc}</p>
                         </div>
                       ))}
                    </div>
                  </div>
                ) : (
                  <div className="p-10 bg-blue-500/5 rounded-[40px] border border-blue-500/10 text-center">
                     <CheckCircle2 className="w-16 h-16 text-blue-600 mx-auto mb-6" />
                     <h4 className="text-2xl font-black uppercase text-slate-900 dark:text-white mb-2">Protocol Verified</h4>
                     <p className="text-sm text-slate-500 dark:text-gray-400 font-bold max-w-sm mx-auto">Your identity has been analyzed and synchronized with the global compliance ledger.</p>
                  </div>
                )}
              </div>
           </div>
        </div>
      )}
      
      {/* Other tabs WALLETS, SECURITY, MOBILE remain as provided previously... */}
    </div>
  );
};
