import { useState, useEffect, useRef, useCallback } from "react";
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
  uncommon: "#5DA832",
  rare: "#4A9EFF",
  epic: "#B44FE8",
};

const RARITY_NAMES: Record<string, string> = {
  common: "Обычный",
  uncommon: "Необычный",
  rare: "Редкий",
  epic: "Эпический",
};

const CATEGORIES = ["Все", "Верх", "Обувь", "Аксессуары"];

// ─── УТИЛИТЫ ───────────────────────────────────────────────────────────────

function randomBetween(a: number, b: number) {
  return a + Math.random() * (b - a);
}

// ─── ТИПЫ ──────────────────────────────────────────────────────────────────

type Product = (typeof PRODUCTS)[0];

interface NotifItem {
  id: number;
  text: string;
  icon: string;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  tx: number;
  ty: number;
  tr: number;
  color: string;
  size: number;
}

// ─── УВЕДОМЛЕНИЕ ──────────────────────────────────────────────────────────

function NotifToast({ notifs }: { notifs: NotifItem[] }) {
  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
      {notifs.map((n) => (
        <div
          key={n.id}
          className="notif-toast flex items-center gap-2 px-4 py-3 text-white text-sm"
          style={{
            fontFamily: "Rubik, sans-serif",
            background: "var(--mc-panel)",
            border: "3px solid var(--mc-grass)",
            boxShadow:
              "inset -3px -3px 0 rgba(0,0,0,0.5), inset 3px 3px 0 rgba(255,255,255,0.1), 0 4px 20px rgba(0,0,0,0.5)",
          }}
        >
          <span className="text-lg">{n.icon}</span>
          <span>{n.text}</span>
        </div>
      ))}
    </div>
  );
}

// ─── ЧАСТИЦЫ-КУБИКИ ────────────────────────────────────────────────────────

