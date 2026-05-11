import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import Doodles from "./Doodles";
import Spinner from "./Spinner";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import UploadPoster from "./UploadPoster"; // <-- imported
import FormSection from "./FormSection";
import { optimizeCard } from "../utils/imageOptimization";

const CreateEvent = () => {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [guest, setGuest] = useState("");
  const [registrationStatus, setRegistrationStatus] = useState("");
  const [coverImageURL, setCoverImageURL] = useState("");
  const [eventCategory, setEventCategory] = useState("");
  const [customCategory, setCustomCategory] = useState("");
  const [societyId, setSocietyId] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  // societies from backend (normalized to { _id, name, raw })
  const [societies, setSocieties] = useState([]);
  const [loadingSocieties, setLoadingSocieties] = useState(false);
  const [societiesError, setSocietiesError] = useState("");

  const BACKEND = import.meta.env.VITE_BACKEND_URL?.replace(/\/$/, "") || "";
  const role = localStorage.getItem("role");
  const isAdmin = role === "admin";

  useEffect(() => {
    if (!isAdmin) {
      // Society users can only create events for themselves — backend resolves
      // the societyId server-side, so we don't need to fetch the dropdown.
      return;
    }
    const fetchSocieties = async () => {
      setLoadingSocieties(true);
      setSocietiesError("");
      try {
        const token = localStorage.getItem("token");
        const config = token
          ? { headers: { Authorization: `Bearer ${token}` } }
          : undefined;

        console.info("[CreateEvent] fetching societies from /api/users ...");
        const res = await axios.get(`${BACKEND}/api/users`, config);
        console.debug("[CreateEvent] raw /api/users response:", res.data);

        if (!Array.isArray(res.data)) {
          console.warn(
            "[CreateEvent] /api/users did not return an array:",
            res.data
          );
          setSocieties([]);
          setSocietiesError("Unexpected societies response from server.");
          return;
        }

        // Normalize response into { _id, name, raw }
        const normalized = res.data
          .map((item) => {
            // Candidate id: user._id or item.societyId / item.society._id
            const candidateId =
              (item && (item._id || item.id)) ||
              (item &&
                item.societyId &&
                (item.societyId._id || item.societyId)) ||
              (item && item.society && (item.society._id || item.society));
            // Candidate name: prefer society.name (if nested), else user.name, else email
            const candidateName =
              (item &&
                item.society &&
                item.society.name &&
                String(item.society.name).trim()) ||
              (item && item.name && String(item.name).trim()) ||
              (item && item.email && String(item.email).trim()) ||
              null;

            if (!candidateId || !candidateName) return null;
            return { _id: String(candidateId), name: candidateName, raw: item };
          })
          .filter(Boolean);

        if (normalized.length === 0) {
          console.warn(
            "[CreateEvent] normalization yielded 0 societies:",
            res.data
          );
          setSocieties([]);
          setSocietiesError("No societies available (server returned empty).");
          return;
        }

        setSocieties(normalized);
        console.info(
          "[CreateEvent] societies loaded (normalized):",
          normalized.length
        );
      } catch (err) {
        console.error(
          "[CreateEvent] failed to fetch societies:",
          err?.response?.data || err.message
        );
        setSocieties([]);
        setSocietiesError("Failed to load societies. Try reloading the page.");
      } finally {
        setLoadingSocieties(false);
      }
    };

    fetchSocieties();
  }, [BACKEND, isAdmin]);

  function normalizeDriveURL(url) {
    const match = url.match(/\/d\/(.*?)\//);
    if (match) return `https://drive.google.com/uc?export=view&id=${match[1]}`;
    return url;
  }

  // NEW: resolve relative backend URLs (like "/uploads/xxx.png") to full URLs
  const resolveImageUrl = (url) => {
    if (!url) return "";
    // already absolute (http/https)
    if (/^https?:\/\//i.test(url)) return url;
    // relative path (starts with '/')
    if (url.startsWith("/")) {
      if (!BACKEND) return url; // fallback: return as-is
      return `${BACKEND}${url}`;
    }
    return url;
  };

  const validateDate = (selected) => {
    const selectedDate = new Date(selected);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    selectedDate.setHours(0, 0, 0, 0);

    const twoMonthsLater = new Date();
    twoMonthsLater.setMonth(twoMonthsLater.getMonth() + 2);

    if (selectedDate <= today) {
      toast.warn("Please select a future date for the event.");
      return false;
    }

    if (selectedDate > twoMonthsLater) {
      toast.warn("Event date must be within the next 2 months.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // --- date checks (same as before) ---
    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    selectedDate.setHours(0, 0, 0, 0);
    const twoMonthsLater = new Date();
    twoMonthsLater.setMonth(twoMonthsLater.getMonth() + 2);

    if (selectedDate <= today) {
      toast.warn("Please select a future date for the event.");
      return;
    }
    if (selectedDate > twoMonthsLater) {
      toast.warn("Event date must be within the next 2 months.");
      return;
    }

    setSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("You must be logged in as an admin to create an event.");
        return;
      }
      if (isAdmin) {
        if (!societyId) {
          toast.warn("Please select a society to associate this event with.");
          return;
        }

        // sanity-check the selected society exists in fetched list
        const found = societies.find((s) => s._id === societyId);
        console.info(
          "[DEBUG] Selected societyId:",
          societyId,
          "found:",
          !!found,
          found
        );
        if (!found) {
          toast.error("Selected society not found in fetched societies.");
          return;
        }
      }

      if (typeof coverImageURL !== "string" || coverImageURL.trim() === "") {
        toast.warn(
          "Please upload a poster or paste an image URL for the event."
        );
        return;
      }

      // normalize Drive URLs and resolve relative backend URLs
      let normalizedURL = normalizeDriveURL(coverImageURL);
      normalizedURL = resolveImageUrl(normalizedURL);

      const finalCategory =
        eventCategory === "Other" ? customCategory : eventCategory;

      const eventData = {
        title: title?.trim() || "",
        date: date || "",
        time: time || "",
        location: location?.trim() || "",
        description: description?.trim() || "",
        guest: guest?.trim() || "",
        registrationStatus: registrationStatus || "",
        coverImageURL: normalizedURL,
        eventCategory: finalCategory || "",
        // Only admins choose societyId; for societies the backend resolves it.
        ...(isAdmin && societyId ? { societyId } : {}),
      };

      console.debug("[DEBUG] POST payload:", eventData);

      const res = await axios.post(`${BACKEND}/api/events/add`, eventData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // --- inspect full response carefully ---
      console.info("[INFO] create event response:", {
        status: res.status,
        data: res.data,
      });

      // server returns created event either in res.data._id or res.data.event
      const returnedEvent = res.data?.event ?? res.data;

      // log returned event
      console.debug("[DEBUG] returnedEvent:", returnedEvent);

      // check societyId presence & type
      const returnedSociety = returnedEvent?.societyId;
      if (!returnedSociety) {
        console.warn(
          "[WARN] Created event does not include societyId in response."
        );
      }

      if (res.status === 201) {
        toast.success(res.data?.message || "Event created successfully!");
        // reset
        setTitle("");
        setDate("");
        setTime("");
        setLocation("");
        setDescription("");
        setGuest("");
        setRegistrationStatus("");
        setCoverImageURL("");
        setEventCategory("");
        setCustomCategory("");
        setSocietyId("");
        setTimeout(() => navigate("/"), 1000);
      }
    } catch (err) {
      console.error("[ERROR] create event failed - axios error:", err);
      if (err.response) {
        console.error("[ERROR] server response:", err.response.data);
        toast.error(
          err.response.data?.message || `Server returned ${err.response.status}`
        );
      } else {
        toast.error(err.message || "Error creating event. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass =
    "rounded-lg p-3 w-full bg-white border border-[#e5e5e5] text-[#111] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all";
  const selectClass =
    "rounded-lg p-3 w-full bg-white border border-[#e5e5e5] text-[#111] focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all";

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="relative flex-grow overflow-hidden flex flex-col">
        <Doodles variant="hero" />
        <div className="relative z-10 flex justify-center flex-grow px-4 py-10">
          <div className="bg-white border border-[#e5e5e5] shadow-sm w-full max-w-2xl rounded-2xl py-8 px-4 sm:px-10">
          <h1 className="font-display text-center font-bold text-3xl mb-2 text-[#111] tracking-tightish">
            Create your{" "}
            <span className="bg-gradient-to-r from-emerald-600 via-emerald-500 to-emerald-400 bg-clip-text text-transparent">
              Event
            </span>
          </h1>
          <p className="text-center text-sm text-gray-500 mb-6">
            Fill in the details below — date must be within the next 2 months.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {/* ── BASICS ─────────────────────────── */}
            <FormSection
              title="Basics"
              description="The headline info attendees will see first."
            >
              <input
                type="text"
                placeholder="Event title"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={inputClass}
              />
              <textarea
                placeholder="Description — what is this event about?"
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className={`${inputClass} resize-none`}
              />
            </FormSection>

            {/* ── SCHEDULE ───────────────────────── */}
            <FormSection
              title="Schedule"
              description="When the event is happening. Date must be within the next 2 months."
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => {
                    setDate(e.target.value);
                    validateDate(e.target.value);
                  }}
                  className={inputClass}
                />
                <input
                  type="time"
                  required
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className={inputClass}
                />
              </div>
              <select
                required
                value={registrationStatus}
                onChange={(e) => setRegistrationStatus(e.target.value)}
                className={selectClass}
              >
                <option value="" disabled>
                  Registration status
                </option>
                <option value="open">Open</option>
                <option value="closed">Closed</option>
                <option value="upcoming">Upcoming</option>
              </select>
            </FormSection>

            {/* ── WHERE & WHO ────────────────────── */}
            <FormSection
              title="Where & who"
              description="Location, hosting society, and category."
            >
              <input
                type="text"
                placeholder="Location"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className={inputClass}
              />
              <input
                type="text"
                placeholder="Guest (speaker, performer, …)"
                required
                value={guest}
                onChange={(e) => setGuest(e.target.value)}
                className={inputClass}
              />

              {isAdmin && (
                loadingSocieties ? (
                  <div className="rounded-lg p-3 bg-[#f7faf8] border border-[#eeeeea] text-gray-500 w-full text-sm">
                    Loading societies...
                  </div>
                ) : societiesError ? (
                  <div className="rounded-lg p-3 bg-red-50 border border-red-200 text-red-600 w-full text-sm">
                    {societiesError}
                  </div>
                ) : (
                  <select
                    required
                    value={societyId}
                    onChange={(e) => setSocietyId(e.target.value)}
                    className={selectClass}
                  >
                    <option value="" disabled>
                      Hosting society
                    </option>
                    {societies.map((soc) => (
                      <option key={soc._id} value={soc._id}>
                        {soc.name}
                      </option>
                    ))}
                  </select>
                )
              )}

              <select
                required
                value={eventCategory}
                onChange={(e) => setEventCategory(e.target.value)}
                className={selectClass}
              >
                <option value="" disabled>
                  Event category
                </option>
                <option value="Music">Music</option>
                <option value="Dance">Dance</option>
                <option value="Party">Party</option>
                <option value="Other">Other</option>
              </select>

              {eventCategory === "Other" && (
                <input
                  type="text"
                  placeholder="Enter custom category"
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value)}
                  className={inputClass}
                  required
                />
              )}
            </FormSection>

            {/* ── MEDIA ──────────────────────────── */}
            <FormSection
              title="Media"
              description="A poster image makes your event stand out in listings."
            >
              <UploadPoster
                onUploaded={(url) => {
                  console.info(
                    "[DEBUG] UploadPoster onUploaded called with:",
                    url
                  );
                  setCoverImageURL(url);
                  toast.success("Poster uploaded.");
                }}
                initialPreviewUrl={coverImageURL}
              />

              <p className="text-xs text-gray-400 -mt-1">
                Or paste an image URL — it will be normalized on submit.
              </p>
              <input
                type="text"
                placeholder="Paste image URL (optional)"
                value={coverImageURL}
                onChange={(e) => setCoverImageURL(e.target.value)}
                className={inputClass}
              />

              {coverImageURL && (
                <div className="mt-2 flex justify-center">
                  <img
                    src={optimizeCard(resolveImageUrl(coverImageURL))}
                    alt="poster preview"
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.src = "";
                    }}
                    className="max-w-full max-h-48 rounded-lg object-cover border border-[#e5e5e5]"
                  />
                </div>
              )}
            </FormSection>

            <button
              type="submit"
              disabled={submitting}
              className="mt-2 font-semibold bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 disabled:bg-emerald-300 disabled:cursor-not-allowed text-white rounded-lg py-3 w-full sm:w-1/2 mx-auto shadow-sm transition-all flex items-center justify-center gap-2"
            >
              {submitting && <Spinner className="w-4 h-4" />}
              {submitting ? "Creating…" : "Create Event"}
            </button>
          </form>
        </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CreateEvent;
