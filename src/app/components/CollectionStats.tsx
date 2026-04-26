import { motion, AnimatePresence } from 'motion/react';
import { Eye, EyeOff, CheckSquare, Square, Copy, Radiation, Skull, Shield } from 'lucide-react';

interface CollectionStatsProps {
  ownedCount: number;
  totalCount: number;
  missingCount: number;
  duplicatesCount: number;
  duplicateCardIds: number[];
  showOnlyMissing: boolean;
  showOnlyDuplicates: boolean;
  onToggleFilter: () => void;
  onToggleDuplicatesFilter: () => void;
  onSelectAll: () => void;
  onClearAll: () => void;
  isSharedView?: boolean;
  onShareClick?: () => void;
}

// Segmented progress bar — STALKER PDA style
function SegmentedBar({ value, total }: { value: number; total: number }) {
  const SEGMENTS = 24;
  const filled = Math.round((value / total) * SEGMENTS);

  return (
    <div className="flex gap-[3px] w-full">
      {Array.from({ length: SEGMENTS }).map((_, i) => {
        const isFilled = i < filled;
        const isEdge = i === filled - 1 && filled > 0;
        return (
          <motion.div
            key={i}
            initial={{ opacity: 0, scaleY: 0.4 }}
            animate={{ opacity: 1, scaleY: 1 }}
            transition={{ delay: i * 0.018, duration: 0.2 }}
            className={`flex-1 h-5 rounded-[2px] relative overflow-hidden transition-all duration-300 ${isFilled
                ? 'bg-orange-500'
                : 'bg-white/8 border border-white/10'
              }`}
          >
            {/* Glow pulse on edge segment */}
            {isEdge && (
              <motion.div
                className="absolute inset-0 bg-orange-300/60"
                animate={{ opacity: [0.6, 0, 0.6] }}
                transition={{ duration: 1.2, repeat: Infinity }}
              />
            )}
            {/* Scan line */}
            {isFilled && (
              <div className="absolute inset-x-0 top-0 h-[1px] bg-orange-200/40 pointer-events-none" />
            )}
          </motion.div>
        );
      })}
    </div>
  );
}

// Status label
function StatusLabel({ percentage }: { percentage: number }) {
  if (percentage === 100) return <span className="text-green-400">ЗІБРАНО</span>;
  if (percentage >= 75) return <span className="text-orange-400">МАЙЖЕ</span>;
  if (percentage >= 50) return <span className="text-yellow-500">В ПРОЦЕСІ</span>;
  if (percentage >= 25) return <span className="text-orange-600">ПОЧАТОК</span>;
  return <span className="text-red-500">КРИТИЧНО</span>;
}

