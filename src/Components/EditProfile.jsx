import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Navbar from "./Navbar";
import Footer from "./Footer";
import Doodles from "./Doodles";
import Spinner from "./Spinner";
import { useNavigate } from "react-router";

const EditProfile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({ name: "" });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/users/me`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setUser({ name: res.data.name || "" });
      } catch (err) {
        console.error("[EditProfile] Error fetching user data:", err);
        toast.error("Failed to fetch user data.");
      }
    };
    fetchUser();
  }, []);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    setSubmitting(true);
    try {
      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/update`,
        { name: user.name },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Profile updated successfully!");
      setTimeout(() => navigate("/dashboard"), 1200);
    } catch (err) {
      console.error("[EditProfile] Error updating profile:", err);
      toast.error("Failed to update profile.");
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass =
    "w-full px-4 py-3 rounded-lg bg-white border border-[#e5e5e5] text-[#111] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all";

  return (
    <>
      <Navbar />

      <div className="relative overflow-hidden flex flex-col">
        <Doodles variant="hero" />
        <div className="relative z-10 flex justify-center px-4 py-12 min-h-[80vh]">
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-lg bg-white border border-[#e5e5e5] rounded-2xl p-8 shadow-sm"
          >
          <h2 className="font-display text-3xl font-bold text-center mb-2 text-[#111] tracking-tightish">
            Edit{" "}
            <span className="bg-gradient-to-r from-emerald-600 via-emerald-500 to-emerald-400 bg-clip-text text-transparent">
              Profile
            </span>
          </h2>
          <p className="text-center text-sm text-gray-500 mb-6">
            Update your display name.
          </p>

          <div className="flex flex-col gap-5">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={user.name}
                onChange={handleChange}
                placeholder="Enter your name"
                className={inputClass}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full mt-6 py-3 rounded-lg font-semibold text-white bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 disabled:bg-emerald-300 disabled:cursor-not-allowed shadow-sm transition-all flex items-center justify-center gap-2"
          >
            {submitting && <Spinner className="w-4 h-4" />}
            {submitting ? "Saving…" : "Save Changes"}
          </button>
        </form>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default EditProfile;
