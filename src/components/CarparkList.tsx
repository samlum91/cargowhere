import React from 'react';
import { Carpark } from '../types/carpark';
import { CarparkCard } from './CarparkCard';
import { SearchX, Filter } from 'lucide-react';

interface CarparkListProps {
  carparks: Carpark[];
  selectedCarpark: Carpark | null;
  favorites: string[];
  onSelectCarpark: (carpark: Carpark) => void;
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
  onOpenDetails: (carpark: Carpark) => void;
  onResetFilters: () => void;
  isLoading: boolean;
}

export const CarparkList: React.FC<CarparkListProps> = ({
  carparks,
  selectedCarpark,
  favorites,
  onSelectCarpark,
  onToggleFavorite,
  onOpenDetails,
  onResetFilters,
  isLoading,
}) => {
  if (isLoading) {
    return (
      <div className="flex flex-col gap-3 p-1">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 animate-pulse"
          >
            <div className="flex justify-between items-center mb-3">
              <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/3"></div>
              <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-12"></div>
            </div>
            <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded w-3/4 mb-3"></div>
            <div className="h-12 bg-slate-100 dark:bg-slate-800 rounded w-full mb-3"></div>
            <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  if (carparks.length === 0) {
    return (
      <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center min-h-[300px]">
        <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 mb-3">
          <SearchX className="w-6 h-6" />
        </div>
        <h4 className="font-semibold text-base text-slate-900 dark:text-slate-100 mb-1">
          No carparks found
        </h4>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mb-4">
          No carparks match your search criteria or active filters. Try clearing your search term or adjusting regions.
        </p>
        <button
          type="button"
          onClick={onResetFilters}
          className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
        >
          Reset All Filters
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 overflow-y-auto pr-1 pb-4">
      {carparks.map((cp) => (
        <CarparkCard
          key={cp.id}
          carpark={cp}
          isSelected={selectedCarpark?.id === cp.id}
          isFavorite={favorites.includes(cp.id)}
          onSelect={() => onSelectCarpark(cp)}
          onToggleFavorite={(e) => onToggleFavorite(cp.id, e)}
          onOpenDetails={() => onOpenDetails(cp)}
        />
      ))}
    </div>
  );
};
