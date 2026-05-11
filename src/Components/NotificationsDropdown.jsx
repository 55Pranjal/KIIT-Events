import axios from "axios";
import { BellIcon } from "./EmptyState";

// Compact notifications panel that opens from the navbar bell. Shows the
// recent ~7 notifications with click-to-mark-read, plus a "View all" link
// that takes the user to the full /Notifications page for bulk actions.
//
// State (`notifications`) is owned by Navbar and passed down so the bell's
// unread badge stays in sync.

export default function NotificationsDropdown({
  notifications,
  setNotifications,
  onView,
  onClose,
}) {
  const recent = notifications.slice(0, 7);
  const unread = notifications.filter((n) => !n.isRead).length;
  const moreCount = Math.max(0, notifications.length - recent.length);

  const toggleRead = async (id, currentStatus, e) => {
    e?.stopPropagation();
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/api/notifications/${id}/read`,
        { isRead: !currentStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNotifications((prev) =>
        prev.map((n) =>
          n._id === id ? { ...n, isRead: !currentStatus } : n
        )
      );
    } catch (err) {
      console.error("[NotificationsDropdown] toggle failed", err);
    }
  };

  const markAllRead = async () => {
    const unreadIds = notifications.filter((n) => !n.isRead).map((n) => n._id);
    if (unreadIds.length === 0) return;
    try {
      const token = localStorage.getItem("token");
      // Optimistic update first, fire requests in parallel.
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      await Promise.all(
        unreadIds.map((id) =>
          axios.patch(
            `${import.meta.env.VITE_BACKEND_URL}/api/notifications/${id}/read`,
            { isRead: true },
            { headers: { Authorization: `Bearer ${token}` } }
          )
        )
      );
    } catch (err) {
      console.error("[NotificationsDropdown] mark-all failed", err);
    }
  };

  return (
    <>
      {/* Mobile backdrop — tap to dismiss. Desktop has no backdrop; the parent
         handles click-outside via document listener. */}
      <button
        type="button"
        onClick={onClose}
        aria-label="Close notifications"
        className="sm:hidden fixed inset-0 z-40 bg-black/30 backdrop-blur-[1px] animate-fadeIn"
      />

      <div
        data-notif-dropdown
        role="dialog"
        aria-label="Notifications"
        className="
          /* Mobile: full-width panel anchored just below the navbar */
          fixed left-2 right-2 top-[68px] z-50 w-auto
          /* Desktop: classic dropdown anchored to the bell */
          sm:absolute sm:inset-auto sm:right-0 sm:top-full sm:mt-2
          sm:w-[min(22rem,calc(100vw-1rem))]
          bg-white border border-[#e5e5e5] rounded-2xl shadow-2xl overflow-hidden animate-fadeUp
        "
      >
      {/* Header */}
      <div className="px-4 py-3 border-b border-[#f0f0f0] flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <h3 className="font-display text-sm font-bold text-[#111] tracking-tightish">
            Notifications
          </h3>
          {unread > 0 && (
            <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded-full uppercase tracking-wider">
              {unread} new
            </span>
          )}
        </div>
        {unread > 0 && (
          <button
            onClick={markAllRead}
            className="text-xs text-emerald-600 hover:text-emerald-700 font-semibold whitespace-nowrap"
          >
            Mark all read
          </button>
        )}
      </div>

      {/* List / empty */}
      <div className="max-h-[60vh] overflow-y-auto">
        {recent.length === 0 ? (
          <div className="p-8 text-center">
            <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 mb-3">
              <BellIcon />
            </span>
            <p className="text-sm font-semibold text-[#111] mb-1">
              You're all caught up
            </p>
            <p className="text-xs text-gray-500">
              New notifications will show here.
            </p>
          </div>
        ) : (
          <ul>
            {recent.map((n) => (
              <li
                key={n._id}
                onClick={(e) => !n.isRead && toggleRead(n._id, n.isRead, e)}
                className={`px-4 py-3 border-b border-[#f6f6f1] last:border-b-0 transition ${
                  n.isRead
                    ? "hover:bg-gray-50"
                    : "bg-emerald-50/50 hover:bg-emerald-50 cursor-pointer"
                }`}
              >
                <div className="flex items-start gap-2.5">
                  <span
                    className={`mt-1.5 w-2 h-2 rounded-full flex-shrink-0 ${
                      n.isRead ? "bg-transparent" : "bg-emerald-500"
                    }`}
                  />
                  <p
                    className={`text-sm flex-1 leading-snug ${
                      n.isRead
                        ? "text-gray-600"
                        : "text-[#111] font-medium"
                    }`}
                  >
                    {n.message}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-[#f0f0f0] bg-[#f7faf8]">
        <button
          onClick={onView}
          className="w-full text-center text-sm font-semibold text-emerald-600 hover:text-emerald-700 transition"
        >
          {moreCount > 0
            ? `View all (${notifications.length}) →`
            : "View all notifications →"}
        </button>
      </div>
      </div>
    </>
  );
}
