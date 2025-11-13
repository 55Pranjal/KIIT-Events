import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "./Navbar";
import Footer from "./Footer";

const Contact = () => {
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");
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
        setStatus("❌ Failed to fetch queries");
      }
    };

    fetchQueries();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!message.trim()) {
      setStatus("⚠️ Please enter a valid query before submitting.");
      return;
    }

    console.info("[INFO] Submitting new query...");

    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/queries`,
        { message },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setStatus("✅ Query submitted successfully!");
      setMessage("");

      // Re-fetch updated queries
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/queries/my`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setQueries(res.data);
      console.info("[INFO] Query submitted and list refreshed.");
    } catch (err) {
      console.error("[ERROR] Failed to send query:", err.message);
      setStatus("❌ Failed to send query. Try again later.");
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex flex-col flex-grow mx-auto min-h-screen text-white px-6 py-16">
        <div className="max-w-lg w-full bg-white/10 p-10 rounded-2xl shadow-2xl backdrop-blur-md border border-white/10">
          <h2 className="text-3xl font-bold mb-6 text-center text-green-400">
            Contact KIIT Events
          </h2>

          {!token ? (
            <p className="text-center text-red-400 font-medium">
              Please log in to send a query.
            </p>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <textarea
                name="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write your query here..."
                rows="5"
                className="w-full bg-transparent border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500/60"
                required
              />
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-green-700 to-green-500 hover:from-green-600 hover:to-green-400 py-3 rounded-xl font-semibold shadow-lg transition-all"
              >
                Send Message
              </button>
            </form>
          )}

          {status && (
            <p className="mt-6 text-center text-sm text-gray-300 italic">
              {status}
            </p>
          )}
        </div>

        {token && (
          <div className="mt-10 max-w-2xl w-full">
            <h3 className="text-2xl font-semibold mb-4 text-green-400">
              Your Queries & Replies
            </h3>
            {queries.length > 0 ? (
              queries.map((q) => (
                <div
                  key={q._id}
                  className="mb-4 bg-white/10 p-4 rounded-xl border border-white/10"
                >
                  <p className="text-gray-200">{q.message}</p>
                  {q.reply ? (
                    <p className="text-green-400 mt-2">
                      <strong>Admin reply:</strong> {q.reply}
                    </p>
                  ) : (
                    <p className="text-gray-500 italic mt-2">No reply yet.</p>
                  )}
                </div>
              ))
            ) : (
              <p className="text-gray-400">No queries submitted yet.</p>
            )}
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default Contact;
