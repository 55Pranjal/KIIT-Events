import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { useNavigate } from "react-router-dom";
import { optimizeCard } from "../utils/imageOptimization";
import { formatEventDateTime, getEventStart as getEventStartIST } from "../utils/formatDate";
import Doodles from "./Doodles";
import { SkeletonGrid } from "./Skeleton";
import EmptyState, { CalendarIcon, SearchIcon } from "./EmptyState";

/**
 * EventsPage
 * - Ongoing / Upcoming: client-side classification from GET /api/events
 * - Past: server-driven via GET /api/events/past
 *
 * Classification rules:
 * - Upcoming: start > now AND registrationStatus === "upcoming"
 * - Ongoing: start > now AND registrationStatus === "open" | "closed"
 * - Past: obtained from server endpoint /api/events/past
 */
const EventsPage = () => {
  const navigate = useNavigate();
  const BACKEND = import.meta.env.VITE_BACKEND_URL?.replace(/\/$/, "") || "";

  const [events, setEvents] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(false);
  const [eventsError, setEventsError] = useState("");

  const [pastEvents, setPastEvents] = useState([]);
  const [loadingPast, setLoadingPast] = useState(false);
  const [pastError, setPastError] = useState("");

  const [view, setView] = useState("ongoing"); // "ongoing" | "upcoming" | "past"
  const [search, setSearch] = useState("");
  const [selectedSociety, setSelectedSociety] = useState("All");

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

  // Use the shared IST-aware helper so client and server agree on which
  // moment an event represents. Falls back to "now" only as a last resort
  // so the classification reducer below doesn't crash on bad data.
  const getEventStart = (ev) => getEventStartIST(ev.date, ev.time) || new Date();

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

  const counts = useMemo(() => {
    const now = new Date();
    let ongoing = 0,
      upcoming = 0;
    events.forEach((ev) => {
      const start = getEventStart(ev);
      if (start.getTime() <= now.getTime()) return;
      const status = String(ev.registrationStatus || "").toLowerCase();
      if (status === "upcoming") upcoming++;
      else if (status === "open" || status === "closed") ongoing++;
      else upcoming++;
    });
    return { ongoing, upcoming, past: pastEvents.length || 0 };
  }, [events, pastEvents]);

  const statusPill = {
    open: "bg-emerald-100 text-emerald-700",
    upcoming: "bg-yellow-100 text-yellow-700",
    closed: "bg-red-100 text-red-600",
    past: "bg-gray-100 text-gray-600",
  };

  const pillFor = (ev, isPast) => {
    if (isPast) return statusPill.past;
    return (
      statusPill[String(ev.registrationStatus || "").toLowerCase()] ||
      statusPill[ev._computed?.category] ||
      "bg-gray-100 text-gray-600"
    );
  };

  const renderEventCard = (ev, isPast = false) => (
    <div
      key={ev._id}
      className="bg-white border border-[#e5e5e5] rounded-xl overflow-hidden flex flex-col transition-all duration-300 ease-out hover:shadow-xl hover:-translate-y-1 hover:scale-[1.01] group"
    >
      {ev.coverImageURL && (
        <img
          src={optimizeCard(ev.coverImageURL)}
          alt={ev.title}
          loading="lazy"
          className="w-full h-44 object-cover bg-gray-100"
        />
      )}

      <div className="p-4 flex flex-col flex-1">
        <h3 className="text-base sm:text-lg font-semibold text-[#111] group-hover:text-emerald-600 transition line-clamp-2">
          {ev.title}
        </h3>

        {ev.description && (
          <p className="text-gray-500 text-sm mt-1 line-clamp-2 leading-relaxed">
            {ev.description}
          </p>
        )}

        <div className="text-gray-400 text-xs mt-3 space-y-0.5">
          <p>{formatEventDateTime(ev.date, ev.time)}</p>
          {ev.location && <p>{ev.location}</p>}
          {ev.eventCategory && <p>{ev.eventCategory}</p>}
        </div>

        {ev.societyId?.name && (
          <p className="text-xs text-emerald-600 font-medium mt-2">
            {ev.societyId.name}
          </p>
        )}

        <div className="mt-4 pt-3 border-t border-[#eee] flex items-center justify-between gap-2">
          <span
            className={`text-xs px-2 py-1 rounded-md font-medium capitalize ${pillFor(
              ev,
              isPast
            )}`}
          >
            {isPast
              ? "past"
              : ev.registrationStatus || ev._computed?.category || "—"}
          </span>

          <button
            onClick={() =>
              navigate(
                isPast
                  ? `/events/${ev._id}/highlights`
                  : `/events/${ev._id}`
              )
            }
            className="text-xs px-3 py-1.5 rounded-md bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 text-white font-medium shadow-sm transition"
          >
            {isPast ? "View Highlights" : "View Details"}
          </button>
        </div>
      </div>
    </div>
  );

  const tabBtn = (key, label, count) => (
    <button
      onClick={() => setView(key)}
      className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
        view === key
          ? "bg-emerald-500 text-white shadow-sm"
          : "text-gray-600 hover:text-emerald-600 hover:bg-white"
      }`}
    >
      {label}
      {count ? (
        <span
          className={`ml-1.5 text-xs ${
            view === key ? "text-white/80" : "text-gray-400"
          }`}
        >
          ({count})
        </span>
      ) : null}
    </button>
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="relative flex-1 overflow-hidden flex flex-col">
        <Doodles variant="hero" />

        <main className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 py-10 flex-1">
          {/* Header */}
          <div className="mb-8 pt-2">
            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-[#111] tracking-tightish">
              Browse{" "}
              <span className="bg-gradient-to-r from-emerald-600 via-emerald-500 to-emerald-400 bg-clip-text text-transparent">
                Events
              </span>
            </h1>
            <p className="text-sm md:text-base text-gray-500 max-w-2xl mt-2">
              Explore ongoing, upcoming and past events. Filter by society or
              search by title or description.
            </p>
          </div>

        {/* Controls bar */}
        <div className="bg-white border border-[#e5e5e5] rounded-2xl p-3 sm:p-4 shadow-sm flex flex-col lg:flex-row lg:items-center gap-3 mb-6">
          {/* Tabs */}
          <div className="rounded-lg bg-[#f7faf8] border border-[#eeeeea] p-1 flex gap-1 flex-shrink-0">
            {tabBtn("ongoing", "Ongoing", counts.ongoing)}
            {tabBtn("upcoming", "Upcoming", counts.upcoming)}
            {tabBtn("past", "Past", counts.past)}
          </div>

          {/* Search + filter — stretch */}
          <div className="flex flex-col sm:flex-row gap-2 flex-1 lg:ml-auto">
            <input
              type="text"
              placeholder="Search by title or description..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 rounded-lg px-4 py-2.5 bg-white border border-[#e5e5e5] text-[#111] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
            />

            <select
              className="rounded-lg px-4 py-2.5 bg-white border border-[#e5e5e5] text-[#111] focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all sm:w-56"
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

        {/* Active filter chips */}
        {(selectedSociety !== "All" || search) && (
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="text-[11px] uppercase tracking-wider font-semibold text-gray-400">
              Active filters
            </span>
            {selectedSociety !== "All" && (
              <FilterChip
                label="Society"
                value={selectedSociety}
                onRemove={() => setSelectedSociety("All")}
              />
            )}
            {search && (
              <FilterChip
                label="Search"
                value={`"${search}"`}
                onRemove={() => setSearch("")}
              />
            )}
            <button
              onClick={() => {
                setSelectedSociety("All");
                setSearch("");
              }}
              className="text-xs text-gray-500 hover:text-emerald-600 font-medium underline-offset-4 hover:underline transition"
            >
              Clear all
            </button>
          </div>
        )}

        {/* Summary */}
        <div className="text-sm text-gray-500 mb-6">
          Showing{" "}
          <span className="font-semibold text-[#111]">
            {view === "past"
              ? visiblePastEvents.length
              : visibleClientEvents.length}
          </span>{" "}
          {view} event
          {(view === "past"
            ? visiblePastEvents.length
            : visibleClientEvents.length) === 1
            ? ""
            : "s"}
          .
        </div>

        {/* Content */}
        {view === "past" ? (
          <>
            {loadingPast ? (
              <SkeletonGrid count={8} />
            ) : pastError ? (
              <p className="text-red-500 text-center py-12">{pastError}</p>
            ) : visiblePastEvents.length === 0 ? (
              <EmptyState
                icon={<CalendarIcon />}
                title="No past events yet"
                description="Once events wrap up, their highlights will show up here."
              />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {visiblePastEvents.map((ev) => renderEventCard(ev, true))}
              </div>
            )}
          </>
        ) : (
          <>
            {loadingEvents ? (
              <SkeletonGrid count={8} />
            ) : eventsError ? (
              <p className="text-red-500 text-center py-12">{eventsError}</p>
            ) : visibleClientEvents.length === 0 ? (
              <EmptyState
                icon={
                  search || selectedSociety !== "All" ? (
                    <SearchIcon />
                  ) : (
                    <CalendarIcon />
                  )
                }
                title={`No ${view} events found`}
                description={
                  search || selectedSociety !== "All"
                    ? "Try clearing your search or society filter."
                    : "Check back later — fresh events drop all the time."
                }
                action={
                  (search || selectedSociety !== "All") && (
                    <button
                      onClick={() => {
                        setSearch("");
                        setSelectedSociety("All");
                      }}
                      className="px-5 py-2.5 border border-[#e5e5e5] hover:bg-gray-50 text-[#333] rounded-lg text-sm font-medium transition"
                    >
                      Clear filters
                    </button>
                  )
                }
              />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {visibleClientEvents.map((ev) => renderEventCard(ev, false))}
              </div>
            )}
          </>
        )}
        </main>
      </div>

      <Footer />
    </div>
  );
};

function FilterChip({ label, value, onRemove }) {
  return (
    <span className="inline-flex items-center gap-1 pl-3 pr-1 py-1 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-full text-xs font-medium">
      <span>
        <span className="text-emerald-600/70">{label}:</span>{" "}
        <span className="font-semibold">{value}</span>
      </span>
      <button
        type="button"
        onClick={onRemove}
        aria-label={`Remove ${label} filter`}
        className="ml-0.5 w-5 h-5 inline-flex items-center justify-center rounded-full hover:bg-emerald-100 text-emerald-700 transition"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-3 h-3"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </span>
  );
}

export default EventsPage;
