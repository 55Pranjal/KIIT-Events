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
    <div className="rounded-2xl mt-8 mx-4 md:mx-8 lg:mx-20 xl:mx-32">
      <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white text-left">
        Find your next event
      </h2>

      {/* Search + Admin Buttons */}
      <div className="flex flex-col md:flex-row justify-between md:items-start">
        <div className="flex mt-2 items-center bg-gradient-to-r from-black/80 to-green-950/40 border border-green-800 rounded-xl p-3 w-full lg:w-[70%] mb-6">
          <input
            type="text"
            placeholder="Find events near you..."
            className="bg-transparent outline-none text-green-300 w-full placeholder-gray-400"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex flex-col-reverse mt-4 md:flex-row md:ml-4 mb-4 md:mb-0 space-y-2 md:space-y-0 md:space-x-2">
          {user && user.role === "admin" && (
            <>
              <button
                onClick={() => navigate("/CreateEvent")}
                className="w-full md:w-auto text-green-700 border border-green-700 rounded-lg px-4 py-2"
              >
                Create Event
              </button>
              <button
                onClick={() => navigate("/CreateAnnouncements")}
                className="w-full md:w-auto text-green-700 border border-green-700 rounded-lg px-4 py-2"
              >
                Create Announcement
              </button>
            </>
          )}
        </div>
      </div>

      {/* Society Filters (data comes only from backend) */}
      <div className="w-full mt-6 border-b border-green-900/50 pb-4">
        <div className="flex flex-wrap gap-2 md:gap-3 justify-start">
          {loadingSocietyAccounts ? (
            <div className="text-xs text-gray-300 px-2 py-1">
              Loading societies…
            </div>
          ) : societyAccountsError ? (
            <div className="text-xs text-red-400 px-2 py-1">
              {societyAccountsError}
            </div>
          ) : societies.length > 0 ? (
            (showAllSocieties ? societies : societies.slice(0, 6)).map(
              (soc) => (
                <button
                  key={soc}
                  onClick={() => setSelectedSociety(soc)}
                  className={`px-3 py-1 md:px-4 md:py-2 rounded-lg font-medium text-xs sm:text-sm border whitespace-nowrap ${
                    selectedSociety === soc
                      ? "bg-gradient-to-r from-green-800 to-green-900 text-green-300 border-green-700"
                      : "bg-black/40 text-gray-300 border-green-900"
                  }`}
                >
                  {soc}
                </button>
              ),
            )
          ) : (
            <div className="text-xs text-gray-400 px-2 py-1">
              No societies available.
            </div>
          )}

          {societies.length > 6 && (
            <button
              onClick={() => setShowAllSocieties(!showAllSocieties)}
              className="px-3 py-1 md:px-4 md:py-2 rounded-lg font-medium text-xs sm:text-sm border border-green-800 text-green-300"
            >
              {showAllSocieties ? "Show Less ▲" : "Show More ▼"}
            </button>
          )}
        </div>
      </div>

      {/* Event List */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-10">
        <p className="text-white text-left font-bold text-3xl sm:text-4xl">
          {selectedSociety === "All"
            ? "All Events"
            : `${selectedSociety} Events`}
        </p>
        {/* <div>
          <button
            onClick={() => navigate("/Upcoming")}
            className="mr-2 text-white px-6 py-2 rounded-lg border border-white hover:bg-white/10"
          >
            View Upcoming Events
          </button>
          <button
            onClick={() => navigate("/PastEvents")}
            className="text-white px-6 py-2 rounded-lg border border-white hover:bg-white/10"
          >
            View Past Events
          </button>
        </div> */}
      </div>

      {/* Event Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8">
        {filteredEvents.length > 0 ? (
          filteredEvents.map((event) => (
            <div
              key={event._id}
              className="bg-black/50 border border-green-800 rounded-xl p-4 flex flex-col"
            >
              {event.coverImageURL && (
                <img
                  src={event.coverImageURL.replace(
                    "/upload/",
                    "/upload/w_400,h_250,c_fill,q_auto,f_auto/",
                  )}
                  alt={event.title}
                  loading="lazy"
                  className="w-full h-40 object-cover"
                />
              )}
              <h3 className="text-lg font-bold text-green-300 line-clamp-2">
                {event.title}
              </h3>
              <p className="text-sm text-gray-400 italic mb-2 line-clamp-1">
                {event.societyId?.name}
              </p>
              <p className="text-gray-200 text-sm mb-1">
                📅 {event.date} • {event.time}
              </p>
              <p className="text-gray-200 text-sm mb-4">📍 {event.location}</p>

              <div className="flex justify-between items-center mt-auto pt-2 border-t border-green-900/50">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium border ${
                    event.registrationStatus === "closed"
                      ? "bg-red-500/20 border-red-500 text-red-300"
                      : event.registrationStatus === "upcoming"
                        ? "bg-yellow-500/20 border-yellow-500 text-yellow-300"
                        : "bg-green-500/20 border-green-500 text-green-300"
                  }`}
                >
                  {event.registrationStatus}
                </span>
                <button
                  onClick={() => navigate(`/events/${event._id}`)}
                  className="font-semibold text-xs bg-gradient-to-r from-green-700 to-green-900 text-white rounded-md px-3 py-1"
                >
                  View Details
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="col-span-full text-center text-gray-400 mt-6">
            No events found.
          </p>
        )}
      </div>
    </div>
  );
};

export default MainSection;
