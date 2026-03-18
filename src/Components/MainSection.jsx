import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FiSearch } from "react-icons/fi";

const MainSection = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [events, setEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSociety, setSelectedSociety] = useState("All");
  const [showAllSocieties, setShowAllSocieties] = useState(false);

  // societies come exclusively from backend (users with role === "society")
  const [societyAccounts, setSocietyAccounts] = useState([]); // [{ _id, name }]
  const [loadingSocietyAccounts, setLoadingSocietyAccounts] = useState(false);
  const [societyAccountsError, setSocietyAccountsError] = useState("");
  const [showSocietyDropdown, setShowSocietyDropdown] = useState(false);

  const BACKEND = import.meta.env.VITE_BACKEND_URL?.replace(/\/$/, "") || "";

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest("[data-dropdown]")) {
        setShowSocietyDropdown(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  // fetch current user
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setUser(null);
          return;
        }
        const res = await axios.get(`${BACKEND}/api/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
      } catch (err) {
        console.error("[USER FETCH ERROR]", err?.response?.data || err.message);
        setUser(null);
      }
    };
    fetchUser();

    const handleStorageChange = () => fetchUser();
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [BACKEND]);

  // fetch society accounts (no hardcoded fallback)
  useEffect(() => {
    const fetchSocietyAccounts = async () => {
      setLoadingSocietyAccounts(true);
      setSocietyAccountsError("");
      try {
        const token = localStorage.getItem("token");
        const config = token
          ? { headers: { Authorization: `Bearer ${token}` } }
          : undefined;
        const res = await axios.get(`${BACKEND}/api/users/public`, config);
        if (Array.isArray(res.data)) {
          setSocietyAccounts(res.data);
          console.info(`[SOCIETIES] Loaded ${res.data.length}`);
        } else {
          console.warn("[SOCIETIES] Unexpected response:", res.data);
          setSocietyAccounts([]);
        }
      } catch (err) {
        console.error(
          "[SOCIETIES FETCH ERROR]",
          err?.response?.data || err.message,
        );
        setSocietyAccounts([]);
        setSocietyAccountsError("Failed to load societies.");
      } finally {
        setLoadingSocietyAccounts(false);
      }
    };

    fetchSocietyAccounts();
  }, [BACKEND]);

  // fetch events
  useEffect(() => {
    const url = `${BACKEND}/api/events`;
    fetch(url)
      .then(async (res) => {
        const data = await res.json().catch(() => null);
        if (!res.ok || !Array.isArray(data)) {
          console.error("[EVENT FETCH ERROR]", res.status, data);
          setEvents([]);
          return;
        }
        setEvents(data);
      })
      .catch((err) => {
        console.error("[EVENT FETCH ERROR]", err.message || err);
        setEvents([]);
      });
  }, [BACKEND]);

  // build society names list from backend accounts (only source)
  const societyNamesFromAccounts = societyAccounts
    .map((s) => s.name?.trim())
    .filter(Boolean);
  const societies = ["All", ...new Set([...societyNamesFromAccounts])];

  // filter events based on selectedSociety and search term
  const filteredEvents = events.filter((event) => {
    const matchesSociety =
      selectedSociety === "All" ||
      (event.societyId &&
        event.societyId.name &&
        event.societyId.name.trim().toLowerCase() ===
          selectedSociety.toLowerCase());
    const matchesSearch =
      !searchTerm ||
      (event.title &&
        event.title.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesSociety && matchesSearch;
  });

  return (
    <div>
      {/* HERO SECTION */}
      <div className="text-center min-h-[70vh] flex flex-col justify-center items-center px-4 md:px-8 lg:px-16 bg-[#f5f5f2]">
        {/* Heading */}
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-[#111] leading-[1.1] max-w-4xl tracking-tight">
          <span className="inline-block">
            Discover{" "}
            <span className="bg-gradient-to-r from-emerald-600 via-emerald-500 to-emerald-400 bg-clip-text text-transparent">
              Unforgettable
            </span>
          </span>
          <br className="hidden sm:block" />
          <span className="inline-block">Experiences</span>
        </h1>

        {/* Subtitle */}
        <p className="text-gray-500 mt-6 max-w-2xl text-base md:text-lg">
          From coding hackathons to musical nights, find everything happening
          around campus in one place.
        </p>

        {/* Search + Society Filter */}
        <div className="mt-10 w-full flex justify-center">
          <div className="w-full max-w-3xl bg-white border border-[#e5e5e5] rounded-xl shadow-2xl px-4 py-3 flex items-center gap-2">
            {/* Search Icon */}
            <FiSearch className="text-gray-400 text-xl flex-shrink-0 ml-1" />

            {/* Search Input */}
            <input
              type="text"
              placeholder="Search events by name or keyword..."
              className="flex-1 outline-none text-[#111] placeholder-gray-400 text-sm md:text-base bg-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            {/* Vertical Divider */}
            <div className="w-px h-6 bg-gray-200 flex-shrink-0" />

            {/* Society Dropdown */}
            <div className="relative flex-shrink-0" data-dropdown>
              <button
                onClick={() => setShowSocietyDropdown(!showSocietyDropdown)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all border ${
                  selectedSociety && selectedSociety !== "All"
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                    : "text-gray-500 border-transparent hover:bg-gray-50 hover:border-gray-200"
                }`}
              >
                {/* Filter Icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4 flex-shrink-0"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
                </svg>

                <span className="max-w-[110px] truncate">
                  {selectedSociety && selectedSociety !== "All"
                    ? selectedSociety
                    : "Filter"}
                </span>

                {/* Chevron */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`w-3.5 h-3.5 transition-transform duration-200 flex-shrink-0 ${
                    showSocietyDropdown ? "rotate-180" : ""
                  }`}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>

                {/* Active dot indicator */}
                {selectedSociety && selectedSociety !== "All" && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-500 rounded-full" />
                )}
              </button>

              {/* Dropdown Menu */}
              {showSocietyDropdown && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-[#e5e5e5] rounded-xl shadow-xl z-50 overflow-hidden">
                  {/* Dropdown Header */}
                  <div className="px-4 py-2.5 border-b border-[#f0f0f0] flex items-center justify-between">
                    <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Society
                    </span>
                    {selectedSociety && selectedSociety !== "All" && (
                      <button
                        onClick={() => {
                          setSelectedSociety("All");
                          setShowSocietyDropdown(false);
                        }}
                        className="text-xs text-emerald-600 hover:text-emerald-700 font-medium transition"
                      >
                        Clear
                      </button>
                    )}
                  </div>

                  {/* Scrollable List */}
                  <div className="max-h-60 overflow-y-auto py-1">
                    {societies.map((soc) => (
                      <button
                        key={soc}
                        onClick={() => {
                          setSelectedSociety(soc);
                          setShowSocietyDropdown(false);
                        }}
                        className={`w-full text-left px-4 py-2.5 text-sm transition-colors flex items-center justify-between group ${
                          selectedSociety === soc
                            ? "bg-emerald-50 text-emerald-700 font-semibold"
                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                        }`}
                      >
                        <span>{soc}</span>
                        {selectedSociety === soc && (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-4 h-4 text-emerald-500"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Vertical Divider */}
            <div className="w-px h-6 bg-gray-200 flex-shrink-0" />

            {/* Search Button */}
            <button className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 text-white text-sm font-medium rounded-lg transition-all flex-shrink-0 shadow-sm">
              Search
            </button>
          </div>
        </div>
      </div>

      <div className="border border-1 border-black/5"></div>

      {/* EVENTS SECTION */}
      <div className="mt-12 px-4 md:px-8 lg:px-16 xl:px-24">
        {/* Section Heading */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl md:text-2xl font-semibold text-[#111]">
              Featured Events
            </h2>
            <p className="text-sm text-gray-500">
              Hand-picked experiences for you this week.
            </p>
          </div>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredEvents.map((event) => (
            <div
              key={event._id}
              className="bg-white border border-[#e5e5e5] rounded-xl overflow-hidden 
             transition-all duration-300 ease-out 
             hover:shadow-xl hover:-translate-y-1 hover:scale-[1.02] 
             flex flex-col group"
            >
              <img
                src={event.coverImageURL.replace(
                  "/upload/",
                  "/upload/w_400,h_250,c_fill,q_auto,f_auto/",
                )}
                alt={event.title}
                loading="lazy"
                className="w-full h-40 object-cover bg-gray-200"
              />

              <div className="p-4 flex flex-col flex-1">
                <h3 className="text-[#111] font-semibold text-sm line-clamp-2 group-hover:text-emerald-600 transition">
                  {event.title}
                </h3>
                <p className="text-gray-500 text-xs mt-1">
                  {event.societyId?.name}
                </p>

                <p className="text-gray-400 text-xs mt-2">
                  {event.date} • {event.time}
                </p>

                <p className="text-gray-400 text-xs mb-3">{event.location}</p>

                {/* ✅ FIXED BOTTOM SECTION */}
                <div className="flex justify-between items-center mt-auto pt-3 border-t border-[#eee]">
                  <span
                    className={`text-xs px-2 py-1 rounded-md font-medium ${
                      event.registrationStatus === "closed"
                        ? "bg-red-100 text-red-600"
                        : event.registrationStatus === "upcoming"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-emerald-100 text-emerald-600"
                    }`}
                  >
                    {event.registrationStatus}
                  </span>

                  <button
                    onClick={() => navigate(`/events/${event._id}`)}
                    className="text-xs px-3 py-1.5 rounded-md bg-emerald-500 hover:bg-emerald-400 text-white font-medium shadow-sm transition"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MainSection;
