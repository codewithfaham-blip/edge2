
import React, { useState } from 'react';
import { useApp } from '../store/AppContext';
import { ShieldCheck, Info, CheckCircle2, ShieldAlert } from 'lucide-react';
import { UserRole } from '../types';
import { Navigate } from 'react-router-dom';

export const InvestPage = () => {
  const { plans, currentUser, investInPlan } = useApp();
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [amount, setAmount] = useState<number>(100);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Hard redirect if an admin somehow accesses this page
  if (currentUser?.role === UserRole.ADMIN) {
    return <Navigate to="/admin" replace />;
  }

  const selectedPlan = plans.find(p => p.id === selectedPlanId);

  const handleInvest = () => {
    if (!selectedPlanId) return;
    setError(null);
    const result = investInPlan(selectedPlanId, amount);
    if (result) {
      setError(result);
    } else {
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-4">Investment Strategies</h2>
        <p className="text-gray-400">Select a package and start growing your digital portfolio today.</p>
      </div>

      {success && (
        <div className="bg-emerald-500/10 border border-emerald-500/50 p-6 rounded-3xl flex items-center gap-4 animate-in zoom-in duration-300">
          <CheckCircle2 className="w-8 h-8 text-emerald-500" />
          <div>
            <h4 className="font-bold text-white">Investment Successful!</h4>
            <p className="text-sm text-gray-400">Your funds have been allocated to the plan. Daily ROIs will be added to your balance.</p>
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <button
            key={plan.id}
            onClick={() => setSelectedPlanId(plan.id)}
            className={`p-6 rounded-3xl border transition-all text-left ${
              selectedPlanId === plan.id 
              ? 'bg-blue-600/10 border-blue-500 shadow-lg shadow-blue-500/10' 
              : 'bg-[#0e121a] border-gray-800 hover:border-gray-700'
            }`}
          >
            <h3 className="font-bold text-lg mb-2">{plan.name}</h3>
            <p className="text-3xl font-bold text-blue-500 mb-6">{plan.roi}% <span className="text-sm font-normal text-gray-500">/ Day</span></p>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-gray-500">Min:</span> <span className="font-medium text-white">${plan.minAmount}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Max:</span> <span className="font-medium text-white">${plan.maxAmount}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Days:</span> <span className="font-medium text-white">{plan.durationDays}</span></div>
            </div>
          </button>
        ))}
      </div>

      {selectedPlan && (
        <div className="bg-[#0e121a] border border-gray-800 p-8 rounded-3xl space-y-8 animate-in slide-in-from-bottom duration-500">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-600/10 rounded-2xl flex items-center justify-center text-blue-500">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-xl">Investment Configuration</h3>
              <p className="text-sm text-gray-500">Review your investment details before proceeding.</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <label className="text-sm font-medium text-gray-400 uppercase tracking-wider">Amount to Invest ($)</label>
              <div className="relative">
                 <input 
                  type="number" 
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-full bg-[#141922] border border-gray-800 rounded-2xl px-6 py-4 text-2xl font-bold text-white outline-none focus:border-blue-500 transition-all"
                 />
                 <span className="absolute right-6 top-1/2 -translate-y-1/2 font-bold text-gray-600">USD</span>
              </div>
              {error && <p className="text-red-500 text-sm font-medium">{error}</p>}
            </div>

            <div className="bg-[#141922] p-6 rounded-2xl space-y-4">
               <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500">Estimated Daily Profit</span>
                  <span className="font-bold text-emerald-500">${(amount * (selectedPlan.roi / 100)).toFixed(2)}</span>
               </div>
               <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500">Total Return (net)</span>
                  <span className="font-bold text-blue-500">${(amount * (selectedPlan.roi / 100) * selectedPlan.durationDays).toFixed(2)}</span>
               </div>
               <div className="pt-4 border-t border-gray-800 flex justify-between items-center">
                  <span className="font-bold">Total Maturity Value</span>
                  <span className="text-xl font-bold text-white">${(amount + (amount * (selectedPlan.roi / 100) * selectedPlan.durationDays)).toFixed(2)}</span>
               </div>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 bg-blue-500/5 rounded-2xl border border-blue-500/10">
            <Info className="w-5 h-5 text-blue-500 mt-0.5" />
            <p className="text-xs text-gray-500 leading-relaxed">
              By clicking "Confirm Investment", you agree to lock your principal amount of <b>${amount}</b> for <b>{selectedPlan.durationDays} days</b>. Dividends are paid out every 24 hours (simulated as 1 minute in demo mode) and credited directly to your account balance.
            </p>
          </div>

          <button 
            onClick={handleInvest}
            className="w-full py-5 bg-blue-600 hover:bg-blue-700 rounded-2xl font-bold text-lg shadow-xl shadow-blue-900/40 transition-all"
          >
            Confirm & Invest Now
          </button>
        </div>
      )}
    </div>
  );
};