function CubeParticles({ particles }: { particles: Particle[] }) {
  return (
    <div className="fixed inset-0 pointer-events-none z-40">
      {particles.map((p) => (
        <div
          key={p.id}
          className="cube-particle absolute"
          style={
            {
              left: p.x,
              top: p.y,
              width: p.size,
              height: p.size,
              background: p.color,
              "--tx": `${p.tx}px`,
              "--ty": `${p.ty}px`,
              "--tr": `${p.tr}deg`,
              boxShadow:
                "inset -2px -2px 0 rgba(0,0,0,0.4), inset 2px 2px 0 rgba(255,255,255,0.2)",
              imageRendering: "pixelated",
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}

// ─── МОДАЛКА ТОВАРА ────────────────────────────────────────────────────────

function ProductModal({
  product,
  onClose,
  onAddToCart,
}: {
  product: Product;
  onClose: () => void;
  onAddToCart: (p: Product) => void;
}) {
  const rarityColor = RARITY_COLORS[product.rarity];
  const rarityName = RARITY_NAMES[product.rarity];

  return (
    <div
      className="fixed inset-0 z-30 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.85)" }}
      onClick={onClose}
    >
      <div
        className="card-reveal relative w-full max-w-sm"
        style={{
          background: "var(--mc-panel)",
          border: "4px solid var(--mc-border)",
          boxShadow:
            "inset -4px -4px 0 rgba(0,0,0,0.5), inset 4px 4px 0 rgba(255,255,255,0.08), 0 20px 60px rgba(0,0,0,0.8)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="px-4 py-2 flex items-center justify-between"
          style={{
            background: rarityColor + "33",
            borderBottom: `3px solid ${rarityColor}`,
          }}
        >
          <span
            className="font-pixel text-xs"
            style={{ color: rarityColor, fontSize: "9px" }}
          >
            ★ {rarityName}
          </span>
          <button
            onClick={onClose}
            className="text-white opacity-60 hover:opacity-100 transition-opacity"
          >
            <Icon name="X" size={18} />
          </button>
        </div>

        <div className="relative">
          <img
            src={product.img}
            alt={product.name}
            className="w-full h-52 object-cover"
          />
          {!product.available && (
            <div
              className="absolute inset-0 flex items-center justify-center"
              style={{ background: "rgba(0,0,0,0.65)" }}
            >
              <span className="font-pixel text-red-400 text-sm">ПРОДАНО</span>
            </div>
          )}
        </div>

        <div className="p-4 space-y-3">
          <h2 className="font-pixel text-sm text-white leading-tight" style={{ fontSize: "11px" }}>
            {product.name}
          </h2>

          <div className="flex gap-2 flex-wrap">
            <span
              className="px-2 py-1 text-xs text-white"
              style={{
                fontFamily: "Rubik, sans-serif",
                background: "var(--mc-dirt)",
                border: "2px solid rgba(0,0,0,0.3)",
              }}
            >
              {product.category}
            </span>
            <span
              className="px-2 py-1 text-xs text-white"
              style={{
                fontFamily: "Rubik, sans-serif",
                background: "var(--mc-stone)",
                border: "2px solid rgba(0,0,0,0.3)",
              }}
            >
              Размер: {product.size}
            </span>
            <span
              className="px-2 py-1 text-xs"
              style={{
                fontFamily: "Rubik, sans-serif",
                background: "#2a4a2a",
                border: "2px solid var(--mc-grass)",
                color: "var(--mc-grass)",
              }}
            >
              {product.condition}
            </span>
          </div>

          <p
            className="text-sm leading-relaxed text-gray-300"
            style={{ fontFamily: "Rubik, sans-serif" }}
          >
            {product.desc}
          </p>

          <div className="flex items-center gap-3 pt-1">
            {product.available ? (
              <>
                <span
                  className="font-pixel text-lg"
                  style={{ color: "var(--mc-gold)" }}
                >
                  {product.price} ₽
                </span>
                <span
                  className="text-sm text-gray-500 line-through"
                  style={{ fontFamily: "Rubik, sans-serif" }}
                >
                  {product.oldPrice} ₽
                </span>
                <span
                  className="ml-auto text-xs px-2 py-1"
                  style={{
                    fontFamily: "Rubik, sans-serif",
                    background: "#1a3a1a",
                    color: "#5DA832",
                    border: "2px solid #5DA832",
                  }}
                >
                  −{Math.round((1 - product.price / product.oldPrice) * 100)}%
                </span>
              </>
            ) : (
              <span className="font-pixel text-sm text-red-400">
                Нет в наличии
              </span>
            )}
          </div>

          {product.available && (
            <button
              onClick={() => {
                onAddToCart(product);
                onClose();
              }}
              className="mc-btn w-full text-center mt-2"
              style={{ fontSize: "9px", padding: "12px" }}
            >
              🛒 В КОРЗИНУ
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── РАЗДЕЛ: МАГАЗИН ───────────────────────────────────────────────────────

function ShopTab({
  onAddToCart,
  onSpawnParticles,
  showNotif,
}: {
  onAddToCart: (p: Product) => void;
  onSpawnParticles: (x: number, y: number, color: string) => void;
  showNotif: (text: string, icon: string) => void;
}) {
  const [filter, setFilter] = useState("Все");
  const [showAvail, setShowAvail] = useState<"all" | "available" | "sold">("all");
  const [selected, setSelected] = useState<Product | null>(null);

  const filtered = PRODUCTS.filter((p) => {
    const catOk = filter === "Все" || p.category === filter;
    const availOk =
      showAvail === "all" ||
      (showAvail === "available" && p.available) ||
      (showAvail === "sold" && !p.available);
    return catOk && availOk;
  });

  function handleCardClick(e: React.MouseEvent, product: Product) {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    onSpawnParticles(cx, cy, RARITY_COLORS[product.rarity]);
    setTimeout(() => setSelected(product), 220);
  }

  return (
    <div className="pb-24">
      <div className="px-4 pt-5 pb-3">
        <div className="flex items-center gap-3 mb-1">
          <span className="text-2xl">🏪</span>
          <h1
            className="font-pixel text-white leading-tight"
            style={{ fontSize: "13px" }}
          >
            SecondCraft
          </h1>
        </div>
        <p
          className="text-sm text-gray-400"
          style={{ fontFamily: "Rubik, sans-serif" }}
        >
          Найди свой редкий дроп
        </p>
      </div>

      <div className="px-4 mb-3 flex gap-2">
        {(["all", "available", "sold"] as const).map((v) => (
          <button
            key={v}
            onClick={() => setShowAvail(v)}
            className="px-3 py-1 text-xs transition-all"
            style={{
              fontFamily: "Rubik, sans-serif",
              background: showAvail === v ? "var(--mc-grass)" : "var(--mc-stone)",
              color: "#fff",
              boxShadow:
                showAvail === v
                  ? "inset -2px -2px 0 rgba(0,0,0,0.4), inset 2px 2px 0 rgba(255,255,255,0.2)"
                  : "inset -2px -2px 0 rgba(0,0,0,0.5)",
            }}
          >
            {v === "all" ? "Все" : v === "available" ? "✅ В наличии" : "❌ Продано"}
          </button>
        ))}
      </div>

      <div className="px-4 mb-4 flex gap-2 overflow-x-auto pb-1">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className="whitespace-nowrap px-3 py-2 font-pixel transition-all"
            style={{
              fontSize: "9px",
              background:
                filter === cat ? "var(--mc-grass)" : "var(--mc-panel)",
              color: filter === cat ? "#fff" : "#aaa",
              border: `2px solid ${
                filter === cat ? "var(--mc-grass)" : "var(--mc-border)"
              }`,
              boxShadow:
                filter === cat
                  ? "inset -2px -2px 0 rgba(0,0,0,0.4), inset 2px 2px 0 rgba(255,255,255,0.2)"
                  : "none",
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="px-4 grid grid-cols-2 gap-3">
        {filtered.map((product, i) => (
          <button
            key={product.id}
            onClick={(e) => handleCardClick(e, product)}
            className="text-left relative overflow-hidden animate-fade-in"
            style={{
              animationDelay: `${i * 0.07}s`,
              background: "var(--mc-panel)",
              border: `3px solid ${RARITY_COLORS[product.rarity]}55`,
              boxShadow:
                "inset -3px -3px 0 rgba(0,0,0,0.4), inset 2px 2px 0 rgba(255,255,255,0.05)",
              opacity: product.available ? 1 : 0.65,
            }}
          >
            <div
              style={{
                height: 3,
                background: RARITY_COLORS[product.rarity],
              }}
            />
            <div className="relative">
              <img
                src={product.img}
                alt={product.name}
                className="w-full h-28 object-cover"
              />
              {!product.available && (
                <div
                  className="absolute inset-0 flex items-center justify-center"
                  style={{ background: "rgba(0,0,0,0.6)" }}
                >
                  <span
                    className="font-pixel text-red-400"
                    style={{ fontSize: "9px" }}
                  >
                    ПРОДАНО
                  </span>
                </div>
              )}
              {product.available && (
                <div
                  className="absolute top-1 right-1 px-1 py-0.5 text-xs"
                  style={{
                    fontFamily: "Rubik, sans-serif",
                    background: "rgba(0,0,0,0.75)",
                    color: "var(--mc-grass)",
                    border: "1px solid var(--mc-grass)",
                  }}
                >
                  −{Math.round((1 - product.price / product.oldPrice) * 100)}%
                </div>
              )}
            </div>
            <div className="p-2">
              <p
                className="text-xs text-white font-semibold leading-tight truncate"
                style={{ fontFamily: "Rubik, sans-serif" }}
              >
                {product.name}
              </p>
              <p
                className="text-xs mt-0.5"
                style={{ fontFamily: "Rubik, sans-serif", color: "#888" }}
              >
                {product.size} · {product.category}
              </p>
              {product.available ? (
                <p
                  className="font-pixel mt-1"
                  style={{ color: "var(--mc-gold)", fontSize: "10px" }}
                >
                  {product.price}₽
                </p>
              ) : (
                <p
                  className="font-pixel mt-1 text-red-400"
                  style={{ fontSize: "10px" }}
                >
                  —
                </p>
              )}
            </div>
          </button>
        ))}
      </div>

      {selected && (
        <ProductModal
          product={selected}
          onClose={() => setSelected(null)}
          onAddToCart={(p) => {
            onAddToCart(p);
            showNotif(`${p.name} добавлен в корзину!`, "🛒");
          }}
        />
      )}
    </div>
  );
}

// ─── РАЗДЕЛ: ИГРА ─────────────────────────────────────────────────────────

const BLOCK_TYPES = [
  { type: "grass", color: "#5DA832", hp: 1, coins: 1, emoji: "🟩" },
  { type: "dirt", color: "#8B6340", hp: 2, coins: 2, emoji: "🟫" },
  { type: "stone", color: "#7B7B7B", hp: 3, coins: 3, emoji: "⬜" },
  { type: "gold", color: "#FFD700", hp: 4, coins: 8, emoji: "🟨" },
  { type: "diamond", color: "#5DE8E8", hp: 5, coins: 15, emoji: "💎" },
];

interface Block {
  id: number;
  type: (typeof BLOCK_TYPES)[0];
  hp: number;
  maxHp: number;
  cracked: number;
  col: number;
  row: number;
}

const COLS = 5;
const ROWS = 4;

function generateGrid(): Block[] {
  const blocks: Block[] = [];
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      const typeIdx = Math.min(
        Math.floor(Math.random() * (row + 1) * 1.4),
        BLOCK_TYPES.length - 1
      );
      const t = BLOCK_TYPES[typeIdx];
      blocks.push({
        id: row * COLS + col,
        type: t,
        hp: t.hp,
        maxHp: t.hp,
        cracked: 0,
        col,
        row,
      });
    }
  }
  return blocks;
}

function GameTab({
  coins,
  onCoinsChange,
  showNotif,
}: {
  coins: number;
  onCoinsChange: (delta: number) => void;
  showNotif: (text: string, icon: string) => void;
}) {
  const [blocks, setBlocks] = useState<Block[]>(generateGrid);
  const [hitting, setHitting] = useState<number | null>(null);
  const [level, setLevel] = useState(1);
  const [totalMined, setTotalMined] = useState(0);
  const [shake, setShake] = useState<number | null>(null);
  const [combo, setCombo] = useState(0);
  const [lastComboTime, setLastComboTime] = useState(0);

  const handleHit = useCallback(
    (block: Block) => {
      const now = Date.now();
      const newCombo = now - lastComboTime < 1500 ? combo + 1 : 1;
      setCombo(newCombo);
      setLastComboTime(now);
      setHitting(block.id);
      setShake(block.id);
      setTimeout(() => setHitting(null), 150);
      setTimeout(() => setShake(null), 280);

      setBlocks((prev) => {
        const updated = prev.map((b) => {
          if (b.id !== block.id) return b;
          const newHp = b.hp - 1;
          if (newHp <= 0) {
            const earned = b.type.coins * (newCombo >= 3 ? 2 : 1);
            onCoinsChange(earned);
            setTotalMined((t) => t + 1);
            if (newCombo >= 3)
              showNotif(`КОМБО x${newCombo}! +${earned} монет`, "⚡");
            else showNotif(`+${earned} монет за ${b.type.type}`, b.type.emoji);
            return null as unknown as Block;
          }
          return { ...b, hp: newHp, cracked: 1 - newHp / b.maxHp };
        });
        return updated.filter(Boolean);
      });
    },
    [combo, lastComboTime, onCoinsChange, showNotif]
  );

  useEffect(() => {
    if (blocks.length === 0) {
      setTimeout(() => {
        setBlocks(generateGrid());
        setLevel((l) => l + 1);
        showNotif(`Уровень ${level + 1}! Новые блоки появились!`, "🎮");
      }, 700);
    }
  }, [blocks.length, level, showNotif]);

  const xpProgress = (totalMined % 20) / 20;

  return (
    <div className="pb-24 px-4">
      <div className="pt-5 pb-4">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <span className="text-xl">⛏️</span>
            <h1 className="font-pixel text-white" style={{ fontSize: "13px" }}>
              МАЙНКРАФТ
            </h1>
          </div>
          <div
            className="flex items-center gap-2 px-3 py-2"
            style={{
              background: "var(--mc-panel)",
              border: "2px solid var(--mc-gold)",
            }}
          >
            <span className="text-base">🪙</span>
            <span
              className="font-pixel text-sm"
              style={{ color: "var(--mc-gold)" }}
            >
              {coins}
            </span>
          </div>
        </div>
        <p
          className="text-xs text-gray-400"
          style={{ fontFamily: "Rubik, sans-serif" }}
        >
          Кликай по блокам — получай монеты для скидок
        </p>
      </div>

      <div
        className="mb-4 p-3"
        style={{
          background: "var(--mc-panel)",
          border: "3px solid var(--mc-border)",
          boxShadow: "inset -3px -3px 0 rgba(0,0,0,0.4)",
        }}
      >
        <div className="flex justify-between items-center mb-2">
          <span className="font-pixel text-white" style={{ fontSize: "9px" }}>
            Уровень {level}
          </span>
          <span
            className="text-xs text-gray-400"
            style={{ fontFamily: "Rubik, sans-serif" }}
          >
            {totalMined % 20}/20 блоков
          </span>
        </div>
        <div
          className="h-3 relative"
          style={{
            background: "#1a1a1a",
            border: "2px solid rgba(0,0,0,0.5)",
          }}
        >
          <div
            className="h-full transition-all duration-300"
            style={{
              width: `${xpProgress * 100}%`,
              background: "var(--mc-grass)",
            }}
          />
        </div>
      </div>

      {combo >= 2 && (
        <div className="mb-3 text-center animate-scale-in">
          <span
            className="font-pixel"
            style={{
              fontSize: "10px",
              color: combo >= 5 ? "var(--mc-gold)" : "#5DE8E8",
            }}
          >
            ⚡ КОМБО x{combo} {combo >= 5 ? "МЕГА!" : ""}
          </span>
        </div>
      )}

      <div
        className="grid gap-1.5"
        style={{ gridTemplateColumns: `repeat(${COLS}, 1fr)` }}
      >
        {blocks.map((block) => (
          <button
            key={block.id}
            onClick={() => handleHit(block)}
            className="aspect-square relative overflow-hidden transition-transform"
            style={{
              background: block.type.color,
              boxShadow:
                "inset -3px -3px 0 rgba(0,0,0,0.4), inset 3px 3px 0 rgba(255,255,255,0.2)",
              transform: shake === block.id ? "scale(0.9)" : "scale(1)",
              imageRendering: "pixelated",
            }}
          >
            {block.cracked > 0 && (
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  opacity: block.cracked,
                  background: `repeating-linear-gradient(45deg, rgba(0,0,0,0.35), rgba(0,0,0,0.35) 2px, transparent 2px, transparent 6px)`,
                }}
              />
            )}
            <span className="text-xl select-none">{block.type.emoji}</span>
            <div className="absolute bottom-0.5 left-0 right-0 flex justify-center gap-0.5">
              {Array.from({ length: block.maxHp }).map((_, i) => (
                <div
                  key={i}
                  className="w-1 h-1"
                  style={{
                    background:
                      i < block.hp ? "#fff" : "rgba(255,255,255,0.2)",
                  }}
                />
              ))}
            </div>
          </button>
        ))}
      </div>

      {blocks.length === 0 && (
        <div className="text-center py-8 animate-fade-in">
          <p className="font-pixel text-white mb-2" style={{ fontSize: "10px" }}>
            ВСЕ БЛОКИ СЛОМАНЫ!
          </p>
          <p
            className="text-sm text-gray-400"
            style={{ fontFamily: "Rubik, sans-serif" }}
          >
            Загрузка следующего уровня...
          </p>
        </div>
      )}

      <div
        className="mt-4 p-3"
        style={{
          background: "var(--mc-panel)",
          border: "2px solid var(--mc-border)",
        }}
      >
        <p
          className="font-pixel text-gray-400 mb-2"
          style={{ fontSize: "8px" }}
        >
          ЛЕГЕНДА БЛОКОВ:
        </p>
        <div className="grid grid-cols-5 gap-1">
          {BLOCK_TYPES.map((bt) => (
            <div key={bt.type} className="flex flex-col items-center gap-1">
              <div
                className="w-7 h-7 flex items-center justify-center text-sm"
                style={{
                  background: bt.color,
                  boxShadow: "inset -2px -2px 0 rgba(0,0,0,0.4)",
                }}
              >
                {bt.emoji}
              </div>
              <span
                className="font-pixel"
                style={{ color: "var(--mc-gold)", fontSize: "7px" }}
              >
                +{bt.coins}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── РАЗДЕЛ: КОРЗИНА ───────────────────────────────────────────────────────

function CartTab({
  cart,
  onRemove,
  showNotif,
}: {
  cart: Product[];
  onRemove: (id: number) => void;
  showNotif: (text: string, icon: string) => void;
}) {
  const total = cart.reduce((s, p) => s + p.price, 0);
  const [ordered, setOrdered] = useState(false);

  function handleOrder() {
    if (cart.length === 0) return;
    setOrdered(true);
    showNotif("Заказ отправлен! Мы свяжемся с вами 📬", "✅");
    setTimeout(() => setOrdered(false), 3000);
  }

  if (cart.length === 0) {
    return (
      <div className="pb-24 px-4 flex flex-col items-center justify-center min-h-[60vh]">
        <div className="mc-float text-6xl mb-4">🛒</div>
        <p
          className="font-pixel text-white text-center mb-2"
          style={{ fontSize: "11px" }}
        >
          КОРЗИНА ПУСТА
        </p>
        <p
          className="text-sm text-gray-400 text-center"
          style={{ fontFamily: "Rubik, sans-serif" }}
        >
          Добавь товары из каталога
        </p>
      </div>
    );
  }

  return (
    <div className="pb-24">
      <div className="px-4 pt-5 pb-4">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xl">🛒</span>
          <h1 className="font-pixel text-white" style={{ fontSize: "13px" }}>
            КОРЗИНА
          </h1>
        </div>
        <p
          className="text-xs text-gray-400"
          style={{ fontFamily: "Rubik, sans-serif" }}
        >
          {cart.length} товара
        </p>
      </div>

      <div className="px-4 space-y-3">
        {cart.map((p) => (
          <div
            key={p.id}
            className="flex gap-3 p-3 animate-fade-in"
            style={{
              background: "var(--mc-panel)",
              border: `3px solid ${RARITY_COLORS[p.rarity]}55`,
              boxShadow: "inset -3px -3px 0 rgba(0,0,0,0.4)",
            }}
          >
            <div
              style={{
                width: 3,
                background: RARITY_COLORS[p.rarity],
                flexShrink: 0,
              }}
            />
            <img
              src={p.img}
              alt={p.name}
              className="w-16 h-16 object-cover flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <p
                className="text-sm text-white font-semibold truncate"
                style={{ fontFamily: "Rubik, sans-serif" }}
              >
                {p.name}
              </p>
              <p
                className="text-xs text-gray-400"
                style={{ fontFamily: "Rubik, sans-serif" }}
              >
                {p.size} · {p.category}
              </p>
              <p
                className="font-pixel mt-1"
                style={{ color: "var(--mc-gold)", fontSize: "11px" }}
              >
                {p.price} ₽
              </p>
            </div>
            <button
              onClick={() => {
                onRemove(p.id);
                showNotif("Убрано из корзины", "🗑️");
              }}
              className="text-gray-500 hover:text-red-400 transition-colors self-start pt-1"
            >
              <Icon name="X" size={16} />
            </button>
          </div>
        ))}
      </div>

      <div
        className="mx-4 mt-4 p-4"
        style={{
          background: "var(--mc-panel)",
          border: "3px solid var(--mc-border)",
          boxShadow: "inset -3px -3px 0 rgba(0,0,0,0.4)",
        }}
      >
        <div className="flex justify-between items-center mb-3">
          <span
            className="text-sm text-gray-300"
            style={{ fontFamily: "Rubik, sans-serif" }}
          >
            Итого:
          </span>
          <span
            className="font-pixel text-base"
            style={{ color: "var(--mc-gold)" }}
          >
            {total} ₽
          </span>
        </div>
        <button
          onClick={handleOrder}
          className="mc-btn w-full text-center"
          style={{
            background: ordered ? "#2a4a2a" : "var(--mc-grass)",
            fontSize: "9px",
            padding: "12px",
          }}
        >
          {ordered ? "✅ ЗАКАЗ ОФОРМЛЕН!" : "⚡ ОФОРМИТЬ ЗАКАЗ"}
        </button>
      </div>
    </div>
  );
}

// ─── РАЗДЕЛ: ПРОФИЛЬ ───────────────────────────────────────────────────────

const ACHIEVEMENTS = [
  {
    id: 1,
    icon: "🛒",
    name: "Первая покупка",
    desc: "Добавь товар в корзину",
    unlocked: true,
  },
  {
    id: 2,
    icon: "⛏️",
    name: "Шахтёр",
    desc: "Сломай 10 блоков",
    unlocked: true,
  },
  {
    id: 3,
    icon: "💎",
    name: "Нашёл алмаз",
    desc: "Сломай алмазный блок",
    unlocked: false,
  },
  {
    id: 4,
    icon: "🎮",
    name: "Геймер",
    desc: "Дойди до 5 уровня",
    unlocked: false,
  },
  {
    id: 5,
    icon: "👑",
    name: "Легенда",
    desc: "Набери 500 монет",
    unlocked: false,
  },
  {
    id: 6,
    icon: "🔥",
    name: "Комбо x5",
    desc: "Попади в серию из 5",
    unlocked: false,
  },
];

function ProfileTab({ coins }: { coins: number }) {
  const level = Math.floor(coins / 50) + 1;
  const xp = (coins % 50) / 50;
  const rank = level < 5 ? "Новичок" : level < 10 ? "Шахтёр" : "Мастер";

  return (
    <div className="pb-24 px-4">
      <div className="pt-5 pb-4">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xl">👤</span>
          <h1 className="font-pixel text-white" style={{ fontSize: "13px" }}>
            ПРОФИЛЬ
          </h1>
        </div>
      </div>

      <div
        className="p-4 mb-4"
        style={{
          background: "var(--mc-panel)",
          border: "3px solid var(--mc-border)",
          boxShadow: "inset -3px -3px 0 rgba(0,0,0,0.4)",
        }}
      >
        <div className="flex items-center gap-4">
          <div
            className="w-16 h-16 mc-float flex items-center justify-center text-4xl"
            style={{
              background: "var(--mc-dirt)",
              boxShadow:
                "inset -4px -4px 0 rgba(0,0,0,0.4), inset 4px 4px 0 rgba(255,255,255,0.15)",
            }}
          >
            🧑
          </div>
          <div className="flex-1">
            <p className="font-pixel text-white mb-1" style={{ fontSize: "10px" }}>
              Игрок #1
            </p>
            <div className="flex items-center gap-2 mb-2">
              <span
                className="text-xs px-2 py-0.5"
                style={{
                  fontFamily: "Rubik, sans-serif",
                  background: "var(--mc-grass)",
                  color: "#fff",
                }}
              >
                {rank}
              </span>
              <span className="font-pixel" style={{ color: "var(--mc-gold)", fontSize: "9px" }}>
                Ур. {level}
              </span>
            </div>
            <div className="flex gap-4">
              <div>
                <p className="font-pixel text-sm" style={{ color: "var(--mc-gold)" }}>
                  {coins}
                </p>
                <p
                  className="text-xs text-gray-400"
                  style={{ fontFamily: "Rubik, sans-serif" }}
                >
                  монет
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-3">
          <div className="flex justify-between mb-1">
            <span
              className="text-xs text-gray-400"
              style={{ fontFamily: "Rubik, sans-serif" }}
            >
              До следующего уровня
            </span>
            <span className="font-pixel" style={{ color: "var(--mc-gold)", fontSize: "8px" }}>
              {Math.round(xp * 50)}/50 XP
            </span>
          </div>
          <div
            className="h-3"
            style={{
              background: "#1a1a1a",
              border: "2px solid rgba(0,0,0,0.5)",
            }}
          >
            <div
              className="h-full transition-all duration-1000"
              style={{ width: `${xp * 100}%`, background: "var(--mc-gold)" }}
            />
          </div>
        </div>
      </div>

      <h2 className="font-pixel text-white mb-3" style={{ fontSize: "10px" }}>
        🏆 ДОСТИЖЕНИЯ
      </h2>
      <div className="grid grid-cols-2 gap-2">
        {ACHIEVEMENTS.map((a) => (
          <div
            key={a.id}
            className="p-3 flex items-start gap-2"
            style={{
              background: a.unlocked ? "var(--mc-panel)" : "#1a1a1a",
              border: `2px solid ${a.unlocked ? "var(--mc-grass)" : "var(--mc-border)"}`,
              boxShadow: a.unlocked
                ? "inset -2px -2px 0 rgba(0,0,0,0.4)"
                : "none",
              opacity: a.unlocked ? 1 : 0.5,
            }}
          >
            <span className="text-xl">{a.icon}</span>
            <div>
              <p
                className="text-xs font-semibold text-white leading-tight"
                style={{ fontFamily: "Rubik, sans-serif" }}
              >
                {a.name}
              </p>
              <p
                className="text-xs text-gray-500 leading-tight mt-0.5"
                style={{ fontFamily: "Rubik, sans-serif" }}
              >
                {a.desc}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div
        className="mt-4 p-3"
        style={{
          background: "#2a1a00",
          border: "3px solid var(--mc-gold)",
          boxShadow: "inset -3px -3px 0 rgba(0,0,0,0.4)",
        }}
      >
        <div className="flex items-center gap-2">
          <span className="text-xl">💡</span>
          <p
            className="text-xs text-gray-300"
            style={{ fontFamily: "Rubik, sans-serif" }}
          >
            Зарабатывай монеты в игре — скоро их можно будет тратить на
            скидки в магазине!
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── НИЖНЯЯ НАВИГАЦИЯ ──────────────────────────────────────────────────────

function BottomNav({
  tab,
  setTab,
  cartCount,
}: {
  tab: string;
  setTab: (t: string) => void;
  cartCount: number;
}) {
  const tabs = [
    { id: "shop", icon: "🏪", label: "Магазин" },
    { id: "game", icon: "⛏️", label: "Игра" },
    { id: "cart", icon: "🛒", label: "Корзина", badge: cartCount },
    { id: "profile", icon: "👤", label: "Профиль" },
  ];

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-20 flex max-w-md mx-auto"
      style={{
        background: "var(--mc-dark)",
        borderTop: "4px solid var(--mc-border)",
        boxShadow: "0 -4px 24px rgba(0,0,0,0.7)",
        left: "50%",
        transform: "translateX(-50%)",
        width: "100%",
      }}
    >
      {tabs.map((t) => (
        <button
          key={t.id}
          onClick={() => setTab(t.id)}
          className="flex-1 flex flex-col items-center py-3 gap-1 relative transition-all"
          style={{
            background: tab === t.id ? "var(--mc-grass)" : "transparent",
            boxShadow:
              tab === t.id
                ? "inset -3px -3px 0 rgba(0,0,0,0.4), inset 3px 3px 0 rgba(255,255,255,0.15)"
                : "none",
          }}
        >
          <span className="text-xl">{t.icon}</span>
          <span
            className="text-xs"
            style={{
              fontFamily: "Rubik, sans-serif",
              color: tab === t.id ? "#fff" : "#888",
            }}
          >
            {t.label}
          </span>
          {t.badge !== undefined && t.badge > 0 && (
            <div
              className="absolute top-2 right-3 w-5 h-5 flex items-center justify-center notif-badge"
              style={{
                background: "#e53e3e",
                border: "2px solid var(--mc-dark)",
                fontFamily: "'Press Start 2P', monospace",
                fontSize: "8px",
                color: "#fff",
              }}
            >
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
  const particleCounter = useRef(0);
  const notifCounter = useRef(0);

  function showNotif(text: string, icon: string) {
    const id = ++notifCounter.current;
    setNotifs((prev) => [...prev, { id, text, icon }]);
    setTimeout(() => setNotifs((prev) => prev.filter((n) => n.id !== id)), 2800);
  }

  function spawnParticles(x: number, y: number, color: string) {
    const newParticles: Particle[] = Array.from({ length: 12 }, () => ({
      id: ++particleCounter.current,
      x,
      y,
      tx: randomBetween(-130, 130),
      ty: randomBetween(-150, 50),
      tr: randomBetween(-200, 200),
      color,
      size: randomBetween(8, 22),
    }));
    setParticles((prev) => [...prev, ...newParticles]);
    setTimeout(
      () =>
        setParticles((prev) =>
          prev.filter((p) => !newParticles.find((n) => n.id === p.id))
        ),
      700
    );
  }

  function addToCart(product: Product) {
    setCart((prev) => [...prev, { ...product, id: product.id + Date.now() }]);
  }

  function removeFromCart(id: number) {
    setCart((prev) => prev.filter((p) => p.id !== id));
  }

  function addCoins(delta: number) {
    setCoins((c) => c + delta);
  }

  return (
    <div
      className="max-w-md mx-auto min-h-screen relative overflow-hidden"
      style={{ background: "var(--mc-bg)" }}
    >
      <CubeParticles particles={particles} />
      <NotifToast notifs={notifs} />

      {tab === "shop" && (
        <ShopTab
          onAddToCart={addToCart}
          onSpawnParticles={spawnParticles}
          showNotif={showNotif}
        />
      )}
      {tab === "game" && (
        <GameTab
          coins={coins}
          onCoinsChange={addCoins}
          showNotif={showNotif}
        />
      )}
      {tab === "cart" && (
        <CartTab cart={cart} onRemove={removeFromCart} showNotif={showNotif} />
      )}
      {tab === "profile" && <ProfileTab coins={coins} />}

      <BottomNav tab={tab} setTab={setTab} cartCount={cart.length} />
    </div>
  );
}
