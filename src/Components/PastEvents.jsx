import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { optimizeCard } from "../utils/imageOptimization";
import { formatEventDateTime } from "../utils/formatDate";
import Doodles from "./Doodles";

export default function PastEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPastEvents = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/events/past`
        );
        setEvents(res.data);
      } catch (err) {
        console.error("Error fetching past events", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPastEvents();
  }, []);

  if (loading)
    return (
      <>
        <Navbar />
        <p className="text-gray-500 text-center mt-10">Loading...</p>
      </>
    );

  return (
    <>
      <Navbar />

      <div className="min-h-screen flex flex-col">
        <div className="relative flex-grow overflow-hidden flex flex-col">
          <Doodles variant="hero" />
          <div className="relative z-10 flex-grow max-w-6xl mx-auto w-full px-4 sm:px-6 py-12">
            <div className="text-center mb-10 pt-2">
              <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-[#111] tracking-tightish">
                Past{" "}
                <span className="bg-gradient-to-r from-emerald-600 via-emerald-500 to-emerald-400 bg-clip-text text-transparent">
                  Events
                </span>
              </h1>
              <p className="text-gray-500 max-w-2xl mx-auto mt-3 text-sm md:text-base leading-relaxed">
                Explore previously held events across campus. Relive the
                experiences, memories, and highlights of what made each event
                special.
              </p>
            </div>

          {events.length === 0 ? (
            <div className="bg-white border border-dashed border-[#e5e5e5] rounded-2xl p-12 text-center">
              <p className="text-xl font-semibold text-[#111] mb-1">
                No past events yet.
              </p>
              <p className="text-gray-500">Check back soon for highlights.</p>
            </div>
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

                  <div className="p-5 flex flex-col flex-1">
                    <h2 className="text-lg font-semibold text-[#111] group-hover:text-emerald-600 transition line-clamp-2">
                      {event.title}
                    </h2>

                    {event.description && (
                      <p className="text-gray-500 text-sm mt-1 line-clamp-3 leading-relaxed">
                        {event.description}
                      </p>
                    )}

                    <div className="text-gray-400 text-xs mt-3 space-y-0.5">
                      <p>{formatEventDateTime(event.date, event.time)}</p>
                      <p>{event.location}</p>
                      <p>{event.eventCategory}</p>
                    </div>

                    {event.societyId && (
                      <div className="mt-3 pt-3 border-t border-[#eee]">
                        <p className="text-xs text-gray-400">
                          Organised by{" "}
                          <span className="text-emerald-600 font-medium">
                            {event.societyId.name}
                          </span>
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
}
