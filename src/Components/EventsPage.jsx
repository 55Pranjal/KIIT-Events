import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { useNavigate } from "react-router-dom";

/**
 * EventsPage
 * - Ongoing / Upcoming: client-side classification from GET /api/events
 * - Past: server-driven via GET /api/events/past
 *
 * Classification rules (as provided earlier):
 * - Upcoming: start > now AND registrationStatus === "upcoming"
 * - Ongoing: start > now AND registrationStatus === "open" | "closed"
 * - Past: obtained from server endpoint /api/events/past
 */
const EventsPage = () => {
  const navigate = useNavigate();
  const BACKEND = import.meta.env.VITE_BACKEND_URL?.replace(/\/$/, "") || "";

  // global states
  const [events, setEvents] = useState([]); // used for ongoing/upcoming classification
  const [loadingEvents, setLoadingEvents] = useState(false);
  const [eventsError, setEventsError] = useState("");

  // past-specific states (fetched from server)
  const [pastEvents, setPastEvents] = useState([]);
  const [loadingPast, setLoadingPast] = useState(false);
  const [pastError, setPastError] = useState("");

  const [view, setView] = useState("ongoing"); // "ongoing" | "upcoming" | "past"
  const [search, setSearch] = useState("");
  const [selectedSociety, setSelectedSociety] = useState("All");

  // Fetch all events for classification (ongoing/upcoming)
  useEffect(() => {
    const fetchEvents = async () => {
      setLoadingEvents(true);
      setEventsError("");
      try {
        const res = await axios.get(`${BACKEND}/api/events`);
        if (Array.isArray(res.data)) {
          setEvents(res.data);
        } else {
          console.warn(
            "[EventsPage] unexpected /api/events response",
            res.data
          );
          setEvents([]);
        }
      } catch (err) {
        console.error(
          "[EventsPage] fetch /api/events failed:",
          err?.response?.data || err.message
        );
        setEvents([]);
        setEventsError(
          err?.response?.data?.message || "Failed to load events."
        );
      } finally {
        setLoadingEvents(false);
      }
    };

    fetchEvents();
  }, [BACKEND]);

  // Fetch past events from server when view === 'past'
  useEffect(() => {
    if (view !== "past") return;

    const fetchPast = async () => {
      setLoadingPast(true);
      setPastError("");
      try {
        const res = await axios.get(`${BACKEND}/api/events/past`);
        if (Array.isArray(res.data)) {
          setPastEvents(res.data);
        } else {
          console.warn(
            "[EventsPage] unexpected /api/events/past response",
            res.data
          );
          setPastEvents([]);
        }
      } catch (err) {
        console.error(
          "[EventsPage] fetch /api/events/past failed:",
          err?.response?.data || err.message
        );
        setPastEvents([]);
        setPastError(
          err?.response?.data?.message || "Failed to load past events."
        );
      } finally {
        setLoadingPast(false);
      }
    };

    fetchPast();
  }, [BACKEND, view]);

  // helper: parse event start datetime (local)
  const getEventStart = (ev) => {
    const dateStr = (ev.date || "").trim(); // expecting "YYYY-MM-DD"
    const timeStr = (ev.time || "00:00").trim(); // default to midnight if missing
    const iso = `${dateStr}T${timeStr}`;
    const start = new Date(iso);
    if (!isNaN(start.getTime())) return start;

    const fallbackDate = new Date(dateStr);
    if (!isNaN(fallbackDate.getTime())) {
      fallbackDate.setHours(0, 0, 0, 0);
      return fallbackDate;
    }

    return new Date();
  };

  // client-side classification for ongoing/upcoming (per your rules)
  const eventsWithClassification = useMemo(() => {
    const now = new Date();
    return events.map((ev) => {
      const start = getEventStart(ev);
      let category = "upcoming";

      if (start.getTime() <= now.getTime()) {
        category = "past";
      } else {
        const status = String(ev.registrationStatus || "").toLowerCase();
        if (status === "upcoming") category = "upcoming";
        else if (status === "open" || status === "closed") category = "ongoing";
        else category = "upcoming";
      }

      return { ...ev, _computed: { start, category } };
    });
  }, [events]);

  // societies for filter (combine both sources so the dropdown is useful for Past as well)
  const societies = useMemo(() => {
    const set = new Set();
    eventsWithClassification.forEach((ev) => {
      const name = ev.societyId?.name?.trim();
      if (name) set.add(name);
    });
    (pastEvents || []).forEach((ev) => {
      const name = ev.societyId?.name?.trim();
      if (name) set.add(name);
    });
    return ["All", ...Array.from(set).sort()];
  }, [eventsWithClassification, pastEvents]);

  // visible events for ongoing/upcoming (client-side filtered)
  const visibleClientEvents = useMemo(() => {
    const q = search.trim().toLowerCase();
    return eventsWithClassification
      .filter(
        (ev) =>
          ev._computed.category ===
          (view === "ongoing" || view === "upcoming" ? view : "ongoing")
      )
      .filter((ev) => {
        if (selectedSociety && selectedSociety !== "All") {
          const name = ev.societyId?.name || "";
          if (
            name.trim().toLowerCase() !== selectedSociety.trim().toLowerCase()
          )
            return false;
        }
        if (!q) return true;
        return (
          (ev.title || "").toLowerCase().includes(q) ||
          (ev.description || "").toLowerCase().includes(q)
        );
      })
      .sort((a, b) => a._computed.start - b._computed.start);
  }, [eventsWithClassification, view, search, selectedSociety]);

  // visible events for past (server-driven, still allow client filtering/search)
  const visiblePastEvents = useMemo(() => {
    const q = search.trim().toLowerCase();
    return (pastEvents || [])
      .filter((ev) => {
        if (selectedSociety && selectedSociety !== "All") {
          const name = ev.societyId?.name || "";
          if (
            name.trim().toLowerCase() !== selectedSociety.trim().toLowerCase()
          )
            return false;
        }
        if (!q) return true;
        return (
          (ev.title || "").toLowerCase().includes(q) ||
          (ev.description || "").toLowerCase().includes(q)
        );
      })
      .sort((a, b) => {
        const aStart = getEventStart(a).getTime();
        const bStart = getEventStart(b).getTime();
        return bStart - aStart;
      });
  }, [pastEvents, search, selectedSociety]);

  const formatDate = (d) => {
    if (!d) return "";
    try {
      return d.toLocaleString();
    } catch {
      return String(d);
    }
  };

  // counts for badges
  const counts = useMemo(() => {
    const now = new Date();
    let ongoing = 0,
      upcoming = 0;
    events.forEach((ev) => {
      const start = getEventStart(ev);
      if (start.getTime() <= now.getTime()) return; // skip past
      const status = String(ev.registrationStatus || "").toLowerCase();
      if (status === "upcoming") upcoming++;
      else if (status === "open" || status === "closed") ongoing++;
      else upcoming++;
    });
    return { ongoing, upcoming, past: pastEvents.length || 0 };
  }, [events, pastEvents]);

  // --- card renderers ---
  const renderEventCard = (ev, isPast = false) => {
    // unchanged card for ongoing/upcoming
    return (
      <div
        key={ev._id}
        className="bg-black/40 border border-gray-700 rounded-xl p-5 hover:border-green-500 hover:shadow-[0_0_15px_rgba(0,255,80,0.15)] transition-all"
      >
        {ev.coverImageURL && (
          <img
            src={ev.coverImageURL}
            alt={ev.title}
            className="w-full h-44 object-cover rounded-lg mb-4 border border-green-700/40"
          />
        )}

        <h2 className="text-xl font-bold text-green-300 mb-2">{ev.title}</h2>

        <p className="text-gray-300 text-sm leading-relaxed mb-3 line-clamp-3">
          {ev.description}
        </p>

        <div className="text-gray-400 text-sm space-y-1">
          <p>
            📅 {ev.date} {ev.time ? `at ${ev.time}` : ""}
          </p>
          {ev.location && <p>📍 {ev.location}</p>}
          <p>📂 {ev.eventCategory || "—"}</p>
          {ev.societyId && (
            <p className="text-green-400 font-semibold">
              Organised by: {ev.societyId.name}
            </p>
          )}
        </div>

        <div className="mt-4 flex items-center justify-between">
          <button
            onClick={() => navigate(`/events/${ev._id}`)}
            className="px-3 py-1 rounded bg-gradient-to-r from-green-700 to-emerald-600 text-white text-sm font-semibold"
          >
            View Details
          </button>

          <span className="text-xs text-gray-300 px-2 py-0.5 rounded bg-white/5">
            {isPast ? "past" : ev._computed?.category || "—"}
          </span>
        </div>
      </div>
    );
  };

  // --- NEW: exact past-card markup you provided ---
  const renderPastCard = (event) => {
    return (
      <div
        key={event._id}
        className="
          bg-black/40 
          border border-gray-700 
          rounded-xl 
          p-5 
          hover:border-green-500 
          hover:shadow-[0_0_15px_rgba(0,255,80,0.2)]
          transition-all
        "
      >
        {/* Image */}
        {event.coverImageURL && (
          <img
            src={event.coverImageURL}
            alt={event.title}
            className="w-full h-44 object-cover rounded-lg mb-4 border border-green-700/40"
          />
        )}

        {/* Title */}
        <h2 className="text-xl font-bold text-green-300 mb-2">{event.title}</h2>

        {/* Description */}
        <p className="text-gray-300 text-sm leading-relaxed mb-3 line-clamp-3">
          {event.description}
        </p>

        {/* Event Meta */}
        <div className="text-gray-400 text-sm space-y-1">
          <p>
            📅 {event.date} at {event.time}
          </p>
          <p>📍 {event.location}</p>
          <p>📂 {event.eventCategory}</p>
          {event.societyId && (
            <p className="text-green-400 font-semibold">
              Organised by: {event.societyId.name}
            </p>
          )}
        </div>
      </div>
    );
  };

  return (
    // parent is a column flex so footer can be placed at bottom
    <div className="min-h-screen bg-gradient-to-br from-black via-[#001a0f] to-[#003319] text-white flex flex-col">
      <Navbar />

      {/* main grows so footer sticks to bottom on short pages */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 py-8">
        {/* Header & controls */}
        <div className="flex items-start md:items-center gap-4 md:gap-8 flex-col md:flex-row">
          <div>
            <h1 className="text-3xl font-bold mb-2">Events</h1>
            <p className="text-sm text-gray-300 max-w-xl">
              Browse ongoing, upcoming and past events. Use the filters to find
              events by society or search by title/description.
            </p>
          </div>

          <div className="ml-auto flex items-center gap-3 mt-4 md:mt-0">
            <div className="rounded-lg bg-black/50 p-1 flex gap-1">
              <button
                onClick={() => setView("ongoing")}
                className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                  view === "ongoing"
                    ? "bg-gradient-to-r from-green-700 to-emerald-600 text-white"
                    : "text-green-300"
                }`}
              >
                Ongoing {counts.ongoing ? `(${counts.ongoing})` : ""}
              </button>
              <button
                onClick={() => setView("upcoming")}
                className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                  view === "upcoming"
                    ? "bg-gradient-to-r from-green-700 to-emerald-600 text-white"
                    : "text-green-300"
                }`}
              >
                Upcoming {counts.upcoming ? `(${counts.upcoming})` : ""}
              </button>
              <button
                onClick={() => setView("past")}
                className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                  view === "past"
                    ? "bg-gradient-to-r from-green-700 to-emerald-600 text-white"
                    : "text-green-300"
                }`}
              >
                Past {counts.past ? `(${counts.past})` : ""}
              </button>
            </div>

            <input
              type="text"
              placeholder="Search by title or description..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="rounded-lg p-2 bg-[#0d1b12] border border-green-700/40 text-green-200 outline-none min-w-[220px]"
            />

            <select
              className="rounded-lg p-2 bg-[#0d1b12] border border-green-700/40 text-green-200"
              value={selectedSociety}
              onChange={(e) => setSelectedSociety(e.target.value)}
            >
              {societies.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Summary */}
        <div className="flex items-center gap-4 text-sm text-gray-300 mt-6 mb-6">
          <div>
            Showing:{" "}
            <span className="font-semibold text-green-300">
              {view === "past"
                ? visiblePastEvents.length
                : visibleClientEvents.length}
            </span>{" "}
            {view}
          </div>
          <div className="text-xs text-gray-400">
            Now: {formatDate(new Date())}
          </div>
        </div>

        {/* Content */}
        {view === "past" ? (
          <>
            {loadingPast ? (
              <p className="text-white text-center mt-10 text-lg">Loading...</p>
            ) : pastError ? (
              <p className="text-red-400 text-center mt-10">{pastError}</p>
            ) : visiblePastEvents.length === 0 ? (
              <>
                <h2 className="text-4xl md:text-5xl font-bold text-green-400 text-center mb-8">
                  Past Events
                </h2>
                <p className="text-center text-gray-300 max-w-2xl mx-auto text-lg leading-relaxed mb-10">
                  Explore all previously held events across KIIT. Relive the
                  experiences, memories, and highlights of what made each event
                  special.
                </p>
                <p className="text-center text-2xl font-semibold text-gray-400 mt-20">
                  No past events available.
                </p>
              </>
            ) : (
              <>
                <h2 className="text-4xl md:text-5xl font-bold text-green-400 text-center mb-4">
                  Past Events
                </h2>
                <p className="text-center text-gray-300 max-w-2xl mx-auto text-lg leading-relaxed mb-8">
                  Explore all previously held events across KIIT. Relive the
                  experiences, memories, and highlights of what made each event
                  special.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {visiblePastEvents.map((ev) => renderPastCard(ev))}
                </div>
              </>
            )}
          </>
        ) : (
          <>
            {loadingEvents ? (
              <div className="text-center py-12 text-gray-300">
                Loading events…
              </div>
            ) : eventsError ? (
              <div className="text-center py-12 text-red-400">
                {eventsError}
              </div>
            ) : visibleClientEvents.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                No {view} events found.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {visibleClientEvents.map((ev) => renderEventCard(ev, false))}
              </div>
            )}
          </>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default EventsPage;
