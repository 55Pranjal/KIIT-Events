import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Navbar from "./Navbar";
import Footer from "./Footer";

const EventDetails = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [registered, setRegistered] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/events/${id}`
        );
        setEvent(res.data);

        if (import.meta.env.MODE === "development") {
          console.log("✅ Event fetched successfully:", res.data);
        }

        const token = localStorage.getItem("token");
        if (token) {
          const regRes = await axios.get(
            `${import.meta.env.VITE_BACKEND_URL}/api/registers/my`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          const already = regRes.data.some((r) => r.eventId._id === id);
          setRegistered(already);

          if (import.meta.env.MODE === "development") {
            console.log(
              already
                ? "ℹ️ User is already registered for this event."
                : "ℹ️ User is not registered yet."
            );
          }
        }
      } catch (err) {
        if (import.meta.env.MODE === "development") {
          console.error("❌ Error fetching event or registration:", err);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  const handleRegister = async () => {
    const token = localStorage.getItem("token");
    if (!token) return alert("Please login to register");

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/registers/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert(res.data.message);
      setRegistered(true);

      if (import.meta.env.MODE === "development") {
        console.log("✅ Registration successful:", res.data);
      }
    } catch (err) {
      if (import.meta.env.MODE === "development") {
        console.error("❌ Registration failed:", err);
      }
      alert(err.response?.data?.message || "Something went wrong");
    }
  };

  if (loading)
    return <p className="text-center mt-10 text-gray-300">Loading...</p>;
  if (!event)
    return <p className="text-center mt-10 text-gray-300">Event not found</p>;

  return (
    <>
      <Navbar />
      <div className="min-h-screen text-gray-200 px-4 sm:px-6 lg:px-8 py-10">
        <div className="max-w-4xl w-full mx-auto bg-emerald-950 rounded-2xl shadow-2xl border border-green-800/30 overflow-hidden backdrop-blur-lg">
          <img
            src={event.coverImageURL}
            alt={event.title}
            className="w-full h-48 sm:h-64 md:h-80 object-cover"
          />

          <div className="p-5 sm:p-8 flex flex-col gap-4">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-green-400 tracking-tight text-center sm:text-left">
              {event.title}
            </h1>

            <p className="text-gray-300 text-sm sm:text-base leading-relaxed text-justify">
              {event.description}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3 text-gray-400 text-sm sm:text-base">
              <p>
                📅{" "}
                <span className="font-medium text-green-300">{event.date}</span>{" "}
                at{" "}
                <span className="font-medium text-green-300">{event.time}</span>
              </p>
              <p>📍 {event.location}</p>
              <p>🎤 Guest: {event.guest}</p>
              <p>📂 Category: {event.eventCategory}</p>
              <p className="sm:col-span-2">
                🟢 Status:{" "}
                <span
                  className={`font-semibold ${
                    event.registrationStatus === "open"
                      ? "text-green-400"
                      : event.registrationStatus === "upcoming"
                      ? "text-yellow-400"
                      : "text-red-500"
                  }`}
                >
                  {event.registrationStatus}
                </span>
              </p>
            </div>

            <div className="flex justify-center sm:justify-start">
              <button
                onClick={handleRegister}
                disabled={event.registrationStatus !== "open" || registered}
                className={`mt-6 w-full sm:w-auto px-6 py-3 rounded-lg font-semibold transition-all duration-300 shadow-md ${
                  event.registrationStatus === "open" && !registered
                    ? "bg-green-600 hover:bg-green-700 text-white"
                    : "bg-gray-700 text-gray-400 cursor-not-allowed"
                }`}
              >
                {registered
                  ? "Registered"
                  : event.registrationStatus === "open"
                  ? "Register Now"
                  : "Registration Closed"}
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default EventDetails;
