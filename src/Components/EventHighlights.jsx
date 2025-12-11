import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

export default function EventHighlights() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [highlight, setHighlight] = useState(null);
  const [loading, setLoading] = useState(true);
  const [index, setIndex] = useState(0);
  const [eventTitle, setEventTitle] = useState("");
  const BACKEND = import.meta.env.VITE_BACKEND_URL?.replace(/\/$/, "") || "";

  // --- USER ROLE ---
  const getUserRole = () => {
    try {
      const rawUser = localStorage.getItem("user");
      if (rawUser) {
        const parsed = JSON.parse(rawUser);
        if (parsed?.role) return parsed.role.toLowerCase();
      }

      const token = localStorage.getItem("token");
      if (token) {
        const parts = token.split(".");
        if (parts.length >= 2) {
          const payload = JSON.parse(
            atob(parts[1].replace(/-/g, "+").replace(/_/g, "/"))
          );
          return (
            payload?.role?.toLowerCase() ||
            payload?.user?.role?.toLowerCase() ||
            null
          );
        }
      }
    } catch {}
    return null;
  };

  const isAdmin = getUserRole() === "admin";

  // --- LOAD HIGHLIGHTS ---
  useEffect(() => {
    let mounted = true;

    async function load() {
      setLoading(true);
      try {
        const res = await axios.get(
          `${BACKEND}/api/events/${eventId}/highlights`
        );
        if (!mounted) return;

        const list = res.data?.highlights || [];
        setHighlight(list.length > 0 ? list[0] : null);

        try {
          const ev = await axios.get(`${BACKEND}/api/events/${eventId}`);
          if (mounted && ev.data?.title) setEventTitle(ev.data.title);
        } catch {}
      } catch (err) {
        console.error("Failed to load highlight:", err);
        setHighlight(null);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();
    return () => (mounted = false);
  }, [eventId, BACKEND]);

  // reset index when highlight changes
  useEffect(() => setIndex(0), [highlight]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        Loading highlight…
      </div>
    );
  }

  if (!highlight) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col">
        <Navbar />
        <div className="flex justify-center items-center flex-grow px-4 py-12">
          <div className="w-full max-w-xl bg-black/40 border border-green-800/30 rounded-2xl p-8 text-center">
            <h2 className="text-3xl font-bold mb-3">No Highlights Yet</h2>
            <p className="text-green-200/70 mb-6">
              This event does not have any highlights yet.
            </p>

            <div className="flex justify-center gap-3">
              <button
                onClick={() => navigate(-1)}
                className="px-4 py-2 bg-black/40 border border-green-800 rounded-md text-green-200"
              >
                Back
              </button>

              {isAdmin && (
                <button
                  onClick={() => navigate(`/CreateHighlights`)}
                  className="px-4 py-2 bg-gradient-to-r from-green-700 to-emerald-600 rounded-md"
                >
                  Add Highlight
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const images = highlight.gallery || [];
  const prev = () => setIndex((i) => (i - 1 + images.length) % images.length);
  const next = () => setIndex((i) => (i + 1) % images.length);

  // -------------- FULLSCREEN UI BELOW --------------
  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <Navbar />

      {/* HERO FULLSCREEN BANNER */}
      <div className="relative w-full h-[60vh] sm:h-[70vh] overflow-hidden">
        {images.length > 0 ? (
          <img
            src={images[index].url}
            className="absolute inset-0 w-full h-full object-cover brightness-[0.45]"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-black via-[#001a0f] to-[#003319]" />
        )}

        {/* HERO TEXT */}
        <div className="absolute bottom-10 left-10 max-w-4xl">
          <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-green-300 to-emerald-300 bg-clip-text text-transparent drop-shadow-lg">
            {highlight.title}
          </h1>

          {eventTitle && (
            <p className="text-green-200/70 mt-2 text-lg">{eventTitle}</p>
          )}

          <p className="text-green-100/70 mt-3 max-w-2xl text-sm sm:text-base">
            {highlight.shortDescription}
          </p>

          <div className="mt-5 flex gap-3">
            <button
              onClick={() => navigate(-1)}
              className="px-5 py-2 bg-black/40 border border-green-800 text-green-200 rounded-md"
            >
              Back
            </button>
          </div>
        </div>

        {/* CAROUSEL ARROWS */}
        {images.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-5 top-1/2 -translate-y-1/2 bg-black/40 p-3 rounded-full border border-green-800 hover:bg-black/60"
            >
              ‹
            </button>
            <button
              onClick={next}
              className="absolute right-5 top-1/2 -translate-y-1/2 bg-black/40 p-3 rounded-full border border-green-800 hover:bg-black/60"
            >
              ›
            </button>
          </>
        )}
      </div>

      {/* THUMBNAIL STRIP */}
      {images.length > 0 && (
        <div className="w-full bg-[#071008] py-3 px-4 overflow-x-auto flex gap-3 border-b border-green-800/20">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`rounded-md overflow-hidden border ${
                index === i ? "border-emerald-400" : "border-green-800/40"
              }`}
            >
              <img
                src={img.url}
                className="h-16 w-24 sm:h-20 sm:w-32 object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* MAIN CONTENT */}
      <div className="flex flex-col gap-16 py-16 px-6 sm:px-12 lg:px-24 bg-gradient-to-b from-black via-[#00170d] to-[#001f11]">
        {/* FEATURED + DATE */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold">{highlight.title}</h2>
            <p className="text-green-300/70 mt-1">
              {highlight.shortDescription}
            </p>
          </div>

          <div className="text-right">
            {highlight.featured && (
              <span className="px-3 py-1 bg-emerald-600/20 text-emerald-300 rounded-md text-sm">
                Featured
              </span>
            )}
            <p className="text-xs text-green-300 mt-1">
              {new Date(highlight.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* LONG DESCRIPTION */}
        {highlight.longDescription && (
          <section>
            <h3 className="text-2xl font-semibold mb-3">What Happened</h3>
            <p className="text-green-200/80 leading-relaxed text-lg max-w-4xl">
              {highlight.longDescription}
            </p>
          </section>
        )}

        {/* KEY MOMENTS */}
        {highlight.keyHighlights?.length > 0 && (
          <section>
            <h3 className="text-2xl font-semibold mb-3">Key Moments</h3>
            <ul className="list-disc pl-5 text-green-200/90 space-y-2 text-lg">
              {highlight.keyHighlights.map((k, i) => (
                <li key={i}>{k}</li>
              ))}
            </ul>
          </section>
        )}

        {/* GUESTS */}
        {highlight.guests?.length > 0 && (
          <section>
            <h3 className="text-2xl font-semibold mb-5">Guests</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {highlight.guests.map((g, i) => (
                <div
                  key={i}
                  className="bg-[#0c1711] p-5 rounded-xl border border-green-800/30 hover:border-green-500/40 transition shadow-md"
                >
                  {g.photo?.url ? (
                    <img
                      src={g.photo.url}
                      className="h-32 w-32 object-cover rounded-full mx-auto"
                    />
                  ) : (
                    <div className="h-32 w-32 bg-black/40 rounded-full mx-auto flex items-center justify-center text-green-300">
                      No Photo
                    </div>
                  )}

                  <h4 className="text-xl font-semibold mt-4 text-center">
                    {g.name}
                  </h4>
                  <p className="text-green-200/80 text-center">{g.title}</p>

                  {g.bio && (
                    <p className="text-green-200/70 mt-2 text-sm leading-relaxed text-center">
                      {g.bio}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* FOOTER */}
      <footer className="w-full bg-[#00150d] border-t border-green-800/30 text-green-300 py-4 text-center text-sm">
        © {new Date().getFullYear()} KIIT Events. Built by Pranjal Agarwal.
      </footer>
    </div>
  );
}
