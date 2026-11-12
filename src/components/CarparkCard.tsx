import React from 'react';
import { Carpark } from '../types/carpark';
import { Star, Navigation, Zap, Bike, ShieldAlert } from 'lucide-react';

interface CarparkCardProps {
  carpark: Carpark;
  isSelected: boolean;
  isFavorite: boolean;
  onSelect: () => void;
  onToggleFavorite: (e: React.MouseEvent) => void;
  onOpenDetails: () => void;
}

export const CarparkCard: React.FC<CarparkCardProps> = ({
  carpark,
  isSelected,
  isFavorite,
  onSelect,
  onToggleFavorite,
  onOpenDetails,
}) => {
  const available = carpark.availableLots.car;
  const total = carpark.totalLots.car;
  const pctFree = total > 0 ? (available / total) * 100 : 0;

  let availabilityText = 'Ample Lots';
  let availabilityColor = 'text-emerald-600 dark:text-emerald-400';
  let progressBg = 'bg-emerald-500';

  if (available === 0) {
    availabilityText = 'Full';
    availabilityColor = 'text-slate-500 dark:text-slate-400';
    progressBg = 'bg-slate-500';
  } else if (pctFree < 12) {
    availabilityText = 'Almost Full';
    availabilityColor = 'text-rose-600 dark:text-rose-400';
    progressBg = 'bg-rose-500';
  } else if (pctFree < 30) {
    availabilityText = 'Filling Up';
    availabilityColor = 'text-amber-600 dark:text-amber-400';
    progressBg = 'bg-amber-500';
  }

  return (
    <div
      onClick={onSelect}
      className={`relative p-4 rounded-xl border transition-all cursor-pointer ${
        isSelected
          ? 'bg-blue-50/70 dark:bg-slate-800/90 border-blue-500 ring-2 ring-blue-500/20 shadow-sm'
          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-xs'
      }`}
    >
      {/* Header: Code + Name + Favorite Button */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          {/* Unboxed metadata line with typographic bullet separators */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
            <span className="font-mono font-bold text-slate-700 dark:text-slate-300">
              {carpark.code}
            </span>
            <span aria-hidden="true">·</span>
            <span>{carpark.operator}</span>
            <span aria-hidden="true">·</span>
            <span>{carpark.area}</span>
            {carpark.distanceKm !== undefined && (
              <>
                <span aria-hidden="true">·</span>
                <span className="font-mono">{carpark.distanceKm} km away</span>
              </>
            )}
          </div>

          <h3 className="font-semibold text-sm text-slate-900 dark:text-slate-100 mt-1 line-clamp-1">
            {carpark.name}
          </h3>
        </div>

        {/* Favorite button */}
        <button
          type="button"
          onClick={onToggleFavorite}
          aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          className={`p-1.5 rounded-lg transition-colors shrink-0 ${
            isFavorite
              ? 'text-amber-500 hover:text-amber-600 bg-amber-50 dark:bg-amber-950/40'
              : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Star className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
        </button>
      </div>

      {/* Lot Availability Section */}
      <div className="mt-3 p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
        <div className="flex items-baseline justify-between">
          <div className="flex items-baseline gap-1.5">
            <span className="font-mono text-2xl font-bold tracking-tight text-slate-900 dark:text-white tabular-nums">
              {available.toLocaleString()}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 tabular-nums">
              / {total.toLocaleString()} lots free
            </span>
          </div>

          <span className={`text-xs font-semibold tabular-nums ${availabilityColor}`}>
            {availabilityText} ({Math.round(pctFree)}%)
          </span>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden mt-2">
          <div
            className={`h-full ${progressBg} transition-all duration-300`}
            style={{ width: `${Math.min(100, Math.max(0, pctFree))}%` }}
          />
        </div>
      </div>

      {/* Rates & Highlights */}
      <div className="mt-3 flex items-center justify-between text-xs text-slate-600 dark:text-slate-300">
        <div className="truncate max-w-[220px]">
          <span className="text-slate-400 dark:text-slate-500 mr-1">Rate:</span>
          <span className="font-medium text-slate-700 dark:text-slate-200">{carpark.rates.weekdayDay}</span>
        </div>

        {carpark.rates.freeParking && (
          <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 shrink-0">
            Sun Free
          </span>
        )}
      </div>

      {/* Feature Icons + Action Bar */}
      <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          {carpark.features.hasEVCharging && (
            <span className="inline-flex items-center gap-0.5 text-[11px] text-blue-600 dark:text-blue-400 font-medium" title="Electric Vehicle Charging Bays Available">
              <Zap className="w-3 h-3" /> EV
            </span>
          )}
          {carpark.availableLots.motorcycle !== undefined && carpark.availableLots.motorcycle > 0 && (
            <span className="inline-flex items-center gap-0.5 text-[11px] text-slate-600 dark:text-slate-400" title="Motorcycle Lots">
              <Bike className="w-3 h-3" /> {carpark.availableLots.motorcycle}
            </span>
          )}
          <span className="text-[11px] text-slate-400 dark:text-slate-500">
            {carpark.features.heightClearanceM}m max
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onOpenDetails();
            }}
            className="px-2.5 py-1 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors"
          >
            Details
          </button>
          <a
            href={`https://www.google.com/maps/dir/?api=1&destination=${carpark.lat},${carpark.lng}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="px-2 py-1 text-xs font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded transition-colors inline-flex items-center gap-1"
          >
            <Navigation className="w-3 h-3" />
            <span>Map</span>
          </a>
        </div>
      </div>
    </div>
  );
};
