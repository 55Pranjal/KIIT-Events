import LandingScreen from "./Components/LandingScreen";

import { Routes, Route } from "react-router-dom";
import Login from "./Components/Login";
import SignUp from "./Components/SignUp";
import Contact from "./Components/Contact";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import EventDetails from "./Components/EventDetails";

import CreateEvent from "./Components/CreateEvent";

import Dashboard from "./Components/Dashboard";
import SocietyRequestForm from "./Components/SocietyRequestForm";
import RequestPage from "./Components/RequestPage";
import EditProfile from "./Components/EditProfile";
import EventRegistrations from "./Components/EventRegistrations";
import EditEvent from "./Components/EditEvent";
import NotificationsPanel from "./Components/NotificationsPanel";
import UpcomingEvents from "./Components/UpcomingEvents";
import EditSociety from "./Components/EditSociety";
import AnnouncementsList from "./Components/AnnouncementsList";
import CreateAnnouncement from "./Components/CreateAnnouncement";
import AdminQueries from "./Components/AdminQueryPage";
import PastEvents from "./Components/PastEvents";
import SocietyDetails from "./Components/SocietyDetails";
import EventsPage from "./Components/EventsPage";
import CreateHighlights from "./Components/CreateHighlights";
import EventHighlightSingle from "./Components/EventHighlights";
import LoadingPage from "./Components/LoadingPage";
import ServerWakeOverlay from "./Components/ServerWakeOverlay";
import RequireAuth from "./Components/RequireAuth";
import CaseInsensitiveRedirect from "./Components/CaseInsensitiveRedirect";
import PrivacyPolicy from "./Components/PrivacyPolicy";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const REWAKE_THRESHOLD_MS = 10 * 60 * 1000;

