import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import Navbar from "./Navbar";
import Footer from "./Footer";
import Doodles from "./Doodles";
import Spinner from "./Spinner";

const EditEvent = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [removing, setRemoving] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        if (import.meta.env.MODE === "development")
          console.log("[EditEvent] Fetching event:", eventId);

        const token = localStorage.getItem("token");
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/events/${eventId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setEvent(res.data);

        if (import.meta.env.MODE === "development")
          console.log("[EditEvent] Event fetched successfully:", res.data);
      } catch (err) {
        console.error("[EditEvent] Error fetching event:", err);
        setError("Failed to fetch event details");
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [eventId]);

  const handleChange = (e) => {
    setEvent({ ...event, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/events/${eventId}`,
        event,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Event updated successfully!");
      setTimeout(() => navigate("/dashboard"), 1200);
    } catch (err) {
      console.error("[EditEvent] Error updating event:", err);
      toast.error(err.response?.data?.message || "Failed to update event");
    } finally {
      setSubmitting(false);
    }
  };

  const handleRemove = async () => {
    if (!window.confirm("Are you sure you want to remove this event?")) return;
    setRemoving(true);
    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/events/${eventId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Event removed.");
      navigate("/dashboard");
    } catch (err) {
      console.error("[EditEvent] Error removing event:", err);
      toast.error(err.response?.data?.message || "Failed to remove event");
    } finally {
      setRemoving(false);
    }
  };

  if (loading)
    return (
      <>
        <Navbar />
        <p className="text-center mt-10 text-gray-500">Loading...</p>
      </>
    );
  if (error)
    return (
      <>
        <Navbar />
        <p className="text-red-500 text-center mt-10">{error}</p>
      </>
    );

  const inputClass =
    "rounded-lg p-3 w-full bg-white border border-[#e5e5e5] text-[#111] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all";

  return (
    <>
      <Navbar />

      <div className="relative overflow-hidden flex flex-col">
        <Doodles variant="hero" />
        <div className="relative z-10 flex justify-center px-4 py-10">
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-3xl bg-white border border-[#e5e5e5] rounded-2xl p-6 sm:p-10 shadow-sm"
          >
          <h1 className="font-display text-3xl font-bold text-center mb-2 text-[#111] tracking-tightish">
            Edit{" "}
            <span className="bg-gradient-to-r from-emerald-600 via-emerald-500 to-emerald-400 bg-clip-text text-transparent">
              Event
            </span>
          </h1>
          <p className="text-center text-sm text-gray-500 mb-8">
            Update event information or remove the event entirely.
          </p>

          <div className="flex flex-col gap-4">
            <input
              type="text"
              name="title"
              value={event.title}
              onChange={handleChange}
              placeholder="Event Title"
              className={inputClass}
              required
            />

            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="date"
                name="date"
                value={event.date}
                onChange={handleChange}
                className={`flex-1 ${inputClass}`}
                required
              />
              <input
                type="time"
                name="time"
                value={event.time}
                onChange={handleChange}
                className={`flex-1 ${inputClass}`}
                required
              />
            </div>

            <input
              type="text"
              name="location"
              value={event.location}
              onChange={handleChange}
              placeholder="Location"
              className={inputClass}
            />

            <textarea
              name="description"
              value={event.description}
              onChange={handleChange}
              placeholder="Description"
              rows={4}
              className={`${inputClass} resize-none`}
            />

            <input
              type="text"
              name="guest"
              value={event.guest}
              onChange={handleChange}
              placeholder="Guest"
              className={inputClass}
            />

            <select
              name="registrationStatus"
              value={event.registrationStatus}
              onChange={handleChange}
              className={inputClass}
            >
              <option value="open">Open</option>
              <option value="closed">Closed</option>
              <option value="upcoming">Upcoming</option>
            </select>

            <input
              type="text"
              name="coverImageURL"
              value={event.coverImageURL}
              onChange={handleChange}
              placeholder="Cover Image URL"
              className={inputClass}
            />

            <select
              name="eventCategory"
              value={event.eventCategory}
              onChange={handleChange}
              required
              className={inputClass}
            >
              <option value="" disabled>
                Event Category
              </option>
              <option value="Music">Music</option>
              <option value="Dance">Dance</option>
              <option value="Party">Party</option>
              <option value="Other">Other</option>
            </select>

            <div className="flex flex-col sm:flex-row gap-3 mt-4">
              <button
                type="submit"
                disabled={submitting || removing}
                className="flex-1 py-3 bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 disabled:bg-emerald-300 disabled:cursor-not-allowed rounded-lg font-semibold text-white shadow-sm transition-all flex items-center justify-center gap-2"
              >
                {submitting && <Spinner className="w-4 h-4" />}
                {submitting ? "Updating…" : "Update Event"}
              </button>

              <button
                type="button"
                onClick={handleRemove}
                disabled={submitting || removing}
                className="flex-1 py-3 border border-red-300 text-red-600 hover:bg-red-50 hover:border-red-400 disabled:opacity-60 disabled:cursor-not-allowed rounded-lg font-semibold transition-all flex items-center justify-center gap-2"
              >
                {removing && <Spinner className="w-4 h-4" />}
                {removing ? "Removing…" : "Remove Event"}
              </button>
            </div>
          </div>
        </form>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default EditEvent;
