import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Copy, Check, Share2, ExternalLink } from 'lucide-react';

interface ShareModalProps {
  isOpen: boolean;
  ownedCards: Set<number>;
  duplicates: Map<number, number>;
  onClose: () => void;
}

export function ShareModal({ isOpen, ownedCards, duplicates, onClose }: ShareModalProps) {
  const [name, setName] = useState('');
  const [copied, setCopied] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const tradeIds = [...duplicates.keys()];
  const ownedIds = [...ownedCards];

  const shareUrl = (() => {
    const data: { v: number; u?: string; o: number[]; t: number[] } = {
      v: 1,
      o: ownedIds,
      t: tradeIds,
    };
    if (name.trim()) data.u = name.trim();
    const encoded = btoa(unescape(encodeURIComponent(JSON.stringify(data))));
    return `${window.location.origin}${window.location.pathname}?s=${encoded}`;
  })();

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const fn = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', fn);
    return () => document.removeEventListener('keydown', fn);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[900] bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', stiffness: 340, damping: 28 }}
            className="fixed inset-0 z-[901] flex items-center justify-center p-4 pointer-events-none"
          >
            <div
              className="w-full max-w-md rounded-2xl overflow-hidden border border-white/10 shadow-2xl pointer-events-auto"
              style={{ background: 'linear-gradient(160deg, #1c1712 0%, #14110d 100%)' }}
            >
              {/* Corner accents */}
              <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-orange-500/50 rounded-tl-2xl" />
              <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-orange-500/50 rounded-tr-2xl" />

              {/* Header */}
              <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-white/8">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-orange-500/15 border border-orange-500/25 flex items-center justify-center">
                    <Share2 className="w-4 h-4 text-orange-400" />
                  </div>
                  <div>
                    <h2 className="text-white font-bold font-['Rubik',sans-serif] text-base">Поділитися колекцією</h2>
                    <p className="text-white/40 text-xs font-['Rubik',sans-serif]">Надішли посилання другу</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="w-7 h-7 rounded-full bg-white/8 hover:bg-white/15 flex items-center justify-center transition-colors"
                >
                  <X className="w-4 h-4 text-white/60" />
                </button>
              </div>

              <div className="px-6 py-5 space-y-5">
                {/* Stats preview */}
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="rounded-xl py-2.5 border border-green-500/20 bg-green-500/8">
                    <div className="text-green-400 text-[10px] uppercase tracking-widest mb-1 font-['Rubik',sans-serif]">Маю</div>
                    <div className="text-white font-bold text-xl font-['Rubik',sans-serif]">{ownedIds.length}</div>
                  </div>
                  <div className="rounded-xl py-2.5 border border-red-500/20 bg-red-500/8">
                    <div className="text-red-400 text-[10px] uppercase tracking-widest mb-1 font-['Rubik',sans-serif]">Шукаю</div>
                    <div className="text-white font-bold text-xl font-['Rubik',sans-serif]">{48 - ownedIds.length}</div>
                  </div>
                  <div className="rounded-xl py-2.5 border border-orange-500/20 bg-orange-500/8">
                    <div className="text-orange-400 text-[10px] uppercase tracking-widest mb-1 font-['Rubik',sans-serif]">Обмін</div>
                    <div className="text-white font-bold text-xl font-['Rubik',sans-serif]">{tradeIds.length}</div>
                  </div>
                </div>

                {/* Name input */}
                <div>
                  <label className="text-white/50 text-xs uppercase tracking-widest font-['Rubik',sans-serif] block mb-2">
                    Твоє ім'я (необов'язково)
                  </label>
                  <input
                    ref={inputRef}
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Наприклад: Петро"
                    maxLength={30}
                    className="w-full rounded-xl px-4 py-2.5 text-white text-sm font-['Rubik',sans-serif] outline-none border border-white/10 focus:border-orange-500/50 transition-colors"
                    style={{ background: 'rgba(255,255,255,0.05)' }}
                  />
                </div>

                {/* Link field */}
                <div>
                  <label className="text-white/50 text-xs uppercase tracking-widest font-['Rubik',sans-serif] block mb-2">
                    Посилання
                  </label>
                  <div className="flex gap-2">
                    <div
                      className="flex-1 rounded-xl px-3 py-2.5 text-white/50 text-xs font-mono border border-white/8 truncate select-all cursor-text"
                      style={{ background: 'rgba(255,255,255,0.03)' }}
                      title={shareUrl}
                    >
                      {shareUrl.length > 55 ? shareUrl.slice(0, 52) + '…' : shareUrl}
                    </div>
                    <button
                      onClick={handleCopy}
                      className={`shrink-0 flex items-center gap-2 px-4 rounded-xl font-bold text-xs uppercase tracking-wide font-['Rubik',sans-serif] transition-all ${
                        copied
                          ? 'bg-green-500 text-white shadow-[0_0_16px_rgba(34,197,94,0.4)]'
                          : 'bg-orange-500 hover:bg-orange-400 text-[#100a02]'
                      }`}
                    >
                      {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      {copied ? 'Скопійовано' : 'Копіювати'}
                    </button>
                  </div>
                </div>

                {/* Hint */}
                <p className="text-white/30 text-xs font-['Rubik',sans-serif] leading-relaxed">
                  Друг відкриє посилання і побачить твої картки, а також які ти готовий обміняти 🔄
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
