import React from 'react';
import { RefreshCw, Moon, Sun, ShieldCheck } from 'lucide-react';

interface NavbarProps {
  activeTab: 'explore' | 'finder' | 'favorites' | 'rates';
  onSelectTab: (tab: 'explore' | 'finder' | 'favorites' | 'rates') => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  onRefresh: () => void;
  isRefreshing: boolean;
  lastUpdatedText: string;
  isLiveFeed: boolean;
  feedSource?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onSelectTab,
  isDarkMode,
  onToggleTheme,
  onRefresh,
  isRefreshing,
  lastUpdatedText,
  isLiveFeed,
  feedSource = 'Live Feed',
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark (Strict single line, no subtitles/pill attachments) */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-sm tracking-tighter shadow-sm">
            SG
          </div>
          <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-slate-100 whitespace-nowrap shrink-0">
            ParkLive
          </span>
          <span className="hidden sm:inline-flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 pl-2 border-l border-slate-200 dark:border-slate-800">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block"></span>
            <span>{isLiveFeed ? `${feedSource} Live` : 'Simulated Feed'}</span>
          </span>
        </div>

        {/* Zone 2: Navigation Links (Single-line, natural typography) */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-300">
          <button
            type="button"
            onClick={() => onSelectTab('explore')}
            className={`whitespace-nowrap transition-colors pb-0.5 ${
              activeTab === 'explore'
                ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 font-semibold'
                : 'hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Live Availability
          </button>
          <button
            type="button"
            onClick={() => onSelectTab('finder')}
            className={`whitespace-nowrap transition-colors pb-0.5 ${
              activeTab === 'finder'
                ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 font-semibold'
                : 'hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Destination Finder
          </button>
          <button
            type="button"
            onClick={() => onSelectTab('favorites')}
            className={`whitespace-nowrap transition-colors pb-0.5 ${
              activeTab === 'favorites'
                ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 font-semibold'
                : 'hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Saved Carparks
          </button>
          <button
            type="button"
            onClick={() => onSelectTab('rates')}
            className={`whitespace-nowrap transition-colors pb-0.5 ${
              activeTab === 'rates'
                ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 font-semibold'
                : 'hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Pricing & Rules
          </button>
        </nav>

        {/* Zone 3: 1 Primary Action group */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            type="button"
            onClick={onToggleTheme}
            aria-label="Toggle dark mode"
            className="p-2 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          <button
            type="button"
            onClick={onRefresh}
            disabled={isRefreshing}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-lg transition-colors shadow-sm disabled:opacity-60 whitespace-nowrap shrink-0"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh Lots</span>
            <span className="sm:hidden">Sync</span>
          </button>
        </div>
      </div>
    </header>
  );
};
