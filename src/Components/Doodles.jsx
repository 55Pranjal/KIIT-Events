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

function OpenBook({ delay = 0.3 }) {
  return (
    <g>
      <path
        className="dk"
        style={{ strokeWidth: 2, animationDelay: `${delay}s` }}
        d="M calc(100% - 130px) 47% C calc(100% - 110px) 43%, calc(100% - 85px) 43%, calc(100% - 78px) 47% L calc(100% - 78px) 62% C calc(100% - 85px) 58%, calc(100% - 110px) 58%, calc(100% - 130px) 62% Z"
      />
      <path
        className="dk"
        style={{ strokeWidth: 2, animationDelay: `${delay + 0.05}s` }}
        d="M calc(100% - 78px) 47% C calc(100% - 71px) 43%, calc(100% - 46px) 43%, calc(100% - 26px) 47% L calc(100% - 26px) 62% C calc(100% - 46px) 58%, calc(100% - 71px) 58%, calc(100% - 78px) 62% Z"
      />
      <line className="dk" style={{ strokeWidth: 2, animationDelay: `${delay + 0.08}s` }} x1="calc(100% - 78px)" y1="47%" x2="calc(100% - 78px)" y2="62%" />
      {[50, 53, 56].map((yp, i) => (
        <line key={`l${i}`} className="dk" style={{ strokeWidth: 1, animationDelay: `${delay + 0.1 + i * 0.02}s` }}
          x1="calc(100% - 120px)" y1={`${yp}%`} x2={`calc(100% - ${88 + i * 2}px)`} y2={`${yp - 0.5}%`} />
      ))}
      {[49.5, 52.5, 55.5].map((yp, i) => (
        <line key={`r${i}`} className="dk" style={{ strokeWidth: 1, animationDelay: `${delay + 0.1 + i * 0.02}s` }}
          x1="calc(100% - 68px)" y1={`${yp}%`} x2={`calc(100% - ${36 + i * 2}px)`} y2={`${yp + 0.5}%`} />
      ))}
    </g>
  );
}

function CodeBrackets({ delay = 0.45 }) {
  return (
    <g transform="translate(30 0)">
      <polyline className="dk" style={{ strokeWidth: 2.2, animationDelay: `${delay}s` }} points="20,84% 10,87% 20,90%" />
      <polyline className="dk" style={{ strokeWidth: 2.2, animationDelay: `${delay + 0.03}s` }} points="46,84% 56,87% 46,90%" />
      <line className="dk" style={{ strokeWidth: 1.8, animationDelay: `${delay + 0.05}s` }} x1="28" y1="91%" x2="38" y2="83%" />
    </g>
  );
}

function DottedWave({ delay = 0.55 }) {
  return (
    <path
      className="dk"
      style={{ strokeWidth: 1.4, strokeDasharray: "5 6", animationDelay: `${delay}s` }}
      d="M 140 92% Q 200 88% 260 92% Q 320 96% 380 92% Q 440 88% 500 92%"
    />
  );
}

function WifiSignal({ delay = 0.5 }) {
  return (
    <g>
      <path className="dk" style={{ strokeWidth: 2, animationDelay: `${delay}s` }} d="M calc(100% - 85px) 86% a 28 28 0 0 1 56 0" />
      <path className="dk" style={{ strokeWidth: 2, animationDelay: `${delay + 0.04}s` }} d="M calc(100% - 68px) 86% a 11 11 0 0 1 22 0" />
      <circle className="dkf" style={{ strokeWidth: 1.8, animationDelay: `${delay + 0.08}s` }} cx="calc(100% - 57px)" cy="86%" r="3.5" />
    </g>
  );
}

