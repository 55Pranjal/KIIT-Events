/**
 * Doodles — hand-drawn campus-themed SVG decorations.
 *
 * Renders absolute-positioned line illustrations inside any
 * relatively-positioned container. Three variants:
 *   - "hero":    full home-page spread (lightbulb, music, book, code, wifi…)
 *   - "corners": top-left + top-right accent only — for shorter page headers
 *   - "accent":  single corner accent — for empty states / small surfaces
 *
 * Usage:
 *   <div className="relative overflow-hidden">
 *     <Doodles variant="corners" />
 *     ...content...
 *   </div>
 */

const STROKE = "#86c9a2";
const FILL = "#c9ecd8";

const styleBlock = `
.dk { stroke:${STROKE}; fill:none; stroke-linecap:round; stroke-linejoin:round; opacity:0; animation:dkIn 0.7s ease forwards; }
.dkf { stroke:${STROKE}; fill:${FILL}; stroke-linecap:round; stroke-linejoin:round; opacity:0; animation:dkIn 0.7s ease forwards; }
@keyframes dkIn { from{opacity:0;transform:scale(.85)} to{opacity:1;transform:scale(1)} }
`;

// ──────────────────────────────────────────────────────────────
// Sub-icons. Each accepts an optional { delay, anchor } prop.
// `anchor` is "left" (default) or "right" — right uses calc(100% - X).
// ──────────────────────────────────────────────────────────────

function Lightbulb({ delay = 0.15, x = 72, y = 70 }) {
  // body, base lines, shine rays, plus a tiny filament squiggle inside
  return (
    <g>
      <path
        className="dk"
        style={{ strokeWidth: 2, animationDelay: `${delay}s` }}
        d={`M ${x} ${y} C ${x} ${y - 14} ${x + 20} ${y - 16} ${x + 20} ${y} C ${x + 20} ${y + 7} ${x + 15} ${y + 12} ${x + 15} ${y + 17} L ${x + 5} ${y + 17} C ${x + 5} ${y + 12} ${x} ${y + 7} ${x} ${y}Z`}
      />
      {/* filament */}
      <path
        className="dk"
        style={{ strokeWidth: 1, animationDelay: `${delay + 0.04}s`, opacity: 0.75 }}
        d={`M ${x + 5} ${y + 2} q 5 -4 10 0 t 5 0`}
      />
      <line
        className="dk"
        style={{ strokeWidth: 1.8, animationDelay: `${delay + 0.05}s` }}
        x1={x + 5} y1={y + 18} x2={x + 15} y2={y + 18}
      />
      <line
        className="dk"
        style={{ strokeWidth: 1.8, animationDelay: `${delay + 0.08}s` }}
        x1={x + 6} y1={y + 21} x2={x + 14} y2={y + 21}
      />
      {/* shine rays */}
      <line className="dk" style={{ strokeWidth: 1.4, animationDelay: `${delay + 0.11}s` }} x1={x + 10} y1={y - 10} x2={x + 10} y2={y - 17} />
      <line className="dk" style={{ strokeWidth: 1.4, animationDelay: `${delay + 0.13}s` }} x1={x - 4} y1={y - 6} x2={x - 9} y2={y - 11} />
      <line className="dk" style={{ strokeWidth: 1.4, animationDelay: `${delay + 0.13}s` }} x1={x + 24} y1={y - 6} x2={x + 29} y2={y - 11} />
      <line className="dk" style={{ strokeWidth: 1, animationDelay: `${delay + 0.15}s` }} x1={x - 9} y1={y + 2} x2={x - 15} y2={y + 2} />
      <line className="dk" style={{ strokeWidth: 1, animationDelay: `${delay + 0.15}s` }} x1={x + 29} y1={y + 2} x2={x + 35} y2={y + 2} />
    </g>
  );
}

function MusicNotes({ delay = 0.2, baseY = 70 }) {
  // baseY = y-coord of the lower (first) note's head.
  // All other y-values follow proportionally so the icon shifts up/down
  // as a unit. Default baseY=70 matches the original home-page placement.
  const o = baseY - 70; // offset
  return (
    <g>
      <ellipse
        className="dkf"
        style={{ strokeWidth: 1.8, animationDelay: `${delay}s` }}
        cx="calc(100% - 90px)" cy={70 + o} rx="8" ry="5.5"
        transform="rotate(-15,0,0)"
      />
      <line
        className="dk"
        style={{ strokeWidth: 2, animationDelay: `${delay + 0.02}s` }}
        x1="calc(100% - 82px)" y1={68 + o} x2="calc(100% - 82px)" y2={48 + o}
      />
      <ellipse
        className="dkf"
        style={{ strokeWidth: 1.8, animationDelay: `${delay + 0.08}s` }}
        cx="calc(100% - 68px)" cy={62 + o} rx="7" ry="5"
        transform="rotate(-15,0,0)"
      />
      <line
        className="dk"
        style={{ strokeWidth: 2, animationDelay: `${delay + 0.1}s` }}
        x1="calc(100% - 61px)" y1={60 + o} x2="calc(100% - 61px)" y2={42 + o}
      />
      <line
        className="dk"
        style={{ strokeWidth: 1.8, animationDelay: `${delay + 0.13}s` }}
        x1="calc(100% - 82px)" y1={48 + o} x2="calc(100% - 61px)" y2={42 + o}
      />
    </g>
  );
}

