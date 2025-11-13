import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "./Navbar";
import Footer from "./Footer";

const EditEvent = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // Fetch event details
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

  // Handle input changes
  const handleChange = (e) => {
    setEvent({ ...event, [e.target.name]: e.target.value });
    if (import.meta.env.MODE === "development")
      console.log(
        `[EditEvent] Field changed: ${e.target.name} = ${e.target.value}`
      );
  };

  // Handle event update
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (import.meta.env.MODE === "development")
        console.log("[EditEvent] Updating event:", event);

      const token = localStorage.getItem("token");
      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/events/${eventId}`,
        event,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessage("Event updated successfully!");
      if (import.meta.env.MODE === "development")
        console.log("[EditEvent] Event updated successfully");

      setTimeout(() => navigate("/dashboard"), 1500);
    } catch (err) {
      console.error("[EditEvent] Error updating event:", err);
      setMessage(err.response?.data?.message || "Failed to update event");
    }
  };

  // Handle event removal
  const handleRemove = async () => {
    if (window.confirm("Are you sure you want to remove this event?")) {
      try {
        if (import.meta.env.MODE === "development")
          console.log("[EditEvent] Removing event:", eventId);

        const token = localStorage.getItem("token");
        await axios.delete(
          `${import.meta.env.VITE_BACKEND_URL}/api/events/${eventId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        alert("Event removed successfully!");
        if (import.meta.env.MODE === "development")
          console.log("[EditEvent] Event removed successfully");

        navigate("/dashboard");
      } catch (err) {
        console.error("[EditEvent] Error removing event:", err);
        alert(err.response?.data?.message || "Failed to remove event");
      }
    }
  };

  if (loading)
    return <p className="text-center mt-10 text-gray-300">Loading...</p>;
  if (error) return <p className="text-red-500 text-center mt-10">{error}</p>;

  return (
    <>
      <Navbar />

      <div className="flex justify-center items-center px-4 py-10">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-3xl bg-gradient-to-br from-black via-[#001a00] to-[#003300] text-white rounded-2xl p-8 sm:p-10 border border-green-500/20 shadow-[0_0_40px_-10px_rgba(0,255,100,0.3)]"
        >
          <h1 className="text-3xl font-semibold text-center mb-8 bg-gradient-to-r from-green-400 to-emerald-600 bg-clip-text text-transparent">
            Edit Event
          </h1>

          <div className="flex flex-col gap-5">
            <input
              type="text"
              name="title"
              value={event.title}
              onChange={handleChange}
              placeholder="Event Title"
              className="p-3 rounded-lg bg-black/60 border border-green-500/20 placeholder-gray-400 text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
              required
            />

            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="date"
                name="date"
                value={event.date}
                onChange={handleChange}
                className="flex-1 p-3 rounded-lg bg-black/60 border border-green-500/20 text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
              <input
                type="time"
                name="time"
                value={event.time}
                onChange={handleChange}
                className="flex-1 p-3 rounded-lg bg-black/60 border border-green-500/20 text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>

            <input
              type="text"
              name="location"
              value={event.location}
              onChange={handleChange}
              placeholder="Location"
              className="p-3 rounded-lg bg-black/60 border border-green-500/20 placeholder-gray-400 text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500"
            />

            <textarea
              name="description"
              value={event.description}
              onChange={handleChange}
              placeholder="Description"
              className="p-3 rounded-lg bg-black/60 border border-green-500/20 placeholder-gray-400 text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500 min-h-[100px]"
            />

            <input
              type="text"
              name="guest"
              value={event.guest}
              onChange={handleChange}
              placeholder="Guest"
              className="p-3 rounded-lg bg-black/60 border border-green-500/20 placeholder-gray-400 text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500"
            />

            <select
              name="registrationStatus"
              value={event.registrationStatus}
              onChange={handleChange}
              className="p-3 rounded-lg bg-black/60 border border-green-500/20 text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500"
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
              className="p-3 rounded-lg bg-black/60 border border-green-500/20 placeholder-gray-400 text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500"
            />

            <select
              name="eventCategory"
              value={event.eventCategory}
              onChange={handleChange}
              required
              className="p-3 rounded-lg bg-black/60 border border-green-500/20 text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="" disabled>
                Event Category
              </option>
              <option value="Music">Music</option>
              <option value="Dance">Dance</option>
              <option value="Party">Party</option>
              <option value="Other">Other</option>
            </select>

            <div className="flex flex-col sm:flex-row justify-between gap-4 mt-4">
              <button
                type="submit"
                className="flex-1 py-3 bg-gradient-to-r from-green-700 to-emerald-600 hover:from-green-600 hover:to-emerald-500 rounded-lg font-semibold transition-all shadow-[0_0_20px_rgba(0,255,100,0.3)] hover:shadow-[0_0_30px_rgba(0,255,100,0.5)]"
              >
                Update Event
              </button>

              <button
                type="button"
                onClick={handleRemove}
                className="flex-1 py-3 bg-gradient-to-r from-red-700 to-red-600 hover:from-red-600 hover:to-red-500 rounded-lg font-semibold transition-all"
              >
                Remove Event
              </button>
            </div>

            {message && (
              <p
                className={`mt-5 text-center font-medium ${
                  message.includes("Failed") ? "text-red-400" : "text-green-400"
                }`}
              >
                {message}
              </p>
            )}
          </div>
        </form>
      </div>

      <Footer />
    </>
  );
};

export default EditEvent;
