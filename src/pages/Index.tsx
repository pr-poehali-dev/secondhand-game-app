import { useState, useRef, useCallback, useEffect } from "react";
import Icon from "@/components/ui/icon";

// ─── ДАННЫЕ ────────────────────────────────────────────────────────────────

const PRODUCTS = [
  {
    id: 1,
    name: "Винтажная джинсовка",
    price: 850,
    oldPrice: 2400,
    category: "Верх",
    size: "M",
    condition: "Хорошее",
    available: true,
    img: "https://cdn.poehali.dev/projects/08e9571c-a235-4ed1-b234-ecd02600ec79/files/42798399-8b8f-46a2-b6f1-147cde85e231.jpg",
    desc: "Классическая джинсовая куртка 90-х. Небольшие потёртости на локтях — придают шарм. Состав: 100% хлопок.",
    rarity: "rare",
  },
  {
    id: 2,
    name: "Кеды Vintage",
    price: 650,
    oldPrice: 1800,
    category: "Обувь",
    size: "42",
    condition: "Отличное",
    available: true,
    img: "https://cdn.poehali.dev/projects/08e9571c-a235-4ed1-b234-ecd02600ec79/files/7137436d-4a60-4417-9b30-62da93b9cf77.jpg",
    desc: "Белые кеды в стиле ретро. Подошва без трещин, лого на месте. Идеально для casual-образа.",
    rarity: "uncommon",
  },
  {
    id: 3,
    name: "Рюкзак Y2K",
    price: 550,
    oldPrice: 1500,
    category: "Аксессуары",
    size: "One size",
    condition: "Хорошее",
    available: true,
    img: "https://cdn.poehali.dev/projects/08e9571c-a235-4ed1-b234-ecd02600ec79/files/de7241ba-d628-492b-af7a-479c28e70774.jpg",
    desc: "Рюкзак в стиле Y2K с металлической фурнитурой. Все молнии работают, подкладка чистая.",
    rarity: "common",
  },
  {
    id: 4,
    name: "Кожаная куртка",
    price: 0,
    oldPrice: 3200,
    category: "Верх",
    size: "L",
    condition: "Среднее",
    available: false,
    img: "https://cdn.poehali.dev/projects/08e9571c-a235-4ed1-b234-ecd02600ec79/files/42798399-8b8f-46a2-b6f1-147cde85e231.jpg",
    desc: "Натуральная кожаная куртка. Продана!",
    rarity: "epic",
  },
  {
    id: 5,
    name: "Толстовка 90-х",
    price: 420,
    oldPrice: 1200,
    category: "Верх",
    size: "S",
    condition: "Отличное",
    available: true,
    img: "https://cdn.poehali.dev/projects/08e9571c-a235-4ed1-b234-ecd02600ec79/files/42798399-8b8f-46a2-b6f1-147cde85e231.jpg",
    desc: "Оверсайз худи с винтажным принтом. Без дыр и катышков.",
    rarity: "common",
  },
  {
    id: 6,
    name: "Шапка вязаная",
    price: 0,
    oldPrice: 600,
    category: "Аксессуары",
    size: "One size",
    condition: "Отличное",
    available: false,
    img: "https://cdn.poehali.dev/projects/08e9571c-a235-4ed1-b234-ecd02600ec79/files/de7241ba-d628-492b-af7a-479c28e70774.jpg",
    desc: "Шерстяная шапка ручной вязки. Продана!",
    rarity: "uncommon",
  },
];

const RARITY_COLORS: Record<string, string> = {
  common: "#aaaaaa",
  uncommon: "#6ecf2a",
  rare: "#4A9EFF",
  epic: "#cc22ff",
};

const RARITY_NAMES: Record<string, string> = {
  common: "Обычный",
  uncommon: "Необычный",
  rare: "Редкий",
  epic: "Эпический",
};

const CATEGORIES = ["Все", "Верх", "Обувь", "Аксессуары"];

type Product = (typeof PRODUCTS)[0];

interface NotifItem { id: number; text: string; icon: string; color?: string; }
interface Particle { id: number; x: number; y: number; tx: number; ty: number; tr: number; color: string; size: number; }

function rand(a: number, b: number) { return a + Math.random() * (b - a); }

const TNT_COLORS = ["#ff2200","#ff7700","#ffdd00","#ff44aa","#cc22ff","#00ffee","#6ecf2a"];

// ─── УВЕДОМЛЕНИЕ ──────────────────────────────────────────────────────────

function NotifToast({ notifs }: { notifs: NotifItem[] }) {
  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 pointer-events-none" style={{ maxWidth: 260 }}>
      {notifs.map((n) => (
        <div key={n.id} className="notif-toast flex items-center gap-2 px-4 py-3 text-white"
          style={{
            fontFamily: "Rubik,sans-serif", fontSize: 12,
            background: "var(--mc-panel)",
            border: `3px solid ${n.color || "var(--mc-grass)"}`,
            boxShadow: `inset -3px -3px 0 rgba(0,0,0,0.5), 0 0 16px ${n.color || "rgba(110,207,42,0.4)"}`,
          }}>
          <span className="text-lg">{n.icon}</span>
          <span>{n.text}</span>
        </div>
      ))}
    </div>
  );
}

// ─── ЧАСТИЦЫ ──────────────────────────────────────────────────────────────

