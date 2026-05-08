import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import {
  optimizeBanner,
  optimizeThumb,
  optimizeAvatar,
} from "../utils/imageOptimization";
import Doodles from "./Doodles";

export default function EventHighlights() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [highlight, setHighlight] = useState(null);
  const [loading, setLoading] = useState(true);
  const [index, setIndex] = useState(0);
  const [eventTitle, setEventTitle] = useState("");
  const BACKEND = import.meta.env.VITE_BACKEND_URL?.replace(/\/$/, "") || "";

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

  useEffect(() => setIndex(0), [highlight]);

  const images = highlight?.gallery || [];

  // Preload neighboring banner images so left/right arrows + thumbnail clicks
  // resolve from the browser cache instead of a fresh network round-trip.
  useEffect(() => {
    if (images.length < 2) return;
    const targets = [
      images[(index + 1) % images.length],
      images[(index - 1 + images.length) % images.length],
    ];
    targets.forEach((target) => {
      if (target?.url) {
        const img = new Image();
        img.src = optimizeBanner(target.url);
      }
    });
  }, [index, images]);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-[60vh] flex items-center justify-center text-gray-500">
          Loading highlight…
        </div>
      </>
    );
  }

  if (!highlight) {
    return (
      <>
        <Navbar />
        <div className="flex justify-center items-center px-4 py-16 min-h-[60vh]">
          <div className="w-full max-w-xl bg-white border border-[#e5e5e5] rounded-2xl p-10 text-center shadow-sm">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-[#111] mb-2 tracking-tightish">
              No Highlights Yet
            </h2>
            <p className="text-gray-500 mb-6">
              This event does not have any highlights yet.
            </p>

            <div className="flex justify-center gap-3 flex-wrap">
              <button
                onClick={() => navigate(-1)}
                className="px-4 py-2.5 border border-[#e5e5e5] text-[#333] hover:bg-gray-50 rounded-lg text-sm font-medium transition-all"
              >
                Back
              </button>

              {isAdmin && (
                <button
                  onClick={() => navigate(`/CreateHighlights`)}
                  className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-white rounded-lg text-sm font-semibold shadow-sm transition-all"
                >
                  Add Highlight
                </button>
              )}
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const prev = () => setIndex((i) => (i - 1 + images.length) % images.length);
  const next = () => setIndex((i) => (i + 1) % images.length);

  const formattedDate = new Date(highlight.createdAt).toLocaleDateString(
    undefined,
    { year: "numeric", month: "long", day: "numeric" }
  );

  // Split paragraphs in long description on blank lines for nicer reading.
  const paragraphs = (highlight.longDescription || "")
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* HERO — kept as-is per request */}
      <div className="relative w-full h-[55vh] sm:h-[65vh] overflow-hidden bg-[#f7faf8]">
        {images.length > 0 ? (
          <>
            <img
              key={index}
              src={optimizeBanner(images[index].url)}
              alt={highlight.title}
              loading="eager"
              className="absolute inset-0 w-full h-full object-cover animate-fadeIn"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          </>
        ) : (
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(circle, #c2e0ce 1px, transparent 1px)",
              backgroundSize: "30px 30px",
              opacity: 0.4,
            }}
          />
        )}

        <div className="absolute bottom-8 left-6 sm:left-12 max-w-4xl text-white drop-shadow-lg">
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tightish">
            {highlight.title}
          </h1>

          {eventTitle && (
            <p className="text-white/80 mt-2 text-base sm:text-lg">
              {eventTitle}
            </p>
          )}

          <p className="text-white/80 mt-3 max-w-2xl text-sm sm:text-base">
            {highlight.shortDescription}
          </p>

          <div className="mt-5 flex gap-3 flex-wrap">
            <button
              onClick={() => navigate(-1)}
              className="px-4 py-2 bg-white/95 hover:bg-white text-[#111] rounded-lg text-sm font-medium shadow-sm transition-all"
            >
              ← Back
            </button>
          </div>
        </div>

        {images.length > 1 && (
          <>
            <button
              onClick={prev}
              aria-label="Previous image"
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-[#111] w-10 h-10 rounded-full shadow-md flex items-center justify-center text-xl"
            >
              ‹
            </button>
            <button
              onClick={next}
              aria-label="Next image"
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-[#111] w-10 h-10 rounded-full shadow-md flex items-center justify-center text-xl"
            >
              ›
            </button>

            {/* Image counter */}
            <div className="absolute top-4 right-4 bg-black/40 backdrop-blur-sm text-white text-xs font-medium px-2.5 py-1 rounded-full">
              {index + 1} / {images.length}
            </div>
          </>
        )}
      </div>

      {/* THUMBNAILS — kept as-is per request */}
      {images.length > 0 && (
        <div className="w-full bg-white py-3 px-4 overflow-x-auto flex gap-3 border-b border-[#e5e5e5]">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              aria-label={`View image ${i + 1}`}
              className={`rounded-md overflow-hidden border-2 flex-shrink-0 transition-all ${
                index === i
                  ? "border-emerald-500 shadow-sm"
                  : "border-transparent hover:border-emerald-200"
              }`}
            >
              <img
                src={optimizeThumb(img.url)}
                alt=""
                loading="lazy"
                className={`h-16 w-24 sm:h-20 sm:w-32 object-cover transition-opacity ${
                  index === i ? "opacity-100" : "opacity-70 hover:opacity-100"
                }`}
              />
            </button>
          ))}
        </div>
      )}

      {/* ── BODY ─────────────────────────────────────────────── */}
      <div className="relative flex-1 overflow-hidden flex flex-col">
        <Doodles variant="hero" />

        <article className="relative z-10 max-w-3xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        {/* META STRIP */}
        <div className="flex items-center justify-between gap-4 pb-6 border-b border-[#e5e5e5] mb-12 flex-wrap">
          <div className="flex items-center gap-2.5 text-sm flex-wrap">
            {eventTitle && (
              <>
                <span className="font-semibold text-[#111]">{eventTitle}</span>
                <span className="text-gray-300">•</span>
              </>
            )}
            <span className="text-gray-500">{formattedDate}</span>
          </div>

          {highlight.featured && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-md text-xs font-semibold uppercase tracking-wider">
              <svg className="w-3 h-3" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.366 2.446a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118L10 14.347l-3.367 2.446c-.784.57-1.838-.197-1.539-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.65 8.154c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.957z" />
              </svg>
              Featured
            </span>
          )}
        </div>

        {/* WHAT HAPPENED */}
        {paragraphs.length > 0 && (
          <section className="mb-14">
            <SectionHeading>What Happened</SectionHeading>
            <div className="text-gray-700 text-base sm:text-lg leading-[1.75] space-y-5">
              {paragraphs.map((para, i) => (
                <p key={i}>
                  {i === 0 ? (
                    <>
                      <span className="float-left font-display text-5xl sm:text-6xl font-bold text-emerald-500 leading-none mr-2 mt-1">
                        {para.charAt(0)}
                      </span>
                      {para.slice(1)}
                    </>
                  ) : (
                    para
                  )}
                </p>
              ))}
            </div>
          </section>
        )}

        {/* KEY MOMENTS */}
        {highlight.keyHighlights?.length > 0 && (
          <section className="mb-14">
            <SectionHeading>Key Moments</SectionHeading>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {highlight.keyHighlights.map((k, i) => (
                <div
                  key={i}
                  className="relative bg-white border border-[#e5e5e5] rounded-xl p-5 pr-16 hover:border-emerald-200 hover:shadow-md transition-all overflow-hidden"
                >
                  <span
                    className="font-display absolute -top-2 -right-1 text-[5rem] font-extrabold leading-none select-none pointer-events-none"
                    style={{ color: "rgba(16, 185, 129, 0.12)" }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p className="relative text-gray-700 text-base leading-relaxed">
                    {k}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* GUESTS */}
        {highlight.guests?.length > 0 && (
          <section>
            <SectionHeading>Guests</SectionHeading>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {highlight.guests.map((g, i) => (
                <div
                  key={i}
                  className="flex gap-4 bg-white border border-[#e5e5e5] rounded-xl p-5 shadow-sm hover:shadow-md hover:border-emerald-200 transition-all"
                >
                  {g.photo?.url ? (
                    <img
                      src={optimizeAvatar(g.photo.url)}
                      alt={g.name}
                      loading="lazy"
                      className="h-20 w-20 sm:h-24 sm:w-24 object-cover rounded-full border border-[#e5e5e5] flex-shrink-0"
                    />
                  ) : (
                    <div className="h-20 w-20 sm:h-24 sm:w-24 bg-[#f7faf8] border border-[#e5e5e5] rounded-full flex items-center justify-center text-gray-400 text-xs flex-shrink-0">
                      No Photo
                    </div>
                  )}

                  <div className="min-w-0 flex-1">
                    <h4 className="font-display text-lg font-semibold text-[#111] tracking-tightish leading-tight">
                      {g.name}
                    </h4>
                    {g.title && (
                      <p className="text-emerald-600 text-sm font-medium mt-0.5">
                        {g.title}
                      </p>
                    )}
                    {g.bio && (
                      <p className="text-gray-500 text-sm mt-2 leading-relaxed line-clamp-4">
                        {g.bio}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
        </article>
      </div>

      <Footer />
    </div>
  );
}

// Section heading with a thin emerald rule that fills the rest of the row.
function SectionHeading({ children }) {
  return (
    <div className="flex items-center gap-4 mb-6">
      <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#111] tracking-tightish whitespace-nowrap">
        {children}
      </h2>
      <span className="flex-1 h-px bg-gradient-to-r from-emerald-200 via-[#e5e5e5] to-transparent" />
    </div>
  );
}
