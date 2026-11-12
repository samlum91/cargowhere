import React from 'react';
import { Carpark } from '../types/carpark';
import { Star, Navigation, Zap, Trash2, ArrowRight } from 'lucide-react';

interface FavoritesViewProps {
  favorites: string[];
  carparks: Carpark[];
  onSelectCarpark: (carpark: Carpark) => void;
  onOpenDetails: (carpark: Carpark) => void;
  onRemoveFavorite: (id: string, e: React.MouseEvent) => void;
  onExplore: () => void;
}

export const FavoritesView: React.FC<FavoritesViewProps> = ({
  favorites,
  carparks,
  onSelectCarpark,
  onOpenDetails,
  onRemoveFavorite,
  onExplore,
}) => {
  const favoriteCarparks = carparks.filter((cp) => favorites.includes(cp.id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Star className="w-5 h-5 text-amber-500 fill-current" />
            <span>Saved Favorite Carparks</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Fast access to live lot availability at your home estate, workplace, and regular Singapore parking spots.
          </p>
        </div>

        <button
          type="button"
          onClick={onExplore}
          className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 self-start sm:self-auto"
        >
          <span>Find more carparks</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {favoriteCarparks.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-500 flex items-center justify-center mb-3">
            <Star className="w-6 h-6" />
          </div>
          <h4 className="font-semibold text-base text-slate-900 dark:text-white mb-1">
            No saved carparks yet
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mb-4">
            Click the star icon on any carpark card or map marker to pin it here for instant live tracking whenever you drive.
          </p>
          <button
            type="button"
            onClick={onExplore}
            className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
          >
            Browse Singapore Carparks
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {favoriteCarparks.map((cp) => {
            const available = cp.availableLots.car;
            const total = cp.totalLots.car;
            const pctFree = total > 0 ? (available / total) * 100 : 0;

            return (
              <div
                key={cp.id}
                onClick={() => onSelectCarpark(cp)}
                className="p-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-blue-500 cursor-pointer transition-all shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                        {cp.code}
                      </span>
                      <span className="mx-1">·</span>
                      <span>{cp.operator}</span>
                      <span className="mx-1">·</span>
                      <span>{cp.area}</span>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => onRemoveFavorite(cp.id, e)}
                      title="Remove from saved"
                      className="p-1 text-slate-400 hover:text-rose-500 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <h3 className="font-semibold text-sm text-slate-900 dark:text-white mt-1 line-clamp-1">
                    {cp.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                    {cp.address}
                  </p>

                  {/* High impact lot counter */}
                  <div className="mt-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                    <div className="flex items-baseline justify-between">
                      <div className="flex items-baseline gap-1.5">
                        <span className="font-mono text-2xl font-bold text-slate-900 dark:text-white tabular-nums">
                          {available}
                        </span>
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                          / {total} free
                        </span>
                      </div>
                      <span
                        className={`text-xs font-semibold tabular-nums ${
                          pctFree > 30
                            ? 'text-emerald-600 dark:text-emerald-400'
                            : pctFree > 10
                            ? 'text-amber-600 dark:text-amber-400'
                            : 'text-rose-600 dark:text-rose-400'
                        }`}
                      >
                        {Math.round(pctFree)}% available
                      </span>
                    </div>

                    <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden mt-2">
                      <div
                        className={`h-full ${
                          pctFree > 30 ? 'bg-emerald-500' : pctFree > 10 ? 'bg-amber-500' : 'bg-rose-500'
                        }`}
                        style={{ width: `${Math.min(100, Math.max(0, pctFree))}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-slate-500 truncate max-w-[180px]">{cp.rates.weekdayDay}</span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenDetails(cp);
                      }}
                      className="px-2.5 py-1 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors"
                    >
                      Details
                    </button>
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${cp.lat},${cp.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="px-2.5 py-1 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded transition-colors flex items-center gap-1"
                    >
                      <Navigation className="w-3 h-3" />
                      <span>Drive</span>
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
