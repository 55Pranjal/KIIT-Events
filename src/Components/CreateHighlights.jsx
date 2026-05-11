import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Navbar from "./Navbar";
import Footer from "./Footer";
import Doodles from "./Doodles";
import Spinner from "./Spinner";
import UploadPoster from "./UploadPoster";
import FormSection from "./FormSection";
import { optimizeThumb, optimizeAvatar } from "../utils/imageOptimization";

const MAX_FILES = 8;
const MAX_SIZE = 12 * 1024 * 1024; // 12MB

export default function CreateHighlight() {
  const navigate = useNavigate();

  const [events, setEvents] = useState([]);
  const [eventId, setEventId] = useState("");
  const [title, setTitle] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [longDescription, setLongDescription] = useState("");
  const [gallery, setGallery] = useState([]);
  const [guests, setGuests] = useState([
    { name: "", title: "", bio: "", photo: null },
  ]);

  const [keyHighlights, setKeyHighlights] = useState([""]);
  const [status, setStatus] = useState("draft");
  const [featured, setFeatured] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const BACKEND = import.meta.env.VITE_BACKEND_URL?.replace(/\/$/, "") || "";

  const fileRef = useRef();

  const token = localStorage.getItem("token");

  const MAX_SHORT_DESC_CHARS = 400;

  const isShortDescriptionInvalid = () =>
    shortDescription.length > MAX_SHORT_DESC_CHARS;

  useEffect(() => {
    axios
      .get(`${BACKEND}/api/events/all`)
      .then((res) => {
        const raw = res.data;

        const list = Array.isArray(raw)
          ? raw
          : Array.isArray(raw?.events)
          ? raw.events
          : typeof raw === "object"
          ? Object.values(raw.events || raw)
          : [];

        setEvents(list);
        if (list.length > 0) setEventId(list[0]._id || list[0].id);
      })
      .catch((err) => {
        console.error("Failed to load events", err);
      });
  }, []);

  function handleFilesChange(e) {
    const files = Array.from(e.target.files || []);
    const next = [...gallery];

    for (const file of files) {
      if (next.length >= MAX_FILES) break;
      if (!file.type.startsWith("image/")) continue;
      if (file.size > MAX_SIZE) {
        toast.warn(`${file.name} is too large (max 12MB).`);
        continue;
      }
      next.push({
        file,
        previewUrl: URL.createObjectURL(file),
        alt: "",
        credit: "",
        uploading: false,
        progress: 0,
        url: null,
      });
    }
    setGallery(next);
    fileRef.current.value = null;
  }

  function removeGalleryItem(i) {
    setGallery((prev) => {
      const copy = [...prev];
      const removed = copy.splice(i, 1)[0];
      if (removed && removed.previewUrl)
        URL.revokeObjectURL(removed.previewUrl);
      return copy;
    });
  }

  function addGuest() {
    setGuests((prev) => [
      ...prev,
      { name: "", title: "", bio: "", photo: null },
    ]);
  }

  function removeGuest(index) {
    setGuests((prev) => prev.filter((_, i) => i !== index));
  }

  function updateGuestField(index, key, value) {
    setGuests((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [key]: value };
      return copy;
    });
  }

  function handleGuestUploaded(index, url) {
    setGuests((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], photo: { url } };
      return copy;
    });
  }

  async function uploadFile(fileObj, onProgress) {
    const form = new FormData();
    form.append("poster", fileObj);

    const res = await axios.post(`${BACKEND}/api/upload`, form, {
      headers: { "Content-Type": "multipart/form-data" },
      onUploadProgress: (p) => {
        if (onProgress) onProgress(Math.round((p.loaded / p.total) * 100));
      },
    });

    return res.data.url;
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!title.trim()) return toast.warn("Title is required.");
    if (!shortDescription.trim())
      return toast.warn("Short description is required.");
    if (gallery.length === 0)
      return toast.warn("Upload at least one image.");
    if (!eventId) return toast.warn("Select an event.");

    setSubmitting(true);

    try {
      const uploadedGallery = [];

      for (let i = 0; i < gallery.length; i++) {
        const g = gallery[i];

        if (g.url) {
          uploadedGallery.push({ url: g.url, alt: g.alt, credit: g.credit });
          continue;
        }

        const url = await uploadFile(g.file, (pct) => {
          setGallery((prev) => {
            const copy = [...prev];
            copy[i] = { ...copy[i], progress: pct, uploading: true };
            return copy;
          });
        });

        uploadedGallery.push({ url, alt: g.alt, credit: g.credit });

        setGallery((prev) => {
          const copy = [...prev];
          copy[i] = { ...copy[i], url, uploading: false, progress: 100 };
          return copy;
        });
      }

      const uploadedGuests = [];
      for (let i = 0; i < guests.length; i++) {
        const g = guests[i];
        let photoObj = null;

        if (g.photo && g.photo.file) {
          const url = await uploadFile(g.photo.file, (pct) => {
            setGuests((prev) => {
              const copy = [...prev];
              copy[i] = {
                ...copy[i],
                photo: { ...copy[i].photo, progress: pct, uploading: true },
              };
              return copy;
            });
          });
          photoObj = { url };
          setGuests((prev) => {
            const copy = [...prev];
            copy[i] = {
              ...copy[i],
              photo: { ...copy[i].photo, url, uploading: false, progress: 100 },
            };
            return copy;
          });
        } else if (g.photo && g.photo.url) {
          photoObj = { url: g.photo.url };
        }

        uploadedGuests.push({
          name: g.name,
          title: g.title,
          bio: g.bio,
          photo: photoObj,
        });
      }

      const payload = {
        title: title.trim(),
        shortDescription: shortDescription.trim(),
        longDescription: longDescription.trim(),
        gallery: uploadedGallery,
        guests: uploadedGuests,
        keyHighlights: keyHighlights.filter((k) => k.trim()),
        status,
        featured,
      };

      console.log("CreateHighlight payload:", payload);

      await axios.post(
        `${BACKEND}/api/events/${eventId}/create-highlights`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Highlight created successfully!");
      setTimeout(() => navigate(`/EventsPage`), 800);
    } catch (err) {
      console.error(err);
      toast.error("Failed to create highlight.");
    } finally {
      setSubmitting(false);
    }
  }

  const inputClass =
    "rounded-lg p-3 w-full bg-white border border-[#e5e5e5] text-[#111] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all";
  const sectionLabel =
    "text-xs font-medium text-gray-500 uppercase tracking-wider";
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="relative flex-grow overflow-hidden flex flex-col">
        <Doodles variant="hero" />
        <div className="relative z-10 flex justify-center flex-grow px-4 py-10">
          <div className="bg-white border border-[#e5e5e5] shadow-sm w-full max-w-3xl rounded-2xl py-8 px-4 sm:px-10">
          <h1 className="font-display text-center font-bold text-3xl mb-2 text-[#111] tracking-tightish">
            Create{" "}
            <span className="bg-gradient-to-r from-emerald-600 via-emerald-500 to-emerald-400 bg-clip-text text-transparent">
              Highlight
            </span>
          </h1>
          <p className="text-center text-sm text-gray-500 mb-6">
            Showcase what happened at an event with photos and stories.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {/* ── EVENT ──────────────────────────── */}
            <FormSection
              title="Event"
              description="Which event is this highlight for?"
            >
              <select
                required
                value={eventId}
                onChange={(e) => setEventId(e.target.value)}
                className={inputClass}
              >
                {events.map((ev) => (
                  <option key={ev._id} value={ev._1d || ev._id}>
                    {ev.title}
                  </option>
                ))}
              </select>
            </FormSection>

            {/* ── STORY ──────────────────────────── */}
            <FormSection
              title="Story"
              description="The headline summary and the long-form recap."
            >
              <input
                type="text"
                placeholder="Highlight title"
                value={title}
                required
                onChange={(e) => setTitle(e.target.value)}
                className={inputClass}
              />

              <div className="space-y-1.5">
                <textarea
                  rows={2}
                  placeholder="Short description (shows on cards, max 400 chars)"
                  value={shortDescription}
                  onChange={(e) => setShortDescription(e.target.value)}
                  className={`${inputClass} resize-none`}
                />
                <p
                  className={`text-xs text-right ${
                    isShortDescriptionInvalid()
                      ? "text-red-500"
                      : "text-gray-400"
                  }`}
                >
                  {shortDescription.length} / {MAX_SHORT_DESC_CHARS} characters
                </p>
              </div>

              <textarea
                rows={6}
                placeholder="Long description — what happened at the event?"
                value={longDescription}
                onChange={(e) => setLongDescription(e.target.value)}
                className={`${inputClass} resize-none`}
              />
            </FormSection>

            {/* ── GALLERY ────────────────────────── */}
            <FormSection
              title="Gallery"
              description={`Upload up to ${MAX_FILES} images. JPG / PNG, max 12 MB each.`}
            >
              <input
                type="file"
                ref={fileRef}
                accept="image/*"
                multiple
                onChange={handleFilesChange}
                className="text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
              />

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {gallery.map((g, i) => (
                  <div
                    key={i}
                    className="bg-[#f7faf8] border border-[#eeeeea] rounded-xl p-3"
                  >
                    <img
                      src={g.previewUrl || optimizeThumb(g.url)}
                      className="rounded-md h-28 w-full object-cover"
                      alt=""
                      loading="lazy"
                    />

                    <input
                      className="mt-2 p-2 text-sm rounded bg-white border border-[#e5e5e5] w-full focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      placeholder="Alt text"
                      value={g.alt}
                      onChange={(e) =>
                        setGallery((prev) => {
                          const copy = [...prev];
                          copy[i].alt = e.target.value;
                          return copy;
                        })
                      }
                    />

                    <input
                      className="mt-2 p-2 text-sm rounded bg-white border border-[#e5e5e5] w-full focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      placeholder="Credit"
                      value={g.credit}
                      onChange={(e) =>
                        setGallery((prev) => {
                          const copy = [...prev];
                          copy[i].credit = e.target.value;
                          return copy;
                        })
                      }
                    />

                    <button
                      type="button"
                      onClick={() => removeGalleryItem(i)}
                      className="mt-2 text-xs text-red-500 hover:text-red-600 font-medium"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </FormSection>

            {/* ── GUESTS ─────────────────────────── */}
            <FormSection
              title="Guests"
              description="Speakers, performers, panelists — anyone you want to credit."
            >
              <div className="-mt-1 flex justify-end">
                <button
                  type="button"
                  onClick={addGuest}
                  className="text-sm text-emerald-600 hover:text-emerald-700 font-semibold"
                >
                  + Add guest
                </button>
              </div>

              <div className="space-y-4">
                {guests.map((g, idx) => (
                  <div
                    key={idx}
                    className="bg-[#f7faf8] border border-[#eeeeea] rounded-xl p-4"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="font-semibold text-[#111] text-sm">
                        Guest {idx + 1}
                      </h4>
                      <button
                        type="button"
                        onClick={() => removeGuest(idx)}
                        className="text-xs text-red-500 hover:text-red-600 font-medium"
                      >
                        Remove
                      </button>
                    </div>

                    <input
                      type="text"
                      placeholder="Guest Name"
                      value={g.name}
                      onChange={(e) =>
                        updateGuestField(idx, "name", e.target.value)
                      }
                      className={`${inputClass} mb-2`}
                    />

                    <input
                      type="text"
                      placeholder="Guest Title"
                      value={g.title}
                      onChange={(e) =>
                        updateGuestField(idx, "title", e.target.value)
                      }
                      className={`${inputClass} mb-2`}
                    />

                    <textarea
                      placeholder="Guest Bio"
                      rows={3}
                      value={g.bio}
                      onChange={(e) =>
                        updateGuestField(idx, "bio", e.target.value)
                      }
                      className={`${inputClass} mb-3 resize-none`}
                    />

                    <div className="mt-2">
                      <UploadPoster
                        onUploaded={(url) => handleGuestUploaded(idx, url)}
                        initialPreviewUrl={
                          g.photo?.url || g.photo?.previewUrl
                        }
                      />
                      {g.photo && (g.photo.url || g.photo.previewUrl) && (
                        <div className="mt-3">
                          <img
                            src={
                              g.photo.previewUrl ||
                              optimizeAvatar(g.photo.url)
                            }
                            alt={g.name || `guest-${idx + 1}`}
                            loading="lazy"
                            className="h-20 rounded-md object-cover border border-[#e5e5e5]"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </FormSection>

            {/* ── KEY MOMENTS ────────────────────── */}
            <FormSection
              title="Key moments"
              description="A short list of the standout moments — bullet-point style."
            >
              {keyHighlights.map((k, idx) => (
                <div key={idx} className="flex gap-3 mb-2">
                  <input
                    type="text"
                    value={k}
                    placeholder={`Highlight ${idx + 1}`}
                    onChange={(e) =>
                      setKeyHighlights((prev) =>
                        prev.map((item, i) =>
                          i === idx ? e.target.value : item
                        )
                      )
                    }
                    className={`flex-1 ${inputClass}`}
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setKeyHighlights((prev) =>
                        prev.filter((_, i) => i !== idx)
                      )
                    }
                    className="text-sm text-red-500 hover:text-red-600 font-medium px-2"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => setKeyHighlights((prev) => [...prev, ""])}
                className="text-sm text-emerald-600 hover:text-emerald-700 font-semibold self-start"
              >
                + Add moment
              </button>
            </FormSection>

            {/* ── PUBLISHING ────────────────────── */}
            <FormSection
              title="Publishing"
              description="Status controls visibility. Featured highlights show on the home page."
            >
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className={inputClass}
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>

              <label className="flex items-center gap-2 text-sm text-gray-600">
                <input
                  type="checkbox"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="w-4 h-4 accent-emerald-500"
                />
                Feature on home page
              </label>
            </FormSection>

            {/* SUBMIT */}
            <button
              type="submit"
              disabled={isShortDescriptionInvalid() || submitting}
              className={`mt-2 font-semibold rounded-lg py-3 text-white shadow-sm transition-all flex items-center justify-center gap-2 ${
                isShortDescriptionInvalid() || submitting
                  ? "bg-emerald-300 cursor-not-allowed"
                  : "bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600"
              }`}
            >
              {submitting && <Spinner className="w-4 h-4" />}
              {submitting ? "Creating…" : "Create Highlight"}
            </button>
          </form>
        </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
