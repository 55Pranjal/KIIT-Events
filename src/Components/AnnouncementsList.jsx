import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "./Navbar";
import Footer from "./Footer";
import Doodles from "./Doodles";

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

      <div className="flex flex-col min-h-screen">
        <div className="relative flex-grow overflow-hidden flex flex-col">
          <Doodles variant="hero" />
          <main className="relative z-10 flex-grow max-w-4xl mx-auto w-full px-4 sm:px-6 py-10">
          <div className="mb-8 pt-2">
            <h1 className="font-display text-3xl md:text-4xl font-bold text-[#111] tracking-tightish">
              <span className="bg-gradient-to-r from-emerald-600 via-emerald-500 to-emerald-400 bg-clip-text text-transparent">
                Announcements
              </span>
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              The latest updates from societies across campus.
            </p>
          </div>

          {loading && (
            <p className="text-center text-gray-500 py-8 animate-pulse">
              Loading announcements...
            </p>
          )}
          {error && (
            <p className="text-center text-red-500 font-medium py-8">{error}</p>
          )}
          {!loading && !error && announcements.length === 0 && (
            <div className="bg-white border border-dashed border-[#e5e5e5] rounded-xl p-10 text-center">
              <p className="text-gray-500">No announcements available.</p>
            </div>
          )}

          <div className="flex flex-col gap-4">
            {announcements.map((a) => (
              <div
                key={a._id}
                className="p-5 sm:p-6 rounded-xl bg-white border border-[#e5e5e5] shadow-sm hover:shadow-md transition-all"
              >
                <h3 className="font-semibold text-lg sm:text-xl text-[#111] mb-1.5">
                  {a.title}
                </h3>
                <p className="text-gray-600 text-sm sm:text-base mb-3 leading-relaxed">
                  {a.message}
                </p>
                <div className="text-xs text-gray-400 flex flex-wrap gap-x-3 gap-y-1 pt-3 border-t border-[#eee]">
                  <span>
                    Posted by{" "}
                    <span className="text-emerald-600 font-medium">
                      {a.author?.name || "Unknown"}
                    </span>
                  </span>
                  <span>
                    ({a.author?.source || a.authorRole || "unknown"})
                  </span>
                  <span className="text-gray-500">
                    {new Date(a.createdAt).toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
          </main>
        </div>
        <Footer />
      </div>
    </>
  );
}
