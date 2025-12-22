
import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  color: string;
  bg: string;
}

export const StatCard: React.FC<StatCardProps> = ({ label, value, icon: Icon, color, bg }) => (
  <div className="bg-[#0e121a] border border-gray-800 p-5 md:p-6 rounded-[24px] md:rounded-[32px] hover:bg-[#141922] transition-all group">
    <div className="flex justify-between items-center mb-4">
      <div className={`p-2.5 md:p-3 rounded-2xl ${bg}`}>
        <Icon className={`w-4 h-4 md:w-5 md:h-5 ${color}`} />
      </div>
      <span className="text-[9px] md:text-[10px] font-bold text-gray-500 uppercase tracking-widest">{label}</span>
    </div>
    <h3 className="text-2xl md:text-3xl font-black font-mono text-white">{value}</h3>
  </div>
);

interface ActionModuleProps {
  title: string;
  description: string;
  icon: LucideIcon;
  colorClass: string;
  bgClass: string;
  primaryAction: { label: string; onClick: () => void };
  secondaryAction?: { icon: LucideIcon; onClick: () => void };
}

export const ActionModule: React.FC<ActionModuleProps> = ({ 
  title, description, icon: Icon, colorClass, bgClass, primaryAction, secondaryAction 
}) => (
  <div className={`bg-[#0e121a] border border-gray-800 p-6 md:p-8 rounded-[32px] md:rounded-[40px] flex flex-col justify-between hover:border-${colorClass.split('-')[1]}-500/30 transition-all group`}>
    <div>
      <div className="flex items-center gap-3 mb-4 md:mb-6">
        <div className={`p-3 ${bgClass} rounded-2xl ${colorClass}`}><Icon className="w-5 h-5 md:w-6 md:h-6" /></div>
        <h4 className="text-lg md:text-xl font-bold">{title}</h4>
      </div>
      <p className="text-xs md:text-sm text-gray-500 mb-6 md:mb-8 leading-relaxed">{description}</p>
    </div>
    <div className="flex items-center gap-2 md:gap-3">
      <button 
        onClick={primaryAction.onClick} 
        className={`flex-1 py-3 md:py-4 ${bgClass} hover:bg-${colorClass.split('-')[1]}-600 ${colorClass} hover:text-white rounded-2xl font-bold text-[10px] md:text-xs transition-all uppercase tracking-widest border border-${colorClass.split('-')[1]}-500/10`}
      >
        {primaryAction.label}
      </button>
      {secondaryAction && (
        <button 
          onClick={secondaryAction.onClick} 
          className="p-3 md:p-4 bg-white/5 hover:bg-white/10 rounded-2xl text-gray-400 transition-all"
        >
          <secondaryAction.icon className="w-4 h-4 md:w-5 md:h-5" />
        </button>
      )}
    </div>
  </div>
);

interface AdminTableProps {
  headers: string[];
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export const AdminTable: React.FC<AdminTableProps> = ({ headers, children, title, subtitle, action }) => (
  <div className="bg-[#0e121a] border border-gray-800 rounded-[24px] md:rounded-[32px] overflow-hidden animate-in fade-in duration-300">
    {(title || action) && (
      <div className="p-5 md:p-8 border-b border-gray-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#141922]/30">
        <div>
          {title && <h3 className="text-lg md:text-xl font-bold">{title}</h3>}
          {subtitle && <p className="text-[10px] md:text-xs text-gray-500 mt-0.5">{subtitle}</p>}
        </div>
        {action}
      </div>
    )}
    <div className="overflow-x-auto no-scrollbar">
      <table className="w-full text-left">
        <thead className="bg-[#141922]/50 text-[9px] md:text-[10px] font-bold text-gray-500 uppercase tracking-widest">
          <tr>
            {headers.map((header, i) => (
              <th key={i} className={`px-5 md:px-8 py-4 md:py-5 ${i === headers.length - 1 ? 'text-right' : ''}`}>
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-800/50">
          {children}
        </tbody>
      </table>
    </div>
  </div>
);

interface StatusBadgeProps {
  status: string;
  variant: 'success' | 'warning' | 'danger' | 'info';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, variant }) => {
  const styles = {
    success: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    warning: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    danger: 'bg-red-500/10 text-red-500 border-red-500/20',
    info: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  };
  return (
    <span className={`px-2 md:px-3 py-1 rounded-lg text-[8px] md:text-[9px] font-black uppercase tracking-widest border ${styles[variant]}`}>
      {status}
    </span>
  );
};
