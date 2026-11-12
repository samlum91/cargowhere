import React, { useState } from 'react';
import { Carpark, DestinationHub } from '../types/carpark';
import { SINGAPORE_HUBS } from '../data/singaporeCarparks';
import { CarparkService } from '../services/carparkService';
import { MapPin, Navigation, Zap, Compass, ArrowRight, DollarSign } from 'lucide-react';

interface DestinationFinderProps {
  carparks: Carpark[];
  onSelectCarpark: (carpark: Carpark) => void;
  onOpenDetails: (carpark: Carpark) => void;
}

export const DestinationFinder: React.FC<DestinationFinderProps> = ({
  carparks,
  onSelectCarpark,
  onOpenDetails,
}) => {
  const [selectedHub, setSelectedHub] = useState<DestinationHub>(SINGAPORE_HUBS[0]);
  const [maxDistanceKm, setMaxDistanceKm] = useState<number>(3.0);

  // Compute nearby carparks sorted by distance
  const nearbyCarparks = carparks
    .map((cp) => {
      const dist = CarparkService.calculateDistanceKm(selectedHub.lat, selectedHub.lng, cp.lat, cp.lng);
      return { ...cp, distanceKm: dist };
    })
    .filter((cp) => (cp.distanceKm ?? 999) <= maxDistanceKm)
    .sort((a, b) => (a.distanceKm ?? 999) - (b.distanceKm ?? 999));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Intro Header */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          Destination Parking Planner
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
          Select your destination in Singapore to instantly find and compare available lots, parking tariffs, and walking proximity before you arrive.
        </p>
      </div>

      {/* Destination Selector Hubs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
        {SINGAPORE_HUBS.map((hub) => {
          const isSelected = selectedHub.name === hub.name;
          return (
            <button
              key={hub.name}
              type="button"
              onClick={() => setSelectedHub(hub)}
              className={`p-3 text-left rounded-xl border transition-all ${
                isSelected
                  ? 'bg-blue-600 text-white border-blue-600 shadow-md ring-2 ring-blue-500/20'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <div className="flex items-center gap-1.5 text-[11px] opacity-80">
                <MapPin className="w-3 h-3" />
                <span>{hub.area}</span>
              </div>
              <div className="font-semibold text-xs mt-1 line-clamp-1">
                {hub.name}
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Destination Summary Card */}
      <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <span className="font-semibold text-slate-700 dark:text-slate-300">Target Destination</span>
            <span aria-hidden="true">·</span>
            <span>{selectedHub.area}</span>
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
            {selectedHub.name}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {selectedHub.description}
          </p>
        </div>

        {/* Proximity Radius Filter */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-500 dark:text-slate-400 font-medium">Radius:</span>
          <div className="flex items-center p-0.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg">
            {[1.0, 2.0, 3.0, 5.0].map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setMaxDistanceKm(r)}
                className={`px-2.5 py-1 text-xs font-mono font-medium rounded transition-colors ${
                  maxDistanceKm === r
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {r} km
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Nearby Carparks Results Grid */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            {nearbyCarparks.length} Carparks within {maxDistanceKm} km
          </h4>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Ranked by proximity & lot availability
          </span>
        </div>

        {nearbyCarparks.length === 0 ? (
          <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-500 text-xs">
            No carparks found within {maxDistanceKm} km. Try increasing the search radius to 5 km.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {nearbyCarparks.map((cp) => {
              const available = cp.availableLots.car;
              const total = cp.totalLots.car;
              const pctFree = total > 0 ? (available / total) * 100 : 0;
              const walkingMins = Math.round((cp.distanceKm ?? 0.5) * 12); // ~12 mins per km walking

              return (
                <div
                  key={cp.id}
                  onClick={() => onSelectCarpark(cp)}
                  className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 cursor-pointer transition-all shadow-xs flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                      <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                        {cp.code}
                      </span>
                      <span className="font-mono text-blue-600 dark:text-blue-400 font-semibold">
                        {cp.distanceKm} km · ~{walkingMins} min walk
                      </span>
                    </div>

                    <h5 className="font-semibold text-sm text-slate-900 dark:text-white mt-1 line-clamp-1">
                      {cp.name}
                    </h5>

                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                      {cp.address}
                    </p>

                    {/* Lot Counter Card */}
                    <div className="mt-3 p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-slate-500 uppercase tracking-wider block">
                          Available Lots
                        </span>
                        <div className="font-mono text-xl font-bold text-slate-900 dark:text-white tabular-nums">
                          {available}{' '}
                          <span className="text-xs font-normal text-slate-500">
                            / {total}
                          </span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span
                          className={`text-xs font-semibold tabular-nums ${
                            pctFree > 30
                              ? 'text-emerald-600 dark:text-emerald-400'
                              : pctFree > 10
                              ? 'text-amber-600 dark:text-amber-400'
                              : 'text-rose-600 dark:text-rose-400'
                          }`}
                        >
                          {Math.round(pctFree)}% free
                        </span>
                        <div className="text-[11px] text-slate-500 truncate max-w-[140px] mt-0.5">
                          {cp.rates.weekdayDay}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Bottom bar */}
                  <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 text-slate-500">
                      {cp.features.hasEVCharging && (
                        <span className="flex items-center gap-0.5 text-blue-600 dark:text-blue-400 text-[11px] font-medium">
                          <Zap className="w-3 h-3" /> EV
                        </span>
                      )}
                      <span>{cp.features.heightClearanceM}m height</span>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenDetails(cp);
                      }}
                      className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                    >
                      <span>Full Rates</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
