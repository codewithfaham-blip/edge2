
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, InvestmentPlan, Investment, Transaction, UserRole, TransactionType, TransactionStatus } from '../types';
import { INITIAL_PLANS, MOCK_USERS } from '../constants';

interface AppContextType {
  currentUser: User | null;
  users: User[];
  plans: InvestmentPlan[];
  investments: Investment[];
  transactions: Transaction[];
  login: (email: string, pass: string) => Promise<boolean>;
  logout: () => void;
  register: (name: string, email: string) => Promise<boolean>;
  makeDeposit: (amount: number, method: string) => void;
  requestWithdrawal: (amount: number, method: string) => void;
  investInPlan: (planId: string, amount: number) => string | null;
  adminApproveWithdrawal: (txId: string) => void;
  adminRejectWithdrawal: (txId: string) => void;
  adminUpdateUser: (userId: string, data: Partial<User>) => void;
  adminUpdatePlan: (plan: InvestmentPlan) => void;
  adminDeletePlan: (id: string) => void;
  adminCreatePlan: (plan: Omit<InvestmentPlan, 'id'>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const SIMULATED_DAY_MS = 60000; // 1 minute = 1 day

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('hyip_current_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('hyip_users');
    return saved ? JSON.parse(saved) : MOCK_USERS;
  });

  const [plans, setPlans] = useState<InvestmentPlan[]>(() => {
    const saved = localStorage.getItem('hyip_plans');
    return saved ? JSON.parse(saved) : INITIAL_PLANS;
  });

  const [investments, setInvestments] = useState<Investment[]>(() => {
    const saved = localStorage.getItem('hyip_investments');
    return saved ? JSON.parse(saved) : [];
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('hyip_transactions');
    return saved ? JSON.parse(saved) : [];
  });

  // Sync state with local storage
  useEffect(() => {
    localStorage.setItem('hyip_current_user', JSON.stringify(currentUser));
    localStorage.setItem('hyip_users', JSON.stringify(users));
    localStorage.setItem('hyip_plans', JSON.stringify(plans));
    localStorage.setItem('hyip_investments', JSON.stringify(investments));
    localStorage.setItem('hyip_transactions', JSON.stringify(transactions));
  }, [currentUser, users, plans, investments, transactions]);

  // Sync currentUser with users list to reflect balance changes in header
  useEffect(() => {
    if (currentUser) {
      const liveUser = users.find(u => u.id === currentUser.id);
      if (liveUser && (liveUser.balance !== currentUser.balance || liveUser.isBlocked !== currentUser.isBlocked)) {
        setCurrentUser(liveUser);
      }
    }
  }, [users, currentUser]);

  // Daily profit simulator logic
  useEffect(() => {
    const interval = setInterval(() => {
      setInvestments(prevInvestments => {
        let hasChanges = false;
        const newTransactions: Transaction[] = [];
        const userUpdates: Record<string, number> = {};

        const nextInvestments = prevInvestments.map(inv => {
          if (inv.status !== 'ACTIVE') return inv;

          const plan = plans.find(p => p.id === inv.planId);
          if (!plan) return inv;

          let tempInv = { ...inv };
          let processedAny = false;

          // Catch-up logic: process all missed payouts
          while (Date.now() > tempInv.nextPayout && tempInv.totalPayouts < plan.durationDays) {
            hasChanges = true;
            processedAny = true;
            const profit = tempInv.amount * (plan.roi / 100);
            
            // Collect updates
            userUpdates[tempInv.userId] = (userUpdates[tempInv.userId] || 0) + profit;
            
            newTransactions.push({
              id: Math.random().toString(36).substr(2, 9),
              userId: tempInv.userId,
              amount: profit,
              type: TransactionType.PROFIT,
              status: TransactionStatus.COMPLETED,
              date: Date.now(),
              details: `ROI Payout from ${plan.name} (${tempInv.totalPayouts + 1}/${plan.durationDays})`
            });

            tempInv.totalPayouts += 1;
            tempInv.nextPayout += SIMULATED_DAY_MS;

            if (tempInv.totalPayouts >= plan.durationDays) {
              tempInv.status = 'COMPLETED' as 'COMPLETED';
              break;
            }
          }

          return processedAny ? tempInv : inv;
        });

        if (hasChanges) {
          // Apply user balance updates
          setUsers(prevUsers => prevUsers.map(u => {
            if (userUpdates[u.id]) {
              return { ...u, balance: u.balance + userUpdates[u.id] };
            }
            return u;
          }));

          // Apply new transactions
          setTransactions(prevT => [...newTransactions, ...prevT]);
          
          return nextInvestments;
        }

        return prevInvestments;
      });
    }, 5000); // Check every 5 seconds for smoother updates

    return () => clearInterval(interval);
  }, [plans]);

