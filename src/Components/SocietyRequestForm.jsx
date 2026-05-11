import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import Doodles from "./Doodles";
import Spinner from "./Spinner";

const SocietyRequestForm = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const token = localStorage.getItem("token");

      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/societies/request`,
        { name, description, email, phone },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success(res.data.message || "Request submitted!");
      setTimeout(() => navigate("/dashboard"), 1200);
    } catch (err) {
      console.error("[SocietyRequestForm] Error submitting request:", err);
      toast.error("Failed to send request.");
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
        <div className="relative z-10 flex justify-center px-4 py-12">
          <div className="w-full max-w-lg bg-white border border-[#e5e5e5] rounded-2xl p-5 sm:p-8 shadow-sm">
          <h1 className="font-display text-3xl font-bold text-center mb-2 text-[#111] tracking-tightish">
            Society{" "}
            <span className="bg-gradient-to-r from-emerald-600 via-emerald-500 to-emerald-400 bg-clip-text text-transparent">
              Registration
            </span>
          </h1>
          <p className="text-center text-sm text-gray-500 mb-6">
            Tell us about your society — admins will review your request.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                Society Name
              </label>
              <input
                type="text"
                placeholder="Enter society name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className={inputClass}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                Description
              </label>
              <textarea
                placeholder="Describe your society..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
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
                placeholder="Enter contact email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className={inputClass}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                Phone Number
              </label>
              <input
                type="text"
                placeholder="Enter phone number"
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
              {submitting ? "Submitting…" : "Submit Request"}
            </button>
          </form>
        </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default SocietyRequestForm;
