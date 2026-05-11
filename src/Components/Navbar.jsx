import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import NotificationsDropdown from "./NotificationsDropdown";

const Navbar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [notifOpen, setNotifOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  // 🔹 Check login state and token validity
  useEffect(() => {
    const checkUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setUser(null);
        return;
      }

      // try {
      //   await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/protected`, {
      //     headers: { Authorization: `Bearer ${token}` },
      //   });
      //   const decoded = jwtDecode(token);
      //   setUser(decoded);
      // } catch (error) {
      //   console.warn("Invalid or expired token");
      //   localStorage.removeItem("token");
      //   setUser(null);
      //   window.dispatchEvent(new Event("authChange"));
      // }

      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/users/me`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        setUser(res.data);
      } catch (err) {
        console.warn("Invalid or expired token");
        localStorage.removeItem("token");
        setUser(null);
        window.dispatchEvent(new Event("authChange"));
      }
    };

    checkUser();
    window.addEventListener("authChange", checkUser);
    window.addEventListener("storage", checkUser);
    return () => {
      window.removeEventListener("authChange", checkUser);
      window.removeEventListener("storage", checkUser);
    };
  }, []);

  // Fetch the notification list (used both for the bell badge count and
  // for populating the dropdown).
  const fetchNotifications = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const { data } = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/notifications`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (Array.isArray(data)) setNotifications(data);
    } catch {
      /* silent — bell just stays at 0 */
    }
  }, []);

  useEffect(() => {
    if (!user) {
      setNotifications([]);
      return;
    }
    fetchNotifications();
  }, [user, fetchNotifications]);

  // Re-fetch each time the dropdown opens so reads done elsewhere reflect.
  useEffect(() => {
    if (notifOpen && user) fetchNotifications();
  }, [notifOpen, user, fetchNotifications]);

  // Click outside / Escape closes the notifications dropdown.
  useEffect(() => {
    if (!notifOpen) return;
    const onClick = (e) => {
      if (
        !e.target.closest("[data-notif-dropdown]") &&
        !e.target.closest("[data-notif-trigger]")
      ) {
        setNotifOpen(false);
      }
    };
    const onKey = (e) => {
      if (e.key === "Escape") setNotifOpen(false);
    };
    document.addEventListener("click", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("click", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [notifOpen]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setNotifications([]);
    setNotifOpen(false);
    window.dispatchEvent(new Event("authChange"));
    window.dispatchEvent(new Event("storage"));
    navigate("/");
  };

  const handleNavigation = (path) => {
    navigate(path);
    setIsMenuOpen(false);
  };

  return (
    <nav className="w-full sticky top-0 z-50 bg-white border-b border-[#e5e5e0] opacity-[95%] backdrop-blur-sm">
      <div className="max-w-7xl mx-auto flex justify-between items-center py-3 px-4 sm:px-8">
        {/* Logo */}
        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => handleNavigation("/")}
        >
          <div className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-lg">
            <img src="/KIIT-Logo-500x500-1.png" alt="" />
          </div>

          <p className="font-display text-xl sm:text-2xl font-bold text-[#1a1a1a] tracking-tightish whitespace-nowrap">
            KIIT <span className="text-emerald-600">Events</span>
          </p>
        </div>

        {/* Desktop Nav Links */}
        <ul className="hidden sm:flex gap-6 lg:gap-8 text-[#4b5563] text-[15px] font-medium">
          <li>
            <button
              onClick={() => handleNavigation("/")}
              className="hover:text-emerald-600 transition"
            >
              Home
            </button>
          </li>
          <li>
            <button
              onClick={() => handleNavigation("/About")}
              className="hover:text-emerald-600 transition"
            >
              About
            </button>
          </li>
          <li>
            <button
              onClick={() => handleNavigation("/EventsPage")}
              className="hover:text-emerald-600 transition"
            >
              Events
            </button>
          </li>
          <li>
            <button
              onClick={() => handleNavigation("/AnnouncementsList")}
              className="hover:text-emerald-600 transition"
            >
              Announcements
            </button>
          </li>
          <li>
            <button
              onClick={() => handleNavigation("/Contact")}
              className="hover:text-emerald-600 transition"
            >
              Contact
            </button>
          </li>
        </ul>

        {/* Right Side */}
        <div className="flex items-center gap-2 sm:gap-3">
          {user ? (
            <>
              {/* Notifications — bell trigger + dropdown */}
              <div className="relative" data-notif-trigger>
                <button
                  onClick={() => setNotifOpen((o) => !o)}
                  className="relative flex w-9 h-9 items-center justify-center rounded-full text-[#4b5563] hover:bg-emerald-50 hover:text-emerald-600 transition-all"
                  aria-label={
                    unreadCount > 0
                      ? `Notifications, ${unreadCount} unread`
                      : "Notifications"
                  }
                  aria-expanded={notifOpen}
                  aria-haspopup="dialog"
                  title={
                    unreadCount > 0
                      ? `${unreadCount} unread`
                      : "Notifications"
                  }
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-[18px] h-[18px]"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
                    <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
                  </svg>

                  {unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-emerald-500 text-white text-[10px] font-bold leading-none flex items-center justify-center ring-2 ring-white">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  )}
                </button>

                {notifOpen && (
                  <NotificationsDropdown
                    notifications={notifications}
                    setNotifications={setNotifications}
                    onClose={() => setNotifOpen(false)}
                    onView={() => {
                      setNotifOpen(false);
                      navigate("/Notifications");
                    }}
                  />
                )}
              </div>

              {/* Avatar + first-name pill — also opens Dashboard */}
              <button
                onClick={() => handleNavigation("/Dashboard")}
                className="flex items-center gap-2 pl-1 pr-1 md:pr-3 py-1 rounded-full border border-[#e5e5e0] hover:bg-[#f7faf8] hover:border-emerald-200 transition-all"
                title={`Dashboard — ${user.name}`}
                aria-label={`Open dashboard, signed in as ${user.name}`}
              >
                <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-400 flex items-center justify-center text-white text-xs sm:text-sm font-bold">
                  {user.name?.charAt(0).toUpperCase() || "?"}
                </span>
                <span className="hidden md:inline text-sm font-medium text-[#374151] max-w-[100px] truncate">
                  {user.name?.split(" ")[0] || "Account"}
                </span>
              </button>

              {/* Log out */}
              <button
                onClick={handleLogout}
                className="px-3 sm:px-4 py-2 rounded-lg text-sm border border-red-200 text-red-500 hover:bg-red-50 hover:border-red-300 transition"
                aria-label="Log out"
                title="Log out"
              >
                <span className="hidden sm:inline">Log out</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4 sm:hidden"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => handleNavigation("/Login")}
                className="text-sm text-[#374151] hover:text-black transition"
              >
                Sign In
              </button>

              <button
                onClick={() => handleNavigation("/SignUp")}
                className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-white text-sm font-medium shadow-sm transition"
              >
                Register
              </button>
            </>
          )}

          {/* Mobile Menu */}
          <button
            className="text-2xl sm:hidden ml-2 text-[#333]"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? "✖" : "☰"}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      <div
        className={`sm:hidden transition-all duration-300 ease-in-out overflow-hidden ${
          isMenuOpen ? "max-h-[400px] opacity-100" : "max-h-0 opacity-0"
        } bg-[#f5f5f2] border-t border-[#e5e5e0]`}
      >
        <ul className="flex flex-col items-center text-[#444] py-3 space-y-1 text-[16px]">
          {[
            { label: "Home", path: "/" },
            { label: "About", path: "/About" },
            { label: "Events", path: "/EventsPage" },
            { label: "Announcements", path: "/AnnouncementsList" },
            { label: "Contact", path: "/Contact" },
          ].map(({ label, path }) => (
            <li key={label} className="w-full text-center">
              <button
                onClick={() => handleNavigation(path)}
                className="block py-2.5 hover:bg-[#ececec] w-full transition"
              >
                {label}
              </button>
            </li>
          ))}
        </ul>

        {user && (
          <div className="border-t border-[#e5e5e0] pt-3 pb-3 flex justify-center">
            <div className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-full bg-white border border-[#e5e5e0]">
              <span className="w-7 h-7 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-400 flex items-center justify-center text-white text-xs font-bold">
                {user.name?.charAt(0).toUpperCase() || "?"}
              </span>
              <span className="text-sm font-medium text-[#374151]">
                {user.name}
              </span>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
