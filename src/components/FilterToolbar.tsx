import React from 'react';
import { Search, SlidersHorizontal, Car, Bike, Truck, Zap, Map as MapIcon, List, Columns, X } from 'lucide-react';
import { CarparkFilterState, VehicleType } from '../types/carpark';

interface FilterToolbarProps {
  filters: CarparkFilterState;
  onChangeFilters: (filters: CarparkFilterState) => void;
  totalCarparks: number;
  totalAvailableLots: number;
}

export const FilterToolbar: React.FC<FilterToolbarProps> = ({
  filters,
  onChangeFilters,
  totalCarparks,
  totalAvailableLots,
}) => {
  const regions = [
    { id: 'all', label: 'All Singapore' },
    { id: 'Central', label: 'Central & CBD' },
    { id: 'East', label: 'East' },
    { id: 'West', label: 'West' },
    { id: 'North', label: 'North' },
    { id: 'North-East', label: 'North-East' },
  ];

  const vehicleOptions: { id: VehicleType | 'all' | 'ev'; label: string; icon: React.ReactNode }[] = [
    { id: 'all', label: 'All Lots', icon: null },
    { id: 'car', label: 'Cars', icon: <Car className="w-3.5 h-3.5" /> },
    { id: 'motorcycle', label: 'Bikes', icon: <Bike className="w-3.5 h-3.5" /> },
    { id: 'heavyVehicle', label: 'Heavy', icon: <Truck className="w-3.5 h-3.5" /> },
    { id: 'ev', label: 'EV Bays', icon: <Zap className="w-3.5 h-3.5" /> },
  ];

  return (
    <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 py-3.5 px-4 sm:px-6 transition-colors">
      <div className="max-w-7xl mx-auto flex flex-col gap-3">
        {/* Top line: Search input + View switcher + Stats */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Search Bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={filters.searchQuery}
              onChange={(e) => onChangeFilters({ ...filters, searchQuery: e.target.value })}
              placeholder="Search carpark code (e.g. ACB, HE12), mall, or street..."
              className="w-full pl-9 pr-8 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
            {filters.searchQuery && (
              <button
                type="button"
                onClick={() => onChangeFilters({ ...filters, searchQuery: '' })}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Quick Metrics & View Mode Segmented Control */}
          <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
            <div className="text-xs text-slate-500 dark:text-slate-400 tabular-nums">
              <span className="font-semibold text-slate-800 dark:text-slate-200">{totalCarparks}</span> carparks
              <span className="mx-1.5 text-slate-300 dark:text-slate-700">·</span>
              <span className="font-semibold text-emerald-600 dark:text-emerald-400 font-mono">
                {totalAvailableLots.toLocaleString()}
              </span>{' '}
              lots free
            </div>

            {/* View Mode Switcher */}
            <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
              <button
                type="button"
                onClick={() => onChangeFilters({ ...filters, viewMode: 'split' })}
                title="Split Map & List View"
                className={`p-1.5 rounded-md text-xs font-medium transition-all ${
                  filters.viewMode === 'split'
                    ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Columns className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => onChangeFilters({ ...filters, viewMode: 'map' })}
                title="Full Map View"
                className={`p-1.5 rounded-md text-xs font-medium transition-all ${
                  filters.viewMode === 'map'
                    ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <MapIcon className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => onChangeFilters({ ...filters, viewMode: 'list' })}
                title="Full List View"
                className={`p-1.5 rounded-md text-xs font-medium transition-all ${
                  filters.viewMode === 'list'
                    ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Second Line: Region pills & Vehicle filters & Sorting */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 pt-1 border-t border-slate-100 dark:border-slate-800/60">
          {/* Region Segmented Controls */}
          <div className="flex flex-wrap items-center gap-1">
            {regions.map((reg) => {
              const isActive = filters.region === reg.id;
              return (
                <button
                  key={reg.id}
                  type="button"
                  onClick={() => onChangeFilters({ ...filters, region: reg.id })}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
                    isActive
                      ? 'bg-slate-900 text-white dark:bg-blue-600 dark:text-white shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {reg.label}
                </button>
              );
            })}
          </div>

          {/* Quick Filters: Vehicle & Operator & Min Lots */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Vehicle Type Tabs */}
            <div className="flex items-center p-0.5 bg-slate-100 dark:bg-slate-800 rounded-md">
              {vehicleOptions.map((v) => {
                const isSelected = filters.vehicleType === v.id;
                return (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => onChangeFilters({ ...filters, vehicleType: v.id })}
                    className={`flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded transition-colors whitespace-nowrap ${
                      isSelected
                        ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    {v.icon}
                    <span>{v.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Operator filter */}
            <select
              value={filters.operator}
              onChange={(e) => onChangeFilters({ ...filters, operator: e.target.value })}
              className="px-2.5 py-1 text-xs bg-slate-100 dark:bg-slate-800 border border-transparent dark:border-slate-700 rounded-md text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="all">All Operators</option>
              <option value="HDB">HDB Only</option>
              <option value="Commercial">Malls / Commercial</option>
            </select>

            {/* Free Sunday Parking toggle */}
            <button
              type="button"
              onClick={() =>
                onChangeFilters({ ...filters, onlyWithFreeParking: !filters.onlyWithFreeParking })
              }
              className={`px-2.5 py-1 text-xs font-medium rounded-md whitespace-nowrap border transition-colors ${
                filters.onlyWithFreeParking
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-transparent hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Sun/PH Free
            </button>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-1.5 pl-1 text-xs text-slate-500 dark:text-slate-400">
              <span className="hidden lg:inline">Sort:</span>
              <select
                value={filters.sortBy}
                onChange={(e) =>
                  onChangeFilters({
                    ...filters,
                    sortBy: e.target.value as CarparkFilterState['sortBy'],
                  })
                }
                className="px-2 py-1 text-xs bg-slate-100 dark:bg-slate-800 border border-transparent dark:border-slate-700 rounded-md text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="availability">Availability %</option>
                <option value="lots">Most Lots Free</option>
                <option value="rate">Lowest Rate ($/hr)</option>
                <option value="name">Name (A-Z)</option>
                <option value="distance">Nearest Distance</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
