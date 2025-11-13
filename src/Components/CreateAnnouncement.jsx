import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import { societies } from "../constants/societies";

export default function CreateAnnouncement({ onCreated }) {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [selectedSociety, setSelectedSociety] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const token = localStorage.getItem("token");
    if (!token) {
      setError("You must be logged in to create an announcement.");
      setLoading(false);
      return;
    }

    if (!selectedSociety) {
      setError("Please select a society to post under.");
      setLoading(false);
      return;
    }

    const announcementData = {
      title,
      message,
      societyId: selectedSociety,
    };

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/announcements`,
        announcementData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.info("[INFO] Announcement created successfully:", {
        id: res.data?._id,
        society: selectedSociety,
      });

      setTitle("");
      setMessage("");
      setSelectedSociety("");
      onCreated?.(res.data);
      navigate("/");
    } catch (err) {
      console.error("[ERROR] Failed to create announcement:", err.message);
      setError("Failed to create announcement");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-[#001a0f] to-[#003319] text-white flex flex-col">
      <Navbar />

      <div className="flex justify-center items-center flex-grow px-4 py-8">
        <div className="bg-black/40 border border-green-900/30 backdrop-blur-md shadow-xl shadow-green-900/40 w-full max-w-xl rounded-2xl py-8 px-6 sm:px-10">
          <h2 className="text-center font-bold text-3xl mb-6 bg-gradient-to-r from-green-400 to-emerald-300 text-transparent bg-clip-text drop-shadow-md">
            Create Announcement
          </h2>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="p-3 rounded-lg bg-[#0d1b12] border border-green-700/40 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200"
            />

            <textarea
              placeholder="Message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              className="p-3 rounded-lg bg-[#0d1b12] border border-green-700/40 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200 min-h-[120px]"
            />

            <select
              value={selectedSociety}
              onChange={(e) => setSelectedSociety(e.target.value)}
              required
              className="p-3 rounded-lg bg-[#0d1b12] border border-green-700/40 text-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200"
            >
              <option value="">Select Society</option>
              {societies.map((society) => (
                <option key={society._id} value={society._id}>
                  {society.name}
                </option>
              ))}
            </select>

            {error && (
              <p className="text-center text-red-400 text-sm font-medium">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-2 font-semibold bg-gradient-to-r from-green-700 to-emerald-600 text-white rounded-lg py-2.5 hover:scale-[1.02] hover:shadow-[0_0_10px_#00ff88aa] transition-all duration-300"
            >
              {loading ? "Creating..." : "Create Announcement"}
            </button>
          </form>
        </div>
      </div>

      <footer className="w-full mt-12 bg-gradient-to-r from-black via-[#0f2e1f] to-[#003300] border-t border-green-800/30 text-green-300 py-4 px-6 text-center">
        <p className="text-sm tracking-wide">
          © {new Date().getFullYear()}{" "}
          <span className="font-semibold text-green-400">KIIT Events</span>. All
          rights reserved.
        </p>
        <p className="text-xs text-green-200/70 mt-1">
          Built by a fellow KIITIAN (Pranjal Agarwal).
        </p>
      </footer>
    </div>
  );
}
