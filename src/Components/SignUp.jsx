import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import { useState } from "react";
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

const SignUpScreen = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("[SignUpScreen] Attempting to create account for:", email);

    setSubmitting(true);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/add`,
        { name, email, password, phone }
      );

      console.log("[SignUpScreen] Signup successful. Status:", res.status);

      if (res.status === 201) {
        console.log("[SignUpScreen] User token and role stored locally.");
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("role", res.data.role);
        localStorage.setItem(
          "societyRequestStatus",
          res.data.societyRequestStatus
        );

        toast.success("Account created — welcome to KIIT Events! 🎉");
        window.dispatchEvent(new Event("authChange"));
        navigate("/");
      } else if (res.data?.message) {
        toast.success(res.data.message);
      }

      setName("");
      setEmail("");
      setPassword("");
      setPhone("");
    } catch (err) {
      console.error("[SignUpScreen] Error creating account:", err);
      toast.error(err.response?.data?.error || "Error creating account.");
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass =
    "w-full rounded-lg px-4 py-3 bg-white text-[#111] placeholder-gray-400 border border-[#e5e5e5] focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all";

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
              Join your{" "}
              <span className="bg-gradient-to-r from-emerald-600 via-emerald-500 to-emerald-400 bg-clip-text text-transparent">
                campus community
              </span>
              .
            </h2>

            <p className="text-gray-600 text-base xl:text-lg leading-relaxed mb-10">
              Create your account to register for events, follow societies you
              love, and never miss what's happening around you.
            </p>

            <ul className="space-y-3.5">
              <Feature>Free for every KIIT student</Feature>
              <Feature>Get notified about events you care about</Feature>
              <Feature>Apply to manage your own society</Feature>
            </ul>
          </div>
        </div>

        {/* FORM PANEL — right side */}
        <div className="flex items-center justify-center px-4 py-12 sm:py-16 bg-[#fffffb]">
          <div className="w-full max-w-md">
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#111] tracking-tightish mb-2">
              Create your{" "}
              <span className="bg-gradient-to-r from-emerald-600 via-emerald-500 to-emerald-400 bg-clip-text text-transparent">
                account
              </span>
            </h1>
            <p className="text-gray-500 mb-8 text-sm md:text-base">
              Join the campus community in seconds.
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="Your full name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={inputClass}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="you@kiit.ac.in"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={inputClass}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Password
                </label>
                <div className="relative w-full">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={inputClass}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-2/4 -translate-y-2/4 text-gray-400 hover:text-emerald-600 transition-colors"
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

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Phone Number
                </label>
                <input
                  type="text"
                  placeholder="10-digit phone"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className={inputClass}
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full mt-3 py-3 rounded-lg font-semibold text-white bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 disabled:bg-emerald-300 disabled:cursor-not-allowed shadow-sm transition-all flex items-center justify-center gap-2"
              >
                {submitting && <Spinner className="w-4 h-4" />}
                {submitting ? "Creating…" : "Create Account"}
              </button>
            </form>

            <p className="text-sm text-center text-gray-500 mt-6">
              Already have an account?{" "}
              <a
                href="/login"
                className="text-emerald-600 hover:text-emerald-700 font-semibold"
              >
                Log in here
              </a>
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default SignUpScreen;
