import { motion } from 'motion/react';
import { Eye, Users, RefreshCw, ExternalLink } from 'lucide-react';

interface SharedViewBannerProps {
  ownerName?: string;
  ownedCount: number;
  tradeCount: number;
  missingCount: number;
  onOpenOwn: () => void;
}

export function SharedViewBanner({ ownerName, ownedCount, tradeCount, missingCount, onOpenOwn }: SharedViewBannerProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      className="sticky top-0 z-50 font-['Rubik',sans-serif]"
      style={{ background: 'linear-gradient(90deg, #1a0e04 0%, #2a1506 50%, #1a0e04 100%)' }}
    >
      {/* Top accent line */}
      <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-orange-500 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-0 justify-between">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-8 h-8 shrink-0 rounded-full bg-orange-500/20 border border-orange-500/30 flex items-center justify-center">
            <Eye className="w-4 h-4 text-orange-400" />
          </div>
          <div className="min-w-0">
            <p className="text-white font-semibold text-sm truncate">
              {ownerName
                ? <>Колекція <span className="text-orange-400">{ownerName}</span></>
                : 'Переглядаєш чужу колекцію'}
            </p>
            <div className="flex items-center gap-3 text-[11px] text-white/40 mt-0.5">
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" />
                {ownedCount} є
              </span>
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400 inline-block" />
                {missingCount} немає
              </span>
              {tradeCount > 0 && (
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-400 inline-block" />
                  {tradeCount} для обміну
                </span>
              )}
            </div>
          </div>
        </div>

        <button
          onClick={onOpenOwn}
          className="shrink-0 flex items-center gap-2 px-4 py-2 rounded-lg bg-orange-500 hover:bg-orange-400 active:scale-95 text-[#100a02] font-bold text-xs uppercase tracking-widest transition-all"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          Відкрити свою
        </button>
      </div>

      {/* Legend */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-3 flex items-center gap-5 text-[11px] text-white/35">
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded border-2 border-green-500/60 bg-green-500/10 inline-block" />
          Є в колекції
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded border-2 border-orange-500/70 bg-orange-500/15 inline-block" />
          Готовий обміняти
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded border border-white/15 bg-white/5 inline-block" />
          Відсутня
        </span>
      </div>
    </motion.div>
  );
}

// ── Decode shared URL param ─────────────────────────────────────────────────
export interface SharedData {
  v: number;
  u?: string;
  o: number[];   // owned
  t: number[];   // for trade
}

export function decodeShareParam(param: string): SharedData | null {
  try {
    const json = decodeURIComponent(escape(atob(param)));
    const data = JSON.parse(json);
    if (
      typeof data === 'object' &&
      Array.isArray(data.o) &&
      Array.isArray(data.t)
    ) {
      return data as SharedData;
    }
  } catch { /* ignore */ }
  return null;
}
