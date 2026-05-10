// Reusable empty-state card with icon, title, description, and optional CTA.
//
// Usage:
//   <EmptyState
//     icon={<CalendarIcon />}
//     title="No upcoming events"
//     description="Check back soon or browse past events below."
//     action={
//       <button onClick={...} className="...">View Past Events</button>
//     }
//   />

export default function EmptyState({
  icon,
  title,
  description,
  action,
  className = "",
}) {
  return (
    <div
      className={`bg-white border border-dashed border-[#e5e5e5] rounded-2xl p-10 sm:p-12 text-center ${className}`}
    >
      {icon && (
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 mb-4">
          {icon}
        </div>
      )}
      <p className="text-lg sm:text-xl font-semibold text-[#111]">{title}</p>
      {description && (
        <p className="text-sm text-gray-500 max-w-md mx-auto mt-1.5">
          {description}
        </p>
      )}
      {action && <div className="mt-5 flex flex-wrap gap-3 justify-center">{action}</div>}
    </div>
  );
}

// ── Inline icon set ──────────────────────────────────────
// Lucide-style outlined SVGs at 24x24, sized via parent container.
// Sized to 24x24 with currentColor so EmptyState's emerald-600 wash applies.

const iconProps = {
  xmlns: "http://www.w3.org/2000/svg",
  className: "w-7 h-7",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: "2",
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

export const CalendarIcon = () => (
  <svg {...iconProps}>
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

export const BellIcon = () => (
  <svg {...iconProps}>
    <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
    <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
  </svg>
);

export const InboxIcon = () => (
  <svg {...iconProps}>
    <polyline points="22 12 16 12 14 15 10 15 8 12 2 12" />
    <path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
  </svg>
);

export const MegaphoneIcon = () => (
  <svg {...iconProps}>
    <path d="m3 11 18-5v12L3 14v-3z" />
    <path d="M11.6 16.8a3 3 0 1 1-5.8-1.6" />
  </svg>
);

export const UsersIcon = () => (
  <svg {...iconProps}>
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

export const ChatIcon = () => (
  <svg {...iconProps}>
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

export const SearchIcon = () => (
  <svg {...iconProps}>
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

export const SparklesIcon = () => (
  <svg {...iconProps}>
    <path d="M12 3l1.5 5.5L19 10l-5.5 1.5L12 17l-1.5-5.5L5 10l5.5-1.5L12 3z" />
  </svg>
);
