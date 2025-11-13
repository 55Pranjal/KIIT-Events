import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Navbar from "./Navbar";
import Footer from "./Footer";

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

        if (import.meta.env.MODE === "development") {
          console.log("✅ Registrations fetched successfully:", res.data);
        }
      } catch (err) {
        if (import.meta.env.MODE === "development") {
          console.error("❌ Fetch error:", {
            status: err.response?.status,
            data: err.response?.data,
            message: err.message,
          });
        }
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
      <p className="text-green-300 text-center mt-10 animate-pulse">
        Loading...
      </p>
    );

  if (error) return <p className="text-red-500 text-center mt-10">{error}</p>;

  return (
    <>
      <Navbar />
      <div className="min-h-screen px-6 py-8 text-green-200">
        <h1 className="text-3xl font-bold mb-6 text-green-400 text-center sm:text-left">
          Registered Students
        </h1>

        <div className="flex justify-center sm:justify-start mb-6">
          <input
            type="text"
            placeholder="Search by name"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-1/2 px-4 py-2 rounded-lg bg-[#10291b] border border-green-700/40 text-green-200 placeholder-green-400/60 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200 mx-auto"
          />
        </div>

        {filtered.length === 0 ? (
          <p className="text-green-300/80 text-center sm:text-left">
            No students found.
          </p>
        ) : (
          <ul className="space-y-3">
            {filtered.map((reg) => (
              <li
                key={reg._id}
                className="bg-[#0e1e14]/60 hover:bg-[#133422]/70 transition-all p-4 rounded-lg border border-green-800/40 shadow-sm hover:shadow-green-800/30"
              >
                <p className="text-green-300 font-medium">{reg.userId.name}</p>
                <p className="text-green-400/80 text-sm">{reg.userId.email}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
      <Footer />
    </>
  );
};

export default EventRegistrations;
