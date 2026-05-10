import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom";
import Footer from "./Footer";
import Doodles from "./Doodles";
import { SkeletonProfileCard, SkeletonGrid } from "./Skeleton";
import EmptyState, { CalendarIcon } from "./EmptyState";
import { optimizeCard } from "../utils/imageOptimization";
import { formatEventDateTime } from "../utils/formatDate";

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      console.log("Fetching dashboard data...");

      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.warn("No token found — user not logged in.");
          setError("Not logged in");
          return;
        }

        console.log("Fetching user details...");
        const resUser = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/users/me`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const fetchedUser = resUser.data;
        console.log("User data fetched:", fetchedUser);
        setUser(fetchedUser);

        let eventsRes;
        if (fetchedUser.role === "student") {
          console.log("Fetching registered events for student...");
          eventsRes = await axios.get(
            `${import.meta.env.VITE_BACKEND_URL}/api/registers/my`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
        } else if (
          fetchedUser.role === "society" ||
          fetchedUser.role === "admin"
        ) {
          console.log("Fetching events created by society/admin...");
          eventsRes = await axios.get(
            `${import.meta.env.VITE_BACKEND_URL}/api/societies/my-events`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
        }

        console.log("Events fetched successfully:", eventsRes.data);
        setEvents(eventsRes.data);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to fetch data");
      } finally {
        console.log("Data fetching complete.");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (error) {
    return (
      <>
        <Navbar />
        <p className="text-red-500 text-center mt-10 px-4">{error}</p>
        <Footer />
      </>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="relative flex-grow overflow-hidden flex flex-col">
          <Doodles variant="hero" />
          <main className="relative z-10 flex-grow max-w-6xl mx-auto w-full px-4 sm:px-6 py-10">
            <SkeletonProfileCard />
            <div className="mt-12">
              <div className="mb-6 space-y-2">
                <div className="h-6 w-56 bg-[#f0f0eb] rounded animate-pulse" />
                <div className="h-3 w-72 bg-[#f0f0eb] rounded animate-pulse" />
              </div>
              <SkeletonGrid count={6} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" />
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const infoRows = [
    { label: "Username", value: user.name },
    { label: "Email", value: user.email },
    { label: "Phone", value: user.phone },
    { label: "Role", value: user.role },
  ];

  if (user.role === "student") {
    infoRows.push({
      label: "Society Request Status",
      value: user.societyRequestStatus,
    });
  }

  const primaryBtn =
    "font-medium text-sm bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 text-white rounded-lg px-4 py-2.5 w-full sm:w-auto sm:min-w-[12rem] shadow-sm transition-all";
  const outlineBtn =
    "font-medium text-sm border border-[#e5e5e5] text-[#333] hover:bg-gray-50 hover:border-emerald-200 rounded-lg px-4 py-2.5 w-full sm:w-auto sm:min-w-[12rem] transition-all";

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="relative flex-grow overflow-hidden flex flex-col">
        <Doodles variant="hero" />
        <main className="relative z-10 flex-grow max-w-6xl mx-auto w-full px-4 sm:px-6 py-10">
        {/* Profile Card */}
        <div className="bg-white border border-[#e5e5e5] rounded-2xl shadow-sm p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
            <div>
              <h1 className="font-display text-2xl md:text-3xl font-bold text-[#111] tracking-tightish">
                Your Details
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Manage your profile and view your activity.
              </p>
            </div>
            <span className="inline-flex items-center self-start gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold uppercase tracking-wider border border-emerald-100">
              {user.role}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {infoRows.map((row, index) => (
              <div
                key={index}
                className="bg-[#f7faf8] border border-[#eeeeea] rounded-lg px-4 py-3"
              >
                <p className="text-xs uppercase tracking-wider text-gray-400 font-semibold mb-0.5">
                  {row.label}
                </p>
                <p className="text-[#111] font-medium text-sm break-words">
                  {row.value || "—"}
                </p>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-3 mt-8">
            <button
              onClick={() => navigate("/EditProfile")}
              className={outlineBtn}
            >
              Edit Profile
            </button>

            {user.role === "society" && (
              <button
                onClick={() => navigate("/EditSociety")}
                className={outlineBtn}
              >
                Edit Society Info
              </button>
            )}

            {(user.role === "admin" || user.role === "society") && (
              <>
                <button
                  onClick={() => navigate("/CreateEvent")}
                  className={primaryBtn}
                >
                  Create Event
                </button>
                <button
                  onClick={() => navigate("/CreateAnnouncements")}
                  className={primaryBtn}
                >
                  Create Announcement
                </button>
                <button
                  onClick={() => navigate("/CreateHighlights")}
                  className={primaryBtn}
                >
                  Create Highlight
                </button>
              </>
            )}

            {user.role === "student" &&
              user.societyRequestStatus === "none" && (
                <button
                  onClick={() => navigate("/SocietyRequestForm")}
                  className={outlineBtn}
                >
                  Request Upgrade to Society
                </button>
              )}

            {user.role === "admin" && (
              <>
                <button
                  onClick={() => navigate("/SocietyDetails")}
                  className={outlineBtn}
                >
                  Societies
                </button>
                <button
                  onClick={() => navigate("/AdminQueriesPage")}
                  className={outlineBtn}
                >
                  Queries
                </button>
              </>
            )}
          </div>
        </div>

        {/* Events Section */}
        <div className="mt-12">
          <div className="mb-6">
            <h2 className="font-display text-xl md:text-2xl font-semibold text-[#111] tracking-tightish">
              {user.role === "student"
                ? "My Registered Events"
                : "Events You Created"}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {user.role === "student"
                ? "All the events you've signed up for."
                : "All the events under your name."}
            </p>
          </div>

          {events.length === 0 ? (
            <EmptyState
              icon={<CalendarIcon />}
              title={
                user.role === "student"
                  ? "No registrations yet"
                  : "No events created yet"
              }
              description={
                user.role === "student"
                  ? "Browse upcoming events and register in one tap."
                  : "Create your first event so students can register."
              }
              action={
                user.role === "student" ? (
                  <button
                    onClick={() => navigate("/EventsPage")}
                    className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-white rounded-lg text-sm font-semibold shadow-sm transition"
                  >
                    Browse events
                  </button>
                ) : (
                  <button
                    onClick={() => navigate("/CreateEvent")}
                    className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-white rounded-lg text-sm font-semibold shadow-sm transition"
                  >
                    Create your first event
                  </button>
                )
              }
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event) => (
                <div
                  key={event._id}
                  className="bg-white border border-[#e5e5e5] rounded-xl overflow-hidden flex flex-col transition-all duration-300 ease-out hover:shadow-xl hover:-translate-y-1 hover:scale-[1.01] group"
                >
                  {event.coverImageURL && (
                    <img
                      src={optimizeCard(event.coverImageURL)}
                      alt={event.title}
                      loading="lazy"
                      className="w-full h-40 object-cover bg-gray-100"
                    />
                  )}

                  <div className="p-4 flex flex-col flex-1">
                    <h3 className="text-[#111] font-semibold text-base line-clamp-2 group-hover:text-emerald-600 transition-colors">
                      {event.title}
                    </h3>
                    {event.description && (
                      <p className="text-gray-500 text-xs mt-1 line-clamp-2">
                        {event.description}
                      </p>
                    )}

                    <div className="text-gray-400 text-xs mt-3 space-y-0.5">
                      <p>{formatEventDateTime(event.date, event.time)}</p>
                      <p>{event.location}</p>
                      {event.eventCategory && <p>{event.eventCategory}</p>}
                    </div>

                    {(user.role === "society" || user.role === "admin") && (
                      <div className="mt-4 pt-3 border-t border-[#eee] flex flex-col gap-2">
                        <button
                          onClick={() =>
                            navigate(`/events/${event._id}/registrations`)
                          }
                          className="text-xs px-3 py-2 rounded-md bg-emerald-500 hover:bg-emerald-400 text-white font-medium shadow-sm transition"
                        >
                          View Registered Students
                        </button>

                        {user.role === "admin" && (
                          <button
                            onClick={() =>
                              navigate(`/edit-event/${event._id}`)
                            }
                            className="text-xs px-3 py-2 rounded-md border border-[#e5e5e5] text-[#333] hover:bg-gray-50 hover:border-emerald-200 font-medium transition"
                          >
                            Edit Event
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default Dashboard;
