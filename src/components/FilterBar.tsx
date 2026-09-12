import React from 'react';
import { FilterCategory } from '../types/calendar';
import { Search, Layers } from 'lucide-react';

interface FilterBarProps {
  activeFilter: FilterCategory;
  onSelectFilter: (filter: FilterCategory) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  activeFilter,
  onSelectFilter,
  searchQuery,
  onSearchChange,
}) => {
  const filters: { key: FilterCategory; label: string; dotColor: string }[] = [
    { key: 'all', label: 'Tüm Hafta', dotColor: 'bg-gt3-yellow' },
    { key: 'snf1', label: '1. Sınıf (Amfi 8)', dotColor: 'bg-emerald-500' },
    { key: 'snf2', label: '2. Sınıf (Amfi 1)', dotColor: 'bg-slate-400 dark:bg-slate-300' },
    { key: 'lib', label: 'Merkez Kütüphane', dotColor: 'bg-amber-500' },
    { key: 'deepwork', label: 'Deep Work & Şirket', dotColor: 'bg-purple-500' },
  ];

  return (
    <div className="no-print max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 py-2.5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white dark:bg-gt3-cardDark p-2 rounded-xl border border-gt3-borderLight dark:border-gt3-borderDark">
        
        {/* Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {filters.map(f => {
            const isActive = activeFilter === f.key;
            return (
              <button
                key={f.key}
                onClick={() => onSelectFilter(f.key)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-slate-900 text-white dark:bg-slate-800 dark:text-gt3-yellow shadow-sm ring-1 ring-gt3-yellow/50'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${f.dotColor}`} />
                <span>{f.label}</span>
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Ders, konu veya not ara..."
            className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-gt3-yellow transition-colors font-medium"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 hover:text-slate-600 dark:hover:text-white"
            >
              ✕
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
