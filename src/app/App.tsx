import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Toaster, toast } from 'sonner';
import confetti from 'canvas-confetti';
import { ChevronUp, Github, ExternalLink } from 'lucide-react';

import { CardItem } from './components/CardItem';
import { CollectionStats } from './components/CollectionStats';
import { CardContextMenu } from './components/CardContextMenu';
import { ShareModal } from './components/ShareModal';
import { SharedViewBanner, decodeShareParam, type SharedData } from './components/SharedViewBanner';

// ─── Figma-imported images ────────────────────────────────────────────────────
import imgHeaderBg from '../imports/Desktop1/5572eb132e8d782a740834070c36144da2398a3c.png';
import imgHeaderDeco from '../imports/Desktop1/da0ef34ce2738a2b57081baed1f78f59f29786d6.png';
import imgHeaderChar from '../imports/Desktop1/75afd46b5fc75eda9e4b7955009bf40d443c615f.png';
import imgLogoStalker from '../imports/Desktop1/161677c3414aa378229be6a230837df206a26cdf.png';
import imgSectionBg from '../imports/Desktop1/2639d0f1b07c0976c28dd5a6b53b2d104666586a.png';

// ─── Card images (48 total) ───────────────────────────────────────────────────
import imgCard1 from '../imports/Desktop1/b86be052e363837ecc12daa49a1e6ef4b984b064.png';
import imgCard2 from '../imports/Desktop1/3c87cf715a435c4939c1f4cbbcc384cdb5f19167.png';
import imgCard3 from '../imports/Desktop1/dec82f9c39cba54422bf4ac971fb50e5c4946fb6.png';
import imgCard4 from '../imports/Desktop1/0b169026fded6b79c980f106baa4509e679c15d3.png';
import imgCard5 from '../imports/Desktop1/9d2fd9a2cae5601e2bec788dfde44bab4c25ae78.png';
import imgCard6 from '../imports/Desktop1/07484d131cb87d71ac7328b8585e7fe4d5e954b0.png';
import imgCard7 from '../imports/Desktop1/b470485e7083908234485d41c6a675b2bc39ab4c.png';
import imgCard8 from '../imports/Desktop1/b6685f18bd0c5db54b81f3605bdb3e1292347f56.png';
import imgCard9 from '../imports/Desktop1/73695fe440107f0eec0c8978d0ac7626bbeb4062.png';
import imgCard10 from '../imports/Desktop1/9fc16d0d99b28b1af4683ae178dd123287d78ac2.png';
import imgCard11 from '../imports/Desktop1/e4407f4374df44c637df16b0c3d08c9e63ce4914.png';
import imgCard12 from '../imports/Desktop1/e98ae87f32acca4fb7a42ca5797df3a8f62c426d.png';
import imgCard13 from '../imports/Desktop1/f1f7a06d449da7b78858e083c4930b241a465bd9.png';
import imgCard14 from '../imports/Desktop1/0ec9c96d194b2a39af80dbc04af440ccc4cbad22.png';
import imgCard15 from '../imports/Desktop1/4b558300c7c4891da76d447d0680d88086fa9f4e.png';
import imgCard16 from '../imports/Desktop1/8539d9acf22422d7aa418af5410a57960f7b88ab.png';
import imgCard17 from '../imports/Desktop1/65abdc6cfca3862535b14477607bab35d0d6f7e6.png';
import imgCard18 from '../imports/Desktop1/038e8089255a1d86c580fcf34418b45481a862ee.png';
import imgCard19 from '../imports/Desktop1/a0a176e90bc9f26c092864c8baf24f56bdb581b7.png';
import imgCard20 from '../imports/Desktop1/725f6555d5aab67281215117c7a25147a7480657.png';
import imgCard21 from '../imports/Desktop1/b4cf803b28dcdb09cd10737a25e9e845824f54ae.png';
import imgCard22 from '../imports/Desktop1/0e8aacecf5c430057e764367e75abd79c759f75a.png';
import imgCard23 from '../imports/Desktop1/95a5f41f59868278db93eca20c395caff67d0485.png';
import imgCard24 from '../imports/Desktop1/896e1855669c9c015092ef0f167145acdac8296a.png';
import imgCard25 from '../imports/Desktop1/9c8c0720724094224ec396e057104edb6595f306.png';
import imgCard26 from '../imports/Desktop1/511b3278df252c93fb278616e6f6f6b1c45cc8a8.png';
import imgCard27 from '../imports/Desktop1/45e1c4cbdccdf3ba14db2419863be6352e0d6e0e.png';
import imgCard28 from '../imports/Desktop1/9162072f2fe2bddbfbab5c25f91974e998a7eb19.png';
import imgCard29 from '../imports/Desktop1/d9bb699f2a50b1d21541d4b4c84082986e88d54d.png';
import imgCard30 from '../imports/Desktop1/c03f5d5bfaf678b37c2afeb23eb6936f1f0ea604.png';
import imgCard31 from '../imports/Desktop1/c8f0ece24b570600986c6f5f719313860e5d1a0c.png';
import imgCard32 from '../imports/Desktop1/56e39b9d4d3000bfb6b791ae92f9386826000b36.png';
import imgCard33 from '../imports/Desktop1/a97c04bfa3727d6f731767630a38e41bc6665957.png';
import imgCard34 from '../imports/Desktop1/56bacd1c750fa948ca6513dc454a95f50de5c27a.png';
import imgCard35 from '../imports/Desktop1/df181c98d6e360fca962e3439e4d7fa551098a30.png';
import imgCard36 from '../imports/Desktop1/d03a9819fcbab01e7583ac206cbb1bed4fb77e2c.png';
import imgCard37 from '../imports/Desktop1/67c41028230f33075fa573dba1df1894d2dcb23c.png';
import imgCard38 from '../imports/Desktop1/13d7aa0361905704a225beacdaa3667544fca7aa.png';
import imgCard39 from '../imports/Desktop1/6a1c031c8f0c9533c463e41b1b226467725f798a.png';
import imgCard40 from '../imports/Desktop1/dbe9ee101c2bd8f87e3b18606e46044e3647f940.png';
import imgCard41 from '../imports/Desktop1/4d82fa74c89904a395ce828559fa725b10efe81d.png';
import imgCard42 from '../imports/Desktop1/cd44c0dd8295adb939d183edd15b37d6cca4aa31.png';
import imgCard43 from '../imports/Desktop1/28d95ac43f02ec6717911c4900028bea03f471d6.png';
import imgCard44 from '../imports/Desktop1/df9092ceff198bb60c750d6eff22696850ba2e32.png';
import imgCard45 from '../imports/Desktop1/69d8d2f12af7e9f1e65b03677949e09acbd003c2.png';
import imgCard46 from '../imports/Desktop1/4a6b37bd9cbc9fb36cc12fc4c97fc83f7b8dce75.png';
import imgCard47 from '../imports/Desktop1/a9af3047165a417c3f4480425a1ea96b41aa59eb.png';
import imgCard48 from '../imports/Desktop1/5da9129d864d5a5e49862184580f490f7c37e470.png';

