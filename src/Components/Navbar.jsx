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

          <p className="text-xl sm:text-2xl font-semibold text-[#1a1a1a] tracking-tight whitespace-nowrap">
            KIIT <span className="text-emerald-600">Events</span>
          </p>
        </div>

        {/* Desktop Nav Links */}
        <ul className="hidden sm:flex gap-8 text-[#4b5563] text-[15px] font-medium">
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
              onClick={() => handleNavigation("/Contact")}
              className="hover:text-emerald-600 transition"
            >
              Contact
            </button>
          </li>
        </ul>

        {/* Right Side */}
        <div className="flex items-center gap-3 sm:gap-4">
          {user ? (
            <>
              <p className="hidden md:block text-sm text-[#374151] font-medium whitespace-nowrap">
                Welcome, {user.name}
              </p>

              <button
                onClick={() => handleNavigation("/Notifications")}
                className="hidden sm:block text-lg hover:text-emerald-600 transition"
              >
                🔔
              </button>

              <button
                onClick={() => handleNavigation("/Dashboard")}
                className="px-4 py-2 rounded-lg text-sm border border-[#ddd] text-[#333] hover:bg-[#ececec] transition"
              >
                Dashboard
              </button>

              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-lg text-sm border border-red-400 text-red-500 hover:bg-red-50 transition"
              >
                Log out
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
        <ul className="flex flex-col items-center text-[#444] py-3 space-y-3 text-[16px]">
          {user && (
            <li className="w-full text-center">
              <button
                onClick={() => handleNavigation("/Notifications")}
                className="flex justify-center items-center gap-2 py-2 hover:bg-[#ececec] w-full transition font-medium"
              >
                🔔 Notifications
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
                        ? "/EventsPage"
                        : `/${item}`,
                  )
                }
                className="block py-2 hover:bg-[#ececec] w-full transition"
              >
                {item}
              </button>
            </li>
          ))}
        </ul>

        {user && (
          <div className="border-t border-[#e5e5e0] pt-3 text-center">
            <p className="text-[#374151] font-medium text-sm">
              Welcome, {user.name}
            </p>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
