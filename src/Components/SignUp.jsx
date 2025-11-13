import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import { useState } from "react";
import axios from "axios";
import Footer from "./Footer";

const SignUpScreen = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("[SignUpScreen] Attempting to create account for:", email);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/add`,
        { name, email, password, phone }
      );

      console.log("[SignUpScreen] Signup successful. Status:", res.status);
      setMessage(res.data.message);

      if (res.status === 201) {
        console.log("[SignUpScreen] User token and role stored locally.");
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("role", res.data.role);
        localStorage.setItem(
          "societyRequestStatus",
          res.data.societyRequestStatus
        );

        window.dispatchEvent(new Event("authChange"));
        navigate("/");
      }

      // Clear form fields
      setName("");
      setEmail("");
      setPassword("");
      setPhone("");
    } catch (err) {
      console.error("[SignUpScreen] Error creating account:", err);
      setMessage(err.response?.data?.error || "Error saving user");
    }
  };

  const inputClass =
    "w-full rounded-lg px-4 py-3 bg-black/60 border border-green-500/20 placeholder-gray-400 text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all";

  return (
    <>
      <Navbar />

      {/* Mobile form */}
      <div className="lg:hidden flex justify-center px-4 sm:px-6 md:px-8 py-10 min-h-[calc(100vh-64px)]">
        <div className="w-full max-w-md bg-gradient-to-br from-black/90 via-[#001a00]/90 to-[#003300]/90 p-6 rounded-2xl shadow-[0_0_30px_-10px_rgba(0,255,100,0.3)] border border-green-500/20 backdrop-blur-xl text-white">
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <h1 className="text-2xl sm:text-3xl font-semibold text-center mb-6 bg-gradient-to-r from-green-400 to-emerald-600 bg-clip-text text-transparent">
              Create Your Account
            </h1>

            <input
              type="text"
              placeholder="Full Name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={inputClass}
            />
            <input
              type="email"
              placeholder="Email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClass}
            />
            <div className="relative w-full">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={inputClass}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-2/4 -translate-y-2/4 text-gray-400"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                <img
                  src={showPassword ? "/eye.svg" : "/eye-off.svg"}
                  alt=""
                  className="h-5 w-5 invert"
                  aria-hidden="true"
                />
              </button>
            </div>
            <input
              type="text"
              placeholder="Phone Number"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className={inputClass}
            />

            <button
              type="submit"
              className="w-full mt-4 py-3 rounded-lg font-semibold text-white bg-gradient-to-r from-green-700 to-emerald-600 hover:from-green-600 hover:to-emerald-500 transition-all shadow-[0_0_20px_rgba(0,255,100,0.3)] hover:shadow-[0_0_30px_rgba(0,255,100,0.5)]"
            >
              Create Account
            </button>

            {message && (
              <p
                className={`mt-2 text-center font-medium ${
                  message.includes("Error") ? "text-red-400" : "text-green-400"
                }`}
              >
                {message}
              </p>
            )}
          </form>

          <p className="text-sm text-center text-green-200/70 mt-6">
            Already have an account?{" "}
            <a
              href="/login"
              className="text-green-400 hover:text-green-300 font-semibold underline"
            >
              Log in here
            </a>
          </p>
        </div>
      </div>

      {/* Desktop form */}
      <div className="hidden lg:flex justify-center items-center min-h-screen px-4">
        <div className="w-full max-w-lg bg-gradient-to-br from-black/90 via-[#001a00]/90 to-[#003300]/90 p-8 rounded-2xl shadow-[0_0_30px_-10px_rgba(0,255,100,0.3)] border border-green-500/20 backdrop-blur-xl">
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-5 text-white"
          >
            <h1 className="text-3xl font-semibold text-center mb-4 bg-gradient-to-r from-green-400 to-emerald-600 bg-clip-text text-transparent">
              Create Your Account
            </h1>

            <input
              type="text"
              placeholder="Full Name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={inputClass}
            />
            <input
              type="email"
              placeholder="Email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClass}
            />
            <div className="relative w-full">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={inputClass}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-2/4 -translate-y-2/4 text-gray-400"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                <img
                  src={showPassword ? "/eye.svg" : "/eye-off.svg"}
                  alt=""
                  className="h-5 w-5 invert"
                  aria-hidden="true"
                />
              </button>
            </div>
            <input
              type="text"
              placeholder="Phone Number"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className={inputClass}
            />

            <button
              type="submit"
              className="w-full mt-4 py-3 rounded-lg font-semibold text-white bg-gradient-to-r from-green-700 to-emerald-600 hover:from-green-600 hover:to-emerald-500 transition-all shadow-[0_0_20px_rgba(0,255,100,0.3)] hover:shadow-[0_0_30px_rgba(0,255,100,0.5)]"
            >
              Create Account
            </button>

            {message && (
              <p
                className={`mt-2 text-center font-medium ${
                  message.includes("Error") ? "text-red-400" : "text-green-400"
                }`}
              >
                {message}
              </p>
            )}
          </form>
          <p className="text-sm text-center text-green-200/70 mt-6">
            Already have an account?{" "}
            <a
              href="/login"
              className="text-green-400 hover:text-green-300 font-semibold underline"
            >
              Log in here
            </a>
          </p>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default SignUpScreen;
