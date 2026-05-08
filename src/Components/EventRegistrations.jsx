import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Navbar from "./Navbar";
import Footer from "./Footer";
import Doodles from "./Doodles";

const EventRegistrations = () => {
  const { eventId } = useParams();
  const [registrations, setRegistrations] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRegistrations = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Please login to view registrations");
          return;
        }

        const res = await axios.get(
          `${
            import.meta.env.VITE_BACKEND_URL
          }/api/registers/${eventId}/registrations`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setRegistrations(res.data);
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Failed to fetch registrations");
      } finally {
        setLoading(false);
      }
    };

    fetchRegistrations();
  }, [eventId]);

  const filtered = registrations.filter((reg) =>
    reg.userId.name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading)
    return (
      <>
        <Navbar />
        <p className="text-gray-500 text-center mt-10 animate-pulse">
          Loading...
        </p>
      </>
    );

  if (error)
    return (
      <>
        <Navbar />
        <p className="text-red-500 text-center mt-10">{error}</p>
      </>
    );

  return (
    <>
      <Navbar />

      <div className="relative overflow-hidden flex flex-col">
        <Doodles variant="hero" />
        <div className="relative z-10 min-h-[80vh] max-w-4xl mx-auto w-full px-4 sm:px-6 py-10">
        <div className="mb-6">
          <h1 className="font-display text-2xl md:text-3xl font-bold text-[#111] tracking-tightish">
            Registered{" "}
            <span className="bg-gradient-to-r from-emerald-600 via-emerald-500 to-emerald-400 bg-clip-text text-transparent">
              Students
            </span>
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {registrations.length}{" "}
            {registrations.length === 1 ? "student" : "students"} registered.
          </p>
        </div>

        <div className="mb-6">
          <input
            type="text"
            placeholder="Search by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-1/2 px-4 py-2.5 rounded-lg bg-white border border-[#e5e5e5] text-[#111] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
          />
        </div>

        {filtered.length === 0 ? (
          <div className="bg-white border border-dashed border-[#e5e5e5] rounded-xl p-10 text-center">
            <p className="text-gray-500">No students found.</p>
          </div>
        ) : (
          <ul className="space-y-2.5">
            {filtered.map((reg) => (
              <li
                key={reg._id}
                className="bg-white border border-[#e5e5e5] hover:border-emerald-200 hover:shadow-md transition-all p-4 rounded-lg"
              >
                <p className="text-[#111] font-medium">{reg.userId.name}</p>
                <p className="text-gray-500 text-sm mt-0.5">
                  {reg.userId.email}
                </p>
              </li>
            ))}
          </ul>
        )}
        </div>
      </div>

      <Footer />
    </>
  );
};

export default EventRegistrations;
