import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "./Navbar";
import Footer from "./Footer";

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
    return <p className="text-white text-center mt-10 text-lg">Loading...</p>;

  return (
    <>
      {/* Navbar */}
      <Navbar />
      <div className="min-h-screen flex flex-col bg-gradient-to-r from-black/80 to-green-950/40 text-gray-200">
        {/* Page Content */}
        <div className="flex-grow max-w-6xl mx-auto px-6 py-12">
          {/* Page Heading */}
          <h1 className="text-4xl md:text-5xl font-bold text-green-400 text-center mb-8">
            Past Events
          </h1>

          {/* Subtext */}
          <p className="text-center text-gray-300 max-w-2xl mx-auto text-lg leading-relaxed mb-10">
            Explore all previously held events across KIIT. Relive the
            experiences, memories, and highlights of what made each event
            special.
          </p>

          {/* No Events */}
          {events.length === 0 ? (
            <p className="text-center text-2xl font-semibold text-gray-400 mt-20">
              No past events available.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {events.map((event) => (
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
                  <h2 className="text-xl font-bold text-green-300 mb-2">
                    {event.title}
                  </h2>

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
              ))}
            </div>
          )}
        </div>

        {/* Footer — FIXED at bottom */}
        <Footer />
      </div>
    </>
  );
}
