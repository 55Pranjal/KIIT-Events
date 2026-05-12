// Friendly date/time formatting for events.
//
// Backend may store `event.date` as either a plain "YYYY-MM-DD" string (from
// the <input type="date"> form) or as a full ISO timestamp like
// "2026-03-05T00:00:00.000Z" (depending on Mongoose schema). `event.time` is
// usually "HH:MM" or "HH:MM:SS". These helpers cope with both shapes.
//
// Timezone convention: event date/time are venue-local (IST for KIIT). The
// `getEventStart` helper builds the Date with an explicit +05:30 offset so
// it produces the same absolute UTC moment that the backend produces — that
// way client/server comparisons agree regardless of where each runs.

const EVENT_TZ_OFFSET = "+05:30";

/**
 * Build a Date for an event's start moment, interpreting `date` and `time`
 * as IST wall-clock. Returns null on malformed input.
 *
 * Mirrors server/utils/eventDate.js — keep the two in sync.
 */
export function getEventStart(date, time) {
  if (!date) return null;
  const dateMatch = String(date).match(/^(\d{4}-\d{2}-\d{2})/);
  if (!dateMatch) return null;
  const t = time && /^\d{1,2}:\d{2}/.test(String(time))
    ? String(time)
    : "00:00";
  const d = new Date(`${dateMatch[1]}T${t}${EVENT_TZ_OFFSET}`);
  return isNaN(d.getTime()) ? null : d;
}

function parseDateLocal(dateInput) {
  if (!dateInput) return null;
  const str = String(dateInput);

  // Match YYYY-MM-DD anywhere at the start (also handles ISO strings).
  // We construct the Date from explicit Y/M/D in *local* time so the day
  // never drifts because of UTC rollover.
  const match = str.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (match) {
    const [, y, m, d] = match;
    return new Date(
      parseInt(y, 10),
      parseInt(m, 10) - 1,
      parseInt(d, 10)
    );
  }

  // Fallback: hand over to the JS Date parser (handles numeric timestamps,
  // RFC 2822 strings, etc.). Returns null if it's still unparseable.
  const fallback = new Date(dateInput);
  return isNaN(fallback.getTime()) ? null : fallback;
}

function parseTimeLocal(timeInput) {
  if (!timeInput) return null;
  const str = String(timeInput);

  // Match "HH:MM" or "HH:MM:SS"
  const match = str.match(/^(\d{1,2}):(\d{2})(?::\d{2})?$/);
  if (match) {
    const [, hh, mm] = match;
    const d = new Date();
    d.setHours(parseInt(hh, 10), parseInt(mm, 10), 0, 0);
    return d;
  }

  // Fallback: maybe it's a full ISO string we can pull a time out of.
  const fallback = new Date(timeInput);
  return isNaN(fallback.getTime()) ? null : fallback;
}

export function formatEventDate(date) {
  const d = parseDateLocal(date);
  if (!d) return date ? String(date) : "";
  return d.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

export function formatEventTime(time) {
  const d = parseTimeLocal(time);
  if (!d) return time ? String(time) : "";
  return d.toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

export function formatEventDateTime(date, time) {
  const dateStr = formatEventDate(date);
  const timeStr = formatEventTime(time);
  if (dateStr && timeStr) return `${dateStr} • ${timeStr}`;
  return dateStr || timeStr || "";
}

export function formatRelativeDate(isoDate) {
  if (!isoDate) return "";
  const d = new Date(isoDate);
  if (isNaN(d.getTime())) return "";
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