function StarBurst({ delay = 0.1 }) {
  const stars = [
    { x: "48%", y: 28, r: 6, d: delay },
    { x: "55%", y: 18, r: 4, d: delay + 0.08 },
    { x: "41%", y: 20, r: 4.5, d: delay + 0.12 },
    { x: "58%", y: 36, r: 3, d: delay + 0.18 },
  ];
  return (
    <g>
      {stars.map((s, i) => (
        <g key={i}>
          <line className="dk" style={{ strokeWidth: 1.4, animationDelay: `${s.d}s` }} x1={`calc(${s.x} - ${s.r}px)`} y1={s.y} x2={`calc(${s.x} + ${s.r}px)`} y2={s.y} />
          <line className="dk" style={{ strokeWidth: 1.4, animationDelay: `${s.d}s` }} x1={s.x} y1={s.y - s.r} x2={s.x} y2={s.y + s.r} />
          <line className="dk" style={{ strokeWidth: 1, animationDelay: `${s.d}s`, opacity: 0.6 }} x1={`calc(${s.x} - ${s.r * 0.7}px)`} y1={s.y - s.r * 0.7} x2={`calc(${s.x} + ${s.r * 0.7}px)`} y2={s.y + s.r * 0.7} />
          <line className="dk" style={{ strokeWidth: 1, animationDelay: `${s.d}s`, opacity: 0.6 }} x1={`calc(${s.x} + ${s.r * 0.7}px)`} y1={s.y - s.r * 0.7} x2={`calc(${s.x} - ${s.r * 0.7}px)`} y2={s.y + s.r * 0.7} />
        </g>
      ))}
    </g>
  );
}

function Pencil({ delay = 0.25 }) {
  return (
    <g transform="rotate(-28 50 230)">
      <rect className="dk" style={{ strokeWidth: 1.8, animationDelay: `${delay}s` }} x="44" y="205" width="14" height="38" rx="1.5" />
      <polygon className="dkf" style={{ strokeWidth: 1.5, animationDelay: `${delay + 0.02}s` }} points="44,243 58,243 51,256" />
      <line className="dk" style={{ strokeWidth: 1.4, animationDelay: `${delay + 0.04}s` }} x1="44" y1="213" x2="58" y2="213" />
      <line className="dk" style={{ strokeWidth: 1, animationDelay: `${delay + 0.06}s` }} x1="48" y1="205" x2="48" y2="213" />
      <line className="dk" style={{ strokeWidth: 1, animationDelay: `${delay + 0.06}s` }} x1="54" y1="205" x2="54" y2="213" />
      {/* tip dot */}
      <circle className="dk" style={{ strokeWidth: 1, animationDelay: `${delay + 0.08}s` }} cx="51" cy="254" r="0.8" />
    </g>
  );
}

// Reusable scattered dot cluster
function Dots({ positions = [], r = 2.5, baseDelay = 0.08 }) {
  return (
    <g>
      {positions.map(([x, y], i) => (
        <circle
          key={i}
          className="dkf"
          style={{ strokeWidth: 1, animationDelay: `${baseDelay + i * 0.05}s` }}
          cx={x}
          cy={y}
          r={r}
        />
      ))}
    </g>
  );
}

// ──────────────────────────────────────────────────────────────
// Variants
// ──────────────────────────────────────────────────────────────

function HeroLayout() {
  const tlDots = [
    [18, 24], [30, 16], [44, 30], [12, 42], [50, 20], [22, 50],
  ];
  const trDots = [
    ["calc(100% - 20px)", 18],
    ["calc(100% - 32px)", 10],
    ["calc(100% - 48px)", 24],
    ["calc(100% - 16px)", 34],
  ];
  const bottomDots = [
    [80, "93%"], [160, "96%"], [260, "91%"], [370, "94%"],
    ["calc(100% - 110px)", "92%"], ["calc(100% - 200px)", "96%"],
  ];
  return (
    <>
      <Lightbulb />
      <Dots positions={tlDots} r={2.8} />
      <StarBurst />
      <MusicNotes />
      <Dots positions={trDots} r={2.5} baseDelay={0.12} />
      <Pencil />
      <Dots positions={bottomDots} r={2.2} baseDelay={0.3} />
    </>
  );
}

function CornersLayout() {
  // Compact for short header bands (~80-180px tall).
  // Lightbulb tucked in top-left, music notes top-right — both shifted high
  // so they decorate above the heading text rather than overlapping it.
  const tlDots = [
    [18, 12],
    [34, 6],
    [10, 26],
    [44, 18],
  ];
  const trDots = [
    ["calc(100% - 16px)", 8],
    ["calc(100% - 32px)", 18],
    ["calc(100% - 22px)", 30],
  ];
  return (
    <>
      <Lightbulb x={32} y={20} delay={0.08} />
      <Dots positions={tlDots} r={2.2} baseDelay={0.05} />
      <MusicNotes delay={0.16} baseY={36} />
      <Dots positions={trDots} r={2} baseDelay={0.1} />
    </>
  );
}

function AccentLayout() {
  // Single corner accent — a few sparkles in the top-right.
  const sparkles = [
    ["calc(100% - 32px)", 20],
    ["calc(100% - 14px)", 38],
    ["calc(100% - 60px)", 78],
  ];
  return (
    <>
      <Dots positions={sparkles} r={2} baseDelay={0.1} />
    </>
  );
}

const VARIANTS = {
  hero: HeroLayout,
  corners: CornersLayout,
  accent: AccentLayout,
};

export default function Doodles({ variant = "corners", className = "" }) {
  const Layout = VARIANTS[variant] || CornersLayout;
  return (
    <svg
      className={`absolute inset-0 w-full h-full pointer-events-none select-none ${className}`}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <style>{styleBlock}</style>
      </defs>
      <Layout />
    </svg>
  );
}

// Named exports for advanced use cases (custom layouts on a one-off page).
export {
  Lightbulb,
  MusicNotes,
  StarBurst,
  Pencil,
  Dots,
};
