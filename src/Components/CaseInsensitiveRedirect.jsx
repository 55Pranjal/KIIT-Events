import { Navigate, useLocation } from "react-router-dom";
import { useMemo } from "react";
import NotFound from "./NotFound";

/**
 * Last-resort fallback under `path="*"` that catches the case where a user
 * types `/dashboard` instead of `/Dashboard`. We match the incoming pathname
 * case-insensitively against our known canonical paths; on a hit, redirect
 * to the canonical form. Anything truly unknown falls through to NotFound.
 *
 * Why this isn't just lowercase-everything: existing links/bookmarks/share
 * URLs out in the wild use PascalCase. Canonicalising on the wrong side
 * would 301-loop or break inbound traffic.
 *
 * Dynamic segments (e.g. /events/:id) are handled by listing the static
 * prefix here and preserving the tail of the URL.
 */
const KNOWN_PATHS = [
  // Static routes
  "/loading",
  "/Login",
  "/SignUp",
  "/EventsPage",
  "/Upcoming",
  "/PastEvents",
  "/AnnouncementsList",
  "/Dashboard",
  "/EditProfile",
  "/Notifications",
  "/Contact",
  "/SocietyRequestForm",
  "/CreateEvent",
  "/CreateAnnouncements",
  "/EditSociety",
  "/RequestPage",
  "/AdminQueriesPage",
  "/SocietyDetails",
  "/CreateHighlights",
  "/privacy",
  // Dynamic prefixes (anything after gets preserved as-is)
  "/events",
  "/edit-event",
];

const CaseInsensitiveRedirect = () => {
  const location = useLocation();

  const canonical = useMemo(() => {
    const pathname = location.pathname;
    const lower = pathname.toLowerCase();

    for (const known of KNOWN_PATHS) {
      const knownLower = known.toLowerCase();
      if (lower === knownLower) {
        return known;
      }
      if (lower.startsWith(knownLower + "/")) {
        // Preserve everything after the matched prefix (incl. params).
        return known + pathname.slice(known.length);
      }
    }
    return null;
  }, [location.pathname]);

  if (canonical && canonical !== location.pathname) {
    return <Navigate to={canonical + location.search} replace />;
  }

  return <NotFound />;
};

export default CaseInsensitiveRedirect;
