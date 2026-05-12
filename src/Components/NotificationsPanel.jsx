import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Navbar from "./Navbar";
import Footer from "./Footer";
import Doodles from "./Doodles";
import EmptyState, { BellIcon } from "./EmptyState";
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

  const handleMarkAllRead = async () => {
    try {
      await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/api/notifications/read-all`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      toast.success("All notifications marked as read.");
    } catch (err) {
      console.error("Failed to mark all read:", err);
      toast.error("Failed to mark all as read.");
    }
  };

  const handleDeleteOne = async (id) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/notifications/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNotifications((prev) => prev.filter((n) => n._id !== id));
    } catch (err) {
      console.error("Failed to delete notification:", err);
      toast.error("Failed to delete notification.");
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

            <div className="flex flex-wrap items-center gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllRead}
                  className="text-sm border border-[#e5e5e5] text-[#333] hover:bg-gray-50 hover:border-emerald-200 font-medium rounded-lg px-4 py-2 transition-all whitespace-nowrap"
                >
                  Mark all read
                </button>
              )}
              <button
                onClick={() => navigate("/AnnouncementsList")}
                className="text-sm border border-[#e5e5e5] text-[#333] hover:bg-gray-50 hover:border-emerald-200 font-medium rounded-lg px-4 py-2 transition-all whitespace-nowrap"
              >
                View Announcements
              </button>
            </div>
          </div>

          <div className="overflow-y-auto max-h-[60vh]">
            {notifications.length === 0 ? (
              <EmptyState
                icon={<BellIcon />}
                title="You're all caught up"
                description="When someone replies to your queries or new events get posted, you'll see them here."
              />
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
                      {n.link ? (
                        <button
                          type="button"
                          onClick={() => {
                            if (!n.isRead) handleToggleRead(n._id, n.isRead);
                            navigate(n.link);
                          }}
                          className={`text-left text-sm break-words hover:underline ${
                            n.isRead ? "text-gray-600" : "text-[#111] font-medium"
                          }`}
                        >
                          {n.message}
                        </button>
                      ) : (
                        <span
                          className={`text-sm break-words ${
                            n.isRead ? "text-gray-600" : "text-[#111] font-medium"
                          }`}
                        >
                          {n.message}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 self-start sm:self-auto">
                      <label className="flex items-center gap-2 text-xs text-gray-500 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={n.isRead}
                          onChange={() => handleToggleRead(n._id, n.isRead)}
                          className="w-4 h-4 accent-emerald-500"
                        />
                        Read
                      </label>
                      <button
                        type="button"
                        onClick={() => handleDeleteOne(n._id)}
                        title="Delete notification"
                        aria-label="Delete notification"
                        className="text-xs text-gray-400 hover:text-red-500 transition-colors px-1.5 py-0.5 rounded"
                      >
                        ✕
                      </button>
                    </div>
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
