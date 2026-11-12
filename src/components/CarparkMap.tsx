import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { Carpark } from '../types/carpark';
import { MapPin, Navigation, Info, Zap } from 'lucide-react';

interface CarparkMapProps {
  carparks: Carpark[];
  selectedCarpark: Carpark | null;
  onSelectCarpark: (carpark: Carpark) => void;
  isDarkMode: boolean;
  onOpenDetails: (carpark: Carpark) => void;
}

export const CarparkMap: React.FC<CarparkMapProps> = ({
  carparks,
  selectedCarpark,
  onSelectCarpark,
  isDarkMode,
  onOpenDetails,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const markersMapRef = useRef<Map<string, L.Marker>>(new Map());

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    // Default center: Central Singapore (MacRitchie / Central Catchment view)
    const map = L.map(mapContainerRef.current, {
      center: [1.3200, 103.8400],
      zoom: 12,
      zoomControl: false,
    });

    // Add zoom control top-right
    L.control.zoom({ position: 'topright' }).addTo(map);

    // Dark vs Light CartoDB tile layer
    const tileUrl = isDarkMode
      ? 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png'
      : 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';

    L.tileLayer(tileUrl, {
      attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
      subdomains: 'abcd',
      maxZoom: 19,
    }).addTo(map);

    const markersLayer = L.layerGroup().addTo(map);
    markersLayerRef.current = markersLayer;
    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Markers whenever carparks change
  useEffect(() => {
    const map = mapInstanceRef.current;
    const layer = markersLayerRef.current;
    if (!map || !layer) return;

    layer.clearLayers();
    markersMapRef.current.clear();

    carparks.forEach((cp) => {
      const available = cp.availableLots.car;
      const total = cp.totalLots.car;
      const pct = total > 0 ? available / total : 0;

      let colorClass = 'bg-emerald-600 text-white border-emerald-700';
      if (available === 0) {
        colorClass = 'bg-slate-700 text-slate-200 border-slate-800';
      } else if (pct < 0.15) {
        colorClass = 'bg-rose-600 text-white border-rose-700';
      } else if (pct < 0.35) {
        colorClass = 'bg-amber-500 text-white border-amber-600';
      }

      const isSelected = selectedCarpark?.id === cp.id;
      const ringClass = isSelected
        ? 'ring-4 ring-blue-500 ring-offset-2 scale-110 z-50'
        : 'hover:scale-110 shadow-md';

      // Custom HTML Marker Pill
      const customIcon = L.divIcon({
        className: 'custom-carpark-pin',
        html: `
          <div class="flex items-center gap-1 px-2 py-0.5 rounded-full font-mono font-bold text-xs border ${colorClass} ${ringClass} transition-all cursor-pointer whitespace-nowrap shadow-sm">
            ${cp.features.hasEVCharging ? '<span class="text-[10px]">⚡</span>' : ''}
            <span>${available}</span>
          </div>
        `,
        iconSize: [50, 24],
        iconAnchor: [25, 12],
      });

      const marker = L.marker([cp.lat, cp.lng], { icon: customIcon });

      marker.on('click', () => {
        onSelectCarpark(cp);
      });

      layer.addLayer(marker);
      markersMapRef.current.set(cp.id, marker);
    });
  }, [carparks, selectedCarpark, onSelectCarpark]);

  // Pan to selected carpark when changed
  useEffect(() => {
    if (!selectedCarpark || !mapInstanceRef.current) return;
    mapInstanceRef.current.flyTo([selectedCarpark.lat, selectedCarpark.lng], 15, {
      animate: true,
      duration: 0.8,
    });
  }, [selectedCarpark]);

  const jumpToZone = (lat: number, lng: number, zoom: number = 14) => {
    if (!mapInstanceRef.current) return;
    mapInstanceRef.current.flyTo([lat, lng], zoom, { animate: true, duration: 0.8 });
  };

  return (
    <div className="relative w-full h-full min-h-[420px] rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-900 shadow-sm flex flex-col">
      {/* Map Container */}
      <div ref={mapContainerRef} className="w-full h-full flex-1" />

      {/* Quick Jump Hotspot Bar overlay at top-left */}
      <div className="absolute top-3 left-3 z-[1000] flex flex-wrap items-center gap-1.5 p-1 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 max-w-[calc(100%-60px)]">
        <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 px-2 uppercase tracking-wider">
          Jump:
        </span>
        <button
          type="button"
          onClick={() => jumpToZone(1.3040, 103.8318, 15)}
          className="px-2 py-0.5 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors whitespace-nowrap"
        >
          Orchard
        </button>
        <button
          type="button"
          onClick={() => jumpToZone(1.2834, 103.8550, 15)}
          className="px-2 py-0.5 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors whitespace-nowrap"
        >
          Marina Bay & CBD
        </button>
        <button
          type="button"
          onClick={() => jumpToZone(1.3005, 103.8552, 15)}
          className="px-2 py-0.5 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors whitespace-nowrap"
        >
          Bugis
        </button>
        <button
          type="button"
          onClick={() => jumpToZone(1.3331, 103.7423, 14)}
          className="px-2 py-0.5 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors whitespace-nowrap"
        >
          Jurong
        </button>
        <button
          type="button"
          onClick={() => jumpToZone(1.3532, 103.9452, 14)}
          className="px-2 py-0.5 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors whitespace-nowrap"
        >
          Tampines
        </button>
        <button
          type="button"
          onClick={() => jumpToZone(1.3200, 103.8400, 12)}
          className="px-2 py-0.5 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded transition-colors whitespace-nowrap"
        >
          Reset All
        </button>
      </div>

      {/* Floating Selected Carpark Preview Card (Bottom Overlay) */}
      {selectedCarpark && (
        <div className="absolute bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-96 z-[1000] p-4 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 transition-all">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                <span className="font-mono font-semibold text-slate-700 dark:text-slate-300">
                  {selectedCarpark.code}
                </span>
                <span aria-hidden="true">·</span>
                <span>{selectedCarpark.operator}</span>
                <span aria-hidden="true">·</span>
                <span>{selectedCarpark.area}</span>
              </div>
              <h4 className="font-semibold text-sm text-slate-900 dark:text-slate-100 mt-0.5 line-clamp-1">
                {selectedCarpark.name}
              </h4>
            </div>

            <div className="text-right shrink-0">
              <div className="font-mono text-lg font-bold text-slate-900 dark:text-white tabular-nums leading-none">
                {selectedCarpark.availableLots.car}
              </div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                of {selectedCarpark.totalLots.car} lots free
              </div>
            </div>
          </div>

          {/* Lot occupancy progress bar */}
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden mt-3">
            <div
              className={`h-full transition-all duration-500 ${
                selectedCarpark.availableLots.car / selectedCarpark.totalLots.car > 0.3
                  ? 'bg-emerald-500'
                  : selectedCarpark.availableLots.car / selectedCarpark.totalLots.car > 0.1
                  ? 'bg-amber-500'
                  : 'bg-rose-500'
              }`}
              style={{
                width: `${Math.min(
                  100,
                  (selectedCarpark.availableLots.car / Math.max(1, selectedCarpark.totalLots.car)) * 100
                )}%`,
              }}
            />
          </div>

          <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-300 mt-2.5">
            <span className="truncate max-w-[200px]">{selectedCarpark.rates.weekdayDay}</span>
            {selectedCarpark.features.hasEVCharging && (
              <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-0.5">
                <Zap className="w-3 h-3" /> EV Ready
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => onOpenDetails(selectedCarpark)}
              className="flex-1 py-1.5 px-3 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center justify-center gap-1.5"
            >
              <Info className="w-3.5 h-3.5" />
              <span>Full Details & Rates</span>
            </button>
            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${selectedCarpark.lat},${selectedCarpark.lng}`}
              target="_blank"
              rel="noopener noreferrer"
              className="py-1.5 px-3 text-xs font-medium text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors flex items-center gap-1"
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>Navigate</span>
            </a>
          </div>
        </div>
      )}

      {/* Map Legend (Bottom Left) */}
      <div className="absolute bottom-3 left-3 z-[1000] hidden sm:flex items-center gap-3 px-3 py-1.5 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 text-[11px] text-slate-600 dark:text-slate-400">
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span>
          <span>&gt;30% Lots Free</span>
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block"></span>
          <span>10-30% Free</span>
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block"></span>
          <span>&lt;10% Free</span>
        </span>
      </div>
    </div>
  );
};