function App() {
  const navigate = useNavigate();
  useEffect(() => {
    // only run on first load, not on internal navigation
    if (window.location.pathname === "/") {
      navigate("/loading", { replace: true });
    }
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      localStorage.setItem("token", token);
      navigate("/");
    }
  }, [navigate]);

  useEffect(() => {
    let hiddenAt = null;
    const BACKEND =
      import.meta.env.VITE_BACKEND_URL?.replace(/\/$/, "") || "";

    const onVisibility = () => {
      if (document.hidden) {
        hiddenAt = Date.now();
        return;
      }
      if (hiddenAt && Date.now() - hiddenAt > REWAKE_THRESHOLD_MS) {
        axios.get(`${BACKEND}/api/health`).catch(() => {});
      }
      hiddenAt = null;
    };

    document.addEventListener("visibilitychange", onVisibility);
    return () =>
      document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  // Session expiry handler — fired by the axios interceptor when a 401 lands
  // on a non-login endpoint. Local auth state has already been cleared by the
  // interceptor; we just notify the user and bounce them to /Login.
  useEffect(() => {
    const onExpired = () => {
      window.dispatchEvent(new Event("authChange"));
      toast.info("Your session has expired. Please log in again.");
      const here = window.location.pathname + window.location.search;
      navigate(`/Login?from=${encodeURIComponent(here)}`, { replace: true });
    };
    window.addEventListener("auth:expired", onExpired);
    return () => window.removeEventListener("auth:expired", onExpired);
  }, [navigate]);

  // Multi-tab auth sync — the `storage` event fires on every OTHER tab when
  // localStorage changes. Use it to keep tabs in agreement: if someone logs
  // out in tab A, tab B should also drop the user. If they're sitting on a
  // public page (EventsPage, an event detail) we just refresh the Navbar
  // without yanking them away; on a protected page we force-redirect.
  useEffect(() => {
    const PUBLIC_PREFIXES = [
      "/",
      "/loading",
      "/Login",
      "/SignUp",
      "/EventsPage",
      "/Upcoming",
      "/PastEvents",
      "/AnnouncementsList",
      "/events",
      "/privacy",
    ];

    const isPublicPath = (p) =>
      PUBLIC_PREFIXES.some(
        (pre) => p === pre || (pre !== "/" && p.startsWith(pre + "/"))
      );

    const onStorage = (e) => {
      if (e.key !== "token") return;
      // Refresh Navbar etc. regardless of direction (login or logout).
      window.dispatchEvent(new Event("authChange"));

      if (!e.newValue) {
        // Logout in another tab.
        toast.info("Signed out in another tab.");
        const here = window.location.pathname;
        if (!isPublicPath(here)) {
          navigate("/Login", { replace: true });
        }
      }
    };

    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [navigate]);

  return (
    <>
      <ServerWakeOverlay />
      <Routes>
        {/* ── Public routes ────────────────────────────────────────────── */}
        <Route path="/loading" element={<LoadingPage />} />
        <Route path="/" element={<LandingScreen />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/SignUp" element={<SignUp />} />
        <Route path="/EventsPage" element={<EventsPage />} />
        <Route path="/Upcoming" element={<UpcomingEvents />} />
        <Route path="/PastEvents" element={<PastEvents />} />
        <Route path="/events/:id" element={<EventDetails />} />
        <Route
          path="/events/:eventId/highlights"
          element={<EventHighlightSingle />}
        />
        <Route path="/AnnouncementsList" element={<AnnouncementsList />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />

        {/* ── Authenticated (any role) ─────────────────────────────────── */}
        <Route
          path="/Dashboard"
          element={<RequireAuth><Dashboard /></RequireAuth>}
        />
        <Route
          path="/EditProfile"
          element={<RequireAuth><EditProfile /></RequireAuth>}
        />
        <Route
          path="/Notifications"
          element={<RequireAuth><NotificationsPanel /></RequireAuth>}
        />
        <Route
          path="/Contact"
          element={<RequireAuth><Contact /></RequireAuth>}
        />
        <Route
          path="/SocietyRequestForm"
          element={<RequireAuth><SocietyRequestForm /></RequireAuth>}
        />

        {/* ── Society or admin ─────────────────────────────────────────── */}
        <Route
          path="/CreateEvent"
          element={
            <RequireAuth roles={["society", "admin"]}>
              <CreateEvent />
            </RequireAuth>
          }
        />
        <Route
          path="/CreateAnnouncements"
          element={
            <RequireAuth roles={["society", "admin"]}>
              <CreateAnnouncement />
            </RequireAuth>
          }
        />
        <Route
          path="/edit-event/:eventId"
          element={
            <RequireAuth roles={["society", "admin"]}>
              <EditEvent />
            </RequireAuth>
          }
        />
        <Route
          path="/events/:eventId/registrations"
          element={
            <RequireAuth roles={["society", "admin"]}>
              <EventRegistrations />
            </RequireAuth>
          }
        />

        {/* ── Society only ─────────────────────────────────────────────── */}
        <Route
          path="/EditSociety"
          element={
            <RequireAuth roles={["society"]}>
              <EditSociety />
            </RequireAuth>
          }
        />

        {/* ── Admin only ───────────────────────────────────────────────── */}
        <Route
          path="/RequestPage"
          element={
            <RequireAuth roles={["admin"]}>
              <RequestPage />
            </RequireAuth>
          }
        />
        <Route
          path="/AdminQueriesPage"
          element={
            <RequireAuth roles={["admin"]}>
              <AdminQueries />
            </RequireAuth>
          }
        />
        <Route
          path="/SocietyDetails"
          element={
            <RequireAuth roles={["admin"]}>
              <SocietyDetails />
            </RequireAuth>
          }
        />
        <Route
          path="/CreateHighlights"
          element={
            <RequireAuth roles={["admin"]}>
              <CreateHighlights />
            </RequireAuth>
          }
        />

        <Route path="*" element={<CaseInsensitiveRedirect />} />
      </Routes>

      <ToastContainer
        position="top-right"
        autoClose={3500}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnFocusLoss
        pauseOnHover
        theme="light"
        toastClassName="!rounded-xl !text-sm !font-medium !shadow-lg !border !border-[#e5e5e5]"
        progressClassName="!bg-emerald-500"
      />
    </>
  );
}

export default App;
