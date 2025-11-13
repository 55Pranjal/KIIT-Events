import { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { useNavigate } from "react-router";

const EditProfile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({ name: "", phone: "" });
  const [message, setMessage] = useState("");

  // Fetch current user data
  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (import.meta.env.MODE === "development")
          console.log("[EditProfile] Fetching current user data...");

        const token = localStorage.getItem("token");
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/users/me`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setUser(res.data);

        if (import.meta.env.MODE === "development")
          console.log(
            "[EditProfile] User data fetched successfully:",
            res.data
          );
      } catch (err) {
        console.error("[EditProfile] Error fetching user data:", err);
        setMessage("Failed to fetch user data");
      }
    };
    fetchUser();
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });

    if (import.meta.env.MODE === "development")
      console.log(
        `[EditProfile] Field changed: ${e.target.name} = ${e.target.value}`
      );
  };

  // Handle profile update
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      if (import.meta.env.MODE === "development")
        console.log("[EditProfile] Updating user profile with data:", user);

      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/update`,
        user,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessage("Profile updated successfully!");

      if (import.meta.env.MODE === "development")
        console.log("[EditProfile] Profile updated successfully");

      setTimeout(() => navigate("/dashboard"), 1500);
    } catch (err) {
      console.error("[EditProfile] Error updating profile:", err);
      setMessage("Failed to update profile");
    }
  };

  return (
    <>
      <Navbar />

      <div className="flex justify-center items-center min-h-[80vh] px-4 mt-8 mb-10">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-lg bg-gradient-to-br from-black via-[#001a00] to-[#003300] backdrop-blur-xl border border-green-500/20 text-white rounded-2xl p-8 shadow-[0_0_30px_-10px_rgba(0,255,100,0.3)]"
        >
          <h2 className="text-3xl font-semibold text-center mb-6 bg-gradient-to-r from-green-400 to-emerald-600 bg-clip-text text-transparent">
            Edit Profile
          </h2>

          <div className="flex flex-col gap-5">
            <div className="space-y-2">
              <label className="text-sm text-gray-300">Full Name</label>
              <input
                type="text"
                name="name"
                value={user.name}
                onChange={handleChange}
                placeholder="Enter your name"
                className="w-full px-4 py-3 rounded-lg bg-black/60 border border-green-500/20 placeholder-gray-400 text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm text-gray-300">Phone Number</label>
              <input
                type="text"
                name="phone"
                value={user.phone}
                onChange={handleChange}
                placeholder="Enter phone number"
                className="w-full px-4 py-3 rounded-lg bg-black/60 border border-green-500/20 placeholder-gray-400 text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full mt-6 py-3 rounded-lg font-semibold text-white bg-gradient-to-r from-green-700 to-emerald-600 hover:from-green-600 hover:to-emerald-500 transition-all shadow-[0_0_20px_rgba(0,255,100,0.3)] hover:shadow-[0_0_30px_rgba(0,255,100,0.5)]"
          >
            Save Changes
          </button>

          {message && (
            <p
              className={`mt-5 text-center font-medium ${
                message.includes("Failed") ? "text-red-400" : "text-green-400"
              }`}
            >
              {message}
            </p>
          )}
        </form>
      </div>

      <Footer />
    </>
  );
};

export default EditProfile;