// ─── Constants ────────────────────────────────────────────────────────────────
const STORAGE_KEY = 'stalker2-artbook-owned-cards';
const DUPLICATES_KEY = 'stalker2-artbook-duplicates';

const CARDS = [
  { id: 1, image: imgCard1 },
  { id: 2, image: imgCard2 },
  { id: 3, image: imgCard3 },
  { id: 4, image: imgCard4 },
  { id: 5, image: imgCard5 },
  { id: 6, image: imgCard6 },
  { id: 7, image: imgCard7 },
  { id: 8, image: imgCard8 },
  { id: 9, image: imgCard9 },
  { id: 10, image: imgCard10 },
  { id: 11, image: imgCard11 },
  { id: 12, image: imgCard12 },
  { id: 13, image: imgCard13 },
  { id: 14, image: imgCard14 },
  { id: 15, image: imgCard15 },
  { id: 16, image: imgCard16 },
  { id: 17, image: imgCard17 },
  { id: 18, image: imgCard18 },
  { id: 19, image: imgCard19 },
  { id: 20, image: imgCard20 },
  { id: 21, image: imgCard21 },
  { id: 22, image: imgCard22 },
  { id: 23, image: imgCard23 },
  { id: 24, image: imgCard24 },
  { id: 25, image: imgCard25 },
  { id: 26, image: imgCard26 },
  { id: 27, image: imgCard27 },
  { id: 28, image: imgCard28 },
  { id: 29, image: imgCard29 },
  { id: 30, image: imgCard30 },
  { id: 31, image: imgCard31 },
  { id: 32, image: imgCard32 },
  { id: 33, image: imgCard33 },
  { id: 34, image: imgCard34 },
  { id: 35, image: imgCard35 },
  { id: 36, image: imgCard36 },
  { id: 37, image: imgCard37 },
  { id: 38, image: imgCard38 },
  { id: 39, image: imgCard39 },
  { id: 40, image: imgCard40 },
  { id: 41, image: imgCard41 },
  { id: 42, image: imgCard42 },
  { id: 43, image: imgCard43 },
  { id: 44, image: imgCard44 },
  { id: 45, image: imgCard45 },
  { id: 46, image: imgCard46 },
  { id: 47, image: imgCard47 },
  { id: 48, image: imgCard48 },
] as const;

