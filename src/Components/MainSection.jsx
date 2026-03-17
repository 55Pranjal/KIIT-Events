import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

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

  const BACKEND = import.meta.env.VITE_BACKEND_URL?.replace(/\/$/, "") || "";

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
    <div className="bg-[#f5f5f2]">
      {/* HERO SECTION */}
      <div className="text-center min-h-[70vh] flex flex-col justify-center items-center px-4 md:px-8 lg:px-16">
        {/* Heading */}
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-[#111] leading-tight max-w-4xl">
          Discover <span className="text-emerald-600">Unforgettable</span>
          <br />
          Experiences
        </h1>

        {/* Subtitle */}
        <p className="text-gray-500 mt-6 max-w-2xl text-base md:text-lg">
          From coding hackathons to musical nights, find everything happening
          around campus in one place.
        </p>

        {/* Search */}
        <div className="mt-10 w-full flex justify-center">
          <div className="w-full max-w-3xl flex items-center bg-white border border-[#e5e5e5] rounded-xl shadow-sm px-5 py-4">
            <input
              type="text"
              placeholder="Search events by name, society, or keyword..."
              className="w-full outline-none text-[#111] placeholder-gray-400 text-sm md:text-base"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            <button className="ml-3 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-white text-sm md:text-base rounded-lg font-medium transition">
              Search
            </button>
          </div>
        </div>
      </div>

      {/* FILTERS */}
      <div className="mt-10 px-4 md:px-8 lg:px-16 xl:px-24 flex flex-wrap gap-2 justify-center">
        {(showAllSocieties ? societies : societies.slice(0, 6)).map((soc) => (
          <button
            key={soc}
            onClick={() => setSelectedSociety(soc)}
            className={`px-3 py-1.5 rounded-full text-xs sm:text-sm border transition ${
              selectedSociety === soc
                ? "bg-emerald-500 text-white border-emerald-500"
                : "bg-white text-gray-600 border-[#e5e5e5] hover:bg-gray-100"
            }`}
          >
            {soc}
          </button>
        ))}

        {/* ✅ Show More / Less Button */}
        {societies.length > 6 && (
          <button
            onClick={() => setShowAllSocieties(!showAllSocieties)}
            className="px-3 py-1.5 rounded-full text-xs sm:text-sm border border-[#ddd] text-gray-600 hover:bg-gray-100"
          >
            {showAllSocieties ? "Show Less ▲" : "Show More ▼"}
          </button>
        )}
      </div>

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
