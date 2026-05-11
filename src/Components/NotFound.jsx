import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import Doodles from "./Doodles";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <>
      <Navbar />

      <div className="relative overflow-hidden flex flex-col min-h-[80vh] items-center justify-center px-4 py-16">
        <Doodles variant="hero" />

        <div className="relative z-10 text-center max-w-lg">
          <p className="font-display text-7xl sm:text-8xl md:text-9xl font-extrabold tracking-tightish leading-none mb-4 bg-gradient-to-br from-emerald-600 via-emerald-500 to-emerald-400 bg-clip-text text-transparent">
            404
          </p>

          <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#111] tracking-tightish mb-3">
            Page not found
          </h1>

          <p className="text-gray-500 text-base mb-8 leading-relaxed">
            We couldn't find the page you were looking for. It might have been
            moved, renamed, or never existed in the first place.
          </p>

          <div className="flex flex-wrap justify-center gap-3">
            <button
              onClick={() => navigate("/")}
              className="px-5 py-3 rounded-lg bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 text-white text-sm font-semibold shadow-sm transition"
            >
              ← Back home
            </button>
            <button
              onClick={() => navigate("/EventsPage")}
              className="px-5 py-3 rounded-lg border border-[#e5e5e5] hover:bg-gray-50 hover:border-emerald-200 text-[#333] text-sm font-medium transition"
            >
              Browse events
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
