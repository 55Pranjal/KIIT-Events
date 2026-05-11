import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { GoogleLogin } from "@react-oauth/google";
import Footer from "./Footer";
import Doodles from "./Doodles";

const Feature = ({ children }) => (
  <li className="flex items-start gap-3 text-gray-700">
    <span className="flex-shrink-0 mt-0.5 w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center text-white text-xs font-bold">
      ✓
    </span>
    <span className="text-sm sm:text-base leading-snug">{children}</span>
  </li>
);

const SignUpScreen = () => {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const handleGoogleSuccess = async (credentialResponse) => {
    setSubmitting(true);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/google`,
        { credential: credentialResponse.credential }
      );

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);
      localStorage.setItem(
        "societyRequestStatus",
        res.data.societyRequestStatus
      );

      toast.success("Welcome to KIIT Events! 🎉");
      window.dispatchEvent(new Event("authChange"));
      navigate("/");
    } catch (err) {
      console.error("[SignUp] Google sign-up error:", err);
      toast.error(
        err.response?.data?.error ||
          "Sign-up failed. Make sure you're using your @kiit.ac.in account."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleError = () => {
    console.error("[SignUp] Google sign-up popup closed or errored.");
    toast.error("Sign-up was cancelled.");
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
              Join your{" "}
              <span className="bg-gradient-to-r from-emerald-600 via-emerald-500 to-emerald-400 bg-clip-text text-transparent">
                campus community
              </span>
              .
            </h2>

            <p className="text-gray-600 text-base xl:text-lg leading-relaxed mb-10">
              Create your account in one tap — we'll verify your KIIT email
              through Google. No passwords to remember.
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
              Sign up with your <span className="font-semibold">@kiit.ac.in</span>{" "}
              Google account.
            </p>

            <div className="flex justify-center">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                text="signup_with"
                shape="rectangular"
                size="large"
                width="280"
              />
            </div>

            {submitting && (
              <p className="text-center text-sm text-gray-500 mt-4">
                Creating your account…
              </p>
            )}

            <div className="mt-8 rounded-lg bg-emerald-50 border border-emerald-100 p-4">
              <p className="text-xs text-emerald-800 leading-relaxed">
                <span className="font-semibold">Heads up:</span> only KIIT
                Google accounts (
                <span className="font-mono">@kiit.ac.in</span>) are accepted.
                If you signed in with a personal Gmail by mistake, switch
                accounts in the Google popup.
              </p>
            </div>

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
