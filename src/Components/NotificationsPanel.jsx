import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { useNavigate } from "react-router-dom";

const NotificationsPanel = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const token = localStorage.getItem("token");

  // 🔹 Fetch notifications from backend
  const fetchNotifications = async () => {
    console.log("📨 [FETCH] Fetching notifications...");
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/notifications`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log("✅ [FETCH SUCCESS] Notifications loaded:", data.length);
      setNotifications(data);
    } catch (err) {
      console.error("❌ [FETCH ERROR] Failed to load notifications:", err);
    }
  };

  useEffect(() => {
    console.log("⚙️ [EFFECT] NotificationsPanel mounted");
    fetchNotifications();
    return () => console.log("🧹 [CLEANUP] NotificationsPanel unmounted");
  }, []);

  // 🔹 Toggle read/unread state
  const handleToggleRead = async (id, currentStatus) => {
    console.log(
      `✏️ [TOGGLE] Changing read status for ID: ${id}, Current: ${currentStatus}`
    );
    try {
      await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/api/notifications/${id}/read`,
        { isRead: !currentStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: !currentStatus } : n))
      );

      console.log("✅ [UPDATE] Notification updated successfully");
    } catch (err) {
      console.error("❌ [TOGGLE ERROR] Failed to update read status:", err);
    }
  };

  // 🔹 Delete all read notifications
  const handleDeleteRead = async () => {
    console.log("🗑️ [DELETE] Attempting to delete all read notifications...");
    try {
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/notifications/delete-read`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setNotifications((prev) => prev.filter((n) => !n.isRead));
      console.log("✅ [DELETE SUCCESS] All read notifications removed");
    } catch (err) {
      console.error(
        "❌ [DELETE ERROR] Failed to delete read notifications:",
        err
      );
    }
  };

  return (
    <>
      <Navbar />

      <div className="flex flex-col min-h-screen text-white p-4 sm:p-6 md:p-10 mt-10">
        <div className="max-w-3xl w-full rounded-xl shadow-lg border border-emerald-900/40 p-6 sm:p-10 mx-auto flex flex-col">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4 sm:gap-0">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-wide text-center sm:text-left">
              Notifications
            </h2>

            <button
              onClick={() => {
                console.log("📢 [NAVIGATE] Going to Announcements List page");
                navigate("/AnnouncementsList");
              }}
              className="px-5 py-2 border border-emerald-600 text-emerald-300 font-semibold rounded-lg hover:bg-emerald-800/50 transition w-full sm:w-auto"
            >
              Announcements
            </button>
          </div>

          <div className="flex-grow overflow-y-auto max-h-[60vh]">
            {notifications.length === 0 ? (
              <p className="text-center text-gray-400">No notifications yet.</p>
            ) : (
              <ul className="space-y-3">
                {notifications.map((n) => (
                  <li
                    key={n._id}
                    className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg border ${
                      n.isRead
                        ? "bg-emerald-900/60 border-emerald-800"
                        : "bg-emerald-800/80 border-emerald-700"
                    } hover:border-emerald-500 transition-all duration-200`}
                  >
                    <span className="text-sm sm:text-base break-words">
                      {n.message}
                    </span>
                    <input
                      type="checkbox"
                      checked={n.isRead}
                      onChange={() => handleToggleRead(n._id, n.isRead)}
                      className="mt-3 sm:mt-0 ml-0 sm:ml-4 w-5 h-5 accent-emerald-500 cursor-pointer self-start sm:self-auto"
                    />
                  </li>
                ))}
              </ul>
            )}
          </div>

          <button
            onClick={handleDeleteRead}
            className="mt-6 w-full bg-gradient-to-r from-red-700 to-red-600 hover:from-red-800 hover:to-red-700 text-white py-2 rounded-lg font-semibold transition"
          >
            Delete read notifications
          </button>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default NotificationsPanel;
