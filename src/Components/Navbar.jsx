import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

const Navbar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // 🔹 Check login state and token validity
  useEffect(() => {
    const checkUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setUser(null);
        return;
      }

      try {
        await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/protected`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const decoded = jwtDecode(token);
        setUser(decoded);
      } catch (error) {
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

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    window.dispatchEvent(new Event("authChange"));
    window.dispatchEvent(new Event("storage"));
    navigate("/");
  };

  const handleNavigation = (path) => {
    navigate(path);
    setIsMenuOpen(false);
  };

  return (
    <nav className="border-b border-emerald-900/40 shadow-md w-full sticky top-0 z-50 bg-black/50 backdrop-blur-lg">
      <div className="max-w-7xl mx-auto flex justify-between items-center py-3 px-4 sm:px-8 text-white">
        {/* Logo */}
        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => handleNavigation("/")}
        >
          <img src="/logo.gif" alt="Logo" className="w-10 h-10 rounded-full" />
          <p className="text-xl sm:text-2xl font-bold tracking-wide whitespace-nowrap">
            KIIT <span className="text-emerald-400">Events</span>
          </p>
        </div>

        {/* Desktop Nav Links */}
        <ul className="hidden sm:flex gap-8 text-gray-200 text-[15px]">
          <li>
            <button
              onClick={() => handleNavigation("/")}
              className="hover:text-emerald-400 transition"
            >
              Home
            </button>
          </li>
          <li>
            <button
              onClick={() => handleNavigation("/About")}
              className="hover:text-emerald-400 transition"
            >
              About
            </button>
          </li>
          <li>
            <button
              onClick={() => handleNavigation("/Upcoming")}
              className="hover:text-emerald-400 transition"
            >
              Events
            </button>
          </li>
          <li>
            <button
              onClick={() => handleNavigation("/Contact")}
              className="hover:text-emerald-400 transition"
            >
              Contact
            </button>
          </li>
        </ul>

        {/* Right Side Buttons */}
        <div className="flex items-center gap-2 sm:gap-4">
          {user ? (
            <>
              <p className="hidden md:block font-semibold text-emerald-300 text-sm whitespace-nowrap">
                Welcome, {user.name}
              </p>

              <button
                onClick={() => handleNavigation("/Notifications")}
                className="hidden sm:block text-xl hover:text-emerald-400 transition"
                title="Notifications"
              >
                🔔
              </button>

              <button
                onClick={() => handleNavigation("/Dashboard")}
                className="px-3 py-1 sm:px-4 sm:py-2 border border-emerald-700 rounded-lg text-xs font-semibold hover:bg-emerald-900/50 transition"
              >
                Dashboard
              </button>
              <button
                onClick={handleLogout}
                className="px-3 py-1 sm:px-4 sm:py-2 border border-red-700 rounded-lg text-xs font-semibold hover:bg-red-800/50 transition"
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => handleNavigation("/Login")}
                className="px-3 py-1 sm:px-4 sm:py-2 border border-emerald-700 rounded-lg text-xs sm:text-sm font-semibold hover:bg-emerald-900/50 transition"
              >
                Login
              </button>
              <button
                onClick={() => handleNavigation("/SignUp")}
                className="px-3 py-1 sm:px-4 sm:py-2 border border-emerald-700 rounded-lg text-xs sm:text-sm font-semibold hover:bg-emerald-900/50 transition"
              >
                Signup
              </button>
            </>
          )}

          {/* Hamburger Button */}
          <button
            className="text-2xl sm:hidden ml-2 focus:outline-none"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? "✖" : "☰"}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      <div
        className={`sm:hidden transition-all duration-300 ease-in-out overflow-hidden ${
          isMenuOpen ? "max-h-[400px] opacity-100" : "max-h-0 opacity-0"
        } bg-emerald-950/60 backdrop-blur-md`}
      >
        <ul className="flex flex-col items-center text-gray-200 py-3 space-y-3 text-[16px]">
          {user && (
            <li className="w-full text-center">
              <button
                onClick={() => handleNavigation("/Notifications")}
                className="flex justify-center items-center gap-2 py-2 hover:bg-emerald-900/40 w-full transition font-semibold"
              >
                <span className="text-xl">🔔</span> Notifications
              </button>
            </li>
          )}

          {["Home", "About", "Events", "Contact"].map((item) => (
            <li key={item} className="w-full text-center">
              <button
                onClick={() =>
                  handleNavigation(
                    item === "Home"
                      ? "/"
                      : item === "Events"
                      ? "/Upcoming"
                      : `/${item}`
                  )
                }
                className="block py-2 hover:bg-emerald-900/40 w-full transition"
              >
                {item}
              </button>
            </li>
          ))}
        </ul>

        {user && (
          <div className="border-t border-emerald-800 pt-3 text-center">
            <p className="text-emerald-300 font-semibold text-sm">
              Welcome, {user.name}
            </p>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
