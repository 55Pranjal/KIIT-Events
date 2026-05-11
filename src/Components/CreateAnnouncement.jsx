import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import Doodles from "./Doodles";
import Spinner from "./Spinner";
import { toast } from "react-toastify";

export default function CreateAnnouncement({ onCreated }) {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [selectedSociety, setSelectedSociety] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // societies from backend
  const [societies, setSocieties] = useState([]); // [{ _id, name }]
  const [loadingSocieties, setLoadingSocieties] = useState(false);
  const [societiesError, setSocietiesError] = useState("");

  const navigate = useNavigate();
  const BACKEND = import.meta.env.VITE_BACKEND_URL?.replace(/\/$/, "") || "";
  const role = localStorage.getItem("role");
  const isAdmin = role === "admin";

  useEffect(() => {
    if (!isAdmin) {
      // Society users post under their own society — backend resolves it.
      return;
    }
    const fetchSocieties = async () => {
      setLoadingSocieties(true);
      setSocietiesError("");
      try {
        const token = localStorage.getItem("token");
        const config = token
          ? { headers: { Authorization: `Bearer ${token}` } }
          : undefined;

        console.info(
          "[CreateAnnouncement] fetching societies from:",
          `${BACKEND}/api/society-accounts`
        );
        const res = await axios.get(`${BACKEND}/api/users`, config);

        if (Array.isArray(res.data)) {
          setSocieties(res.data);
          console.info(
            "[CreateAnnouncement] societies loaded:",
            res.data.length
          );
        } else {
          console.warn(
            "[CreateAnnouncement] unexpected societies response:",
            res.data
          );
          setSocieties([]);
          setSocietiesError("Unexpected response when loading societies.");
        }
      } catch (err) {
        console.error(
          "[CreateAnnouncement] failed to fetch societies:",
          err?.response?.data || err.message
        );
        setSocieties([]);
        setSocietiesError("Failed to load societies. Try reloading the page.");
      } finally {
        setLoadingSocieties(false);
      }
    };

    fetchSocieties();
  }, [BACKEND, isAdmin]);

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

    if (isAdmin && !selectedSociety) {
      setError("Please select a society to post under.");
      setLoading(false);
      return;
    }

    const announcementData = {
      title,
      message,
      // Society users: server resolves the societyId from their account.
      ...(isAdmin && selectedSociety ? { societyId: selectedSociety } : {}),
    };

    try {
      const res = await axios.post(
        `${BACKEND}/api/announcements`,
        announcementData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.info("[INFO] Announcement created successfully:", {
        id: res.data?._id,
        society: selectedSociety,
      });

      toast.success("Announcement created!");
      setTitle("");
      setMessage("");
      setSelectedSociety("");
      onCreated?.(res.data);
      navigate("/");
    } catch (err) {
      console.error("[ERROR] Failed to create announcement:", {
        message: err.message,
        status: err.response?.status,
        data: err.response?.data,
      });
      const msg =
        err.response?.data?.message || "Failed to create announcement";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "rounded-lg p-3 w-full bg-white border border-[#e5e5e5] text-[#111] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all";

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="relative flex-grow overflow-hidden flex flex-col">
        <Doodles variant="hero" />
        <div className="relative z-10 flex justify-center flex-grow px-4 py-10">
          <div className="bg-white border border-[#e5e5e5] shadow-sm w-full max-w-xl rounded-2xl py-8 px-4 sm:px-10">
          <h2 className="font-display text-center font-bold text-3xl mb-2 text-[#111] tracking-tightish">
            Create{" "}
            <span className="bg-gradient-to-r from-emerald-600 via-emerald-500 to-emerald-400 bg-clip-text text-transparent">
              Announcement
            </span>
          </h2>
          <p className="text-center text-sm text-gray-500 mb-6">
            Share an update under your society's name.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className={inputClass}
            />

            <textarea
              placeholder="Message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              rows={5}
              className={`${inputClass} resize-none`}
            />

            {isAdmin && (
              loadingSocieties ? (
                <div className="rounded-lg p-3 bg-[#f7faf8] border border-[#eeeeea] text-gray-500 text-sm">
                  Loading societies...
                </div>
              ) : societiesError ? (
                <div className="rounded-lg p-3 bg-red-50 border border-red-200 text-red-600 text-sm">
                  {societiesError}
                </div>
              ) : societies.length === 0 ? (
                <div className="rounded-lg p-3 bg-yellow-50 border border-yellow-200 text-yellow-700 text-sm">
                  No societies available.
                </div>
              ) : (
                <select
                  value={selectedSociety}
                  onChange={(e) => setSelectedSociety(e.target.value)}
                  required
                  className={inputClass}
                >
                  <option value="">Select Society</option>
                  {societies.map((society) => (
                    <option key={society._id} value={society._id}>
                      {society.name}
                    </option>
                  ))}
                </select>
              )
            )}

            {error && (
              <p className="text-center text-red-500 text-sm font-medium">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-2 font-semibold bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 disabled:bg-emerald-300 disabled:cursor-not-allowed text-white rounded-lg py-3 shadow-sm transition-all flex items-center justify-center gap-2"
            >
              {loading && <Spinner className="w-4 h-4" />}
              {loading ? "Creating…" : "Create Announcement"}
            </button>
          </form>
        </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
