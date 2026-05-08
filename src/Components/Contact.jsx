import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Navbar from "./Navbar";
import Footer from "./Footer";
import Doodles from "./Doodles";
import Spinner from "./Spinner";

const Contact = () => {
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [queries, setQueries] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchQueries = async () => {
      if (!token) return;
      console.info("[INFO] Fetching user queries...");
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/queries/my`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setQueries(res.data);
        console.info(`[INFO] Retrieved ${res.data.length} queries`);
      } catch (err) {
        console.error("[ERROR] Failed to fetch user queries:", err.message);
        toast.error("Failed to load your queries.");
      }
    };

    fetchQueries();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!message.trim()) {
      toast.warn("Please enter a valid query before submitting.");
      return;
    }

    console.info("[INFO] Submitting new query...");
    setSubmitting(true);

    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/queries`,
        { message },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success("Query submitted successfully!");
      setMessage("");

      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/queries/my`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setQueries(res.data);
      console.info("[INFO] Query submitted and list refreshed.");
    } catch (err) {
      console.error("[ERROR] Failed to send query:", err.message);
      toast.error("Failed to send query. Try again later.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />

      <div className="relative overflow-hidden">
        <Doodles variant="hero" />

        <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 py-16">
          <div className="text-center mb-10">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-[#111] tracking-tightish">
              Contact{" "}
              <span className="bg-gradient-to-r from-emerald-600 via-emerald-500 to-emerald-400 bg-clip-text text-transparent">
                KIIT Events
              </span>
            </h2>
            <p className="text-gray-500 mt-3 text-sm md:text-base">
              Have a question, suggestion, or feedback? Send us a message.
            </p>
          </div>

        <div className="bg-white border border-[#e5e5e5] rounded-2xl shadow-sm p-6 sm:p-8">
          {!token ? (
            <p className="text-center text-red-500 font-medium py-6">
              Please log in to send a query.
            </p>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Your Message
                </label>
                <textarea
                  name="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Write your query here..."
                  rows="5"
                  className="w-full bg-white border border-[#e5e5e5] rounded-lg px-4 py-3 text-[#111] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all resize-none"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="w-full sm:w-auto px-6 py-3 rounded-lg bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 disabled:bg-emerald-300 disabled:cursor-not-allowed text-white font-semibold shadow-sm transition-all flex items-center justify-center gap-2"
              >
                {submitting && <Spinner className="w-4 h-4" />}
                {submitting ? "Sending…" : "Send Message"}
              </button>
            </form>
          )}
        </div>

        {token && (
          <div className="mt-12">
            <h3 className="text-xl md:text-2xl font-semibold text-[#111] mb-1">
              Your Queries & Replies
            </h3>
            <p className="text-sm text-gray-500 mb-6">
              Track every question you've sent and the replies from admins.
            </p>

            {queries.length > 0 ? (
              <div className="flex flex-col gap-4">
                {queries.map((q) => (
                  <div
                    key={q._id}
                    className="bg-white border border-[#e5e5e5] rounded-xl p-5 shadow-sm hover:shadow-md transition-all"
                  >
                    <p className="text-[#111] text-sm md:text-base">
                      {q.message}
                    </p>
                    {q.reply ? (
                      <div className="mt-3 pt-3 border-t border-[#eee]">
                        <p className="text-xs uppercase tracking-wider font-semibold text-emerald-600 mb-1">
                          Admin Reply
                        </p>
                        <p className="text-gray-600 text-sm">{q.reply}</p>
                      </div>
                    ) : (
                      <p className="text-xs text-gray-400 italic mt-3">
                        No reply yet.
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-6">
                No queries submitted yet.
              </p>
            )}
          </div>
        )}
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Contact;