  const login = async (email: string, pass: string): Promise<boolean> => {
    if (email === 'admin@hyip.com' && pass === 'admin123') {
      const admin = users.find(u => u.email === email);
      if (admin) {
        setCurrentUser(admin);
        return true;
      }
    }
    const user = users.find(u => u.email === email && !u.isBlocked);
    if (user) {
      setCurrentUser(user);
      return true;
    }
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const register = async (name: string, email: string): Promise<boolean> => {
    if (users.find(u => u.email === email)) return false;
    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      name,
      role: UserRole.USER,
      balance: 100,
      totalInvested: 0,
      totalWithdrawn: 0,
      referralCode: name.toUpperCase().replace(/\s/g, '') + Math.floor(Math.random() * 100),
      createdAt: Date.now(),
      isBlocked: false,
    };
    setUsers([...users, newUser]);
    setCurrentUser(newUser);
    return true;
  };

  const makeDeposit = (amount: number, method: string) => {
    if (!currentUser) return;
    const tx: Transaction = {
      id: Math.random().toString(36).substr(2, 9),
      userId: currentUser.id,
      amount,
      type: TransactionType.DEPOSIT,
      status: TransactionStatus.COMPLETED,
      date: Date.now(),
      method,
    };
    setTransactions(prev => [tx, ...prev]);
    setUsers(prev => prev.map(u => u.id === currentUser.id ? { ...u, balance: u.balance + amount } : u));
  };

  const requestWithdrawal = (amount: number, method: string) => {
    if (!currentUser || currentUser.balance < amount) return;
    const tx: Transaction = {
      id: Math.random().toString(36).substr(2, 9),
      userId: currentUser.id,
      amount,
      type: TransactionType.WITHDRAWAL,
      status: TransactionStatus.PENDING,
      date: Date.now(),
      method,
    };
    setTransactions(prev => [tx, ...prev]);
    setUsers(prev => prev.map(u => u.id === currentUser.id ? { ...u, balance: u.balance - amount } : u));
  };

  const investInPlan = (planId: string, amount: number) => {
    const liveUser = users.find(u => u.id === currentUser?.id);
    if (!liveUser || liveUser.balance < amount) return 'Insufficient balance';
    
    const plan = plans.find(p => p.id === planId);
    if (!plan) return 'Plan not found';
    if (amount < plan.minAmount || amount > plan.maxAmount) return 'Amount outside plan limits';

    const newInv: Investment = {
      id: Math.random().toString(36).substr(2, 9),
      userId: liveUser.id,
      planId,
      amount,
      startDate: Date.now(),
      nextPayout: Date.now() + SIMULATED_DAY_MS,
      totalPayouts: 0,
      status: 'ACTIVE' as 'ACTIVE'
    };

    setInvestments(prev => [newInv, ...prev]);
    setUsers(prev => prev.map(u => u.id === liveUser.id ? { 
      ...u, 
      balance: u.balance - amount,
      totalInvested: u.totalInvested + amount 
    } : u));
    
    setTransactions(prev => [{
      id: Math.random().toString(36).substr(2, 9),
      userId: liveUser.id,
      amount,
      type: TransactionType.DEPOSIT,
      status: TransactionStatus.COMPLETED,
      date: Date.now(),
      details: `Invested in ${plan.name} - Plan ROI: ${plan.roi}%, Duration: ${plan.durationDays} days`
    }, ...prev]);

    return null;
  };

  const adminApproveWithdrawal = (txId: string) => {
    setTransactions(prev => prev.map(t => {
      if (t.id === txId) {
        setUsers(uList => uList.map(u => {
          if (u.id === t.userId) return { ...u, totalWithdrawn: u.totalWithdrawn + t.amount };
          return u;
        }));
        return { ...t, status: TransactionStatus.COMPLETED };
      }
      return t;
    }));
  };

  const adminRejectWithdrawal = (txId: string) => {
    setTransactions(prev => prev.map(t => {
      if (t.id === txId) {
        setUsers(uList => uList.map(u => {
          if (u.id === t.userId) return { ...u, balance: u.balance + t.amount };
          return u;
        }));
        return { ...t, status: TransactionStatus.REJECTED };
      }
      return t;
    }));
  };

  const adminUpdateUser = (userId: string, data: Partial<User>) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, ...data } : u));
  };

  const adminUpdatePlan = (plan: InvestmentPlan) => {
    setPlans(prev => prev.map(p => p.id === plan.id ? plan : p));
  };

  const adminDeletePlan = (id: string) => {
    setPlans(prev => prev.filter(p => p.id !== id));
  };

  const adminCreatePlan = (planData: Omit<InvestmentPlan, 'id'>) => {
    const newPlan = { ...planData, id: 'plan_' + Date.now() };
    setPlans([...plans, newPlan]);
  };

  return (
    <AppContext.Provider value={{
      currentUser, users, plans, investments, transactions,
      login, logout, register, makeDeposit, requestWithdrawal, investInPlan,
      adminApproveWithdrawal, adminRejectWithdrawal, adminUpdateUser, adminUpdatePlan, adminDeletePlan, adminCreatePlan
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
