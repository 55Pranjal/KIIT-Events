import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import Navbar from "./Navbar";
import Footer from "./Footer";
import Doodles from "./Doodles";
import Spinner from "./Spinner";

const EditSociety = () => {
  const navigate = useNavigate();
  const [society, setSociety] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchSociety = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/societies/me`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setSociety(res.data);
      } catch (err) {
        console.error("Error fetching society:", err);
        setError("Failed to fetch society info");
      } finally {
        setLoading(false);
      }
    };
    fetchSociety();
  }, []);

  const handleChange = (e) => {
    setSociety({ ...society, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/societies/me`,
        {
          name: society.name,
          description: society.description,
          email: society.email,
          phone: society.phone,
          president: society.president,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Society info updated successfully!");
      setTimeout(() => navigate("/dashboard"), 1200);
    } catch (err) {
      console.error("Error updating society:", err);
      toast.error("Failed to update society info.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading)
    return (
      <>
        <Navbar />
        <p className="text-center mt-10 text-gray-500">Loading...</p>
      </>
    );
  if (error)
    return (
      <>
        <Navbar />
        <p className="text-red-500 text-center mt-10">{error}</p>
      </>
    );

  const inputClass =
    "w-full px-4 py-3 rounded-lg bg-white border border-[#e5e5e5] text-[#111] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all";

  return (
    <>
      <Navbar />

      <div className="relative overflow-hidden flex flex-col">
        <Doodles variant="hero" />
        <div className="relative z-10 flex justify-center px-4 py-12">
          <div className="w-full max-w-lg bg-white border border-[#e5e5e5] rounded-2xl p-5 sm:p-8 shadow-sm">
          <h1 className="font-display text-3xl font-bold text-center mb-2 text-[#111] tracking-tightish">
            Edit{" "}
            <span className="bg-gradient-to-r from-emerald-600 via-emerald-500 to-emerald-400 bg-clip-text text-transparent">
              Society Info
            </span>
          </h1>
          <p className="text-center text-sm text-gray-500 mb-6">
            Manage your society's public profile.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                Society Name
              </label>
              <input
                type="text"
                name="name"
                value={society.name || ""}
                onChange={handleChange}
                placeholder="Enter society name"
                required
                className={inputClass}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                Description
              </label>
              <textarea
                name="description"
                value={society.description || ""}
                onChange={handleChange}
                placeholder="Enter description"
                rows={4}
                className={`${inputClass} resize-none`}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contact Email
              </label>
              <input
                type="email"
                name="email"
                value={society.email || ""}
                onChange={handleChange}
                placeholder="Enter contact email"
                required
                className={inputClass}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={society.phone || ""}
                onChange={handleChange}
                placeholder="Enter phone number"
                className={inputClass}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                Request Status
              </label>
              <input
                type="text"
                name="requestStatus"
                value={society.requestStatus || ""}
                readOnly
                className="w-full px-4 py-3 rounded-lg bg-[#f7faf8] border border-[#eeeeea] text-gray-500 cursor-not-allowed"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full mt-3 py-3 rounded-lg font-semibold text-white bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 disabled:bg-emerald-300 disabled:cursor-not-allowed shadow-sm transition-all flex items-center justify-center gap-2"
            >
              {submitting && <Spinner className="w-4 h-4" />}
              {submitting ? "Updating…" : "Update Society Info"}
            </button>
          </form>
        </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default EditSociety;