export function CollectionStats({
  ownedCount,
  totalCount,
  missingCount,
  duplicatesCount,
  duplicateCardIds,
  showOnlyMissing,
  showOnlyDuplicates,
  onToggleFilter,
  onToggleDuplicatesFilter,
  onSelectAll,
  onClearAll,
  isSharedView,
  onShareClick,
}: CollectionStatsProps) {
  const percentage = totalCount > 0 ? Math.round((ownedCount / totalCount) * 100) : 0;

  return (
    <div className="mb-8 font-['Rubik',sans-serif]">

      {/* ── PDA panel ─────────────────────────────────────────────── */}
      <div
        className="relative rounded-2xl overflow-hidden border border-orange-900/40"
        style={{ background: 'linear-gradient(135deg, #1a1612 0%, #120f0a 60%, #1c1208 100%)' }}
      >
        {/* Corner accents */}
        <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-orange-500/60 rounded-tl-2xl pointer-events-none" />
        <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-orange-500/60 rounded-tr-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-orange-500/30 rounded-bl-2xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-orange-500/30 rounded-br-2xl pointer-events-none" />

        {/* Scanlines overlay */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.04]"
          style={{
            backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, #fff 2px, #fff 3px)',
          }}
        />

        {/* Ambient glow */}
        <div className="absolute inset-0 pointer-events-none rounded-2xl"
          style={{ boxShadow: 'inset 0 0 60px rgba(251,115,10,0.06)' }} />

        <div className="relative p-5 sm:p-6">

          {/* ── Header: PDA title bar ──────────────────────────────── */}
          <div className="flex items-center justify-between mb-5 pb-3 border-b border-orange-900/40">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse shadow-[0_0_6px_#f97316]" />
              <span className="text-orange-500/80 text-[10px] tracking-[0.25em] uppercase font-bold">
                ПДА · Колекція артбуку
              </span>
            </div>
            <div className="text-orange-900/60 text-[10px] tracking-widest uppercase">
              S.T.A.L.K.E.R. 2
            </div>
          </div>

          {/* ── Progress section ───────────────────────────────────── */}
          <div className="mb-5">
            <div className="flex items-baseline justify-between mb-2">
              <span className="text-white/40 text-[11px] uppercase tracking-widest">Прогрес збору</span>
              <div className="flex items-baseline gap-2">
                <StatusLabel percentage={percentage} />
                <motion.span
                  key={percentage}
                  initial={{ scale: 1.4, color: '#f97316' }}
                  animate={{ scale: 1, color: '#ffffff' }}
                  transition={{ duration: 0.4 }}
                  className="text-white font-bold text-lg tabular-nums"
                  style={{ textShadow: '0 0 12px rgba(249,115,22,0.5)' }}
                >
                  {percentage}%
                </motion.span>
              </div>
            </div>

            <SegmentedBar value={ownedCount} total={totalCount} />
          </div>

          {/* ── Stat counters ──────────────────────────────────────── */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mb-5">
            {/* Total */}
            <div className="rounded-xl p-3 border border-white/8 text-center"
              style={{ background: 'rgba(255,255,255,0.04)' }}>
              <div className="flex items-center justify-center gap-1 text-white/30 text-[10px] uppercase tracking-widest mb-1.5">
                <Shield className="w-3 h-3" />
                <span>Всього</span>
              </div>
              <div className="text-white font-bold text-2xl tabular-nums"
                style={{ textShadow: '0 0 8px rgba(255,255,255,0.2)' }}>
                {totalCount}
              </div>
            </div>

            {/* Owned */}
            <div className="rounded-xl p-3 border text-center"
              style={{ background: 'rgba(34,197,94,0.08)', borderColor: 'rgba(34,197,94,0.2)' }}>
              <div className="flex items-center justify-center gap-1 text-green-500/70 text-[10px] uppercase tracking-widest mb-1.5">
                <CheckSquare className="w-3 h-3" />
                <span>Зібрано</span>
              </div>
              <motion.div
                key={ownedCount}
                initial={{ scale: 1.35, color: '#4ade80' }}
                animate={{ scale: 1, color: '#ffffff' }}
                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                className="font-bold text-2xl tabular-nums"
                style={{ textShadow: '0 0 10px rgba(74,222,128,0.3)' }}
              >
                {ownedCount}
              </motion.div>
            </div>

            {/* Missing */}
            <div className="rounded-xl p-3 border text-center"
              style={{ background: 'rgba(239,68,68,0.08)', borderColor: 'rgba(239,68,68,0.2)' }}>
              <div className="flex items-center justify-center gap-1 text-red-500/70 text-[10px] uppercase tracking-widest mb-1.5">
                <Skull className="w-3 h-3" />
                <span>Відсутніх</span>
              </div>
              <motion.div
                key={missingCount}
                initial={{ scale: 1.35, color: '#f87171' }}
                animate={{ scale: 1, color: '#ffffff' }}
                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                className="font-bold text-2xl tabular-nums"
                style={{ textShadow: '0 0 10px rgba(248,113,113,0.3)' }}
              >
                {missingCount}
              </motion.div>
            </div>

            {/* Duplicates */}
            <div className="rounded-xl p-3 border text-center"
              style={{ background: 'rgba(249,115,22,0.08)', borderColor: 'rgba(249,115,22,0.2)' }}>
              <div className="flex items-center justify-center gap-1 text-orange-500/70 text-[10px] uppercase tracking-widest mb-1.5">
                <Copy className="w-3 h-3" />
                <span>Повторки</span>
              </div>
              <motion.div
                key={duplicatesCount}
                initial={{ scale: 1.35, color: '#fb923c' }}
                animate={{ scale: 1, color: '#ffffff' }}
                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                className="font-bold text-2xl tabular-nums"
                style={{ textShadow: '0 0 10px rgba(249,115,22,0.3)' }}
              >
                {duplicatesCount}
              </motion.div>
            </div>
          </div>

          {/* ── Duplicates for trade ───────────────────────────────── */}
          <AnimatePresence>
            {duplicateCardIds.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="mb-4 rounded-xl border border-orange-900/40 px-4 py-3"
                  style={{ background: 'rgba(249,115,22,0.07)' }}>
                  <div className="flex items-center gap-2 text-orange-400/80 text-[10px] uppercase tracking-widest font-bold mb-2">
                    <Radiation className="w-3.5 h-3.5" />
                    <span>Картки для обміну:</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {duplicateCardIds.map((id, idx) => (
                      <span
                        key={`${id}-${idx}`}
                        className="border border-orange-700/50 text-orange-300 text-[11px] font-bold px-2 py-0.5 rounded"
                        style={{ background: 'rgba(249,115,22,0.12)', fontFamily: 'monospace' }}
                      >
                        #{String(id).padStart(2, '0')}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Separator ─────────────────────────────────────────── */}
          <div className="border-t border-orange-900/30 mb-4" />

          {/* ── Action buttons ─────────────────────────────────────── */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={onToggleFilter}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold uppercase tracking-wide transition-all border ${showOnlyMissing
                  ? 'bg-red-900/60 border-red-700/60 text-red-300 shadow-[0_0_12px_rgba(239,68,68,0.2)]'
                  : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10 hover:text-white/90 hover:border-white/20'
                }`}
            >
              {showOnlyMissing ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              <span className="text-xs">{showOnlyMissing ? 'Всі картки' : 'Відсутні'}</span>
            </button>

            <button
              onClick={onToggleDuplicatesFilter}
              disabled={duplicatesCount === 0}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold uppercase tracking-wide transition-all border disabled:opacity-30 disabled:cursor-not-allowed ${showOnlyDuplicates
                  ? 'bg-orange-900/60 border-orange-700/60 text-orange-300 shadow-[0_0_12px_rgba(249,115,22,0.2)]'
                  : 'bg-white/5 border-white/10 text-white/60 hover:bg-orange-900/30 hover:text-orange-300 hover:border-orange-800/40'
                }`}
            >
              <Copy className="w-3.5 h-3.5" />
              <span className="text-xs">{showOnlyDuplicates ? 'Всі картки' : 'Повторки'}</span>
              {duplicatesCount > 0 && (
                <span className="text-[10px] font-bold bg-orange-700/40 px-1.5 py-0.5 rounded">
                  {duplicatesCount}
                </span>
              )}
            </button>

            {!isSharedView && (
              <>
                <button
                  onClick={onShareClick}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wide bg-orange-500/10 border border-orange-500/30 text-orange-400 hover:bg-orange-500 hover:text-[#100a02] transition-all shadow-[0_0_15px_rgba(249,115,22,0.1)] hover:shadow-[0_0_20px_rgba(249,115,22,0.4)] ml-auto"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Поділитися</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
