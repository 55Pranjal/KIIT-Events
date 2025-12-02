import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function AnnouncementsList() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAnnouncements = async () => {
      console.info("[INFO] Fetching announcements from server...");
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/announcements`
        );
        setAnnouncements(res.data);
        console.info(
          `[INFO] Successfully fetched ${res.data.length} announcements`
        );
      } catch (err) {
        console.error(
          "[ERROR] Failed to fetch announcements:",
          err.response?.status || err.message
        );
        setError("Failed to fetch announcements");
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncements();
  }, []);

  return (
    <>
      <Navbar />

      <div className="flex flex-col min-h-screen text-white">
        <main className="flex-grow max-w-4xl mx-auto w-full px-4 py-10">
          <div className="bg-black/40 border border-green-900/30 backdrop-blur-md shadow-xl shadow-green-900/40 rounded-2xl p-8 z-0">
            <h1 className="text-center text-3xl font-extrabold mb-6 bg-gradient-to-r from-green-400 to-emerald-300 text-transparent bg-clip-text drop-shadow-md">
              Announcements
            </h1>

            {loading && (
              <p className="text-center text-gray-400 animate-pulse">
                Loading announcements...
              </p>
            )}
            {error && (
              <p className="text-center text-red-400 font-medium">{error}</p>
            )}
            {!loading && !error && announcements.length === 0 && (
              <p className="text-center text-gray-400">
                No announcements available.
              </p>
            )}

            <div className="flex flex-col gap-5 mt-4">
              {announcements.map((a) => (
                <div
                  key={a._id}
                  className="p-5 rounded-xl bg-[#0d1b12] border border-green-800/40 shadow-sm hover:shadow-[0_0_10px_#00ff88aa] transition-all duration-300 hover:scale-[1.01]"
                >
                  <h3 className="font-semibold text-xl mb-1 text-green-300">
                    {a.title}
                  </h3>
                  <p className="text-gray-200 mb-2">{a.message}</p>
                  <small className="text-gray-400 italic">
                    Posted by{" "}
                    <span className="text-green-400">
                      {a.author?.name || "Unknown"}
                    </span>{" "}
                    ({a.author?.source || a.authorRole || "unknown"}) on{" "}
                    <span className="text-emerald-400">
                      {new Date(a.createdAt).toLocaleString()}
                    </span>
                  </small>
                </div>
              ))}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
}