// New: Graduation cap (campus theme)
function GradCap({ delay = 0.18, anchor = "right" }) {
  // Anchored top-right by default, ~50px from edge, y=46
  // Use a viewBox-friendly approach: render at fixed canvas pixels.
  const cx = anchor === "right" ? "calc(100% - 100px)" : "100";
  const cy = 50;
  return (
    <g>
      {/* mortarboard top diamond */}
      <polygon
        className="dkf"
        style={{ strokeWidth: 1.6, animationDelay: `${delay}s` }}
        points={`calc(${cx} - 18) ${cy}, ${cx} ${cy - 8}, calc(${cx} + 18) ${cy}, ${cx} ${cy + 8}`}
      />
      {/* base / cap */}
      <path
        className="dk"
        style={{ strokeWidth: 1.6, animationDelay: `${delay + 0.04}s` }}
        d={`M calc(${cx} - 11) ${cy + 4} L calc(${cx} - 11) ${cy + 10} Q ${cx} ${cy + 14} calc(${cx} + 11) ${cy + 10} L calc(${cx} + 11) ${cy + 4}`}
      />
      {/* tassel string */}
      <path
        className="dk"
        style={{ strokeWidth: 1.2, animationDelay: `${delay + 0.08}s` }}
        d={`M calc(${cx} + 18) ${cy} Q calc(${cx} + 22) ${cy + 6} calc(${cx} + 20) ${cy + 14}`}
      />
      {/* tassel ball */}
      <circle
        className="dkf"
        style={{ strokeWidth: 1.2, animationDelay: `${delay + 0.1}s` }}
        cx={`calc(${cx} + 20)`}
        cy={cy + 16}
        r="2.4"
      />
    </g>
  );
}

// New: Calendar with an event mark (events theme)
function CalendarMark({ delay = 0.32 }) {
  // mid-left, around x=40 y=46% (vertical %)
  const x = 40;
  const y = "46%";
  return (
    <g>
      {/* binder rings */}
      <line className="dk" style={{ strokeWidth: 1.6, animationDelay: `${delay}s` }} x1={x + 6} y1={y} x2={x + 6} y2={`calc(${y} - 6px)`} />
      <line className="dk" style={{ strokeWidth: 1.6, animationDelay: `${delay}s` }} x1={x + 22} y1={y} x2={x + 22} y2={`calc(${y} - 6px)`} />
      {/* outer box */}
      <rect
        className="dk"
        style={{ strokeWidth: 1.8, animationDelay: `${delay + 0.04}s` }}
        x={x} y={y} width="32" height="28" rx="2"
      />
      {/* header strip */}
      <line className="dk" style={{ strokeWidth: 1.4, animationDelay: `${delay + 0.06}s` }} x1={x} y1={`calc(${y} + 8px)`} x2={x + 32} y2={`calc(${y} + 8px)`} />
      {/* event dot */}
      <circle className="dkf" style={{ strokeWidth: 1.2, animationDelay: `${delay + 0.1}s` }} cx={x + 22} cy={`calc(${y} + 18px)`} r="2.5" />
      {/* date squares */}
      <line className="dk" style={{ strokeWidth: 0.9, animationDelay: `${delay + 0.12}s`, opacity: 0.7 }} x1={x + 5} y1={`calc(${y} + 16px)`} x2={x + 11} y2={`calc(${y} + 16px)`} />
      <line className="dk" style={{ strokeWidth: 0.9, animationDelay: `${delay + 0.13}s`, opacity: 0.7 }} x1={x + 13} y1={`calc(${y} + 16px)`} x2={x + 19} y2={`calc(${y} + 16px)`} />
      <line className="dk" style={{ strokeWidth: 0.9, animationDelay: `${delay + 0.14}s`, opacity: 0.7 }} x1={x + 5} y1={`calc(${y} + 22px)`} x2={x + 11} y2={`calc(${y} + 22px)`} />
      <line className="dk" style={{ strokeWidth: 0.9, animationDelay: `${delay + 0.15}s`, opacity: 0.7 }} x1={x + 13} y1={`calc(${y} + 22px)`} x2={x + 19} y2={`calc(${y} + 22px)`} />
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
      <OpenBook />
      <CodeBrackets />
      <DottedWave />
      <WifiSignal />
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
  // Single corner accent — graduation cap top-right with a few sparkles.
  const sparkles = [
    ["calc(100% - 32px)", 20],
    ["calc(100% - 14px)", 38],
    ["calc(100% - 60px)", 78],
  ];
  return (
    <>
      <GradCap delay={0.12} />
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
  OpenBook,
  CodeBrackets,
  DottedWave,
  WifiSignal,
  GradCap,
  CalendarMark,
  Dots,
};
