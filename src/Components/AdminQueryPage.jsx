import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "./Navbar";
import Footer from "./Footer";

const AdminQueries = () => {
  const [queries, setQueries] = useState([]);
  const [reply, setReply] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.warn("[WARN] No auth token found — redirect or block access");
      return;
    }

    const fetchQueries = async () => {
      try {
        console.info("[INFO] Fetching all student queries...");
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/queries`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setQueries(res.data);
        console.info("[INFO] Queries fetched successfully:", res.data.length);
      } catch (err) {
        console.error(
          "[ERROR] Failed to fetch queries:",
          err.response?.status || err.message
        );
        if (err.response?.status === 401) {
          alert("Unauthorized! Please login again.");
        } else {
          alert("Failed to fetch queries.");
        }
      }
    };

    fetchQueries();
  }, []);

  const handleReply = async (id) => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.warn("[WARN] No auth token found while sending reply");
      return alert("Unauthorized! Please login again.");
    }

    try {
      console.info(`[INFO] Sending reply for query ID: ${id}`);
      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/queries/${id}`,
        { reply },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setReply("");
      alert("✅ Reply sent!");
      console.info("[SUCCESS] Reply sent successfully");
    } catch (error) {
      console.error(
        "[ERROR] Failed to send reply:",
        error.response?.status || error.message
      );
      if (error.response?.status === 401) {
        alert("Unauthorized! Please login again.");
      } else {
        alert("Failed to send reply.");
      }
    }
  };

  return (
    <>
      <Navbar />
      <div className="py-16 text-white px-6 min-h-screen">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-center text-green-400">
            Student Queries Dashboard
          </h1>

          {queries.length === 0 ? (
            <p className="text-center text-gray-400">No queries found.</p>
          ) : (
            <div className="space-y-6">
              {queries.map((q) => (
                <div
                  key={q._id}
                  className="bg-white/10 p-6 rounded-2xl border border-white/10 hover:border-green-500/40 shadow-lg backdrop-blur-md transition-all duration-300"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="font-semibold text-lg text-green-300">
                        {q.name}
                      </h2>
                      <p className="text-gray-400 text-sm">{q.email}</p>
                    </div>
                    <span className="text-xs text-gray-500">
                      {new Date(q.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <p className="mt-3 text-gray-200">{q.message}</p>

                  {q.reply ? (
                    <div className="mt-4 bg-green-900/30 border border-green-600/40 p-3 rounded-lg">
                      <p className="text-green-300">
                        <strong>Admin Reply:</strong> {q.reply}
                      </p>
                    </div>
                  ) : (
                    <div className="mt-4 flex flex-col sm:flex-row gap-3">
                      <input
                        value={reply}
                        onChange={(e) => setReply(e.target.value)}
                        placeholder="Write your reply..."
                        className="bg-transparent border border-white/20 rounded-xl px-4 py-2 text-white placeholder-gray-400 focus:ring-2 focus:ring-green-500/50 w-full sm:w-3/4"
                      />
                      <button
                        onClick={() => handleReply(q._id)}
                        className="bg-gradient-to-r from-green-700 to-green-500 hover:from-green-600 hover:to-green-400 px-5 py-2 rounded-xl font-semibold shadow-md transition-all"
                      >
                        Send
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AdminQueries;
