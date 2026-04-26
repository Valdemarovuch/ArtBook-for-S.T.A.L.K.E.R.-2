import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Minus, Check, X, Copy } from 'lucide-react';

interface CardContextMenuProps {
  cardId: number | null;
  cardImage: string | null;
  isOwned: boolean;
  duplicates: number;
  position: { x: number; y: number };
  onClose: () => void;
  onToggleOwned: (id: number) => void;
  onAddDuplicate: (id: number) => void;
  onRemoveDuplicate: (id: number) => void;
}

export function CardContextMenu({
  cardId,
  cardImage,
  isOwned,
  duplicates,
  position,
  onClose,
  onToggleOwned,
  onAddDuplicate,
  onRemoveDuplicate,
}: CardContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  // Close on outside click or Escape
  useEffect(() => {
    if (cardId === null) return;
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener('keydown', handleKey);
    document.addEventListener('mousedown', handleClick);
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.removeEventListener('mousedown', handleClick);
    };
  }, [cardId, onClose]);

  // Adjust position so menu doesn't overflow the viewport
  const adjustedX = Math.min(position.x, window.innerWidth - 260);
  const adjustedY = Math.min(position.y, window.innerHeight - 320);

  return (
    <AnimatePresence>
      {cardId !== null && cardImage !== null && (
        <>
          {/* Invisible backdrop */}
          <div className="fixed inset-0 z-[998]" onContextMenu={e => { e.preventDefault(); onClose(); }} />

          <motion.div
            ref={menuRef}
            key="ctx-menu"
            initial={{ opacity: 0, scale: 0.88, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.88, y: -8 }}
            transition={{ type: 'spring', stiffness: 400, damping: 26 }}
            style={{ left: adjustedX, top: adjustedY }}
            className="fixed z-[999] w-56 rounded-2xl overflow-hidden shadow-2xl border border-white/10"
            onContextMenu={e => e.preventDefault()}
          >
            {/* Glassmorphism background */}
            <div className="absolute inset-0 bg-[#1c1a19]/90 backdrop-blur-xl" />

            {/* Card preview header */}
            <div className="relative flex items-center gap-3 px-4 pt-4 pb-3 border-b border-white/10">
              <div className="relative shrink-0 w-12 h-16 rounded-lg overflow-hidden shadow-lg">
                <img
                  src={cardImage}
                  alt={`Картка ${cardId}`}
                  className={`w-full h-full object-cover transition-all duration-300 ${
                    isOwned ? 'grayscale-0 brightness-100' : 'grayscale brightness-50'
                  }`}
                />
                {isOwned && (
                  <div className="absolute inset-0 ring-2 ring-green-500/60 rounded-lg" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-white font-bold font-['Rubik',sans-serif] text-sm">
                  Картка #{cardId}
                </p>
                <div className={`flex items-center gap-1 mt-0.5 text-xs font-['Rubik',sans-serif] ${
                  isOwned ? 'text-green-400' : 'text-red-400'
                }`}>
                  <div className={`w-1.5 h-1.5 rounded-full ${isOwned ? 'bg-green-400' : 'bg-red-400'}`} />
                  {isOwned ? 'У колекції' : 'Відсутня'}
                </div>
                {duplicates > 0 && (
                  <div className="flex items-center gap-1 mt-1 text-orange-400 text-xs font-['Rubik',sans-serif]">
                    <Copy className="w-3 h-3" />
                    <span>{duplicates} повторк{duplicates === 1 ? 'а' : duplicates < 5 ? 'и' : 'ок'}</span>
                  </div>
                )}
              </div>

              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-3 right-3 w-6 h-6 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
              >
                <X className="w-3.5 h-3.5 text-white/60" />
              </button>
            </div>

            {/* Actions */}
            <div className="relative px-2 py-2 flex flex-col gap-1">
              {/* Toggle owned */}
              <button
                onClick={() => { onToggleOwned(cardId); onClose(); }}
                className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-['Rubik',sans-serif] font-medium transition-all text-left ${
                  isOwned
                    ? 'text-red-300 hover:bg-red-500/20 hover:text-red-200'
                    : 'text-green-300 hover:bg-green-500/20 hover:text-green-200'
                }`}
              >
                {isOwned ? (
                  <>
                    <div className="w-7 h-7 rounded-lg bg-red-500/20 flex items-center justify-center shrink-0">
                      <Minus className="w-3.5 h-3.5" />
                    </div>
                    <span>Прибрати з колекції</span>
                  </>
                ) : (
                  <>
                    <div className="w-7 h-7 rounded-lg bg-green-500/20 flex items-center justify-center shrink-0">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <span>Додати до колекції</span>
                  </>
                )}
              </button>

              {/* Separator + duplicate actions (only for owned cards) */}
              {isOwned && (
                <>
                  <div className="h-px bg-white/10 mx-2 my-1" />

                  <button
                    onClick={() => { onAddDuplicate(cardId); onClose(); }}
                    className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-['Rubik',sans-serif] font-medium text-orange-300 hover:bg-orange-500/20 hover:text-orange-200 transition-all text-left"
                  >
                    <div className="w-7 h-7 rounded-lg bg-orange-500/20 flex items-center justify-center shrink-0">
                      <Plus className="w-3.5 h-3.5" />
                    </div>
                    <span>Додати повторку</span>
                  </button>

                  {duplicates > 0 && (
                    <button
                      onClick={() => { onRemoveDuplicate(cardId); onClose(); }}
                      className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-['Rubik',sans-serif] font-medium text-white/50 hover:bg-white/10 hover:text-white/80 transition-all text-left"
                    >
                      <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                        <Minus className="w-3.5 h-3.5" />
                      </div>
                      <span>Прибрати повторку</span>
                    </button>
                  )}
                </>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