function CubeParticles({ particles }: { particles: Particle[] }) {
  return (
    <div className="fixed inset-0 pointer-events-none z-40">
      {particles.map((p) => (
        <div key={p.id} className="cube-particle absolute"
          style={{
            left: p.x, top: p.y, width: p.size, height: p.size,
            background: p.color,
            "--tx": `${p.tx}px`, "--ty": `${p.ty}px`, "--tr": `${p.tr}deg`,
            boxShadow: `0 0 8px ${p.color}, inset -2px -2px 0 rgba(0,0,0,0.4)`,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
}

// ─── МОДАЛКА ТОВАРА ────────────────────────────────────────────────────────

function ProductModal({ product, onClose, onAddToCart }: {
  product: Product; onClose: () => void; onAddToCart: (p: Product) => void;
}) {
  const rc = RARITY_COLORS[product.rarity];
  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.88)" }} onClick={onClose}>
      <div className="card-reveal relative w-full max-w-sm"
        style={{
          background: "var(--mc-panel)",
          border: `4px solid ${rc}`,
          boxShadow: `inset -4px -4px 0 rgba(0,0,0,0.5), inset 4px 4px 0 rgba(255,255,255,0.07), 0 0 40px ${rc}55, 0 20px 60px rgba(0,0,0,0.8)`,
        }}
        onClick={(e) => e.stopPropagation()}>
        <div className="px-4 py-2 flex items-center justify-between"
          style={{ background: rc + "22", borderBottom: `3px solid ${rc}` }}>
          <span className="font-pixel" style={{ color: rc, fontSize: 9 }}>★ {RARITY_NAMES[product.rarity]}</span>
          <button onClick={onClose} className="text-white opacity-60 hover:opacity-100 transition-opacity">
            <Icon name="X" size={18} />
          </button>
        </div>
        <div className="relative">
          <img src={product.img} alt={product.name} className="w-full h-52 object-cover" />
          {!product.available && (
            <div className="absolute inset-0 flex items-center justify-center"
              style={{ background: "rgba(0,0,0,0.7)" }}>
              <span className="font-pixel text-red-400 text-sm">ПРОДАНО</span>
            </div>
          )}
        </div>
        <div className="p-4 space-y-3">
          <h2 className="font-pixel text-white leading-tight" style={{ fontSize: 11 }}>{product.name}</h2>
          <div className="flex gap-2 flex-wrap">
            <span className="px-2 py-1 text-xs text-white" style={{ fontFamily: "Rubik,sans-serif", background: "var(--mc-dirt)", border: "2px solid rgba(0,0,0,0.3)" }}>{product.category}</span>
            <span className="px-2 py-1 text-xs text-white" style={{ fontFamily: "Rubik,sans-serif", background: "var(--mc-stone)", border: "2px solid rgba(0,0,0,0.3)" }}>Размер: {product.size}</span>
            <span className="px-2 py-1 text-xs" style={{ fontFamily: "Rubik,sans-serif", background: "#1a3a10", border: "2px solid var(--mc-grass)", color: "var(--mc-grass)" }}>{product.condition}</span>
          </div>
          <p className="text-sm leading-relaxed text-gray-300" style={{ fontFamily: "Rubik,sans-serif" }}>{product.desc}</p>
          <div className="flex items-center gap-3 pt-1">
            {product.available ? (
              <>
                <span className="font-pixel text-lg" style={{ color: "var(--mc-gold)" }}>{product.price} ₽</span>
                <span className="text-sm text-gray-500 line-through" style={{ fontFamily: "Rubik,sans-serif" }}>{product.oldPrice} ₽</span>
                <span className="ml-auto text-xs px-2 py-1" style={{ fontFamily: "Rubik,sans-serif", background: "#0e2a0e", color: "var(--mc-grass)", border: "2px solid var(--mc-grass)" }}>
                  −{Math.round((1 - product.price / product.oldPrice) * 100)}%
                </span>
              </>
            ) : (
              <span className="font-pixel text-sm text-red-400">Нет в наличии</span>
            )}
          </div>
          {product.available && (
            <button onClick={() => { onAddToCart(product); onClose(); }}
              className="mc-btn w-full text-center mt-2" style={{ fontSize: 9, padding: 12 }}>
              🛒 В КОРЗИНУ
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── РАЗДЕЛ: МАГАЗИН ───────────────────────────────────────────────────────

function ShopTab({ onAddToCart, onSpawnParticles, showNotif }: {
  onAddToCart: (p: Product) => void;
  onSpawnParticles: (x: number, y: number) => void;
  showNotif: (text: string, icon: string, color?: string) => void;
}) {
  const [filter, setFilter] = useState("Все");
  const [showAvail, setShowAvail] = useState<"all" | "available" | "sold">("all");
  const [selected, setSelected] = useState<Product | null>(null);

  const filtered = PRODUCTS.filter((p) => {
    const catOk = filter === "Все" || p.category === filter;
    const availOk = showAvail === "all" || (showAvail === "available" && p.available) || (showAvail === "sold" && !p.available);
    return catOk && availOk;
  });

  function handleCardClick(e: React.MouseEvent, product: Product) {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    onSpawnParticles(rect.left + rect.width / 2, rect.top + rect.height / 2);
    setTimeout(() => setSelected(product), 200);
  }

  return (
    <div className="pb-24">
      <div className="px-4 pt-5 pb-3">
        <div className="flex items-center gap-3 mb-1">
          <span className="text-2xl tnt-flicker">🏪</span>
          <h1 className="font-pixel text-white" style={{ fontSize: 14 }}>SecondCraft</h1>
        </div>
        <p className="text-sm" style={{ fontFamily: "Rubik,sans-serif", color: "#8ab870" }}>Найди свой редкий дроп</p>
      </div>

      <div className="px-4 mb-3 flex gap-2 flex-wrap">
        {(["all", "available", "sold"] as const).map((v) => (
          <button key={v} onClick={() => setShowAvail(v)}
            className="px-3 py-1 text-xs transition-all"
            style={{
              fontFamily: "Rubik,sans-serif",
              background: showAvail === v ? "var(--mc-grass)" : "#1e2e18",
              color: showAvail === v ? "#fff" : "#6a9a50",
              border: `2px solid ${showAvail === v ? "var(--mc-grass)" : "var(--mc-border)"}`,
              boxShadow: showAvail === v ? "0 0 10px rgba(110,207,42,0.4), inset -2px -2px 0 rgba(0,0,0,0.4)" : "none",
            }}>
            {v === "all" ? "Все" : v === "available" ? "✅ В наличии" : "❌ Продано"}
          </button>
        ))}
      </div>

      <div className="px-4 mb-4 flex gap-2 overflow-x-auto pb-1">
        {CATEGORIES.map((cat) => (
          <button key={cat} onClick={() => setFilter(cat)}
            className="whitespace-nowrap px-3 py-2 font-pixel transition-all"
            style={{
              fontSize: 8,
              background: filter === cat ? "var(--mc-grass)" : "var(--mc-panel)",
              color: filter === cat ? "#fff" : "#6a9a50",
              border: `2px solid ${filter === cat ? "var(--mc-grass)" : "var(--mc-border)"}`,
              boxShadow: filter === cat ? "0 0 12px rgba(110,207,42,0.5), inset -2px -2px 0 rgba(0,0,0,0.4)" : "none",
            }}>
            {cat}
          </button>
        ))}
      </div>

      <div className="px-4 grid grid-cols-2 gap-3">
        {filtered.map((product, i) => (
          <button key={product.id} onClick={(e) => handleCardClick(e, product)}
            className="text-left relative overflow-hidden animate-fade-in"
            style={{
              animationDelay: `${i * 0.07}s`,
              background: "var(--mc-panel)",
              border: `3px solid ${RARITY_COLORS[product.rarity]}66`,
              boxShadow: `inset -3px -3px 0 rgba(0,0,0,0.5), 0 0 8px ${RARITY_COLORS[product.rarity]}33`,
              opacity: product.available ? 1 : 0.6,
            }}>
            <div style={{ height: 4, background: `linear-gradient(90deg, ${RARITY_COLORS[product.rarity]}, transparent)` }} />
            <div className="relative">
              <img src={product.img} alt={product.name} className="w-full h-28 object-cover" />
              {!product.available && (
                <div className="absolute inset-0 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.65)" }}>
                  <span className="font-pixel text-red-400" style={{ fontSize: 9 }}>ПРОДАНО</span>
                </div>
              )}
              {product.available && (
                <div className="absolute top-1 right-1 px-1 py-0.5 text-xs"
                  style={{ fontFamily: "Rubik,sans-serif", background: "rgba(0,0,0,0.8)", color: "var(--mc-grass)", border: "1px solid var(--mc-grass)" }}>
                  −{Math.round((1 - product.price / product.oldPrice) * 100)}%
                </div>
              )}
            </div>
            <div className="p-2">
              <p className="text-xs text-white font-semibold leading-tight truncate" style={{ fontFamily: "Rubik,sans-serif" }}>{product.name}</p>
              <p className="text-xs mt-0.5" style={{ fontFamily: "Rubik,sans-serif", color: "#6a9a50" }}>{product.size} · {product.category}</p>
              {product.available
                ? <p className="font-pixel mt-1" style={{ color: "var(--mc-gold)", fontSize: 10 }}>{product.price}₽</p>
                : <p className="font-pixel mt-1 text-red-500" style={{ fontSize: 10 }}>—</p>}
            </div>
          </button>
        ))}
      </div>

      {selected && (
        <ProductModal product={selected} onClose={() => setSelected(null)}
          onAddToCart={(p) => { onAddToCart(p); showNotif(`${p.name} в корзине! +5🪙`, "🛒", "var(--mc-grass)"); }} />
      )}
    </div>
  );
}

// ─── СЛОТ-МАШИНА ──────────────────────────────────────────────────────────

const SLOT_SYMBOLS = [
  { emoji: "👖", label: "Джинсы",  coins: 5,   weight: 30 },
  { emoji: "👟", label: "Кеды",    coins: 8,   weight: 25 },
  { emoji: "🎒", label: "Рюкзак",  coins: 12,  weight: 18 },
  { emoji: "🧥", label: "Куртка",  coins: 20,  weight: 12 },
  { emoji: "💎", label: "Алмаз",   coins: 50,  weight: 7  },
  { emoji: "🧨", label: "TNT",     coins: 100, weight: 3  },
  { emoji: "👑", label: "Джекпот", coins: 300, weight: 1  },
];

function weightedRandom() {
  const total = SLOT_SYMBOLS.reduce((s, x) => s + x.weight, 0);
  let r = Math.random() * total;
  for (const s of SLOT_SYMBOLS) { r -= s.weight; if (r <= 0) return s; }
  return SLOT_SYMBOLS[0];
}

const SPIN_COST = 10;
const REEL_COUNT = 3;

function ReelSpin({ symbols }: { symbols: (typeof SLOT_SYMBOLS[0])[] }) {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % symbols.length), 75);
    return () => clearInterval(t);
  }, [symbols.length]);
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <span className="text-4xl" style={{ lineHeight: 1 }}>{symbols[idx].emoji}</span>
    </div>
  );
}

function GameTab({ coins, onCoinsChange, showNotif }: {
  coins: number;
  onCoinsChange: (delta: number) => void;
  showNotif: (text: string, icon: string, color?: string) => void;
}) {
  const [reels] = useState<(typeof SLOT_SYMBOLS[0])[][]>(() =>
    Array.from({ length: REEL_COUNT }, () => Array.from({ length: 20 }, weightedRandom))
  );
  const [displayed, setDisplayed] = useState<(typeof SLOT_SYMBOLS[0])[]>(() =>
    Array.from({ length: REEL_COUNT }, () => SLOT_SYMBOLS[0])
  );
  const [spinning, setSpinning] = useState(false);
  const [spinningReels, setSpinningReels] = useState([false, false, false]);
  const [currentReels, setCurrentReels] = useState(reels);
  const [result, setResult] = useState<null | { win: number; isJackpot: boolean; combo: string }>(null);
  const [totalSpins, setTotalSpins] = useState(0);
  const [totalWon, setTotalWon] = useState(0);
  const [flashWin, setFlashWin] = useState(false);

  const spin = useCallback(() => {
    if (spinning || coins < SPIN_COST) {
      if (coins < SPIN_COST) showNotif(`Нужно ${SPIN_COST} монет для спина!`, "❌", "var(--tnt-red)");
      return;
    }
    onCoinsChange(-SPIN_COST);
    setSpinning(true);
    setResult(null);
    setFlashWin(false);
    setTotalSpins((s) => s + 1);

    const newReels = Array.from({ length: REEL_COUNT }, () =>
      Array.from({ length: 20 }, weightedRandom)
    );
    setCurrentReels(newReels);
    setSpinningReels([true, true, true]);

    const finalDisplayed: (typeof SLOT_SYMBOLS[0])[] = [];

    [800, 1250, 1700].forEach((delay, idx) => {
      setTimeout(() => {
        const sym = newReels[idx][0];
        finalDisplayed[idx] = sym;
        setSpinningReels((prev) => { const next = [...prev]; next[idx] = false; return next; });
        setDisplayed((prev) => { const next = [...prev]; next[idx] = sym; return next; });

        if (idx === REEL_COUNT - 1) {
          setTimeout(() => {
            const counts: Record<string, number> = {};
            for (const s of finalDisplayed) counts[s.emoji] = (counts[s.emoji] || 0) + 1;
            const maxCount = Math.max(...Object.values(counts));
            const topEmoji = Object.entries(counts).find(([, v]) => v === maxCount)![0];
            const symbol = SLOT_SYMBOLS.find((s) => s.emoji === topEmoji)!;

            let win = 0; let combo = ""; let isJackpot = false;
            if (maxCount === 3) {
              if (symbol.label === "Джекпот") { win = symbol.coins; isJackpot = true; combo = "👑 ДЖЕКПОТ! 👑"; }
              else if (symbol.label === "TNT") { win = symbol.coins; isJackpot = true; combo = "🧨 ВЗРЫВ! +100🪙"; }
              else { win = symbol.coins * 3; combo = `ТРОЙКА ${symbol.emoji} +${symbol.coins * 3}🪙`; }
            } else if (maxCount === 2) {
              win = symbol.coins; combo = `Пара ${symbol.emoji} +${symbol.coins}🪙`;
            } else {
              combo = "Не повезло... ещё раз?";
            }

            setSpinning(false);
            setResult({ win, isJackpot, combo });
            if (win > 0) {
              onCoinsChange(win);
              setTotalWon((t) => t + win);
              setFlashWin(true);
              setTimeout(() => setFlashWin(false), 1400);
              showNotif(combo, isJackpot ? "🎉" : "🪙", isJackpot ? "var(--tnt-yellow)" : "var(--mc-gold)");
            } else {
              showNotif(combo, "😅", "#555");
            }
          }, 150);
        }
      }, delay);
    });
  }, [spinning, coins, onCoinsChange, showNotif]);

  const canSpin = coins >= SPIN_COST && !spinning;

  return (
    <div className="pb-24 px-4">
      <div className="pt-5 pb-4">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <span className="text-xl">🎰</span>
            <h1 className="font-pixel text-white" style={{ fontSize: 13 }}>СЕКОНД СЛОТ</h1>
          </div>
          <div className="flex items-center gap-2 px-3 py-2"
            style={{ background: "var(--mc-panel)", border: "2px solid var(--mc-gold)", boxShadow: "0 0 10px rgba(255,224,51,0.3)" }}>
            <span>🪙</span>
            <span className="font-pixel text-sm" style={{ color: "var(--mc-gold)" }}>{coins}</span>
          </div>
        </div>
        <p className="text-xs" style={{ fontFamily: "Rubik,sans-serif", color: "#6a9a50" }}>
          Спин стоит {SPIN_COST} монет · Монеты = скидки в магазине
        </p>
      </div>

      {/* Machine */}
      <div className={`relative p-4 ${flashWin ? "jackpot-flash" : ""}`}
        style={{
          background: "var(--mc-panel)",
          border: "4px solid var(--mc-border)",
          boxShadow: "inset -4px -4px 0 rgba(0,0,0,0.6), inset 4px 4px 0 rgba(255,255,255,0.07), 0 0 20px rgba(110,207,42,0.1)",
        }}>

        {/* Top deco */}
        <div className="flex justify-between items-center mb-3">
          {["🧨","💥","🎰","💥","🧨"].map((e, i) => (
            <span key={i} className="text-sm tnt-flicker" style={{ animationDelay: `${i * 0.3}s` }}>{e}</span>
          ))}
        </div>

        {/* Reels */}
        <div className="flex gap-2 mb-1">
          {Array.from({ length: REEL_COUNT }, (_, i) => (
            <div key={i} className="flex-1 relative overflow-hidden flex items-center justify-center"
              style={{
                height: 88,
                background: "#080e08",
                border: "3px solid var(--mc-border)",
                boxShadow: "inset 0 0 24px rgba(0,0,0,0.9)",
              }}>
              {/* scanlines */}
              <div className="absolute inset-0 pointer-events-none z-10"
                style={{ background: "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.08) 3px, rgba(0,0,0,0.08) 4px)" }} />

              {spinningReels[i] ? (
                <ReelSpin symbols={currentReels[i].slice(0, 8)} />
              ) : (
                <div className="flex flex-col items-center gap-1 z-20">
                  <span className="text-5xl" style={{ lineHeight: 1, filter: result && result.win > 0 ? `drop-shadow(0 0 8px ${TNT_COLORS[i]})` : "none" }}>
                    {displayed[i].emoji}
                  </span>
                  <span className="font-pixel" style={{ fontSize: 6, color: "#6a9a50" }}>{displayed[i].label}</span>
                </div>
              )}

              {/* Win highlight */}
              {!spinningReels[i] && !spinning && result && result.win > 0 && (
                <div className="absolute inset-0 pointer-events-none rainbow-border" style={{ border: "3px solid transparent" }} />
              )}
            </div>
          ))}
        </div>

        {/* Center payline */}
        <div className="relative h-0.5 mb-3 mx-0"
          style={{ background: "linear-gradient(90deg, transparent, var(--tnt-yellow), transparent)" }} />

        {/* Result display */}
        <div className="h-7 flex items-center justify-center mb-3">
          {result && (
            <span className="animate-scale-in font-pixel"
              style={{ fontSize: 9, color: result.isJackpot ? "var(--tnt-yellow)" : result.win > 0 ? "var(--mc-gold)" : "#555" }}>
              {result.combo}
            </span>
          )}
          {spinning && (
            <span className="font-pixel tnt-flicker" style={{ fontSize: 9, color: "var(--tnt-orange)" }}>
              🎰 КРУТИТСЯ...
            </span>
          )}
          {!spinning && !result && (
            <span className="font-pixel" style={{ fontSize: 8, color: "#3a5a2a" }}>НАЖМИ КРУТИТЬ</span>
          )}
        </div>

        {/* Spin button */}
        <button onClick={spin}
          className={`mc-btn w-full text-center ${canSpin ? "mc-btn-tnt" : ""}`}
          style={{
            fontSize: 10, padding: 14,
            opacity: canSpin ? 1 : 0.35,
            cursor: canSpin ? "pointer" : "not-allowed",
            background: !canSpin ? "#2a2a2a" : undefined,
            boxShadow: !canSpin ? "none" : undefined,
          }}>
          {spinning ? "⏳ КРУТИТСЯ..." : `🎰 КРУТИТЬ  (−${SPIN_COST} 🪙)`}
        </button>
      </div>

      {/* Stats */}
      <div className="mt-3 grid grid-cols-2 gap-2">
        <div className="p-3 text-center" style={{ background: "var(--mc-panel)", border: "2px solid var(--mc-border)" }}>
          <p className="font-pixel" style={{ fontSize: 8, color: "#6a9a50" }}>СПИНОВ</p>
          <p className="font-pixel mt-1" style={{ fontSize: 16, color: "var(--tnt-cyan)" }}>{totalSpins}</p>
        </div>
        <div className="p-3 text-center" style={{ background: "var(--mc-panel)", border: "2px solid var(--mc-border)" }}>
          <p className="font-pixel" style={{ fontSize: 8, color: "#6a9a50" }}>ВЫИГРАНО</p>
          <p className="font-pixel mt-1" style={{ fontSize: 16, color: "var(--mc-gold)" }}>{totalWon}🪙</p>
        </div>
      </div>

      {/* Paytable */}
      <div className="mt-3 p-3" style={{ background: "var(--mc-panel)", border: "2px solid var(--mc-border)" }}>
        <p className="font-pixel mb-2" style={{ fontSize: 8, color: "#6a9a50" }}>ТАБЛИЦА ВЫПЛАТ:</p>
        <div className="space-y-1.5">
          {[
            { label: "3 × 👑 ДЖЕКПОТ", val: "300 🪙", color: "var(--mc-gold)", star: "★★★" },
            { label: "3 × 🧨 TNT",      val: "100 🪙", color: "var(--tnt-red)",    star: "★★" },
            { label: "3 × 💎 Алмаз",    val: "150 🪙", color: "var(--tnt-cyan)",   star: "★★" },
            { label: "3 × 🧥 Куртка",   val:  "60 🪙", color: "var(--tnt-purple)", star: "★" },
            { label: "Любая пара",      val: "5–20 🪙", color: "#6a9a50",           star: "" },
          ].map((row) => (
            <div key={row.label} className="flex justify-between items-center">
              <span style={{ fontFamily: "Rubik,sans-serif", fontSize: 11, color: row.color }}>{row.label}</span>
              <span className="font-pixel" style={{ fontSize: 8, color: row.star ? "var(--mc-gold)" : "#555" }}>{row.val}</span>
            </div>
          ))}
        </div>
        <p className="mt-2 text-center font-pixel" style={{ fontSize: 7, color: "#3a4a3a" }}>
          Шанс джекпота ≈ 0.01% · Удачи!
        </p>
      </div>

      {/* Earn hint */}
      <div className="mt-3 p-3"
        style={{ background: "#150a00", border: "3px solid var(--tnt-orange)", boxShadow: "0 0 10px rgba(255,119,0,0.2)" }}>
        <div className="flex items-center gap-2">
          <span className="text-xl">💡</span>
          <p className="text-xs text-gray-300" style={{ fontFamily: "Rubik,sans-serif" }}>
            +5 монет за каждый товар в корзине. Трать монеты на скидки — скоро!
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── ФОРМА ЗАКАЗА ─────────────────────────────────────────────────────────

function OrderForm({ cart, onSubmit, onCancel }: {
  cart: Product[];
  onSubmit: (data: { name: string; phone: string; comment: string }) => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [comment, setComment] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate() {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = "Введи имя";
    if (!phone.trim() || phone.replace(/\D/g, "").length < 10) e.phone = "Введи корректный номер";
    return e;
  }

  function handleSubmit() {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    onSubmit({ name, phone, comment });
  }

  const total = cart.reduce((s, p) => s + p.price, 0);

  return (
    <div className="fixed inset-0 z-30 flex items-end justify-center"
      style={{ background: "rgba(0,0,0,0.85)" }} onClick={onCancel}>
      <div className="card-reveal w-full max-w-md"
        style={{
          background: "var(--mc-panel)",
          border: "4px solid var(--mc-grass)",
          borderBottom: "none",
          boxShadow: "inset -4px -4px 0 rgba(0,0,0,0.5), 0 0 30px rgba(110,207,42,0.3)",
          maxHeight: "92vh",
          overflowY: "auto",
        }}
        onClick={(e) => e.stopPropagation()}>

        <div className="px-4 py-3 flex items-center justify-between sticky top-0 z-10"
          style={{ borderBottom: "3px solid var(--mc-grass)", background: "var(--mc-panel)" }}>
          <span className="font-pixel text-white" style={{ fontSize: 10 }}>⚡ ОФОРМЛЕНИЕ ЗАКАЗА</span>
          <button onClick={onCancel} className="text-gray-400 hover:text-white transition-colors">
            <Icon name="X" size={20} />
          </button>
        </div>

        <div className="p-4 space-y-4">
          {/* Summary */}
          <div className="p-3" style={{ background: "#080e08", border: "2px solid var(--mc-border)" }}>
            <p className="font-pixel text-white mb-2" style={{ fontSize: 8 }}>ТОВАРЫ:</p>
            {cart.map((p) => (
              <div key={p.id} className="flex justify-between items-center py-1"
                style={{ borderBottom: "1px solid #1a2a1a" }}>
                <span className="text-sm text-gray-300 truncate" style={{ fontFamily: "Rubik,sans-serif", maxWidth: "70%" }}>{p.name}</span>
                <span className="font-pixel" style={{ fontSize: 10, color: "var(--mc-gold)" }}>{p.price}₽</span>
              </div>
            ))}
            <div className="flex justify-between items-center mt-2 pt-2" style={{ borderTop: "2px solid var(--mc-grass)" }}>
              <span className="font-pixel text-white" style={{ fontSize: 9 }}>ИТОГО:</span>
              <span className="font-pixel" style={{ fontSize: 14, color: "var(--mc-gold)", textShadow: "0 0 8px rgba(255,224,51,0.5)" }}>{total} ₽</span>
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="font-pixel text-white block mb-2" style={{ fontSize: 8 }}>👤 ИМЯ *</label>
            <input className="mc-input" placeholder="Как тебя зовут?" value={name}
              onChange={(e) => { setName(e.target.value); setErrors((p) => ({ ...p, name: "" })); }} />
            {errors.name && <p className="mt-1 text-xs text-red-400" style={{ fontFamily: "Rubik,sans-serif" }}>{errors.name}</p>}
          </div>

          {/* Phone */}
          <div>
            <label className="font-pixel text-white block mb-2" style={{ fontSize: 8 }}>📱 ТЕЛЕФОН *</label>
            <input className="mc-input" placeholder="+7 (999) 000-00-00" type="tel" value={phone}
              onChange={(e) => { setPhone(e.target.value); setErrors((p) => ({ ...p, phone: "" })); }} />
            {errors.phone && <p className="mt-1 text-xs text-red-400" style={{ fontFamily: "Rubik,sans-serif" }}>{errors.phone}</p>}
          </div>

          {/* Comment */}
          <div>
            <label className="font-pixel text-white block mb-2" style={{ fontSize: 8 }}>💬 КОММЕНТАРИЙ</label>
            <textarea className="mc-input resize-none" placeholder="Удобное время, способ доставки..." rows={3}
              value={comment} onChange={(e) => setComment(e.target.value)}
              style={{ fontFamily: "Rubik,sans-serif" }} />
          </div>

          <button onClick={handleSubmit} className="mc-btn w-full text-center mc-btn-gold" style={{ fontSize: 10, padding: 14 }}>
            ✅ ОТПРАВИТЬ ЗАКАЗ
          </button>

          <p className="text-center text-xs text-gray-500" style={{ fontFamily: "Rubik,sans-serif" }}>
            Свяжемся с тобой в течение часа
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── РАЗДЕЛ: КОРЗИНА ───────────────────────────────────────────────────────

function CartTab({ cart, onRemove, showNotif }: {
  cart: Product[];
  onRemove: (id: number) => void;
  showNotif: (text: string, icon: string, color?: string) => void;
}) {
  const total = cart.reduce((s, p) => s + p.price, 0);
  const [showForm, setShowForm] = useState(false);
  const [done, setDone] = useState(false);

  function handleOrder(data: { name: string; phone: string; comment: string }) {
    setShowForm(false);
    setDone(true);
    showNotif(`Заказ принят, ${data.name}! 📬`, "✅", "var(--mc-gold)");
  }

  if (done) {
    return (
      <div className="pb-24 px-4 flex flex-col items-center justify-center min-h-[60vh]">
        <div className="mc-float text-6xl mb-4">✅</div>
        <p className="font-pixel text-white text-center mb-2" style={{ fontSize: 11 }}>ЗАКАЗ ПРИНЯТ!</p>
        <p className="text-sm text-gray-400 text-center" style={{ fontFamily: "Rubik,sans-serif" }}>
          Свяжемся с тобой в ближайшее время
        </p>
        <button onClick={() => setDone(false)} className="mc-btn mt-6" style={{ fontSize: 9 }}>🔄 НОВЫЙ ЗАКАЗ</button>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="pb-24 px-4 flex flex-col items-center justify-center min-h-[60vh]">
        <div className="mc-float text-6xl mb-4">🛒</div>
        <p className="font-pixel text-white text-center mb-2" style={{ fontSize: 11 }}>КОРЗИНА ПУСТА</p>
        <p className="text-sm text-gray-400 text-center" style={{ fontFamily: "Rubik,sans-serif" }}>Добавь товары из каталога</p>
      </div>
    );
  }

  return (
    <div className="pb-24">
      <div className="px-4 pt-5 pb-4">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xl">🛒</span>
          <h1 className="font-pixel text-white" style={{ fontSize: 13 }}>КОРЗИНА</h1>
        </div>
        <p className="text-xs" style={{ fontFamily: "Rubik,sans-serif", color: "#6a9a50" }}>
          {cart.length} {cart.length === 1 ? "товар" : cart.length < 5 ? "товара" : "товаров"}
        </p>
      </div>

      <div className="px-4 space-y-3">
        {cart.map((p) => (
          <div key={p.id} className="flex gap-3 p-3 animate-fade-in"
            style={{
              background: "var(--mc-panel)",
              border: `3px solid ${RARITY_COLORS[p.rarity]}55`,
              boxShadow: `inset -3px -3px 0 rgba(0,0,0,0.4), 0 0 8px ${RARITY_COLORS[p.rarity]}22`,
            }}>
            <div style={{ width: 4, background: `linear-gradient(180deg, ${RARITY_COLORS[p.rarity]}, transparent)`, flexShrink: 0 }} />
            <img src={p.img} alt={p.name} className="w-16 h-16 object-cover flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm text-white font-semibold truncate" style={{ fontFamily: "Rubik,sans-serif" }}>{p.name}</p>
              <p className="text-xs text-gray-400" style={{ fontFamily: "Rubik,sans-serif" }}>{p.size} · {p.category}</p>
              <p className="font-pixel mt-1" style={{ color: "var(--mc-gold)", fontSize: 11 }}>{p.price} ₽</p>
            </div>
            <button onClick={() => { onRemove(p.id); showNotif("Убрано из корзины", "🗑️"); }}
              className="text-gray-500 hover:text-red-400 transition-colors self-start pt-1">
              <Icon name="X" size={16} />
            </button>
          </div>
        ))}
      </div>

      <div className="mx-4 mt-4 p-4"
        style={{ background: "var(--mc-panel)", border: "3px solid var(--mc-border)", boxShadow: "inset -3px -3px 0 rgba(0,0,0,0.4)" }}>
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm text-gray-300" style={{ fontFamily: "Rubik,sans-serif" }}>Итого:</span>
          <span className="font-pixel text-xl" style={{ color: "var(--mc-gold)", textShadow: "0 0 12px rgba(255,224,51,0.6)" }}>
            {total} ₽
          </span>
        </div>
        <button onClick={() => setShowForm(true)}
          className="mc-btn w-full text-center mc-btn-gold" style={{ fontSize: 10, padding: 14 }}>
          ⚡ ОФОРМИТЬ ЗАКАЗ
        </button>
      </div>

      {showForm && <OrderForm cart={cart} onSubmit={handleOrder} onCancel={() => setShowForm(false)} />}
    </div>
  );
}

// ─── ПРОФИЛЬ ──────────────────────────────────────────────────────────────

const ACHIEVEMENTS = [
  { id: 1, icon: "🛒", name: "Первая покупка", desc: "Добавь товар в корзину", unlocked: true },
  { id: 2, icon: "🎰", name: "Игрок", desc: "Сделай первый спин", unlocked: true },
  { id: 3, icon: "💎", name: "Нашёл алмаз", desc: "Выпади три 💎 в ряд", unlocked: false },
  { id: 4, icon: "🧨", name: "ТНТ!", desc: "Три 🧨 — взрыв монет!", unlocked: false },
  { id: 5, icon: "👑", name: "Джекпот", desc: "Три 👑 — легенда", unlocked: false },
  { id: 6, icon: "🔥", name: "Везунчик", desc: "Выиграй 3 раза подряд", unlocked: false },
];

function ProfileTab({ coins }: { coins: number }) {
  const level = Math.floor(coins / 50) + 1;
  const xp = (coins % 50) / 50;
  const rank = level < 5 ? "Новичок" : level < 15 ? "Везунчик" : "Легенда";
  const rankColor = level < 5 ? "var(--mc-grass)" : level < 15 ? "var(--tnt-orange)" : "var(--mc-gold)";

  return (
    <div className="pb-24 px-4">
      <div className="pt-5 pb-4">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xl">👤</span>
          <h1 className="font-pixel text-white" style={{ fontSize: 13 }}>ПРОФИЛЬ</h1>
        </div>
      </div>

      <div className="p-4 mb-4"
        style={{
          background: "var(--mc-panel)",
          border: "3px solid var(--mc-border)",
          boxShadow: "inset -3px -3px 0 rgba(0,0,0,0.5), 0 0 20px rgba(110,207,42,0.08)",
        }}>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 mc-float flex items-center justify-center text-4xl"
            style={{
              background: "var(--mc-dirt)",
              boxShadow: "inset -4px -4px 0 rgba(0,0,0,0.4), inset 4px 4px 0 rgba(255,255,255,0.15), 0 0 12px rgba(110,207,42,0.25)",
            }}>🧑</div>
          <div className="flex-1">
            <p className="font-pixel text-white mb-1" style={{ fontSize: 10 }}>Игрок #1</p>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs px-2 py-0.5"
                style={{ fontFamily: "Rubik,sans-serif", background: rankColor + "22", color: rankColor, border: `2px solid ${rankColor}` }}>
                {rank}
              </span>
              <span className="font-pixel" style={{ color: "var(--mc-gold)", fontSize: 9 }}>Ур. {level}</span>
            </div>
            <p className="font-pixel" style={{ fontSize: 14, color: "var(--mc-gold)", textShadow: "0 0 10px rgba(255,224,51,0.5)" }}>
              {coins} <span style={{ fontSize: 9 }}>монет</span>
            </p>
          </div>
        </div>
        <div className="mt-3">
          <div className="flex justify-between mb-1">
            <span className="text-xs text-gray-400" style={{ fontFamily: "Rubik,sans-serif" }}>До уровня {level + 1}</span>
            <span className="font-pixel" style={{ color: "var(--mc-gold)", fontSize: 8 }}>{Math.round(xp * 50)}/50 XP</span>
          </div>
          <div className="h-3" style={{ background: "#0a100a", border: "2px solid rgba(0,0,0,0.6)" }}>
            <div className="h-full transition-all duration-1000"
              style={{ width: `${xp * 100}%`, background: "linear-gradient(90deg, var(--mc-grass), var(--mc-gold))" }} />
          </div>
        </div>
      </div>

      <h2 className="font-pixel text-white mb-3" style={{ fontSize: 10 }}>🏆 ДОСТИЖЕНИЯ</h2>
      <div className="grid grid-cols-2 gap-2">
        {ACHIEVEMENTS.map((a) => (
          <div key={a.id} className="p-3 flex items-start gap-2"
            style={{
              background: a.unlocked ? "var(--mc-panel)" : "#0a0a0a",
              border: `2px solid ${a.unlocked ? "var(--mc-grass)" : "#1a1a1a"}`,
              boxShadow: a.unlocked ? "inset -2px -2px 0 rgba(0,0,0,0.4), 0 0 8px rgba(110,207,42,0.15)" : "none",
              opacity: a.unlocked ? 1 : 0.4,
            }}>
            <span className="text-xl">{a.icon}</span>
            <div>
              <p className="text-xs font-semibold text-white leading-tight" style={{ fontFamily: "Rubik,sans-serif" }}>{a.name}</p>
              <p className="text-xs text-gray-500 leading-tight mt-0.5" style={{ fontFamily: "Rubik,sans-serif" }}>{a.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 p-3"
        style={{ background: "#150a00", border: "3px solid var(--tnt-yellow)", boxShadow: "0 0 14px rgba(255,221,0,0.15)" }}>
        <div className="flex items-center gap-2">
          <span className="text-xl">💡</span>
          <p className="text-xs text-gray-300" style={{ fontFamily: "Rubik,sans-serif" }}>
            Зарабатывай монеты за покупки и спины — скоро появятся скидки!
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── НИЖНЯЯ НАВИГАЦИЯ ──────────────────────────────────────────────────────

function BottomNav({ tab, setTab, cartCount }: {
  tab: string; setTab: (t: string) => void; cartCount: number;
}) {
  const tabs = [
    { id: "shop",    icon: "🏪", label: "Магазин" },
    { id: "game",    icon: "🎰", label: "Игра" },
    { id: "cart",    icon: "🛒", label: "Корзина", badge: cartCount },
    { id: "profile", icon: "👤", label: "Профиль" },
  ];

  return (
    <div className="fixed bottom-0 z-20 flex"
      style={{
        left: "50%", transform: "translateX(-50%)",
        width: "100%", maxWidth: 448,
        background: "var(--mc-dark)",
        borderTop: "4px solid var(--mc-border)",
        boxShadow: "0 -4px 30px rgba(0,0,0,0.9), 0 -1px 0 rgba(110,207,42,0.1)",
      }}>
      {tabs.map((t) => (
        <button key={t.id} onClick={() => setTab(t.id)}
          className="flex-1 flex flex-col items-center py-3 gap-1 relative transition-all"
          style={{
            background: tab === t.id ? "var(--mc-grass)" : "transparent",
            boxShadow: tab === t.id
              ? "inset -3px -3px 0 rgba(0,0,0,0.4), inset 3px 3px 0 rgba(255,255,255,0.15), 0 0 20px rgba(110,207,42,0.25)"
              : "none",
          }}>
          <span className="text-xl">{t.icon}</span>
          <span className="text-xs" style={{ fontFamily: "Rubik,sans-serif", color: tab === t.id ? "#fff" : "#4a7a3a" }}>
            {t.label}
          </span>
          {t.badge !== undefined && t.badge > 0 && (
            <div className="absolute top-1.5 right-2 w-5 h-5 flex items-center justify-center notif-badge"
              style={{
                background: "var(--tnt-red)", border: "2px solid var(--mc-dark)",
                fontFamily: "'Press Start 2P',monospace", fontSize: 8, color: "#fff",
                boxShadow: "0 0 10px rgba(255,34,0,0.7)",
              }}>
              {t.badge}
            </div>
          )}
        </button>
      ))}
    </div>
  );
}

// ─── ГЛАВНЫЙ КОМПОНЕНТ ─────────────────────────────────────────────────────

export default function Index() {
  const [tab, setTab] = useState("shop");
  const [cart, setCart] = useState<Product[]>([]);
  const [coins, setCoins] = useState(0);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [notifs, setNotifs] = useState<NotifItem[]>([]);
  const pCounter = useRef(0);
  const nCounter = useRef(0);

  function showNotif(text: string, icon: string, color?: string) {
    const id = ++nCounter.current;
    setNotifs((prev) => [...prev, { id, text, icon, color }]);
    setTimeout(() => setNotifs((prev) => prev.filter((n) => n.id !== id)), 2800);
  }

  function spawnParticles(x: number, y: number) {
    const newP: Particle[] = Array.from({ length: 14 }, () => ({
      id: ++pCounter.current,
      x, y,
      tx: rand(-140, 140), ty: rand(-160, 40), tr: rand(-220, 220),
      color: TNT_COLORS[Math.floor(Math.random() * TNT_COLORS.length)],
      size: rand(8, 24),
    }));
    setParticles((prev) => [...prev, ...newP]);
    setTimeout(() => setParticles((prev) => prev.filter((p) => !newP.find((n) => n.id === p.id))), 700);
  }

  function addToCart(product: Product) {
    setCart((prev) => [...prev, { ...product, id: product.id * 10000 + Date.now() % 10000 }]);
    setCoins((c) => c + 5);
  }

  function removeFromCart(id: number) {
    setCart((prev) => prev.filter((p) => p.id !== id));
  }

  return (
    <div className="max-w-md mx-auto min-h-screen relative" style={{ background: "var(--mc-bg)" }}>
      <CubeParticles particles={particles} />
      <NotifToast notifs={notifs} />

      {tab === "shop" && (
        <ShopTab onAddToCart={addToCart} onSpawnParticles={spawnParticles} showNotif={showNotif} />
      )}
      {tab === "game" && (
        <GameTab coins={coins} onCoinsChange={(d) => setCoins((c) => Math.max(0, c + d))} showNotif={showNotif} />
      )}
      {tab === "cart" && (
        <CartTab cart={cart} onRemove={removeFromCart} showNotif={showNotif} />
      )}
      {tab === "profile" && <ProfileTab coins={coins} />}

      <BottomNav tab={tab} setTab={setTab} cartCount={cart.length} />
    </div>
  );
}
