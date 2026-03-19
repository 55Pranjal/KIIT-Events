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

  // ── Campus-themed hand-drawn doodles ──────────────────────────────────────────
  const Doodles = () => (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none select-none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <style>{`
        .dk { stroke:#86c9a2; fill:none; stroke-linecap:round; stroke-linejoin:round; opacity:0;
              animation:dkIn 0.7s ease forwards; }
        .dkf{ stroke:#86c9a2; fill:#c9ecd8; stroke-linecap:round; stroke-linejoin:round; opacity:0;
              animation:dkIn 0.7s ease forwards; }
        @keyframes dkIn { from{opacity:0;transform:scale(.8)} to{opacity:1;transform:scale(1)} }
      `}</style>
      </defs>

      {/* ══ TOP-LEFT — Lightbulb ══ */}
      {/* bulb body */}
      <path
        className="dk"
        style={{ strokeWidth: 2, animationDelay: ".15s" }}
        d="M 72 70 C 72 56 92 54 92 70 C 92 77 87 82 87 87 L 77 87 C 77 82 72 77 72 70Z"
      />
      {/* base lines */}
      <line
        className="dk"
        style={{ strokeWidth: 1.8, animationDelay: ".2s" }}
        x1="77"
        y1="88"
        x2="87"
        y2="88"
      />
      <line
        className="dk"
        style={{ strokeWidth: 1.8, animationDelay: ".23s" }}
        x1="78"
        y1="91"
        x2="86"
        y2="91"
      />
      {/* shine rays */}
      <line
        className="dk"
        style={{ strokeWidth: 1.4, animationDelay: ".26s" }}
        x1="82"
        y1="60"
        x2="82"
        y2="53"
      />
      <line
        className="dk"
        style={{ strokeWidth: 1.4, animationDelay: ".28s" }}
        x1="68"
        y1="64"
        x2="63"
        y2="59"
      />
      <line
        className="dk"
        style={{ strokeWidth: 1.4, animationDelay: ".28s" }}
        x1="96"
        y1="64"
        x2="101"
        y2="59"
      />
      <line
        className="dk"
        style={{ strokeWidth: 1, animationDelay: ".3s" }}
        x1="63"
        y1="72"
        x2="57"
        y2="72"
      />
      <line
        className="dk"
        style={{ strokeWidth: 1, animationDelay: ".3s" }}
        x1="101"
        y1="72"
        x2="107"
        y2="72"
      />

      {/* ══ TOP-LEFT — scattered dots ══ */}
      {[
        [18, 24],
        [30, 16],
        [44, 30],
        [12, 42],
        [50, 20],
        [22, 50],
      ].map(([x, y], i) => (
        <circle
          key={i}
          className="dkf"
          style={{ strokeWidth: 1, animationDelay: `${0.05 * i + 0.08}s` }}
          cx={x}
          cy={y}
          r="2.8"
        />
      ))}

      {/* ══ TOP-CENTER — star burst ══ */}
      {[
        { x: "48%", y: 28, r: 6, delay: ".1s" },
        { x: "55%", y: 18, r: 4, delay: ".18s" },
        { x: "41%", y: 20, r: 4.5, delay: ".22s" },
        { x: "58%", y: 36, r: 3, delay: ".28s" },
      ].map((s, i) => (
        <g key={i}>
          <line
            className="dk"
            style={{ strokeWidth: 1.4, animationDelay: s.delay }}
            x1={`calc(${s.x} - ${s.r}px)`}
            y1={s.y}
            x2={`calc(${s.x} + ${s.r}px)`}
            y2={s.y}
          />
          <line
            className="dk"
            style={{ strokeWidth: 1.4, animationDelay: s.delay }}
            x1={s.x}
            y1={s.y - s.r}
            x2={s.x}
            y2={s.y + s.r}
          />
          <line
            className="dk"
            style={{ strokeWidth: 1, animationDelay: s.delay, opacity: 0.6 }}
            x1={`calc(${s.x} - ${s.r * 0.7}px)`}
            y1={s.y - s.r * 0.7}
            x2={`calc(${s.x} + ${s.r * 0.7}px)`}
            y2={s.y + s.r * 0.7}
          />
          <line
            className="dk"
            style={{ strokeWidth: 1, animationDelay: s.delay, opacity: 0.6 }}
            x1={`calc(${s.x} + ${s.r * 0.7}px)`}
            y1={s.y - s.r * 0.7}
            x2={`calc(${s.x} - ${s.r * 0.7}px)`}
            y2={s.y + s.r * 0.7}
          />
        </g>
      ))}

      {/* ══ TOP-RIGHT — double music note ══ */}
      {/* note 1 */}
      <ellipse
        className="dkf"
        style={{ strokeWidth: 1.8, animationDelay: ".2s" }}
        cx="calc(100% - 90px)"
        cy="70"
        rx="8"
        ry="5.5"
        transform="rotate(-15,0,0)"
      />
      <line
        className="dk"
        style={{ strokeWidth: 2, animationDelay: ".22s" }}
        x1="calc(100% - 82px)"
        y1="68"
        x2="calc(100% - 82px)"
        y2="48"
      />
      {/* note 2 */}
      <ellipse
        className="dkf"
        style={{ strokeWidth: 1.8, animationDelay: ".28s" }}
        cx="calc(100% - 68px)"
        cy="62"
        rx="7"
        ry="5"
        transform="rotate(-15,0,0)"
      />
      <line
        className="dk"
        style={{ strokeWidth: 2, animationDelay: ".3s" }}
        x1="calc(100% - 61px)"
        y1="60"
        x2="calc(100% - 61px)"
        y2="42"
      />
      {/* beam */}
      <line
        className="dk"
        style={{ strokeWidth: 1.8, animationDelay: ".33s" }}
        x1="calc(100% - 82px)"
        y1="48"
        x2="calc(100% - 61px)"
        y2="42"
      />

      {/* ══ TOP-RIGHT — scattered dots ══ */}
      {[
        ["calc(100% - 20px)", 18],
        ["calc(100% - 32px)", 10],
        ["calc(100% - 48px)", 24],
        ["calc(100% - 16px)", 34],
      ].map(([x, y], i) => (
        <circle
          key={i}
          className="dkf"
          style={{ strokeWidth: 1, animationDelay: `${0.05 * i + 0.12}s` }}
          cx={x}
          cy={y}
          r="2.5"
        />
      ))}

      {/* ══ MID-LEFT — Pencil (rotated) ══ */}
      <g transform="rotate(-28 50 230)">
        <rect
          className="dk"
          style={{ strokeWidth: 1.8, animationDelay: ".25s" }}
          x="44"
          y="205"
          width="14"
          height="38"
          rx="1.5"
        />
        <polygon
          className="dkf"
          style={{ strokeWidth: 1.5, animationDelay: ".27s" }}
          points="44,243 58,243 51,256"
        />
        <line
          className="dk"
          style={{ strokeWidth: 1.4, animationDelay: ".29s" }}
          x1="44"
          y1="213"
          x2="58"
          y2="213"
        />
        {/* wood grain lines */}
        <line
          className="dk"
          style={{ strokeWidth: 1, animationDelay: ".31s" }}
          x1="48"
          y1="205"
          x2="48"
          y2="213"
        />
        <line
          className="dk"
          style={{ strokeWidth: 1, animationDelay: ".31s" }}
          x1="54"
          y1="205"
          x2="54"
          y2="213"
        />
      </g>

      {/* ══ MID-RIGHT — Open book ══ */}
      <g>
        {/* left page */}
        <path
          className="dk"
          style={{ strokeWidth: 2, animationDelay: ".3s" }}
          d="M calc(100% - 130px) 47% C calc(100% - 110px) 43%, calc(100% - 85px) 43%, calc(100% - 78px) 47%
           L calc(100% - 78px) 62% C calc(100% - 85px) 58%, calc(100% - 110px) 58%, calc(100% - 130px) 62% Z"
        />
        {/* right page */}
        <path
          className="dk"
          style={{ strokeWidth: 2, animationDelay: ".35s" }}
          d="M calc(100% - 78px) 47% C calc(100% - 71px) 43%, calc(100% - 46px) 43%, calc(100% - 26px) 47%
           L calc(100% - 26px) 62% C calc(100% - 46px) 58%, calc(100% - 71px) 58%, calc(100% - 78px) 62% Z"
        />
        {/* spine */}
        <line
          className="dk"
          style={{ strokeWidth: 2, animationDelay: ".38s" }}
          x1="calc(100% - 78px)"
          y1="47%"
          x2="calc(100% - 78px)"
          y2="62%"
        />
        {/* text lines left */}
        <line
          className="dk"
          style={{ strokeWidth: 1, animationDelay: ".4s" }}
          x1="calc(100% - 120px)"
          y1="50%"
          x2="calc(100% - 88px)"
          y2="49.5%"
        />
        <line
          className="dk"
          style={{ strokeWidth: 1, animationDelay: ".42s" }}
          x1="calc(100% - 120px)"
          y1="53%"
          x2="calc(100% - 90px)"
          y2="52.5%"
        />
        <line
          className="dk"
          style={{ strokeWidth: 1, animationDelay: ".44s" }}
          x1="calc(100% - 120px)"
          y1="56%"
          x2="calc(100% - 92px)"
          y2="55.5%"
        />
        {/* text lines right */}
        <line
          className="dk"
          style={{ strokeWidth: 1, animationDelay: ".4s" }}
          x1="calc(100% - 68px)"
          y1="49.5%"
          x2="calc(100% - 36px)"
          y2="50%"
        />
        <line
          className="dk"
          style={{ strokeWidth: 1, animationDelay: ".42s" }}
          x1="calc(100% - 68px)"
          y1="52.5%"
          x2="calc(100% - 38px)"
          y2="53%"
        />
        <line
          className="dk"
          style={{ strokeWidth: 1, animationDelay: ".44s" }}
          x1="calc(100% - 68px)"
          y1="55.5%"
          x2="calc(100% - 40px)"
          y2="56%"
        />
      </g>

      {/* ══ BOTTOM-LEFT — Code brackets </> ══ */}
      <g transform="translate(30 0)">
        <polyline
          className="dk"
          style={{ strokeWidth: 2.2, animationDelay: ".45s" }}
          points="20,84% 10,87% 20,90%"
        />
        <polyline
          className="dk"
          style={{ strokeWidth: 2.2, animationDelay: ".48s" }}
          points="46,84% 56,87% 46,90%"
        />
        <line
          className="dk"
          style={{ strokeWidth: 1.8, animationDelay: ".5s" }}
          x1="28"
          y1="91%"
          x2="38"
          y2="83%"
        />
      </g>

      {/* ══ BOTTOM-CENTER — dotted wave ══ */}
      <path
        className="dk"
        style={{
          strokeWidth: 1.4,
          strokeDasharray: "5 6",
          animationDelay: ".55s",
        }}
        d="M 140 92% Q 200 88% 260 92% Q 320 96% 380 92% Q 440 88% 500 92%"
      />

      {/* ══ BOTTOM-RIGHT — WiFi signal ══ */}
      <g>
        <path
          className="dk"
          style={{ strokeWidth: 2, animationDelay: ".5s" }}
          d="M calc(100% - 85px) 86% a 28 28 0 0 1 56 0"
        />
        <path
          className="dk"
          style={{ strokeWidth: 2, animationDelay: ".54s" }}
          d="M calc(100% - 68px) 86% a 11 11 0 0 1 22 0"
        />
        <circle
          className="dkf"
          style={{ strokeWidth: 1.8, animationDelay: ".58s" }}
          cx="calc(100% - 57px)"
          cy="86%"
          r="3.5"
        />
      </g>

      {/* ══ BOTTOM — scattered dots strip ══ */}
      {[
        [80, "93%"],
        [160, "96%"],
        [260, "91%"],
        [370, "94%"],
        ["calc(100% - 110px)", "92%"],
        ["calc(100% - 200px)", "96%"],
      ].map(([x, y], i) => (
        <circle
          key={i}
          className="dkf"
          style={{ strokeWidth: 1, animationDelay: `${0.05 * i + 0.3}s` }}
          cx={x}
          cy={y}
          r="2.2"
        />
      ))}
    </svg>
  );

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
        <Doodles />

        {/* ── Content ── */}
        <div className="relative z-10 w-full flex flex-col items-center">
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

          <p className="text-gray-500 mt-6 max-w-2xl text-base md:text-lg">
            From coding hackathons to musical nights, find everything happening
            around campus in one place.
          </p>

          <div className="mt-10 w-full flex justify-center">
            <div className="w-full max-w-3xl bg-white border border-[#e5e5e5] rounded-xl shadow-2xl px-4 py-3 flex items-center gap-2">
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
                placeholder="Search events by name or keyword..."
                className="flex-1 outline-none text-[#111] placeholder-gray-400 text-sm md:text-base bg-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />

              <div className="w-px h-6 bg-gray-200 flex-shrink-0" />

              <div className="relative flex-shrink-0" data-dropdown>
                <button
                  onClick={() => setShowSocietyDropdown(!showSocietyDropdown)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all border ${
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
                  <span className="max-w-[110px] truncate">
                    {selectedSociety !== "All" ? selectedSociety : "Filter"}
                  </span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`w-3.5 h-3.5 transition-transform duration-200 flex-shrink-0 ${showSocietyDropdown ? "rotate-180" : ""}`}
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
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-500 rounded-full" />
                  )}
                </button>

                {showSocietyDropdown && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-[#e5e5e5] rounded-xl shadow-xl z-50 overflow-hidden">
                    <div className="px-4 py-2.5 border-b border-[#f0f0f0] flex items-center justify-between">
                      <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                        Society
                      </span>
                      {selectedSociety !== "All" && (
                        <button
                          onClick={() => {
                            setSelectedSociety("All");
                            setShowSocietyDropdown(false);
                          }}
                          className="text-xs text-emerald-600 hover:text-emerald-700 font-medium"
                        >
                          Clear
                        </button>
                      )}
                    </div>
                    <div className="max-h-60 overflow-y-auto py-1">
                      {societies.map((soc) => (
                        <button
                          key={soc}
                          onClick={() => {
                            setSelectedSociety(soc);
                            setShowSocietyDropdown(false);
                          }}
                          className={`w-full text-left px-4 py-2.5 text-sm transition-colors flex items-center justify-between ${
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

              <div className="w-px h-6 bg-gray-200 flex-shrink-0" />

              <button className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 text-white text-sm font-medium rounded-lg transition-all flex-shrink-0 shadow-sm">
                Search
              </button>
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
