import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { optimizeCard } from "../utils/imageOptimization";
import { formatEventDateTime } from "../utils/formatDate";
import Doodles from "./Doodles";

const MainSection = () => {
  const navigate = useNavigate();

  const [events, setEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSociety, setSelectedSociety] = useState("All");

  // societies come exclusively from backend (users with role === "society")
  const [societyAccounts, setSocietyAccounts] = useState([]); // [{ _id, name }]
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

  // fetch society accounts (no hardcoded fallback)
  useEffect(() => {
    const fetchSocietyAccounts = async () => {
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
      <div className="relative text-center min-h-[70vh] flex flex-col justify-center items-center px-4 md:px-8 lg:px-16 bg-[#fffffb] overflow-hidden">
        {/* dot-grid texture */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle, #c2e0ce 1px, transparent 1px)",
            backgroundSize: "30px 30px",
            opacity: 0.4,
          }}
        />

        {/* doodle layer */}
        <Doodles variant="hero" />

        {/* ── Content ── */}
        <div className="relative z-10 w-full flex flex-col items-center">
          <h1 className="font-display text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-[#111] leading-[1.05] max-w-4xl tracking-tightish">
            <span className="inline-block">
              Discover{" "}
              <span className="bg-gradient-to-r from-emerald-600 via-emerald-500 to-emerald-400 bg-clip-text text-transparent">
                Unforgettable
              </span>
            </span>
            <br className="hidden sm:block" />
            <span className="inline-block">Experiences</span>
          </h1>

          <p className="text-gray-500 mt-6 max-w-2xl text-base md:text-lg">
            From coding hackathons to musical nights, find everything happening
            around campus in one place.
          </p>

          <div className="mt-10 w-full flex justify-center px-2 sm:px-0">
            <div className="w-full max-w-3xl bg-white border border-[#e5e5e5] rounded-xl shadow-2xl px-2.5 sm:px-4 py-2 sm:py-3 flex items-center gap-1.5 sm:gap-2">
              {/* search icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="text-gray-400 flex-shrink-0 ml-1 w-5 h-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>

              <input
                type="text"
                placeholder="Search events..."
                className="flex-1 min-w-0 outline-none text-[#111] placeholder-gray-400 text-sm md:text-base bg-transparent py-1"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />

              <div className="hidden sm:block w-px h-6 bg-gray-200 flex-shrink-0" />

              <div className="relative flex-shrink-0" data-dropdown>
                <button
                  onClick={() => setShowSocietyDropdown(!showSocietyDropdown)}
                  aria-label="Filter by society"
                  className={`relative flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-2 rounded-lg text-sm font-medium transition-all border ${
                    selectedSociety !== "All"
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                      : "text-gray-500 border-transparent hover:bg-gray-50 hover:border-gray-200"
                  }`}
                >
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
                  <span className="hidden sm:inline max-w-[110px] truncate">
                    {selectedSociety !== "All" ? selectedSociety : "Filter"}
                  </span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`hidden sm:block w-3.5 h-3.5 transition-transform duration-200 flex-shrink-0 ${showSocietyDropdown ? "rotate-180" : ""}`}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                  {selectedSociety !== "All" && (
                    <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-emerald-500 rounded-full ring-2 ring-white" />
                  )}
                </button>

                {showSocietyDropdown && (
                  <>
                    {/* Mobile-only backdrop dim — tap to dismiss */}
                    <button
                      type="button"
                      onClick={() => setShowSocietyDropdown(false)}
                      aria-label="Close filter"
                      className="sm:hidden fixed inset-0 z-40 bg-black/30 backdrop-blur-[1px]"
                    />

                    <div className="absolute right-0 top-full mt-2 z-50 w-[min(20rem,calc(100vw-1.5rem))] sm:w-60 bg-white border border-[#e5e5e5] rounded-2xl shadow-2xl overflow-hidden animate-fadeUp">
                      <div className="px-4 py-3 border-b border-[#f0f0f0] flex items-center justify-between">
                        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                          Filter by society
                        </span>
                        {selectedSociety !== "All" && (
                          <button
                            onClick={() => {
                              setSelectedSociety("All");
                              setShowSocietyDropdown(false);
                            }}
                            className="text-xs text-emerald-600 hover:text-emerald-700 font-semibold"
                          >
                            Clear
                          </button>
                        )}
                      </div>
                      <div className="max-h-[60vh] sm:max-h-72 overflow-y-auto p-1.5">
                        {societies.map((soc) => {
                          const isActive = selectedSociety === soc;
                          return (
                            <button
                              key={soc}
                              onClick={() => {
                                setSelectedSociety(soc);
                                setShowSocietyDropdown(false);
                              }}
                              className={`w-full text-left px-3 py-3 sm:py-2.5 text-sm rounded-lg transition-all flex items-center justify-between gap-2 ${
                                isActive
                                  ? "bg-emerald-50 text-emerald-700 font-semibold"
                                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 active:bg-gray-100"
                              }`}
                            >
                              <span className="truncate">{soc}</span>
                              {isActive && (
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="w-4 h-4 text-emerald-500 flex-shrink-0"
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
                          );
                        })}
                      </div>
                    </div>
                  </>
                )}
              </div>

            </div>
          </div>
        </div>
      </div>

      <div className="border border-1 border-black/5"></div>

      {/* EVENTS SECTION */}
      <div className="mt-12 px-4 md:px-8 lg:px-16 xl:px-24">
        {/* Section Heading */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="font-display text-xl md:text-2xl font-semibold text-[#111]">
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
                src={optimizeCard(event.coverImageURL)}
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
                  {formatEventDateTime(event.date, event.time)}
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
