import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Navbar from "./Navbar";
import Footer from "./Footer";
import Doodles from "./Doodles";

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
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/queries`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setQueries(res.data);
      } catch (err) {
        console.error(
          "[ERROR] Failed to fetch queries:",
          err.response?.status || err.message
        );
        if (err.response?.status === 401) {
          toast.error("Unauthorized — please log in again.");
        } else {
          toast.error("Failed to fetch queries.");
        }
      }
    };

    fetchQueries();
  }, []);

  const handleReply = async (id) => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Unauthorized — please log in again.");
      return;
    }

    try {
      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/queries/${id}`,
        { reply },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setReply("");
      toast.success("Reply sent!");
    } catch (error) {
      console.error(
        "[ERROR] Failed to send reply:",
        error.response?.status || error.message
      );
      if (error.response?.status === 401) {
        toast.error("Unauthorized — please log in again.");
      } else {
        toast.error("Failed to send reply.");
      }
    }
  };

  return (
    <>
      <Navbar />

      <div className="relative overflow-hidden flex flex-col">
        <Doodles variant="hero" />
        <div className="relative z-10 max-w-4xl mx-auto w-full px-4 sm:px-6 py-10 min-h-[80vh]">
        <div className="mb-8">
          <h1 className="font-display text-2xl md:text-3xl font-bold text-[#111] tracking-tightish">
            Student{" "}
            <span className="bg-gradient-to-r from-emerald-600 via-emerald-500 to-emerald-400 bg-clip-text text-transparent">
              Queries
            </span>
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Review and respond to messages from students.
          </p>
        </div>

        {queries.length === 0 ? (
          <div className="bg-white border border-dashed border-[#e5e5e5] rounded-xl p-10 text-center">
            <p className="text-gray-500">No queries found.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {queries.map((q) => (
              <div
                key={q._id}
                className="bg-white border border-[#e5e5e5] rounded-2xl p-5 sm:p-6 shadow-sm hover:shadow-md transition-all"
              >
                <div className="flex justify-between items-start gap-3">
                  <div className="min-w-0">
                    <h2 className="font-semibold text-[#111] text-base sm:text-lg break-words">
                      {q.name}
                    </h2>
                    <p className="text-gray-400 text-xs sm:text-sm break-words">
                      {q.email}
                    </p>
                  </div>
                  <span className="text-xs text-gray-400 flex-shrink-0">
                    {new Date(q.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <p className="mt-3 text-gray-700 text-sm sm:text-base">
                  {q.message}
                </p>

                {q.reply ? (
                  <div className="mt-4 bg-emerald-50 border border-emerald-100 p-3 rounded-lg">
                    <p className="text-xs uppercase tracking-wider font-semibold text-emerald-600 mb-1">
                      Admin Reply
                    </p>
                    <p className="text-sm text-gray-700">{q.reply}</p>
                  </div>
                ) : (
                  <div className="mt-4 flex flex-col sm:flex-row gap-2">
                    <input
                      value={reply}
                      onChange={(e) => setReply(e.target.value)}
                      placeholder="Write your reply..."
                      className="flex-1 bg-white border border-[#e5e5e5] rounded-lg px-4 py-2.5 text-[#111] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                    />
                    <button
                      onClick={() => handleReply(q._id)}
                      className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 text-white font-medium rounded-lg shadow-sm transition-all"
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
