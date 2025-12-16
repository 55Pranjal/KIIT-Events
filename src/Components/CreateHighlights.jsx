import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import UploadPoster from "./UploadPoster";

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
  const [message, setMessage] = useState("");

  const BACKEND = import.meta.env.VITE_BACKEND_URL?.replace(/\/$/, "") || "";

  const fileRef = useRef();

  const token = localStorage.getItem("token");

  const MAX_SHORT_DESC_CHARS = 400;

  // returns true if short description exceeds limit
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

  // FILE HANDLING FOR GALLERY
  function handleFilesChange(e) {
    const files = Array.from(e.target.files || []);
    const next = [...gallery];

    for (const file of files) {
      if (next.length >= MAX_FILES) break;
      if (!file.type.startsWith("image/")) continue;
      if (file.size > MAX_SIZE) {
        alert(`${file.name} is too large.`);
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

  // GUEST HANDLERS (multiple guests)
  function addGuest() {
    setGuests((prev) => [
      ...prev,
      { name: "", title: "", bio: "", photo: null },
    ]);
  }

  function removeGuest(index) {
    setGuests((prev) => {
      const copy = prev.filter((_, i) => i !== index);
      return copy;
    });
  }

  function updateGuestField(index, key, value) {
    setGuests((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [key]: value };
      return copy;
    });
  }

  // This handler is used if UploadPoster returns a url (it calls onUploaded)
  function handleGuestUploaded(index, url) {
    setGuests((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], photo: { url } };
      return copy;
    });
  }

  // If UploadPoster supports previewing an already-uploaded url, we pass initialPreviewUrl below.

  // If you ever want to support selecting a local file for guest photo and upload via uploadFile:
  function setGuestLocalPhoto(index, file) {
    // file should be a File object
    const preview = URL.createObjectURL(file);
    setGuests((prev) => {
      const copy = [...prev];
      copy[index] = {
        ...copy[index],
        photo: {
          file,
          previewUrl: preview,
          url: null,
          uploading: false,
          progress: 0,
        },
      };
      return copy;
    });
  }

  async function uploadFile(fileObj, onProgress) {
    const form = new FormData();
    form.append("poster", fileObj); // ✅ MUST MATCH backend "poster"

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

    if (!title.trim()) return alert("Title required");
    if (!shortDescription.trim()) return alert("Short description required");
    if (gallery.length === 0) return alert("Upload at least one image");
    if (!eventId) return alert("Select an event");

    try {
      const uploadedGallery = [];

      // Upload gallery files
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

      // Upload guest photos if they have a local file; otherwise use provided URL (from UploadPoster)
      const uploadedGuests = [];
      for (let i = 0; i < guests.length; i++) {
        const g = guests[i];
        let photoObj = null;

        // If maintainer used setGuestLocalPhoto to set a local file
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
          // photo already uploaded via UploadPoster or prefilled
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
      setMessage("Highlight created successfully!");
      setTimeout(
        () =>
          navigate(`/EventsPage
            `),
        800
      );
    } catch (err) {
      console.error(err);
      setMessage("Failed to create highlight.");
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-[#001a0f] to-[#003319] text-white flex flex-col">
      <Navbar />

      <div className="flex justify-center items-center flex-grow px-4 py-10">
        <div className="bg-black/40 border border-green-900/30 backdrop-blur-md shadow-xl shadow-green-900/40 w-full max-w-3xl rounded-2xl py-8 px-6 sm:px-10">
          <h1 className="text-center font-bold text-3xl mb-6 bg-gradient-to-r from-green-400 to-emerald-300 text-transparent bg-clip-text drop-shadow-md">
            Create Highlight
          </h1>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* EVENT SELECT */}
            <select
              required
              value={eventId}
              onChange={(e) => setEventId(e.target.value)}
              className="rounded-lg p-3 bg-[#0d1b12] border border-green-700/40 text-gray-300"
            >
              {events.map((ev) => (
                <option key={ev._id} value={ev._1d || ev._id}>
                  {ev.title}
                </option>
              ))}
            </select>

            {/* TITLE */}
            <input
              type="text"
              placeholder="Highlight Title"
              value={title}
              required
              onChange={(e) => setTitle(e.target.value)}
              className="rounded-lg p-3 bg-[#0d1b12] border border-green-700/40"
            />

            {/* SHORT DESCRIPTION */}
            <textarea
              rows={2}
              placeholder="Short Description (max 400 characters)"
              value={shortDescription}
              onChange={(e) => setShortDescription(e.target.value)}
              className="rounded-lg p-3 bg-[#0d1b12] border border-green-700/40 resize-none"
            />

            <p
              className={`text-sm text-right mt-1 ${
                isShortDescriptionInvalid() ? "text-red-400" : "text-green-300"
              }`}
            >
              {shortDescription.length} / {MAX_SHORT_DESC_CHARS} characters
            </p>

            {/* LONG DESCRIPTION */}
            <textarea
              rows={6}
              placeholder="Long Description (What happened?)"
              value={longDescription}
              onChange={(e) => setLongDescription(e.target.value)}
              className="rounded-lg p-3 bg-[#0d1b12] border border-green-700/40"
            />

            {/* GALLERY UPLOAD */}
            <div>
              <p className="text-green-300 mb-2">Gallery Images</p>
              <input
                type="file"
                ref={fileRef}
                accept="image/*"
                multiple
                onChange={handleFilesChange}
                className="text-gray-300"
              />

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-4">
                {gallery.map((g, i) => (
                  <div
                    key={i}
                    className="bg-[#0d1b12] border border-green-700/40 rounded-xl p-3"
                  >
                    <img
                      src={g.previewUrl || g.url}
                      className="rounded-md h-28 w-full object-cover"
                    />

                    <input
                      className="mt-2 p-1 rounded bg-black/40 border border-green-700/30 w-full"
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
                      className="mt-2 p-1 rounded bg-black/40 border border-green-700/30 w-full"
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
                      className="mt-2 text-red-400 hover:text-red-300"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* GUESTS SECTION (multiple guests) */}
            <div>
              <div className="flex items-center justify-between">
                <p className="text-green-300 mb-2">Guests</p>
                <button
                  type="button"
                  onClick={addGuest}
                  className="text-green-300 hover:text-green-200"
                >
                  + Add Guest
                </button>
              </div>

              <div className="space-y-4">
                {guests.map((g, idx) => (
                  <div
                    key={idx}
                    className="bg-[#0d1b12] border border-green-700/40 rounded-xl p-4"
                  >
                    <div className="flex justify-between items-start">
                      <h4 className="font-semibold">Guest {idx + 1}</h4>
                      <button
                        type="button"
                        onClick={() => removeGuest(idx)}
                        className="text-red-400 hover:text-red-300"
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
                      className="rounded-lg p-3 bg-[#0d1b12] border border-green-700/40 w-full mb-2 mt-3"
                    />

                    <input
                      type="text"
                      placeholder="Guest Title"
                      value={g.title}
                      onChange={(e) =>
                        updateGuestField(idx, "title", e.target.value)
                      }
                      className="rounded-lg p-3 bg-[#0d1b12] border border-green-700/40 w-full mb-2"
                    />

                    <textarea
                      placeholder="Guest Bio"
                      rows={3}
                      value={g.bio}
                      onChange={(e) =>
                        updateGuestField(idx, "bio", e.target.value)
                      }
                      className="rounded-lg p-3 bg-[#0d1b12] border border-green-700/40 w-full mb-3"
                    />

                    <div className="mt-2">
                      <UploadPoster
                        onUploaded={(url) => handleGuestUploaded(idx, url)}
                        initialPreviewUrl={g.photo?.url || g.photo?.previewUrl}
                      />
                      {g.photo && (g.photo.url || g.photo.previewUrl) && (
                        <div className="mt-3">
                          <img
                            src={g.photo.url || g.photo.previewUrl}
                            alt={g.name || `guest-${idx + 1}`}
                            className="h-20 rounded-md object-cover"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* KEY HIGHLIGHTS */}
            <div>
              <p className="text-green-300 mb-2">Key Highlights</p>
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
                    className="flex-1 rounded-lg p-3 bg-[#0d1b12] border border-green-700/40"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setKeyHighlights((prev) =>
                        prev.filter((_, i) => i !== idx)
                      )
                    }
                    className="text-red-400 hover:text-red-300"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => setKeyHighlights((prev) => [...prev, ""])}
                className="text-green-300 hover:text-green-200"
              >
                + Add Highlight
              </button>
            </div>

            {/* STATUS */}
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="rounded-lg p-3 bg-[#0d1b12] border border-green-700/40 text-gray-300"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>

            {/* FEATURED */}
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
              />
              Feature on Homepage
            </label>

            {/* SUBMIT */}
            <button
              type="submit"
              disabled={isShortDescriptionInvalid()}
              className={`mt-4 font-semibold rounded-lg py-2.5 transition-all duration-300
    ${
      isShortDescriptionInvalid()
        ? "bg-gray-600 cursor-not-allowed"
        : "bg-gradient-to-r from-green-700 to-emerald-600 hover:scale-[1.02]"
    }
  `}
            >
              Create Highlight
            </button>

            {message && (
              <p className="text-center text-green-300 mt-2">{message}</p>
            )}
          </form>
        </div>
      </div>

      <footer className="w-full bg-gradient-to-r from-black via-[#0f2e1f] to-[#003300] border-t border-green-800/30 text-green-300 py-4 text-center text-sm">
        © {new Date().getFullYear()} KIIT Events. Built by Pranjal Agarwal.
      </footer>
    </div>
  );
}
