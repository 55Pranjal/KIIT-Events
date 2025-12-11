import { useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function LoadingPage() {
  const navigate = useNavigate();
  const BACKEND = import.meta.env.VITE_BACKEND_URL?.replace(/\/$/, "") || "";

  useEffect(() => {
    const checkBackend = async () => {
      try {
        await axios.get(`${BACKEND}/api/health`);
        navigate("/");
      } catch (err) {
        setTimeout(checkBackend, 3000);
      }
    };

    checkBackend();
  }, []);

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-gradient-to-br from-black/90 via-[#001a00]/90 to-[#003300]/90 text-white px-6">
      <div className="text-center animate-fadeIn">
        {/* Glowing logo badge */}
        <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-green-700 to-emerald-600 flex items-center justify-center shadow-[0_0_35px_-8px_rgba(0,255,100,0.5)] border border-green-400/20 backdrop-blur-xl">
          <p className="text-3xl font-bold tracking-wide bg-gradient-to-r from-green-300 to-emerald-500 bg-clip-text text-transparent">
            KIIT
          </p>
        </div>

        {/* Heading */}
        <h2 className="mt-6 text-2xl font-semibold bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
          Initializing Server…
        </h2>

        {/* Subtitle */}
        <p className="mt-2 text-green-200/70 text-sm leading-relaxed">
          Backend is waking up from Render sleep mode.
          <br />
          This usually takes 20–60 seconds.
        </p>

        {/* Animated Loader Dots */}
        <div className="mt-6 flex justify-center gap-3">
          <span className="w-3 h-3 rounded-full bg-green-400 animate-bounce"></span>
          <span
            className="w-3 h-3 rounded-full bg-green-400 animate-bounce"
            style={{ animationDelay: "0.15s" }}
          ></span>
          <span
            className="w-3 h-3 rounded-full bg-green-400 animate-bounce"
            style={{ animationDelay: "0.3s" }}
          ></span>
        </div>

        {/* Soft Glow Under Loader */}
        <div className="mt-6 w-32 h-2 mx-auto rounded-full bg-green-500/10 blur-xl"></div>
      </div>
    </div>
  );
}
