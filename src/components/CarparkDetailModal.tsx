import React, { useState } from 'react';
import { Carpark } from '../types/carpark';
import {
  X,
  Navigation,
  Car,
  Bike,
  Zap,
  Clock,
  DollarSign,
  Shield,
  Copy,
  Check,
  Star,
  ExternalLink,
  ArrowRight,
} from 'lucide-react';

interface CarparkDetailModalProps {
  carpark: Carpark | null;
  allCarparks: Carpark[];
  onClose: () => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onSelectAlternative: (carpark: Carpark) => void;
}

export const CarparkDetailModal: React.FC<CarparkDetailModalProps> = ({
  carpark,
  allCarparks,
  onClose,
  isFavorite,
  onToggleFavorite,
  onSelectAlternative,
}) => {
  const [copied, setCopied] = useState(false);

  if (!carpark) return null;

  const copyAddress = () => {
    navigator.clipboard.writeText(`${carpark.name}, ${carpark.address}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const availableCars = carpark.availableLots.car;
  const totalCars = carpark.totalLots.car;
  const pctFree = totalCars > 0 ? (availableCars / totalCars) * 100 : 0;

  // Find 2 nearby alternatives in the same area or region
  const alternatives = allCarparks
    .filter((cp) => cp.id !== carpark.id && (cp.area === carpark.area || cp.region === carpark.region))
    .sort((a, b) => {
      // sort by distance to current carpark
      const distA = Math.hypot(a.lat - carpark.lat, a.lng - carpark.lng);
      const distB = Math.hypot(b.lat - carpark.lat, b.lng - carpark.lng);
      return distA - distB;
    })
    .slice(0, 2);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs transition-opacity animate-fade-in">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 max-h-[90vh] flex flex-col overflow-hidden text-slate-900 dark:text-slate-100">
        {/* Top Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-start justify-between gap-4 bg-slate-50/50 dark:bg-slate-900/50">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                {carpark.code}
              </span>
              <span aria-hidden="true">·</span>
              <span>{carpark.operator}</span>
              <span aria-hidden="true">·</span>
              <span>{carpark.carparkType}</span>
              <span aria-hidden="true">·</span>
              <span>{carpark.area}</span>
            </div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mt-1">
              {carpark.name}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {carpark.address}
            </p>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={onToggleFavorite}
              title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
              className={`p-2 rounded-lg border transition-colors ${
                isFavorite
                  ? 'bg-amber-50 text-amber-500 border-amber-200 dark:bg-amber-950/30 dark:border-amber-800'
                  : 'bg-white dark:bg-slate-800 text-slate-400 border-slate-200 dark:border-slate-700 hover:text-slate-600'
              }`}
            >
              <Star className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-white dark:bg-slate-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Modal Content */}
        <div className="p-5 overflow-y-auto space-y-5">
          {/* Real-time Lot Breakdown Grid */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Real-Time Lot Availability
              </span>
              <span className="text-[11px] text-slate-400 font-mono">
                Updated {new Date(carpark.lastUpdated).toLocaleTimeString()}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Cars */}
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
                  <span className="flex items-center gap-1 font-medium">
                    <Car className="w-3.5 h-3.5" /> Car Lots
                  </span>
                  <span className="font-mono font-semibold text-emerald-600 dark:text-emerald-400">
                    {Math.round(pctFree)}% Free
                  </span>
                </div>
                <div className="font-mono text-2xl font-bold text-slate-900 dark:text-white tabular-nums">
                  {availableCars.toLocaleString()}
                </div>
                <div className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">
                  of {totalCars.toLocaleString()} total bays
                </div>
                {/* Visual bar */}
                <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden mt-2">
                  <div
                    className={`h-full ${
                      pctFree > 30 ? 'bg-emerald-500' : pctFree > 10 ? 'bg-amber-500' : 'bg-rose-500'
                    }`}
                    style={{ width: `${Math.min(100, Math.max(0, pctFree))}%` }}
                  />
                </div>
              </div>

              {/* Motorcycles */}
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
                  <span className="flex items-center gap-1 font-medium">
                    <Bike className="w-3.5 h-3.5" /> Motorcycle
                  </span>
                  <span className="font-mono text-slate-500">Lot Type Y</span>
                </div>
                <div className="font-mono text-2xl font-bold text-slate-900 dark:text-white tabular-nums">
                  {carpark.availableLots.motorcycle ?? '--'}
                </div>
                <div className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">
                  of {carpark.totalLots.motorcycle ?? '--'} total bays
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden mt-2">
                  <div className="h-full bg-blue-500" style={{ width: '65%' }} />
                </div>
              </div>

              {/* EV Charging & Clearance */}
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
                  <span className="flex items-center gap-1 font-medium">
                    <Zap className="w-3.5 h-3.5 text-blue-500" /> EV Charging
                  </span>
                  <span className="font-mono text-xs font-semibold text-blue-600 dark:text-blue-400">
                    {carpark.features.hasEVCharging ? 'Available' : 'None'}
                  </span>
                </div>
                <div className="text-xs text-slate-700 dark:text-slate-300 mt-1">
                  Height Limit:{' '}
                  <span className="font-bold font-mono text-slate-900 dark:text-white">
                    {carpark.features.heightClearanceM}m
                  </span>
                </div>
                <div className="text-xs text-slate-700 dark:text-slate-300 mt-1">
                  Gantry: {carpark.features.isGantryElectronic ? 'Electronic EPS' : 'Barrier'}
                </div>
                <div className="text-xs text-slate-700 dark:text-slate-300 mt-1">
                  Night Parking: {carpark.features.nightParking ? 'Yes (Central Cap)' : 'Standard'}
                </div>
              </div>
            </div>
          </div>

          {/* Parking Rates Table */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1">
                <DollarSign className="w-3.5 h-3.5" /> Parking Charges & Tariff
              </span>
              <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                {carpark.rates.gracePeriodMins} min grace period
              </span>
            </div>

            <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden divide-y divide-slate-100 dark:divide-slate-800 text-xs">
              <div className="grid grid-cols-3 p-3 bg-slate-50/50 dark:bg-slate-800/40">
                <span className="text-slate-500 dark:text-slate-400 font-medium">Weekday Daytime</span>
                <span className="col-span-2 font-mono font-medium text-slate-800 dark:text-slate-200">
                  {carpark.rates.weekdayDay}
                </span>
              </div>
              <div className="grid grid-cols-3 p-3">
                <span className="text-slate-500 dark:text-slate-400 font-medium">Weekday Evening/Night</span>
                <span className="col-span-2 font-mono font-medium text-slate-800 dark:text-slate-200">
                  {carpark.rates.weekdayNight}
                </span>
              </div>
              <div className="grid grid-cols-3 p-3 bg-slate-50/50 dark:bg-slate-800/40">
                <span className="text-slate-500 dark:text-slate-400 font-medium">Saturday</span>
                <span className="col-span-2 font-mono font-medium text-slate-800 dark:text-slate-200">
                  {carpark.rates.weekendSat}
                </span>
              </div>
              <div className="grid grid-cols-3 p-3">
                <span className="text-slate-500 dark:text-slate-400 font-medium">Sunday & Public Hol.</span>
                <span className="col-span-2 font-mono font-medium text-slate-800 dark:text-slate-200">
                  {carpark.rates.weekendSunPH}
                </span>
              </div>
            </div>
          </div>

          {/* 24-Hour Occupancy Pattern */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> Typical 24-Hour Occupancy Pattern
              </span>
              <span className="text-[11px] text-slate-400">Peak hours: 12pm - 2pm & 6pm - 8pm</span>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-xl">
              <div className="flex items-end justify-between gap-2 h-24 pt-4">
                {carpark.hourlyTrends.map((trend) => (
                  <div key={trend.hour} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                    <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">
                      {trend.occupancyPercent}%
                    </span>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-t h-full max-h-16 flex items-end">
                      <div
                        className={`w-full rounded-t transition-all ${
                          trend.occupancyPercent > 80
                            ? 'bg-rose-500'
                            : trend.occupancyPercent > 60
                            ? 'bg-amber-500'
                            : 'bg-emerald-500'
                        }`}
                        style={{ height: `${trend.occupancyPercent}%` }}
                      />
                    </div>
                    <span className="text-[10px] font-mono text-slate-600 dark:text-slate-400">
                      {trend.hour}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Alternative Carparks nearby */}
          {alternatives.length > 0 && (
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-2">
                Alternative Parking Nearby
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {alternatives.map((alt) => (
                  <div
                    key={alt.id}
                    onClick={() => onSelectAlternative(alt)}
                    className="p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:border-blue-500 cursor-pointer transition-all flex items-center justify-between"
                  >
                    <div>
                      <div className="text-[11px] font-mono text-slate-500">{alt.code} · {alt.area}</div>
                      <div className="text-xs font-semibold text-slate-800 dark:text-slate-100 line-clamp-1">
                        {alt.name}
                      </div>
                      <div className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 mt-0.5">
                        {alt.availableLots.car} lots free
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Bottom Actions */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/90 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={copyAddress}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied to Clipboard' : 'Copy Address'}</span>
          </button>

          <div className="flex items-center gap-2">
            <a
              href={`https://waze.com/ul?ll=${carpark.lat},${carpark.lng}&navigate=yes`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg transition-colors flex items-center gap-1"
            >
              <span>Waze</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </a>

            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${carpark.lat},${carpark.lng}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-sm flex items-center gap-1.5"
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>Google Maps Directions</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