const TOTAL = CARDS.length;

// ─── Helper: hydrate Set from localStorage ────────────────────────────────────
function loadOwned(): Set<number> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return new Set<number>(parsed);
    }
  } catch { /* ignore */ }
  return new Set<number>();
}

// ─── Helper: hydrate duplicates map from localStorage ─────────────────────────
function loadDuplicates(): Map<number, number> {
  try {
    const raw = localStorage.getItem(DUPLICATES_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return new Map<number, number>(parsed);
    }
  } catch { /* ignore */ }
  return new Map<number, number>();
}

// ─── Confetti burst ───────────────────────────────────────────────────────────
function fireConfetti() {
  confetti({ particleCount: 80, angle: 60, spread: 70, origin: { x: 0, y: 0.7 } });
  confetti({ particleCount: 80, angle: 120, spread: 70, origin: { x: 1, y: 0.7 } });
  confetti({ particleCount: 60, spread: 90, origin: { y: 0.6 } });
}

// ─── Header ───────────────────────────────────────────────────────────────────
function Header() {
  return (
    <>
      {/* ── Desktop hero (≥ md) ── */}
      <div className="hidden md:block relative w-full overflow-hidden bg-[#1a1008]"
        style={{ height: 'clamp(420px, 52vw, 680px)' }}>

        {/* ── BG art — full bleed ── */}
        <img alt="" src={imgHeaderBg}
          className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none" />

        {/* ── Deco overlay (radiation/clouds) — right half ── */}
        <img alt="" src={imgHeaderDeco}
          className="absolute top-0 right-0 pointer-events-none object-cover object-left"
          style={{ height: '100%', width: '55%', opacity: 0.88 }} />

        {/* ── Character — centred-right, pinned to bottom ── */}
        <img alt="" src={imgHeaderChar}
          className="absolute bottom-0 pointer-events-none object-contain object-bottom"
          style={{ right: '16%', height: '92%', width: 'clamp(160px, 20vw, 340px)' }} />

        {/* ── Left gradient scrim ── */}
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'linear-gradient(100deg, rgba(12,7,2,0.86) 0%, rgba(12,7,2,0.62) 30%, rgba(12,7,2,0.18) 55%, transparent 70%)'
        }} />
        {/* ── Bottom fade ── */}
        <div className="absolute bottom-0 left-0 right-0 h-28 pointer-events-none" style={{
          background: 'linear-gradient(to bottom, transparent, rgba(20,16,8,0.65))'
        }} />

        {/* ── Text content ── */}
        <div className="relative h-full flex flex-col justify-center z-10"
          style={{ paddingLeft: 'clamp(28px, 6vw, 110px)', maxWidth: '50%' }}>

          {/* Logo row: STALKER 2 × АТБ */}
          <div className="flex items-center gap-3 mb-6">
            <img alt="STALKER 2" src={imgLogoStalker} className="h-18 object-contain" />
          </div>

          {/* Main title */}
          <h1
            className="font-['Rubik',sans-serif] font-black text-white uppercase leading-none mb-4 tracking-tight"
            style={{ fontSize: 'clamp(36px, 6.5vw, 92px)', textShadow: '0 2px 28px rgba(0,0,0,0.6)' }}
          >
            Колекціонуй. <span className="text-orange-400">Відмічай</span>. Мрій
          </h1>

          {/* Sub-title */}
          <p
            className="font-['Rubik',sans-serif] font-bold text-white/80 uppercase mb-7 text-left"
            style={{ fontSize: 'clamp(10px, 1.1vw, 15px)', letterSpacing: '0.2em' }}
          >
            Відмічай зібрані картки, знаходь повторки та ділися прогресом з друзями
          </p>

          {/* CTA button */}
          <button
            id="collection-cta"
            onClick={() => document.getElementById('collection')?.scrollIntoView({ behavior: 'smooth' })}
            className="self-start font-['Rubik',sans-serif] font-bold uppercase text-[#100a02] active:scale-95 transition-transform"
            style={{
              background: 'linear-gradient(135deg, #f5a623 0%, #e8870a 100%)',
              padding: 'clamp(10px,1.1vw,14px) clamp(22px,3vw,44px)',
              fontSize: 'clamp(11px, 1vw, 14px)',
              letterSpacing: '0.15em',
              borderRadius: '3px',
              boxShadow: '0 4px 22px rgba(245,166,35,0.4)',
            }}
            onMouseEnter={e => (e.currentTarget.style.filter = 'brightness(1.12)')}
            onMouseLeave={e => (e.currentTarget.style.filter = '')}
          >
            До колекції
          </button>
        </div>
      </div>

      {/* ── Mobile hero (< md) ── */}
      <div className="md:hidden relative w-full min-h-[260px] bg-[#242221] overflow-hidden flex flex-col items-center justify-center px-6 py-12 text-center">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <img alt="" src={imgHeaderBg} className="absolute inset-0 w-full h-full object-cover opacity-60" />
        </div>
        <div className="relative z-10 flex flex-col items-center">
          <img alt="STALKER 2" src={imgLogoStalker} className="h-7 mb-5 object-contain" />
          <h1 className="font-['Rubik',sans-serif] text-white font-bold mb-1">
            Колекціонуй. <span className="text-orange-400">Відмічай</span>. Мрій
          </h1>
          <h2 className="font-['Rubik',sans-serif] text-white font-bold">S.T.A.L.K.E.R. 2</h2>
          <p className="font-['Rubik',sans-serif] text-white/55 mt-3 font-light max-w-xs">
            Відмічай зібрані картки, знаходь повторки та ділися прогресом з друзями
          </p>
        </div>
      </div>
    </>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="border-t border-white/10 mt-12 py-10 px-6 font-['Rubik',sans-serif] bg-[#100a02]/40 backdrop-blur-sm relative z-10">
      <div className="max-w-7xl mx-auto flex flex-col items-center justify-center gap-4 text-center">
        <p className="text-white/40 text-xs sm:text-sm max-w-3xl leading-relaxed">
          <span className="font-bold text-orange-500/70">Увага:</span> Цей сайт є фанатською ініціативою та не має офіційного відношення до компанії <span className="font-semibold text-white/50">GSC Game World</span>, серії ігор <span className="font-semibold text-white/50">S.T.A.L.K.E.R.</span> або мережі магазинів <span className="font-semibold text-white/50">АТБ</span>. Всі права на зображення та торгові марки належать їх відповідним власникам.
        </p>
        <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-6 text-white/25 text-[10px] uppercase tracking-widest mt-2">
          <div className="flex items-center gap-2">
            <span>Створено фанатами для фанатів</span>
            <span>•</span>
            <span>{new Date().getFullYear()}</span>
          </div>

          <div className="flex items-center gap-4 border-t sm:border-t-0 sm:border-l border-white/10 pt-3 sm:pt-0 sm:pl-6">
            <a
              href="https://www.stalker2.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-white/60 transition-colors"
              title="Офіційний сайт S.T.A.L.K.E.R. 2"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>S.T.A.L.K.E.R. 2</span>
            </a>
            <a
              href="https://s2-atb.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-white/60 transition-colors"
              title="Офіційний сайт акції"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Офіційна акція</span>
            </a>
            <a
              href="https://www.atbmarket.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-white/60 transition-colors"
              title="Офіційний сайт АТБ"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>АТБ</span>
            </a>
            <a
              href="https://github.com/Valdemarovuch/ArtBook-for-S.T.A.L.K.E.R.-2"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-white/60 transition-colors"
              title="Переглянути код на GitHub"
            >
              <Github className="w-3.5 h-3.5" />
              <span>Open Source</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ─── Empty state ──────────────────────────────────────────────────────────────
