
import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { User, InvestmentPlan, Investment, Transaction, UserRole, TransactionStatus, TransactionType, SupportTicket, CoinData, KycStatus } from '../types.ts';
import { INITIAL_PLANS, MOCK_USERS } from '../constants.ts';

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'info' | 'error';
  title?: string;
}

interface PlatformStats {
  totalUsers: number;
  totalDeposits: number;
  totalWithdrawals: number;
  totalInvested: number;
  pendingWithdrawals: number;
  platformBalance: number;
}

interface SystemIntegration {
  isLive: boolean;
  dbLink?: string;
  authRpc?: string;
  apiGateway?: string;
}

interface AppContextType {
  currentUser: User | null;
  users: User[];
  plans: InvestmentPlan[];
  investments: Investment[];
  transactions: Transaction[];
  tickets: SupportTicket[];
  marketData: CoinData[];
  platformStats: PlatformStats;
  theme: 'dark' | 'light';
  toasts: Toast[];
  isHydrated: boolean;
  systemIntegration: SystemIntegration;
  toggleTheme: () => void;
  removeToast: (id: string) => void;
  addToast: (message: string, type?: 'success' | 'info' | 'error', title?: string) => void;
  login: (email: string, pass: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;
  submitKyc: (files: string[]) => void;
  createTicket: (subject: string, message: string, priority: 'LOW' | 'MEDIUM' | 'HIGH') => void;
  register: (name: string, email: string, userId: string, referrerCode?: string) => Promise<{success: boolean, message?: string}>;
  makeDeposit: (amount: number, method: string, proofFilename?: string) => void;
  requestWithdrawal: (amount: number, method: string) => void;
  investInPlan: (planId: string, amount: number) => string | null;
  adminApproveWithdrawal: (txId: string) => void;
  adminRejectWithdrawal: (txId: string) => void;
  adminApproveDeposit: (txId: string) => void;
  adminRejectDeposit: (txId: string) => void;
  updateSystemIntegration: (data: Partial<SystemIntegration>) => void;
  adminUpdateUser: (userId: string, data: Partial<User>) => void;
  adminUpdatePlan: (plan: InvestmentPlan) => void;
  adminDeletePlan: (id: string) => void;
  adminCreatePlan: (plan: Omit<InvestmentPlan, 'id'>) => void;
  debugTriggerProfit: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);
const SIMULATED_DAY_MS = 60000;

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isHydrated, setIsHydrated] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [plans, setPlans] = useState<InvestmentPlan[]>(INITIAL_PLANS);
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [systemIntegration, setSystemIntegration] = useState<SystemIntegration>({ isLive: false });
  const [marketData, setMarketData] = useState<CoinData[]>([
    { id: 'bitcoin', symbol: 'BTC', name: 'Bitcoin', price: 96450.25, change24h: 2.45 },
    { id: 'ethereum', symbol: 'ETH', name: 'Ethereum', price: 2840.12, change24h: -1.15 },
    { id: 'solana', symbol: 'SOL', name: 'Solana', price: 145.80, change24h: 5.82 },
    { id: 'tether', symbol: 'USDT', name: 'Tether', price: 1.00, change24h: 0.01 },
  ]);

  useEffect(() => {
    try {
      const getParsed = (key: string) => {
        const val = localStorage.getItem(key);
        return (val && val !== 'undefined') ? JSON.parse(val) : null;
      };

      const u = getParsed('hyip_current_user');
      const us = getParsed('hyip_users');
      const inv = getParsed('hyip_investments');
      const tx = getParsed('hyip_transactions');
      const storedPlans = getParsed('hyip_plans');

      if (u) setCurrentUser(u);
      if (us) setUsers(us);
      if (inv) setInvestments(inv);
      if (tx) setTransactions(tx);
      if (storedPlans) setPlans(storedPlans);
    } catch (e) {
      console.warn("Hydration failed, using defaults", e);
    } finally {
      setIsHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    localStorage.setItem('hyip_current_user', JSON.stringify(currentUser));
    localStorage.setItem('hyip_users', JSON.stringify(users));
    localStorage.setItem('hyip_investments', JSON.stringify(investments));
    localStorage.setItem('hyip_transactions', JSON.stringify(transactions));
    localStorage.setItem('hyip_plans', JSON.stringify(plans));
  }, [currentUser, users, investments, transactions, plans, isHydrated]);

  const addToast = useCallback((message: string, type: 'success' | 'info' | 'error' = 'info', title?: string) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts(prev => [...prev, { id, message, type, title }]);
    setTimeout(() => setToasts(curr => curr.filter(t => t.id !== id)), 5000);
  }, []);

  const removeToast = useCallback((id: string) => setToasts(curr => curr.filter(t => t.id !== id)), []);

  const platformStats = useMemo(() => ({
    totalUsers: users.length,
    totalDeposits: transactions.filter(t => t.type === TransactionType.DEPOSIT && t.status === TransactionStatus.COMPLETED).reduce((a, b) => a + b.amount, 0),
    totalWithdrawals: transactions.filter(t => t.type === TransactionType.WITHDRAWAL && t.status === TransactionStatus.COMPLETED).reduce((a, b) => a + b.amount, 0),
    totalInvested: investments.reduce((a, b) => a + b.amount, 0),
    pendingWithdrawals: transactions.filter(t => t.type === TransactionType.WITHDRAWAL && t.status === TransactionStatus.PENDING).length,
    platformBalance: users.reduce((a, b) => a + b.balance, 0),
  }), [users, transactions, investments]);

  const processProfits = useCallback(() => {
    const now = Date.now();
    setInvestments(prev => {
      const updates: Transaction[] = [];
      const userBalanceUpdates: Record<string, number> = {};
      let changed = false;

      const updated = prev.map(inv => {
        if (inv.status !== 'ACTIVE') return inv;
        const plan = plans.find(p => p.id === inv.planId);
        if (!plan || now < inv.nextPayout || inv.totalPayouts >= plan.durationDays) return inv;

        changed = true;
        const profit = inv.amount * (plan.roi / 100);
        userBalanceUpdates[inv.userId] = (userBalanceUpdates[inv.userId] || 0) + profit;
        
        updates.push({
          id: `PROFIT-${Math.random().toString(36).substr(2, 5).toUpperCase()}`,
          userId: inv.userId,
          amount: profit,
          type: TransactionType.PROFIT,
          status: TransactionStatus.COMPLETED,
          date: now,
          details: `Yield from ${plan.name}`
        });

        return {
          ...inv,
          earnedSoFar: inv.earnedSoFar + profit,
          totalPayouts: inv.totalPayouts + 1,
          nextPayout: now + SIMULATED_DAY_MS,
          status: (inv.totalPayouts + 1 >= plan.durationDays ? 'COMPLETED' : 'ACTIVE') as 'ACTIVE' | 'COMPLETED'
        };
      });

      if (changed) {
        setTransactions(t => [...updates, ...t]);
        setUsers(u => u.map(usr => userBalanceUpdates[usr.id] ? { ...usr, balance: usr.balance + userBalanceUpdates[usr.id] } : usr));
        if (currentUser && userBalanceUpdates[currentUser.id]) {
          setCurrentUser(curr => curr ? { ...curr, balance: curr.balance + userBalanceUpdates[curr.id] } : null);
          addToast("Yield payout credited to balance.", "success", "Profit Received");
        }
      }
      return updated;
    });
  }, [plans, currentUser, addToast]);

  useEffect(() => {
    const interval = setInterval(processProfits, 10000);
    return () => clearInterval(interval);
  }, [processProfits]);

  const login = async (email: string, pass: string) => {
    const user = users.find(u => u.email === email && !u.isBlocked);
    if (user && (email === 'admin@hyip.com' ? pass === 'admin123' : true)) {
      setCurrentUser(user);
      addToast(`Authentication successful.`, "success", "Welcome Back");
      return true;
    }
    return false;
  };

  const logout = useCallback(() => {
    setCurrentUser(null);
    addToast("Session terminated.", "info", "Logged Out");
  }, [addToast]);

  const register = async (name: string, email: string, userId: string, referrerCode?: string) => {
    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      email, name, role: UserRole.USER, balance: 10,
      totalInvested: 0, totalWithdrawn: 0, referralCode: userId.trim().toUpperCase(),
      createdAt: Date.now(), isBlocked: false, kycLevel: 0, kycStatus: 'UNVERIFIED', twoFactorEnabled: false
    };
    setUsers(prev => [...prev, newUser]);
    setCurrentUser(newUser);
    return { success: true };
  };

  const updateProfile = (data: Partial<User>) => {
    if (!currentUser) return;
    const up = { ...currentUser, ...data };
    setCurrentUser(up);
    setUsers(prev => prev.map(u => u.id === currentUser.id ? up : u));
  };

  const submitKyc = (files: string[]) => {
    if (!currentUser) return;
    updateProfile({ kycStatus: 'PENDING' });
    addToast("Documents archive (.rar/.zip) received. Analysis in progress.", "success", "KYC Pending");
  };

  const makeDeposit = (amount: number, method: string, proofFilename?: string) => {
    if (!currentUser) return;
    const tx: Transaction = { 
      id: `D-${Math.random().toString(36).substr(2, 5).toUpperCase()}`, 
      userId: currentUser.id, 
      amount, 
      type: TransactionType.DEPOSIT, 
      status: TransactionStatus.COMPLETED, 
      date: Date.now(), 
      method,
      proofFile: proofFilename 
    };
    setTransactions(prev => [tx, ...prev]);
    const updated = { ...currentUser, balance: currentUser.balance + amount };
    setCurrentUser(updated);
    setUsers(prev => prev.map(u => u.id === currentUser.id ? updated : u));
    addToast(`$${amount} deposited via ${method}. Proof verified.`, "success", "Funds Added");
  };

  const requestWithdrawal = (amount: number, method: string) => {
    if (!currentUser || currentUser.balance < amount) return;
    const tx: Transaction = { id: `W-${Math.random().toString(36).substr(2, 5).toUpperCase()}`, userId: currentUser.id, amount, type: TransactionType.WITHDRAWAL, status: TransactionStatus.PENDING, date: Date.now(), method };
    setTransactions(prev => [tx, ...prev]);
    const updated = { ...currentUser, balance: currentUser.balance - amount };
    setCurrentUser(updated);
    setUsers(prev => prev.map(u => u.id === currentUser.id ? updated : u));
    addToast("Withdrawal request sent to queue.", "info", "Processing");
  };

  const investInPlan = (planId: string, amount: number) => {
    const p = plans.find(p => p.id === planId);
    if (!currentUser || currentUser.balance < amount || !p || amount < p.minAmount || amount > p.maxAmount) return 'Check balance or plan limits.';

    const newInv: Investment = {
      id: `I-${Math.random().toString(36).substr(2, 5).toUpperCase()}`,
      userId: currentUser.id, planId, amount, earnedSoFar: 0, startDate: Date.now(),
      nextPayout: Date.now() + SIMULATED_DAY_MS, totalPayouts: 0, status: 'ACTIVE'
    };

    setInvestments(prev => [newInv, ...prev]);
    const updatedUser = { ...currentUser, balance: currentUser.balance - amount, totalInvested: currentUser.totalInvested + amount };
    setCurrentUser(updatedUser);
    setUsers(prev => prev.map(usr => usr.id === currentUser.id ? updatedUser : usr));
    setTransactions(prev => [{ id: `S-${Math.random().toString(36).substr(2, 5).toUpperCase()}`, userId: currentUser.id, amount, type: TransactionType.DEPOSIT, status: TransactionStatus.COMPLETED, date: Date.now(), details: `Staked in ${p.name}` }, ...prev]);
    addToast("Investment started successfully.", "success", "Yield Active");
    return null;
  };

  const adminApproveWithdrawal = (txId: string) => {
    setTransactions(prev => prev.map(t => {
      if (t.id === txId) {
        setUsers(uList => uList.map(u => u.id === t.userId ? { ...u, totalWithdrawn: u.totalWithdrawn + t.amount } : u));
        return { ...t, status: TransactionStatus.COMPLETED };
      }
      return t;
    }));
  };

  const adminRejectWithdrawal = (txId: string) => {
    setTransactions(prev => prev.map(t => t.id === txId ? { ...t, status: TransactionStatus.REJECTED } : t));
    const tx = transactions.find(t => t.id === txId);
    if (tx) setUsers(prev => prev.map(u => u.id === tx.userId ? { ...u, balance: u.balance + tx.amount } : u));
  };

  const adminApproveDeposit = (txId: string) => {
    setTransactions(prev => prev.map(t => {
      if (t.id === txId && t.status === TransactionStatus.PENDING) {
        setUsers(uList => uList.map(u => u.id === t.userId ? { ...u, balance: u.balance + t.amount } : u));
        return { ...t, status: TransactionStatus.COMPLETED };
      }
      return t;
    }));
  };

  const adminRejectDeposit = (txId: string) => {
    setTransactions(prev => prev.map(t => t.id === txId ? { ...t, status: TransactionStatus.REJECTED } : t));
  };

  const updateSystemIntegration = (data: Partial<SystemIntegration>) => setSystemIntegration(prev => ({ ...prev, ...data }));
  const adminUpdateUser = (userId: string, data: Partial<User>) => setUsers(prev => prev.map(u => u.id === userId ? { ...u, ...data } : u));
  const adminUpdatePlan = (plan: InvestmentPlan) => setPlans(prev => prev.map(p => p.id === plan.id ? plan : p));
  const adminDeletePlan = (id: string) => setPlans(prev => prev.filter(p => p.id !== id));
  const adminCreatePlan = (planData: Omit<InvestmentPlan, 'id'>) => setPlans([...plans, { ...planData, id: 'plan_' + Date.now() }]);

  const debugTriggerProfit = () => {
    setInvestments(p => p.map(i => i.status === 'ACTIVE' ? { ...i, nextPayout: Date.now() - 1000 } : i));
    setTimeout(processProfits, 100);
  };

  return (
    <AppContext.Provider value={{
      currentUser, users, plans, investments, transactions, tickets, marketData, platformStats, theme, toggleTheme: () => setTheme(t => t === 'dark' ? 'light' : 'dark'),
      toasts, removeToast, addToast, isHydrated, systemIntegration,
      login, logout, updateProfile, submitKyc,
      createTicket: (subject, message, priority) => {
        if (!currentUser) return;
        setTickets(p => [{ id: 'T-' + Math.random().toString(36).substr(2, 5).toUpperCase(), userId: currentUser.id, subject, message, status: 'OPEN', priority, createdAt: Date.now() }, ...p]);
      },
      register, makeDeposit, requestWithdrawal, investInPlan, adminApproveWithdrawal, adminRejectWithdrawal,
      adminApproveDeposit, adminRejectDeposit,
      updateSystemIntegration, adminUpdateUser, adminUpdatePlan, adminDeletePlan, adminCreatePlan, debugTriggerProfit
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
