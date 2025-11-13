import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "./Navbar";
import Footer from "./Footer";

const UpcomingEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUpcomingEvents = async () => {
      console.log("[UpcomingEvents] Fetching upcoming events...");
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/events/upcoming`
        );
        console.log("[UpcomingEvents] Events fetched successfully:", res.data);
        setEvents(res.data);
      } catch (err) {
        console.error("[UpcomingEvents] Error fetching events:", err);
        setError("Failed to fetch upcoming events");
      } finally {
        setLoading(false);
        console.log("[UpcomingEvents] Loading state set to false.");
      }
    };

    fetchUpcomingEvents();
  }, []);

  if (loading)
    return <p className="text-white text-center mt-10">Loading...</p>;
  if (error) return <p className="text-red-500 text-center mt-10">{error}</p>;

  return (
    <>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow px-4 sm:px-6 md:px-8">
          <div className="max-w-7xl mx-auto mt-10 text-white">
            <h2 className="text-3xl sm:text-4xl font-bold my-10 text-center">
              Upcoming Events
            </h2>

            {events.length === 0 ? (
              <p className="text-center my-10 text-2xl sm:text-4xl font-bold">
                No upcoming events right now.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.map((event) => (
                  <div
                    key={event._id}
                    className="bg-black/50 border border-green-800 rounded-xl p-4 shadow-[0_0_15px_rgba(0,255,100,0.2)] hover:shadow-[0_0_25px_rgba(0,255,100,0.4)] transition-all w-full mx-auto my-4"
                  >
                    {event.coverImageURL && (
                      <img
                        src={event.coverImageURL}
                        alt={event.title}
                        className="w-full h-40 sm:h-48 object-cover rounded-md mb-3 border border-green-700"
                      />
                    )}
                    <h3 className="text-lg sm:text-xl font-bold mb-1 text-green-300">
                      {event.title}
                    </h3>
                    <p className="text-gray-300 text-sm sm:text-base">
                      {event.description}
                    </p>
                    <p className="text-gray-200 text-sm mb-1">
                      📅 {event.date} at {event.time}
                    </p>
                    <p className="text-gray-200 text-sm mb-2">
                      📍 {event.location}
                    </p>
                    <p className="text-gray-200 text-sm">
                      📂 {event.eventCategory}
                    </p>
                    <p className="border-yellow-500 text-yellow-300 font-semibold mt-2 capitalize text-sm sm:text-base">
                      {event.registrationStatus}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default UpcomingEvents;
