import React from 'react';
import { DollarSign, Clock, ShieldCheck, Zap, Info, HelpCircle } from 'lucide-react';

export const RatesGuide: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          Singapore Parking Rules & Rates Guide
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Essential guidelines on Housing & Development Board (HDB), Urban Redevelopment Authority (URA), and Commercial parking systems across Singapore.
        </p>
      </div>

      {/* 3 Core Rules Bento */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-sm mb-3">
            01
          </div>
          <h3 className="font-semibold text-sm text-slate-900 dark:text-white">
            HDB & URA Standard Tariffs
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
            Outside the Central Area, standard HDB parking is charged at <strong className="text-slate-700 dark:text-slate-200">$0.60 per 30 minutes</strong>. Within designated Central Area zones (e.g. Chinatown, Tanjong Pagar, Rochor), charges are <strong className="text-slate-700 dark:text-slate-200">$1.20 per 30 minutes</strong> during peak hours (7:00 AM – 5:00 PM).
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-sm mb-3">
            02
          </div>
          <h3 className="font-semibold text-sm text-slate-900 dark:text-white">
            Sunday & Public Holiday Free Parking
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
            Most residential HDB carparks offer <strong className="text-emerald-600 dark:text-emerald-400">Free Parking Scheme (FPS)</strong> on Sundays and Public Holidays from <strong className="text-slate-700 dark:text-slate-200">7:00 AM to 10:30 PM</strong>. Look for the yellow FPS signboard at the gantry.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold text-sm mb-3">
            03
          </div>
          <h3 className="font-semibold text-sm text-slate-900 dark:text-white">
            Grace Periods & Night Parking Caps
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
            HDB Electronic Parking System (EPS) offers a standard <strong className="text-slate-700 dark:text-slate-200">15-minute grace period</strong> (extended to 20 mins during select periods) for drop-offs. Night parking (10:30 PM to 7:00 AM) is capped at <strong className="text-slate-700 dark:text-slate-200">$5.00 maximum</strong>.
          </p>
        </div>
      </div>

      {/* Detailed Breakdown Accordion or Table */}
      <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
        <h3 className="font-semibold text-base text-slate-900 dark:text-white flex items-center gap-2">
          <Info className="w-4 h-4 text-blue-600" />
          <span>Vehicle Type Breakdown & Demarcation in Singapore</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
            <h4 className="font-semibold text-slate-900 dark:text-white mb-1">
              White Lots vs Red/Yellow Demarcations
            </h4>
            <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
              <strong>White lots</strong> are available for all day parking by non-season parking holders. <strong>Red lots</strong> are strictly reserved for Season Parking Holders all day. <strong>Bi-coloured (Red and White) lots</strong> are reserved for Season Parking Ticket holders from 7:00 PM to 7:00 AM on weekdays and Saturdays, and all day on Sundays.
            </p>
          </div>

          <div className="p-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
            <h4 className="font-semibold text-slate-900 dark:text-white mb-1">
              Motorcycles (Type Y Lots) & ERP Gantries
            </h4>
            <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
              Motorcycle parking in HDB and URA lots is charged at a flat rate of <strong>$0.65 per session</strong> (Day session 7am-10:30pm, Night session 10:30pm-7am), or an all-day concession cap.
            </p>
          </div>

          <div className="p-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
            <h4 className="font-semibold text-slate-900 dark:text-white mb-1">
              EV (Electric Vehicle) Charging Etiquette
            </h4>
            <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
              CDG ENGIE, SP Mobility, and Shell Recharge lots in HDB Multi-Storey Carparks are designated for active charging only. Idle fees apply once charging completes (typically 30-minute grace before $0.50/min idle fee).
            </p>
          </div>

          <div className="p-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
            <h4 className="font-semibold text-slate-900 dark:text-white mb-1">
              Commercial Mall Parking Strategies
            </h4>
            <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
              Many shopping malls (CapitaLand, Frasers, Lendlease) provide per-entry parking caps after 5:00 PM or 6:00 PM (e.g., $2.50 to $4.00 flat entry), making evening dining cheaper than daytime hourly increments.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
