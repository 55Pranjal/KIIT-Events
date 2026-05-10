// Skeleton placeholders. All elements use the `animate-pulse` Tailwind utility
// so a parent can wrap children once and they'll shimmer in unison.

const BASE = "bg-[#f0f0eb] rounded";

export function SkeletonLine({ width = "w-full", height = "h-3", className = "" }) {
  return <div className={`${BASE} ${height} ${width} ${className}`} />;
}

export function SkeletonText({ lines = 3, className = "" }) {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <SkeletonLine
          key={i}
          width={i === lines - 1 ? "w-2/3" : "w-full"}
        />
      ))}
    </div>
  );
}

export function SkeletonBlock({ className = "h-40 w-full" }) {
  return <div className={`${BASE} ${className}`} />;
}

// Card matching the shape of an event card (image + title + meta + footer).
export function SkeletonCard() {
  return (
    <div className="bg-white border border-[#e5e5e5] rounded-xl overflow-hidden flex flex-col animate-pulse">
      <div className="w-full h-40 bg-[#f0f0eb]" />
      <div className="p-4 flex flex-col flex-1 gap-2.5">
        <SkeletonLine width="w-4/5" height="h-4" />
        <SkeletonLine width="w-2/3" />
        <div className="space-y-1.5 mt-2">
          <SkeletonLine width="w-1/2" height="h-2.5" />
          <SkeletonLine width="w-1/3" height="h-2.5" />
        </div>
        <div className="mt-auto pt-3 border-t border-[#eee] flex items-center justify-between gap-2">
          <SkeletonLine width="w-16" height="h-5" />
          <SkeletonLine width="w-20" height="h-7" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonGrid({
  count = 8,
  className = "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6",
}) {
  return (
    <div className={className}>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

// List row used by listing pages (Announcements, Notifications, Registrations).
export function SkeletonListRow() {
  return (
    <div className="bg-white border border-[#e5e5e5] rounded-xl p-5 animate-pulse">
      <SkeletonLine width="w-1/3" height="h-4" className="mb-2" />
      <SkeletonText lines={2} />
    </div>
  );
}

export function SkeletonList({ count = 4, className = "flex flex-col gap-3" }) {
  return (
    <div className={className}>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonListRow key={i} />
      ))}
    </div>
  );
}

// Detail-page skeleton: hero image + title + meta grid + body
export function SkeletonDetail() {
  return (
    <div className="max-w-4xl w-full mx-auto bg-white border border-[#e5e5e5] rounded-2xl shadow-sm overflow-hidden animate-pulse">
      <div className="w-full h-56 sm:h-72 md:h-80 bg-[#f0f0eb]" />
      <div className="p-6 sm:p-8 flex flex-col gap-5">
        <div className="flex items-start justify-between gap-3">
          <SkeletonLine width="w-2/3" height="h-7" />
          <SkeletonLine width="w-16" height="h-5" />
        </div>
        <SkeletonText lines={3} />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="space-y-1.5">
              <SkeletonLine width="w-16" height="h-2.5" />
              <SkeletonLine width="w-3/4" height="h-4" />
            </div>
          ))}
        </div>
        <SkeletonLine width="w-32" height="h-10" className="mt-2" />
      </div>
    </div>
  );
}

// Profile-card skeleton (Dashboard top section).
export function SkeletonProfileCard() {
  return (
    <div className="bg-white border border-[#e5e5e5] rounded-2xl shadow-sm p-6 sm:p-8 animate-pulse">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div className="space-y-2">
          <SkeletonLine width="w-40" height="h-7" />
          <SkeletonLine width="w-56" height="h-3" />
        </div>
        <SkeletonLine width="w-20" height="h-6" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-[#f7faf8] border border-[#eeeeea] rounded-lg px-4 py-3 space-y-1.5"
          >
            <SkeletonLine width="w-16" height="h-2.5" />
            <SkeletonLine width="w-3/4" height="h-4" />
          </div>
        ))}
      </div>
      <div className="flex flex-wrap gap-3 mt-8">
        {[0, 1, 2].map((i) => (
          <SkeletonLine key={i} width="w-32" height="h-10" />
        ))}
      </div>
    </div>
  );
}
