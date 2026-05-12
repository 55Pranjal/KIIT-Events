import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import Navbar from "./Navbar";
import Footer from "./Footer";
import Doodles from "./Doodles";
import { SkeletonDetail } from "./Skeleton";
import { optimizeHero } from "../utils/imageOptimization";
import { formatEventDate, formatEventTime, getEventStart } from "../utils/formatDate";

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
        }
      } catch (err) {
        console.error("Error fetching event or registration:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  const handleRegister = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.warn("Please log in to register.");
      return;
    }

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/registers/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(res.data?.message || "Registered successfully.");
      setRegistered(true);
    } catch (err) {
      console.error("Registration failed:", err);
      toast.error(err.response?.data?.message || "Something went wrong.");
    }
  };

  if (loading)
    return (
      <>
        <Navbar />
        <div className="relative min-h-screen overflow-hidden">
          <Doodles variant="hero" />
          <div className="relative z-10 px-4 sm:px-6 lg:px-8 py-10">
            <SkeletonDetail />
          </div>
        </div>
      </>
    );
  if (!event)
    return (
      <>
        <Navbar />
        <p className="text-center mt-10 text-gray-500">Event not found</p>
      </>
    );

  const statusStyles = {
    open: "bg-emerald-100 text-emerald-700",
    upcoming: "bg-yellow-100 text-yellow-700",
    closed: "bg-red-100 text-red-600",
    past: "bg-gray-100 text-gray-600",
  };

  const eventStart = getEventStart(event.date, event.time);
  const isPast = !!eventStart && eventStart.getTime() <= Date.now();
  const canRegister =
    !isPast && event.registrationStatus === "open" && !registered;
  const displayStatus = isPast ? "past" : event.registrationStatus;
  const buttonLabel = registered
    ? "Registered"
    : isPast
    ? "Event Ended"
    : event.registrationStatus === "open"
    ? "Register Now"
    : "Registration Closed";

  return (
    <>
      <Navbar />

      <div className="relative min-h-screen overflow-hidden">
        <Doodles variant="hero" />
        <div className="relative z-10 px-4 sm:px-6 lg:px-8 py-10">
          <div className="max-w-4xl w-full mx-auto bg-white border border-[#e5e5e5] rounded-2xl shadow-sm overflow-hidden">
          {event.coverImageURL && (
            <img
              src={optimizeHero(event.coverImageURL)}
              alt={event.title}
              loading="eager"
              className="w-full h-56 sm:h-72 md:h-80 object-cover bg-gray-100"
            />
          )}

          <div className="p-6 sm:p-8 flex flex-col gap-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <h1 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-[#111] tracking-tightish">
                {event.title}
              </h1>
              <span
                className={`px-3 py-1 rounded-md text-xs font-medium capitalize ${
                  statusStyles[displayStatus] ||
                  "bg-gray-100 text-gray-600"
                }`}
              >
                {displayStatus}
              </span>
            </div>

            <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
              {event.description}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3 mt-2 text-sm">
              <div>
                <p className="text-xs uppercase tracking-wider text-gray-400 font-semibold mb-0.5">
                  When
                </p>
                <p className="text-[#111] font-medium">
                  {formatEventDate(event.date)}
                  {event.time ? ` at ${formatEventTime(event.time)}` : ""}
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-gray-400 font-semibold mb-0.5">
                  Location
                </p>
                <p className="text-[#111] font-medium">{event.location}</p>
              </div>
              {event.guest && (
                <div>
                  <p className="text-xs uppercase tracking-wider text-gray-400 font-semibold mb-0.5">
                    Guest
                  </p>
                  <p className="text-[#111] font-medium">{event.guest}</p>
                </div>
              )}
              {event.eventCategory && (
                <div>
                  <p className="text-xs uppercase tracking-wider text-gray-400 font-semibold mb-0.5">
                    Category
                  </p>
                  <p className="text-[#111] font-medium">
                    {event.eventCategory}
                  </p>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-[#eee]">
              <button
                onClick={handleRegister}
                disabled={!canRegister}
                className={`w-full sm:w-auto px-6 py-3 rounded-lg font-semibold text-sm transition-all shadow-sm ${
                  canRegister
                    ? "bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 text-white"
                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                }`}
              >
                {buttonLabel}
              </button>
            </div>
          </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default EventDetails;
