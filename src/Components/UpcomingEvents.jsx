import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { useNavigate } from "react-router-dom";
import { optimizeCard } from "../utils/imageOptimization";
import { formatEventDateTime } from "../utils/formatDate";
import Doodles from "./Doodles";
import { SkeletonGrid } from "./Skeleton";
import EmptyState, { CalendarIcon } from "./EmptyState";

const UpcomingEvents = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUpcomingEvents = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/events/upcoming`
        );
        setEvents(res.data);
      } catch (err) {
        console.error("[UpcomingEvents] Error fetching events:", err);
        setError("Failed to fetch upcoming events");
      } finally {
        setLoading(false);
      }
    };

    fetchUpcomingEvents();
  }, []);

  if (loading)
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="relative flex-grow overflow-hidden flex flex-col">
          <Doodles variant="hero" />
          <main className="relative z-10 flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 py-10">
            <div className="space-y-3 mb-10 text-center">
              <div className="h-8 w-72 max-w-full bg-[#f0f0eb] rounded animate-pulse mx-auto" />
              <div className="h-3 w-96 max-w-full bg-[#f0f0eb] rounded animate-pulse mx-auto" />
            </div>
            <SkeletonGrid count={6} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" />
          </main>
        </div>
      </div>
    );
  if (error)
    return (
      <>
        <Navbar />
        <p className="text-red-500 text-center mt-10">{error}</p>
      </>
    );

  const outlineBtn =
    "text-sm border border-[#e5e5e5] text-[#333] hover:bg-gray-50 hover:border-emerald-200 font-medium rounded-lg px-5 py-2.5 transition-all";

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="relative flex-grow overflow-hidden flex flex-col">
        <Doodles variant="hero" />
        <main className="relative z-10 flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 py-10">
        <div className="mb-10 pt-2 text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-[#111] tracking-tightish">
            Upcoming{" "}
            <span className="bg-gradient-to-r from-emerald-600 via-emerald-500 to-emerald-400 bg-clip-text text-transparent">
              Events
            </span>
          </h2>
          <p className="text-gray-500 mt-3">
            Plan ahead — here's what's coming up around campus.
          </p>
        </div>

        {events.length === 0 ? (
          <EmptyState
            icon={<CalendarIcon />}
            title="No upcoming events right now"
            description="Check back soon — new events drop all the time."
            action={
              <>
                <button
                  onClick={() => navigate("/PastEvents")}
                  className={outlineBtn}
                >
                  View Past Events
                </button>
                <button onClick={() => navigate("/")} className={outlineBtn}>
                  View Ongoing Events
                </button>
              </>
            }
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <div
                key={event._id}
                className="bg-white border border-[#e5e5e5] rounded-xl overflow-hidden flex flex-col transition-all duration-300 ease-out hover:shadow-xl hover:-translate-y-1 hover:scale-[1.01] group"
              >
                {event.coverImageURL && (
                  <img
                    src={optimizeCard(event.coverImageURL)}
                    alt={event.title}
                    loading="lazy"
                    className="w-full h-44 object-cover bg-gray-100"
                  />
                )}
                <div className="p-4 flex flex-col flex-1">
                  <h3 className="text-base sm:text-lg font-semibold text-[#111] group-hover:text-emerald-600 transition line-clamp-2">
                    {event.title}
                  </h3>
                  {event.description && (
                    <p className="text-gray-500 text-sm mt-1 line-clamp-2">
                      {event.description}
                    </p>
                  )}

                  <div className="text-gray-400 text-xs mt-3 space-y-0.5">
                    <p>{formatEventDateTime(event.date, event.time)}</p>
                    <p>{event.location}</p>
                    <p>{event.eventCategory}</p>
                  </div>

                  <div className="mt-auto pt-3 border-t border-[#eee] flex items-center justify-between">
                    <span className="text-xs px-2 py-1 rounded-md font-medium bg-yellow-100 text-yellow-700 capitalize">
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
        )}
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default UpcomingEvents;
