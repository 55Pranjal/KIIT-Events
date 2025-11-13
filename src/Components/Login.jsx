"use client";
import Navbar from "./Navbar";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Footer from "./Footer";

const Login = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleRegularLogin = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

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

        window.dispatchEvent(new Event("authChange"));
        navigate("/");
      }
    } catch (err) {
      console.error(
        "[LOGIN ERROR]",
        err.response?.status || "",
        err.response?.data?.message || err.message
      );
      setMessage("Login failed. Please check your credentials.");
    }
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen flex flex-col items-center justify-center px-4">
        <div className="w-full max-w-md bg-black/60 backdrop-blur-md border border-green-800/40 rounded-2xl p-8 shadow-[0_0_20px_rgba(0,255,150,0.15)]">
          <h1 className="text-center font-extrabold text-3xl sm:text-4xl text-green-300 mb-6">
            Welcome Back
          </h1>
          <p className="text-center text-green-100/70 mb-8">
            Log in to access your dashboard
          </p>

          <form onSubmit={handleRegularLogin} className="flex flex-col gap-4">
            <input
              type="email"
              name="email"
              placeholder="Email"
              required
              className="w-full rounded-lg px-4 py-3 bg-black/50 text-green-100 placeholder-green-300/50 border border-green-700/40 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
            />

            <div className="relative w-full">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                required
                className="w-full rounded-lg px-4 py-3 bg-black/50 text-green-100 placeholder-green-300/50 border border-green-700/40 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute top-1/2 right-3 -translate-y-1/2 text-green-400"
              >
                {showPassword ? (
                  <img
                    src="/eye.svg"
                    alt="Hide password"
                    className="h-5 w-5 invert opacity-80"
                  />
                ) : (
                  <img
                    src="/eye-off.svg"
                    alt="Show password"
                    className="h-5 w-5 invert opacity-80"
                  />
                )}
              </button>
            </div>

            <button
              type="submit"
              className="w-full mt-2 py-3 rounded-lg bg-gradient-to-r from-green-700 to-green-500 hover:from-green-600 hover:to-green-400 text-white font-semibold transition-transform transform hover:scale-[1.02]"
            >
              Login
            </button>

            {message && (
              <p className="mt-4 text-red-400 text-center font-medium">
                {message}
              </p>
            )}
          </form>

          <p className="text-sm text-center text-green-200/70 mt-6">
            Don’t have an account?{" "}
            <a
              href="/signup"
              className="text-green-400 hover:text-green-300 font-semibold underline"
            >
              Sign up here
            </a>
          </p>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Login;
