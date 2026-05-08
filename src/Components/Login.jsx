"use client";
import Navbar from "./Navbar";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import Footer from "./Footer";
import Doodles from "./Doodles";
import Spinner from "./Spinner";

const Feature = ({ children }) => (
  <li className="flex items-start gap-3 text-gray-700">
    <span className="flex-shrink-0 mt-0.5 w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center text-white text-xs font-bold">
      ✓
    </span>
    <span className="text-sm sm:text-base leading-snug">{children}</span>
  </li>
);

const Login = () => {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleRegularLogin = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    setSubmitting(true);
    try {
      console.info("[LOGIN] Attempting user login...");

      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/login`,
        { email, password }
      );

      if (res.status === 200) {
        console.info("[LOGIN SUCCESS] User logged in successfully.");

        localStorage.setItem("token", res.data.token);
        localStorage.setItem("role", res.data.role);
        localStorage.setItem(
          "societyRequestStatus",
          res.data.societyRequestStatus
        );

        toast.success(`Welcome back, ${res.data.name || ""}!`.trim() + " 👋");
        window.dispatchEvent(new Event("authChange"));
        navigate("/");
      }
    } catch (err) {
      console.error(
        "[LOGIN ERROR]",
        err.response?.status || "",
        err.response?.data?.message || err.message
      );
      toast.error("Login failed. Please check your credentials.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />

      <div className="grid lg:grid-cols-2 min-h-[calc(100vh-65px)]">
        {/* HERO PANEL — left side, hidden on mobile */}
        <div className="hidden lg:flex relative overflow-hidden bg-gradient-to-br from-emerald-50 via-[#fffffb] to-emerald-50 border-r border-[#e5e5e0]">
          <Doodles variant="hero" />

          <div className="relative z-10 m-auto max-w-md px-12 py-20">
            <p className="font-display text-emerald-700 font-bold tracking-[0.2em] text-xs uppercase mb-6">
              KIIT Events
            </p>

            <h2 className="font-display text-4xl xl:text-5xl font-bold text-[#111] tracking-tightish leading-[1.1] mb-6">
              Welcome back to your{" "}
              <span className="bg-gradient-to-r from-emerald-600 via-emerald-500 to-emerald-400 bg-clip-text text-transparent">
                campus
              </span>
              .
            </h2>

            <p className="text-gray-600 text-base xl:text-lg leading-relaxed mb-10">
              Sign in to register for events, manage your society, and stay in
              the loop with everything happening around campus.
            </p>

            <ul className="space-y-3.5">
              <Feature>Browse events from every society on campus</Feature>
              <Feature>One-tap event registration</Feature>
              <Feature>Stay updated with society announcements</Feature>
            </ul>
          </div>
        </div>

        {/* FORM PANEL — right side */}
        <div className="flex items-center justify-center px-4 py-12 sm:py-16 bg-[#fffffb]">
          <div className="w-full max-w-md">
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#111] tracking-tightish mb-2">
              Welcome{" "}
              <span className="bg-gradient-to-r from-emerald-600 via-emerald-500 to-emerald-400 bg-clip-text text-transparent">
                Back
              </span>
            </h1>
            <p className="text-gray-500 mb-8 text-sm md:text-base">
              Log in to access your dashboard.
            </p>

            <form onSubmit={handleRegularLogin} className="flex flex-col gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="you@kiit.ac.in"
                  required
                  className="w-full rounded-lg px-4 py-3 bg-white text-[#111] placeholder-gray-400 border border-[#e5e5e5] focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Password
                </label>
                <div className="relative w-full">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="••••••••"
                    required
                    className="w-full rounded-lg px-4 py-3 bg-white text-[#111] placeholder-gray-400 border border-[#e5e5e5] focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 hover:text-emerald-600 transition-colors"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    <img
                      src={showPassword ? "/eye.svg" : "/eye-off.svg"}
                      alt=""
                      className="h-5 w-5 opacity-70"
                      aria-hidden="true"
                    />
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full mt-2 py-3 rounded-lg bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 disabled:bg-emerald-300 disabled:cursor-not-allowed text-white font-semibold shadow-sm transition-all flex items-center justify-center gap-2"
              >
                {submitting && <Spinner className="w-4 h-4" />}
                {submitting ? "Logging in…" : "Log in"}
              </button>
            </form>

            <p className="text-sm text-center text-gray-500 mt-6">
              Don't have an account?{" "}
              <a
                href="/signup"
                className="text-emerald-600 hover:text-emerald-700 font-semibold"
              >
                Sign up here
              </a>
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Login;
