import LandingScreen from "./Components/LandingScreen";

import { Routes, Route } from "react-router-dom";
import Login from "./Components/Login";
import SignUp from "./Components/SignUp";
import About from "./Components/About";
import Contact from "./Components/Contact";
import Home from "./pages/Home";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import EventDetails from "./Components/EventDetails";
import {
  VscHome,
  VscArchive,
  VscAccount,
  VscSettingsGear,
} from "react-icons/vsc";

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

function App() {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      localStorage.setItem("token", token);
      navigate("/");
    }
  }, [navigate]);
  const items = [
    {
      icon: <VscHome size={18} />,
      label: "Home",
      onClick: () => alert("Home!"),
    },
    {
      icon: <VscArchive size={18} />,
      label: "Archive",
      onClick: () => alert("Archive!"),
    },
    {
      icon: <VscAccount size={18} />,
      label: "Profile",
      onClick: () => alert("Profile!"),
    },
    {
      icon: <VscSettingsGear size={18} />,
      label: "Settings",
      onClick: () => alert("Settings!"),
    },
  ];
  return (
    <>
      <Routes>
        <Route path="/" element={<LandingScreen />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/SignUp" element={<SignUp />} />
        <Route path="/About" element={<About />} />
        <Route path="/Contact" element={<Contact />} />
        <Route path="/home" element={<Home />} />
        <Route path="/CreateEvent" element={<CreateEvent />} />

        <Route path="/Dashboard" element={<Dashboard />} />
        <Route path="/SocietyRequestForm" element={<SocietyRequestForm />} />
        <Route path="/RequestPage" element={<RequestPage />} />
        <Route path="/EditProfile" element={<EditProfile />} />
        <Route path="/events/:id" element={<EventDetails />} />
        <Route
          path="/events/:eventId/registrations"
          element={<EventRegistrations />}
        />
        <Route path="/edit-event/:eventId" element={<EditEvent />} />
        <Route path="/Notifications" element={<NotificationsPanel />} />
        <Route path="/Upcoming" element={<UpcomingEvents />} />
        <Route path="/EditSociety" element={<EditSociety />} />
        <Route path="/AnnouncementsList" element={<AnnouncementsList />} />
        <Route path="/CreateAnnouncements" element={<CreateAnnouncement />} />
        <Route path="/AdminQueriesPage" element={<AdminQueries />} />
        <Route path="/PastEvents" element={<PastEvents />} />
        <Route path="/SocietyDetails" element={<SocietyDetails />} />
        <Route path="/EventsPage" element={<EventsPage />} />
      </Routes>
    </>
  );
}

export default App;
