import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "./Navbar";
import Footer from "./Footer";

const EditSociety = () => {
  const navigate = useNavigate();
  const [society, setSociety] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchSociety = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/societies/me`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setSociety(res.data);

        // ✅ Development log (auto-disabled in production)
        if (import.meta.env.MODE === "development") {
          console.log("✅ Society data fetched:", res.data);
        }
      } catch (err) {
        if (import.meta.env.MODE === "development") {
          console.error("❌ Error fetching society:", err);
        }
        setError("Failed to fetch society info");
      } finally {
        setLoading(false);
      }
    };
    fetchSociety();
  }, []);

  const handleChange = (e) => {
    setSociety({ ...society, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/societies/me`,
        {
          name: society.name,
          description: society.description,
          email: society.email,
          phone: society.phone,
          president: society.president,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessage("✅ Society info updated successfully!");

      if (import.meta.env.MODE === "development") {
        console.log("✅ Society updated successfully:", society);
      }

      setTimeout(() => navigate("/dashboard"), 1500);
    } catch (err) {
      if (import.meta.env.MODE === "development") {
        console.error("❌ Error updating society:", err);
      }
      setMessage("❌ Failed to update society info");
    }
  };

  if (loading)
    return <p className="text-center mt-10 text-gray-300">Loading...</p>;
  if (error) return <p className="text-red-500 text-center mt-10">{error}</p>;

  return (
    <>
      <Navbar />

      <div className="flex justify-center px-4 mt-16 mb-10">
        <div className="w-full max-w-lg bg-gradient-to-br from-black via-[#001a00] to-[#003300] backdrop-blur-xl border border-green-500/20 text-white rounded-2xl p-8 shadow-[0_0_30px_-10px_rgba(0,255,100,0.3)]">
          <h1 className="text-3xl font-semibold text-center mb-6 bg-gradient-to-r from-green-400 to-emerald-600 bg-clip-text text-transparent">
            Edit Society Info
          </h1>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="space-y-2">
              <label className="text-sm text-gray-300">Society Name</label>
              <input
                type="text"
                name="name"
                value={society.name || ""}
                onChange={handleChange}
                placeholder="Enter society name"
                required
                className="w-full px-4 py-3 rounded-lg bg-black/60 border border-green-500/20 placeholder-gray-400 text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm text-gray-300">Description</label>
              <textarea
                name="description"
                value={society.description || ""}
                onChange={handleChange}
                placeholder="Enter description"
                rows={4}
                className="w-full px-4 py-3 rounded-lg bg-black/60 border border-green-500/20 placeholder-gray-400 text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all resize-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm text-gray-300">Contact Email</label>
              <input
                type="email"
                name="email"
                value={society.email || ""}
                onChange={handleChange}
                placeholder="Enter contact email"
                required
                className="w-full px-4 py-3 rounded-lg bg-black/60 border border-green-500/20 placeholder-gray-400 text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm text-gray-300">Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={society.phone || ""}
                onChange={handleChange}
                placeholder="Enter phone number"
                className="w-full px-4 py-3 rounded-lg bg-black/60 border border-green-500/20 placeholder-gray-400 text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm text-gray-300">Request Status</label>
              <input
                type="text"
                name="requestStatus"
                value={society.requestStatus || ""}
                readOnly
                className="w-full px-4 py-3 rounded-lg bg-black/60 border border-green-500/20 text-gray-400 cursor-not-allowed"
              />
            </div>

            <button
              type="submit"
              className="w-full mt-4 py-3 rounded-lg font-semibold text-white bg-gradient-to-r from-green-700 to-emerald-600 hover:from-green-600 hover:to-emerald-500 transition-all shadow-[0_0_20px_rgba(0,255,100,0.3)] hover:shadow-[0_0_30px_rgba(0,255,100,0.5)]"
            >
              Update Society Info
            </button>
          </form>

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
      </div>

      <Footer />
    </>
  );
};

export default EditSociety;
