import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom";
import Footer from "./Footer";

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      console.log("🔍 Fetching dashboard data...");

      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.warn("⚠️ No token found — user not logged in.");
          setError("Not logged in");
          return;
        }

        console.log("📤 Fetching user details...");
        const resUser = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/users/me`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const fetchedUser = resUser.data;
        console.log("✅ User data fetched:", fetchedUser);
        setUser(fetchedUser);

        let eventsRes;
        if (fetchedUser.role === "student") {
          console.log("🎟 Fetching registered events for student...");
          eventsRes = await axios.get(
            `${import.meta.env.VITE_BACKEND_URL}/api/registers/my`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
        } else if (
          fetchedUser.role === "society" ||
          fetchedUser.role === "admin"
        ) {
          console.log("🏛 Fetching events created by society/admin...");
          eventsRes = await axios.get(
            `${import.meta.env.VITE_BACKEND_URL}/api/societies/my-events`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
        }

        console.log("✅ Events fetched successfully:", eventsRes.data);
        setEvents(eventsRes.data);
      } catch (err) {
        console.error("❌ Error fetching data:", err);
        setError("Failed to fetch data");
      } finally {
        console.log("⏳ Data fetching complete.");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (error) {
    console.warn("⚠️ Dashboard error:", error);
    return <p className="text-red-500 text-center mt-10">{error}</p>;
  }

  if (loading) {
    console.log("⏳ Loading dashboard...");
    return <p className="text-white text-center mt-10">Loading...</p>;
  }

  if (!user) {
    console.warn("⚠️ User object is null — returning nothing.");
    return null;
  }

  console.log("👤 Rendering dashboard for user:", user.role);

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-[#003300] to-black text-white flex flex-col">
      <Navbar />

      <main className="flex-grow">
        <div className="max-w-4xl mx-auto mt-10 bg-[#0a1a0a]/80 backdrop-blur-md text-white rounded-2xl shadow-[0_0_15px_rgba(0,255,100,0.25)] p-6 sm:p-10">
          <h1 className="font-bold text-3xl text-center mb-6 text-green-400">
            Your Details
          </h1>

          <div className="flex flex-col gap-4">
            {infoRows.map((row, index) => (
              <div
                key={index}
                className="flex flex-col sm:flex-row sm:justify-between bg-black/40 border border-green-700 rounded-lg p-3 hover:border-green-500 transition-all"
              >
                <p className="font-semibold text-green-300">{row.label}:</p>
                <p>{row.value}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-4 mt-8 justify-center">
            <button
              onClick={() => {
                console.log("🖋 Navigating to Edit Profile");
                navigate("/EditProfile");
              }}
              className="font-semibold text-sm bg-gradient-to-r from-green-600 to-green-800 hover:from-green-500 hover:to-green-700 transition-all text-white rounded-md px-4 py-2 w-full sm:w-48 shadow-md"
            >
              Edit Profile
            </button>

            {user.role === "society" && (
              <button
                onClick={() => {
                  console.log("🏛 Navigating to Edit Society Info");
                  navigate("/EditSociety");
                }}
                className="font-semibold text-sm bg-gradient-to-r from-emerald-600 to-emerald-800 hover:from-emerald-500 hover:to-emerald-700 transition-all text-white rounded-md px-4 py-2 w-full sm:w-48 shadow-md"
              >
                Edit Society Info
              </button>
            )}

            {user.role === "student" &&
              user.societyRequestStatus === "none" && (
                <button
                  onClick={() => {
                    console.log("📨 Navigating to Society Request Form");
                    navigate("/SocietyRequestForm");
                  }}
                  className="font-semibold text-sm bg-gradient-to-r from-green-600 to-green-800 hover:from-green-500 hover:to-green-700 transition-all text-white rounded-md px-4 py-2 w-full sm:w-48 shadow-md"
                >
                  Request Upgrade to Society
                </button>
              )}

            {user.role === "admin" && (
              <>
                <button
                  onClick={() => {
                    console.log("🗂 Navigating to Requests Page");
                    navigate("/RequestPage");
                  }}
                  className="font-semibold text-sm bg-gradient-to-r from-green-600 to-green-800 hover:from-green-500 hover:to-green-700 transition-all text-white rounded-md px-4 py-2 w-full sm:w-48 shadow-md"
                >
                  Requests
                </button>

                <button
                  onClick={() => {
                    console.log("📬 Navigating to Admin Queries Page");
                    navigate("/AdminQueriesPage");
                  }}
                  className="font-semibold text-sm bg-gradient-to-r from-green-600 to-green-800 hover:from-green-500 hover:to-green-700 transition-all text-white rounded-md px-4 py-2 w-full sm:w-48 shadow-md"
                >
                  Queries
                </button>
              </>
            )}
          </div>
        </div>

        <div className="max-w-6xl mx-auto mt-12 mb-12 px-4">
          <h2 className="text-2xl font-bold mb-6 text-center text-green-400 drop-shadow-md">
            {user.role === "student"
              ? "My Registered Events"
              : "Events You Created"}
          </h2>

          {events.length === 0 ? (
            <p className="text-center text-gray-300">
              {user.role === "student"
                ? "You haven’t registered for any events yet."
                : "You haven’t created any events yet."}
            </p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event) => (
                <div
                  key={event._id}
                  className="bg-black/50 border border-green-800 rounded-xl p-4 shadow-[0_0_15px_rgba(0,255,100,0.2)] hover:shadow-[0_0_25px_rgba(0,255,100,0.4)] transition-all"
                >
                  {event.coverImageURL && (
                    <img
                      src={event.coverImageURL}
                      alt={event.title}
                      className="w-full h-40 object-cover rounded-md mb-3 border border-green-700"
                    />
                  )}
                  <h3 className="text-xl font-bold mb-1 text-green-300">
                    {event.title}
                  </h3>
                  <p className="text-gray-300 text-sm mb-1">
                    {event.description}
                  </p>
                  <p className="text-gray-200">
                    📅 {event.date} at {event.time}
                  </p>
                  <p className="text-gray-200">📍 {event.location}</p>
                  <p className="text-gray-200">📂 {event.eventCategory}</p>

                  {(user.role === "society" || user.role === "admin") && (
                    <div className="mt-4 flex flex-col gap-2">
                      <button
                        onClick={() => {
                          console.log(
                            `👥 Viewing registered students for event: ${event._id}`
                          );
                          navigate(`/events/${event._id}/registrations`);
                        }}
                        className="font-semibold text-sm bg-gradient-to-r from-green-700 to-green-900 hover:from-green-600 hover:to-green-800 text-white rounded-md px-4 py-2 transition-all shadow-md"
                      >
                        View Registered Students
                      </button>

                      {user.role === "admin" && (
                        <button
                          onClick={() => {
                            console.log(`📝 Editing event: ${event._id}`);
                            navigate(`/edit-event/${event._id}`);
                          }}
                          className="font-semibold text-sm bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-500 hover:to-blue-700 text-white rounded-md px-4 py-2 transition-all shadow-md"
                        >
                          Edit Event
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Dashboard;
