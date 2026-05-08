import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Navbar from "./Navbar";
import Footer from "./Footer";
import Doodles from "./Doodles";
import { useNavigate } from "react-router-dom";

const NotificationsPanel = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const token = localStorage.getItem("token");

  const fetchNotifications = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/notifications`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNotifications(data);
    } catch (err) {
      console.error("Failed to load notifications:", err);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleToggleRead = async (id, currentStatus) => {
    try {
      await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/api/notifications/${id}/read`,
        { isRead: !currentStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: !currentStatus } : n))
      );
    } catch (err) {
      console.error("Failed to update read status:", err);
    }
  };

  const handleDeleteRead = async () => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/notifications/delete-read`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setNotifications((prev) => prev.filter((n) => !n.isRead));
      toast.success("Read notifications cleared.");
    } catch (err) {
      console.error("Failed to delete read notifications:", err);
      toast.error("Failed to delete read notifications.");
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <>
      <Navbar />

      <div className="relative overflow-hidden flex flex-col flex-grow">
        <Doodles variant="hero" />
        <div className="relative z-10 flex flex-col min-h-[80vh] max-w-3xl mx-auto w-full px-4 sm:px-6 py-10">
          <div className="bg-white border border-[#e5e5e5] rounded-2xl shadow-sm p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6">
            <div>
              <h2 className="font-display text-2xl md:text-3xl font-bold text-[#111] tracking-tightish">
                Notifications
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                {unreadCount > 0
                  ? `${unreadCount} unread`
                  : "You're all caught up."}
              </p>
            </div>

            <button
              onClick={() => navigate("/AnnouncementsList")}
              className="text-sm border border-[#e5e5e5] text-[#333] hover:bg-gray-50 hover:border-emerald-200 font-medium rounded-lg px-4 py-2 transition-all whitespace-nowrap"
            >
              View Announcements
            </button>
          </div>

          <div className="overflow-y-auto max-h-[60vh]">
            {notifications.length === 0 ? (
              <div className="bg-[#f7faf8] border border-dashed border-[#eeeeea] rounded-xl p-10 text-center">
                <p className="text-gray-500">No notifications yet.</p>
              </div>
            ) : (
              <ul className="space-y-2.5">
                {notifications.map((n) => (
                  <li
                    key={n._id}
                    className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-lg border transition-all ${
                      n.isRead
                        ? "bg-white border-[#e5e5e5]"
                        : "bg-emerald-50 border-emerald-200"
                    }`}
                  >
                    <div className="flex items-start gap-3 flex-1">
                      {!n.isRead && (
                        <span className="mt-1.5 w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0" />
                      )}
                      <span
                        className={`text-sm break-words ${
                          n.isRead ? "text-gray-600" : "text-[#111] font-medium"
                        }`}
                      >
                        {n.message}
                      </span>
                    </div>
                    <label className="flex items-center gap-2 text-xs text-gray-500 cursor-pointer self-start sm:self-auto">
                      <input
                        type="checkbox"
                        checked={n.isRead}
                        onChange={() => handleToggleRead(n._id, n.isRead)}
                        className="w-4 h-4 accent-emerald-500"
                      />
                      Read
                    </label>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {notifications.some((n) => n.isRead) && (
            <button
              onClick={handleDeleteRead}
              className="mt-6 w-full sm:w-auto px-4 py-2.5 border border-red-300 text-red-600 hover:bg-red-50 hover:border-red-400 rounded-lg font-medium text-sm transition-all"
            >
              Delete read notifications
            </button>
          )}
        </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default NotificationsPanel;
