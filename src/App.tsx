import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { FilterToolbar } from './components/FilterToolbar';
import { CarparkMap } from './components/CarparkMap';
import { CarparkList } from './components/CarparkList';
import { CarparkDetailModal } from './components/CarparkDetailModal';
import { DestinationFinder } from './components/DestinationFinder';
import { FavoritesView } from './components/FavoritesBar';
import { RatesGuide } from './components/RatesGuide';
import { Carpark, CarparkFilterState } from './types/carpark';
import { CarparkService } from './services/carparkService';
import { INITIAL_CARPARKS } from './data/singaporeCarparks';

export default function App() {
  const [carparks, setCarparks] = useState<Carpark[]>(INITIAL_CARPARKS);
  const [selectedCarpark, setSelectedCarpark] = useState<Carpark | null>(INITIAL_CARPARKS[0]);
  const [inspectingCarpark, setInspectingCarpark] = useState<Carpark | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'explore' | 'finder' | 'favorites' | 'rates'>('explore');
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [isLiveFeed, setIsLiveFeed] = useState<boolean>(true);
  const [lastUpdated, setLastUpdated] = useState<string>(new Date().toISOString());

  // Dark Mode
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    try {
      const stored = localStorage.getItem('sg_parklive_theme');
      return stored ? stored === 'dark' : false;
    } catch {
      return false;
    }
  });

  // Filter State
  const [filters, setFilters] = useState<CarparkFilterState>({
    searchQuery: '',
    region: 'all',
    area: 'all',
    operator: 'all',
    vehicleType: 'all',
    minLots: 0,
    sortBy: 'availability',
    onlyWithFreeParking: false,
    onlyEV: false,
    viewMode: 'split',
  });

  // Sync dark class on document element
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('sg_parklive_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('sg_parklive_theme', 'light');
    }
  }, [isDarkMode]);

  // Load favorites on mount
  useEffect(() => {
    setFavorites(CarparkService.getFavorites());
  }, []);

  // Fetch real-time lots from data.gov.sg
  const loadData = useCallback(async () => {
    setIsRefreshing(true);
    try {
      const res = await CarparkService.fetchRealtimeCarparks();
      setCarparks(res.carparks);
      setIsLiveFeed(res.isLiveFeed);
      setLastUpdated(res.timestamp);

      // Keep selected carpark fresh
      setSelectedCarpark((prev) => {
        if (!prev) return res.carparks[0];
        const match = res.carparks.find((c) => c.id === prev.id);
        return match || prev;
      });
    } catch (err) {
      console.error('Failed to update carpark lots:', err);
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  // Initial load and auto-refresh every 60 seconds
  useEffect(() => {
    loadData();
    const interval = setInterval(() => {
      loadData();
    }, 60000); // 60s live refresh
    return () => clearInterval(interval);
  }, [loadData]);

  // Favorite toggle handler
  const handleToggleFavorite = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const updated = CarparkService.toggleFavorite(id);
    setFavorites(updated);
  };

  // Filtered carparks
  const filteredCarparks = useMemo(() => {
    return CarparkService.filterCarparks(carparks, filters);
  }, [carparks, filters]);

  // Summary Metrics
  const totalAvailableLots = useMemo(() => {
    return filteredCarparks.reduce((sum, cp) => sum + cp.availableLots.car, 0);
  }, [filteredCarparks]);

  const handleResetFilters = () => {
    setFilters({
      searchQuery: '',
      region: 'all',
      area: 'all',
      operator: 'all',
      vehicleType: 'all',
      minLots: 0,
      sortBy: 'availability',
      onlyWithFreeParking: false,
      onlyEV: false,
      viewMode: 'split',
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors antialiased">
      {/* Top Bar Contract Navbar */}
      <Navbar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        isDarkMode={isDarkMode}
        onToggleTheme={() => setIsDarkMode((prev) => !prev)}
        onRefresh={loadData}
        isRefreshing={isRefreshing}
        lastUpdatedText={new Date(lastUpdated).toLocaleTimeString()}
        isLiveFeed={isLiveFeed}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col">
        {activeTab === 'explore' && (
          <div className="flex-1 flex flex-col">
            {/* Filter & Search Bar */}
            <FilterToolbar
              filters={filters}
              onChangeFilters={setFilters}
              totalCarparks={filteredCarparks.length}
              totalAvailableLots={totalAvailableLots}
            />

            {/* Content Views: Split, Map only, or List only */}
            <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:px-6">
              {filters.viewMode === 'split' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-[calc(100vh-185px)] min-h-[550px]">
                  {/* Left Column: Carpark Card Feed */}
                  <div className="lg:col-span-5 h-full flex flex-col min-h-0">
                    <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-2 px-1">
                      <span>Showing {filteredCarparks.length} parking locations</span>
                      <span>Click to pinpoint on map</span>
                    </div>
                    <div className="flex-1 overflow-y-auto">
                      <CarparkList
                        carparks={filteredCarparks}
                        selectedCarpark={selectedCarpark}
                        favorites={favorites}
                        onSelectCarpark={setSelectedCarpark}
                        onToggleFavorite={handleToggleFavorite}
                        onOpenDetails={setInspectingCarpark}
                        onResetFilters={handleResetFilters}
                        isLoading={isRefreshing && carparks.length === 0}
                      />
                    </div>
                  </div>

                  {/* Right Column: Interactive Map */}
                  <div className="lg:col-span-7 h-full min-h-[400px]">
                    <CarparkMap
                      carparks={filteredCarparks}
                      selectedCarpark={selectedCarpark}
                      onSelectCarpark={setSelectedCarpark}
                      isDarkMode={isDarkMode}
                      onOpenDetails={setInspectingCarpark}
                    />
                  </div>
                </div>
              )}

              {filters.viewMode === 'map' && (
                <div className="h-[calc(100vh-185px)] min-h-[600px]">
                  <CarparkMap
                    carparks={filteredCarparks}
                    selectedCarpark={selectedCarpark}
                    onSelectCarpark={setSelectedCarpark}
                    isDarkMode={isDarkMode}
                    onOpenDetails={setInspectingCarpark}
                  />
                </div>
              )}

              {filters.viewMode === 'list' && (
                <div className="py-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredCarparks.map((cp) => (
                      <div key={cp.id}>
                        <CarparkList
                          carparks={[cp]}
                          selectedCarpark={selectedCarpark}
                          favorites={favorites}
                          onSelectCarpark={setSelectedCarpark}
                          onToggleFavorite={handleToggleFavorite}
                          onOpenDetails={setInspectingCarpark}
                          onResetFilters={handleResetFilters}
                          isLoading={false}
                        />
                      </div>
                    ))}
                  </div>
                  {filteredCarparks.length === 0 && (
                    <CarparkList
                      carparks={[]}
                      selectedCarpark={null}
                      favorites={favorites}
                      onSelectCarpark={() => {}}
                      onToggleFavorite={() => {}}
                      onOpenDetails={() => {}}
                      onResetFilters={handleResetFilters}
                      isLoading={false}
                    />
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'finder' && (
          <DestinationFinder
            carparks={carparks}
            onSelectCarpark={(cp) => {
              setSelectedCarpark(cp);
              setActiveTab('explore');
            }}
            onOpenDetails={setInspectingCarpark}
          />
        )}

        {activeTab === 'favorites' && (
          <FavoritesView
            favorites={favorites}
            carparks={carparks}
            onSelectCarpark={(cp) => {
              setSelectedCarpark(cp);
              setActiveTab('explore');
            }}
            onOpenDetails={setInspectingCarpark}
            onRemoveFavorite={(id, e) => handleToggleFavorite(id, e)}
            onExplore={() => setActiveTab('explore')}
          />
        )}

        {activeTab === 'rates' && <RatesGuide />}
      </main>

      {/* Carpark Detail Modal */}
      {inspectingCarpark && (
        <CarparkDetailModal
          carpark={inspectingCarpark}
          allCarparks={carparks}
          onClose={() => setInspectingCarpark(null)}
          isFavorite={favorites.includes(inspectingCarpark.id)}
          onToggleFavorite={() => handleToggleFavorite(inspectingCarpark.id)}
          onSelectAlternative={(alt) => {
            setSelectedCarpark(alt);
            setInspectingCarpark(alt);
          }}
        />
      )}

      {/* Quiet Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-4 px-4 sm:px-6 transition-colors text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-700 dark:text-slate-300">SG ParkLive</span>
            <span>·</span>
            <span>Official Data.gov.sg & LTA DataMall Real-Time Lot Availability Integration</span>
          </div>
          <div className="flex items-center gap-4">
            <span>Last feed: {new Date(lastUpdated).toLocaleTimeString()}</span>
            <span>·</span>
            <button
              type="button"
              onClick={loadData}
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              Manual Sync
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