function EmptyState({ filterType }: { filterType: 'missing' | 'duplicates' | 'all' }) {
  let emoji = '📭';
  let title = 'Тут порожньо';
  let subtitle = 'Немає карток для відображення';

  if (filterType === 'missing') {
    emoji = '🎉';
    title = 'Вітаємо!';
    subtitle = 'У вас вже є всі картки з колекції!';
  } else if (filterType === 'duplicates') {
    emoji = '✨';
    title = 'Немає повторок';
    subtitle = 'У вас поки немає карток для обміну.';
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-24 font-['Rubik',sans-serif]"
    >
      <div className="text-6xl mb-5 select-none">{emoji}</div>
      <h2 className="text-white font-bold mb-2 text-xl">{title}</h2>
      <p className="text-white/60 text-sm max-w-sm mx-auto">{subtitle}</p>
    </motion.div>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [ownedCards, setOwnedCards] = useState<Set<number>>(loadOwned);
  const [duplicates, setDuplicates] = useState<Map<number, number>>(loadDuplicates);
  const [showOnlyMissing, setShowOnlyMissing] = useState(false);
  const [showOnlyDuplicates, setShowOnlyDuplicates] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  // ── Shared view mode (read-only from URL param) ─────────────────────────────
  const [sharedData, setSharedData] = useState<SharedData | null>(() => {
    const params = new URLSearchParams(window.location.search);
    const s = params.get('s');
    return s ? decodeShareParam(s) : null;
  });
  const isSharedView = sharedData !== null;

  // Context menu state
  const [ctxMenu, setCtxMenu] = useState<{
    cardId: number;
    cardImage: string;
    x: number;
    y: number;
  } | null>(null);

  const openCtxMenu = useCallback((id: number, image: string, x: number, y: number) => {
    setCtxMenu({ cardId: id, cardImage: image, x, y });
  }, []);

  const closeCtxMenu = useCallback(() => setCtxMenu(null), []);

  /**
   * Tracks the owned count from the *previous* render so we can detect
   * the moment the collection transitions from incomplete → complete,
   * without firing confetti on page load when already complete.
   */
  const prevOwnedSizeRef = useRef<number>(ownedCards.size);

  // ── Persist state to localStorage ──────────────────────────────────────────
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...ownedCards]));
  }, [ownedCards]);

  useEffect(() => {
    localStorage.setItem(DUPLICATES_KEY, JSON.stringify([...duplicates]));
  }, [duplicates]);

  // ── Show / hide scroll-to-top button ───────────────────────────────────────
  useEffect(() => {
    const onScroll = () => setShowScrollTop(window.scrollY > 500);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // ── Fire confetti only when count REACHES total (not on initial load) ───────
  useEffect(() => {
    if (ownedCards.size === TOTAL && prevOwnedSizeRef.current < TOTAL) {
      fireConfetti();
      toast.success('🎉 Вітаємо! Колекція повністю зібрана!', {
        duration: 5000,
        description: 'Ви зібрали всі 48 карток артбуку S.T.A.L.K.E.R. 2!',
      });
    }
    prevOwnedSizeRef.current = ownedCards.size;
  }, [ownedCards.size]);

  // ── Toggle single card ──────────────────────────────────────────────────────
  const toggleCard = useCallback((cardId: number) => {
    setOwnedCards(prev => {
      const next = new Set(prev);
      if (next.has(cardId)) {
        next.delete(cardId);
        toast(`Картку #${cardId} прибрано з колекції`, { icon: '📤', duration: 2000 });
      } else {
        next.add(cardId);
        toast.success(`Картку #${cardId} додано до колекції!`, { duration: 2000 });
      }
      return next;
    });
  }, []);

  // ── Duplicates handlers ─────────────────────────────────────────────────────
  const addDuplicate = useCallback((cardId: number) => {
    setDuplicates(prev => {
      const next = new Map(prev);
      next.set(cardId, (next.get(cardId) ?? 0) + 1);
      toast(`Повторку #${cardId} додано!`, { icon: '📋', duration: 2000 });
      return next;
    });
  }, []);

  const removeDuplicate = useCallback((cardId: number) => {
    setDuplicates(prev => {
      const next = new Map(prev);
      const cur = next.get(cardId) ?? 0;
      if (cur <= 1) {
        next.delete(cardId);
      } else {
        next.set(cardId, cur - 1);
      }
      toast(`Повторку #${cardId} прибрано`, { icon: '📤', duration: 2000 });
      return next;
    });
  }, []);

  // ── Select / clear all ──────────────────────────────────────────────────────
  const selectAll = useCallback(() => {
    setOwnedCards(new Set(CARDS.map(c => c.id)));
    toast.success('Всі 48 карток відмічено!', { duration: 3000 });
  }, []);

  const clearAll = useCallback(() => {
    setOwnedCards(new Set());
    setDuplicates(new Map());
    toast('Колекцію очищено', { icon: '🗑️', duration: 3000 });
  }, []);

  // ── Derived values ──────────────────────────────────────────────────────────
  // In shared-view mode use the decoded data; otherwise use local state
  const viewOwned = isSharedView ? new Set<number>(sharedData!.o) : ownedCards;
  const viewTrade = isSharedView ? new Set<number>(sharedData!.t) : new Set<number>(duplicates.keys());

  const ownedCount = isSharedView ? sharedData!.o.length : ownedCards.size;
  const missingCount = TOTAL - ownedCount;
  const duplicatesCount = isSharedView
    ? sharedData!.t.length
    : [...duplicates.values()].reduce((s, v) => s + v, 0);
  const duplicateCardIds = isSharedView
    ? sharedData!.t
    : [...duplicates.entries()].filter(([, v]) => v > 0).flatMap(([id, v]) => Array(v).fill(id));

  const displayedCards = showOnlyDuplicates
    ? CARDS.filter(c => viewTrade.has(c.id))
    : showOnlyMissing
      ? CARDS.filter(c => !viewOwned.has(c.id))
      : CARDS;

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(180deg, #181410 0%, #1c1710 40%, #14110d 100%)' }}>
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: '#2e2c2b',
            color: '#fff',
            border: '1px solid rgba(255,255,255,0.1)',
            fontFamily: 'Rubik, sans-serif',
          },
        }}
      />

      {/* Shared view banner */}
      {isSharedView && (
        <SharedViewBanner
          ownerName={sharedData!.u}
          ownedCount={ownedCount}
          tradeCount={sharedData!.t.length}
          missingCount={missingCount}
          onOpenOwn={() => {
            window.history.replaceState({}, '', window.location.pathname);
            setSharedData(null);
          }}
        />
      )}

      {/* Hero */}
      <Header />

      {/* Main content */}
      <div className="relative">
        {/* ── Layered atmospheric background ── */}

        {/* Base section image — more visible */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <img
            alt=""
            className="absolute h-[123.24%] left-0 max-w-none top-[-11.62%] w-full object-cover opacity-40 mix-blend-luminosity"
            src={imgSectionBg}
          />
        </div>

        {/* Warm amber radial glow — center */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse 80% 50% at 50% 20%, rgba(180,80,10,0.12) 0%, transparent 70%)',
          }}
        />

        {/* Vignette edges */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse 100% 100% at 50% 50%, transparent 40%, rgba(0,0,0,0.55) 100%)',
          }}
        />

        {/* Subtle noise grain */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            backgroundSize: '256px 256px',
          }}
        />

        <div id="collection" className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

          {/* Stats & controls */}
          <CollectionStats
            ownedCount={ownedCount}
            totalCount={TOTAL}
            missingCount={missingCount}
            duplicatesCount={duplicatesCount}
            duplicateCardIds={duplicateCardIds}
            showOnlyMissing={showOnlyMissing}
            showOnlyDuplicates={showOnlyDuplicates}
            onToggleFilter={() => { setShowOnlyMissing(v => !v); setShowOnlyDuplicates(false); }}
            onToggleDuplicatesFilter={() => { setShowOnlyDuplicates(v => !v); setShowOnlyMissing(false); }}
            onSelectAll={selectAll}
            onClearAll={clearAll}
            isSharedView={isSharedView}
            onShareClick={() => setShowShareModal(true)}
          />

          {/* Card grid with layout animations */}
          <AnimatePresence mode="popLayout">
            {displayedCards.length === 0 ? (
              <EmptyState
                key="empty"
                filterType={showOnlyMissing ? 'missing' : showOnlyDuplicates ? 'duplicates' : 'all'}
              />
            ) : (
              <motion.div
                key="grid"
                layout
                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-4 sm:gap-5"
              >
                <AnimatePresence mode="popLayout">
                  {displayedCards.map(card => (
                    <motion.div
                      key={card.id}
                      layout
                      initial={{ opacity: 0, scale: 0.88 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.88 }}
                      transition={{ duration: 0.22, ease: 'easeOut' }}
                    >
                      <CardItem
                        id={card.id}
                        image={card.image}
                        isOwned={viewOwned.has(card.id)}
                        duplicates={isSharedView ? 0 : (duplicates.get(card.id) ?? 0)}
                        onToggle={toggleCard}
                        onContextMenu={openCtxMenu}
                        isSharedView={isSharedView}
                        isForTrade={viewTrade.has(card.id)}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Context menu */}
      <CardContextMenu
        cardId={ctxMenu?.cardId ?? null}
        cardImage={ctxMenu?.cardImage ?? null}
        isOwned={ctxMenu ? ownedCards.has(ctxMenu.cardId) : false}
        duplicates={ctxMenu ? (duplicates.get(ctxMenu.cardId) ?? 0) : 0}
        position={{ x: ctxMenu?.x ?? 0, y: ctxMenu?.y ?? 0 }}
        onClose={closeCtxMenu}
        onToggleOwned={(id) => { toggleCard(id); }}
        onAddDuplicate={(id) => { addDuplicate(id); }}
        onRemoveDuplicate={(id) => { removeDuplicate(id); }}
      />

      {/* Footer */}
      <Footer />

      {/* Scroll-to-top FAB */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            key="scrollTop"
            initial={{ opacity: 0, scale: 0.7, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.7, y: 16 }}
            transition={{ type: 'spring', stiffness: 320, damping: 22 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-6 right-6 z-50 bg-orange-500 hover:bg-orange-600 active:scale-95 text-white p-3 rounded-full shadow-xl shadow-orange-500/30 transition-colors"
            aria-label="Прокрутити вгору"
          >
            <ChevronUp className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Share Modal */}
      <ShareModal
        isOpen={showShareModal}
        ownedCards={ownedCards}
        duplicates={duplicates}
        onClose={() => setShowShareModal(false)}
      />
    </div>
  );
}
