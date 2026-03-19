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
    <div className="w-screen h-screen flex items-center justify-center bg-[#f5f5f2] px-6">
      <div className="text-center">
        {/* Logo Badge (clean, not glowing) */}
        <div className="w-20 h-20 mx-auto rounded-full bg-emerald-100 flex items-center justify-center shadow-md">
          <p className="text-2xl font-bold text-emerald-600 tracking-wide">
            KIIT
          </p>
        </div>

        {/* Heading */}
        <h2 className="mt-6 text-xl md:text-2xl font-semibold text-[#111]">
          Initializing Server…
        </h2>

        {/* Subtitle */}
        <p className="mt-2 text-gray-500 text-sm leading-relaxed max-w-xs mx-auto">
          Backend is waking up from sleep mode.
          <br />
          This usually takes 20–60 seconds.
        </p>

        {/* Loader */}
        <div className="mt-6 flex justify-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-bounce"></span>
          <span
            className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-bounce"
            style={{ animationDelay: "0.15s" }}
          ></span>
          <span
            className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-bounce"
            style={{ animationDelay: "0.3s" }}
          ></span>
        </div>
      </div>
    </div>
  );
}
