import { motion, AnimatePresence } from 'motion/react';
import { Check, Plus, Copy } from 'lucide-react';

interface CardItemProps {
  id: number;
  image: string;
  isOwned: boolean;
  duplicates: number;
  onToggle: (id: number) => void;
  onContextMenu: (id: number, image: string, x: number, y: number) => void;
  isSharedView?: boolean;
  isForTrade?: boolean;
}

export function CardItem({ id, image, isOwned, duplicates, onToggle, onContextMenu, isSharedView, isForTrade }: CardItemProps) {
  const handleContextMenu = (e: React.MouseEvent) => {
    if (isSharedView) return;
    e.preventDefault();
    onContextMenu(id, image, e.clientX, e.clientY);
  };

  return (
    <motion.button
      layout
      onClick={() => !isSharedView && onToggle(id)}
      onContextMenu={handleContextMenu}
      whileHover={isSharedView ? {} : { scale: 1.04, y: -4 }}
      whileTap={isSharedView ? {} : { scale: 0.96 }}
      transition={{ type: 'spring', stiffness: 320, damping: 24 }}
      className={`relative w-full aspect-[256/353] overflow-hidden rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 select-none ${
        isSharedView ? 'cursor-default' : 'cursor-pointer'
      }`}
      aria-label={`Картка ${id} — ${isOwned ? 'є в колекції' : 'відсутня'}`}
      aria-pressed={isOwned}
    >
      {/* Card image */}
      <img
        alt={`Картка ${id}`}
        src={image}
        draggable={false}
        className={`w-full h-full object-cover pointer-events-none transition-all duration-500 ${
          isOwned ? 'grayscale-0 brightness-100' : 'grayscale brightness-50'
        }`}
      />

      {/* Hover hint for missing cards (only if not shared view) */}
      {!isOwned && !isSharedView && (
        <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-200 bg-black/40 pointer-events-none">
          <Plus className="w-12 h-12 text-white/80 drop-shadow-lg" />
        </div>
      )}

      {/* Card number badge */}
      <div className="absolute bottom-2 left-2 bg-black/70 backdrop-blur-sm text-white text-xs px-2 py-0.5 rounded-md font-['Rubik',sans-serif] font-medium pointer-events-none select-none">
        #{id}
      </div>

      {/* Duplicates / For Trade badge */}
      <AnimatePresence>
        {((duplicates > 0 && !isSharedView) || (isForTrade && isSharedView)) && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 18 }}
            className="absolute top-2 left-2 bg-orange-500 rounded-full min-w-[22px] h-[22px] flex items-center justify-center shadow-lg pointer-events-none px-1.5 gap-1"
          >
            <Copy className="w-3 h-3 text-white" />
            {!isSharedView && (
              <span className="text-white text-[11px] font-bold font-['Rubik',sans-serif]">{duplicates}</span>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Owned checkmark badge */}
      <AnimatePresence>
        {isOwned && (
          <motion.div
            initial={{ scale: 0, opacity: 0, rotate: -20 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            exit={{ scale: 0, opacity: 0, rotate: 20 }}
            transition={{ type: 'spring', stiffness: 400, damping: 18 }}
            className="absolute top-2 right-2 bg-green-500 rounded-full p-1.5 shadow-lg pointer-events-none"
          >
            <Check className="w-4 h-4 text-white" strokeWidth={3} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Green ring glow for owned */}
      <AnimatePresence>
        {isOwned && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 rounded-xl ring-2 ring-green-500/60 pointer-events-none"
          />
        )}
      </AnimatePresence>

      {/* Orange ring for duplicates */}
      <AnimatePresence>
        {duplicates > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 rounded-xl ring-2 ring-orange-500/50 pointer-events-none"
          />
        )}
      </AnimatePresence>
    </motion.button>
  );
}
