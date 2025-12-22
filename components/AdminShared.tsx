
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
  <div className="bg-[#0e121a] border border-gray-800 p-3 sm:p-5 md:p-6 rounded-2xl md:rounded-[32px] hover:bg-[#141922] transition-all group overflow-hidden">
    <div className="flex justify-between items-start sm:items-center mb-2 md:mb-4">
      <div className={`p-1.5 sm:p-2.5 md:p-3 rounded-lg md:rounded-2xl ${bg}`}>
        <Icon className={`w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 ${color}`} />
      </div>
      <span className="text-[7px] sm:text-[9px] md:text-[10px] font-bold text-gray-500 uppercase tracking-widest truncate ml-2 text-right">{label}</span>
    </div>
    <h3 className="text-sm sm:text-base md:text-3xl font-black font-mono text-white truncate leading-tight">{value}</h3>
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
  <div className={`bg-[#0e121a] border border-gray-800 p-5 md:p-8 rounded-[24px] md:rounded-[40px] flex flex-col justify-between hover:border-${colorClass.split('-')[1]}-500/30 transition-all group`}>
    <div>
      <div className="flex items-center gap-3 mb-3 md:mb-6">
        <div className={`p-2 sm:p-3 ${bgClass} rounded-xl md:rounded-2xl ${colorClass}`}><Icon className="w-4 h-4 md:w-6 md:h-6" /></div>
        <h4 className="text-sm md:text-xl font-bold">{title}</h4>
      </div>
      <p className="text-[10px] md:text-sm text-gray-500 mb-5 md:mb-8 leading-relaxed line-clamp-2 md:line-clamp-none">{description}</p>
    </div>
    <div className="flex items-center gap-2">
      <button 
        onClick={primaryAction.onClick} 
        className={`flex-1 py-2.5 md:py-4 ${bgClass} hover:bg-${colorClass.split('-')[1]}-600 ${colorClass} hover:text-white rounded-xl md:rounded-2xl font-bold text-[8px] sm:text-[9px] md:text-xs transition-all uppercase tracking-widest border border-${colorClass.split('-')[1]}-500/10`}
      >
        {primaryAction.label}
      </button>
      {secondaryAction && (
        <button 
          onClick={secondaryAction.onClick} 
          className="p-2.5 md:p-4 bg-white/5 hover:bg-white/10 rounded-xl md:rounded-2xl text-gray-400 transition-all"
        >
          <secondaryAction.icon className="w-3.5 h-3.5 md:w-5 md:h-5" />
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
  <div className="bg-[#0e121a] border border-gray-800 rounded-2xl md:rounded-[32px] overflow-hidden animate-in fade-in duration-300">
    {(title || action) && (
      <div className="p-4 sm:p-6 md:p-8 border-b border-gray-800 flex flex-row justify-between items-center gap-4 bg-[#141922]/30">
        <div>
          {title && <h3 className="text-xs sm:text-sm md:text-xl font-bold leading-none">{title}</h3>}
          {subtitle && <p className="text-[7px] sm:text-[8px] md:text-xs text-gray-500 mt-1 md:mt-2">{subtitle}</p>}
        </div>
        {action}
      </div>
    )}
    <div className="overflow-x-auto w-full scrollbar-hide">
      <table className="w-full text-left min-w-[500px]">
        <thead className="bg-[#141922]/50 text-[7px] sm:text-[8px] md:text-[10px] font-bold text-gray-500 uppercase tracking-widest">
          <tr>
            {headers.map((header, i) => (
              <th key={i} className={`px-4 md:px-8 py-3 md:py-5 ${i === headers.length - 1 ? 'text-right' : ''}`}>
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
    <span className={`px-1.5 md:px-3 py-0.5 md:py-1 rounded-md md:rounded-lg text-[6px] sm:text-[7px] md:text-[9px] font-black uppercase tracking-widest border ${styles[variant]}`}>
      {status}
    </span>
  );
};
