import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

const SocietyRequestForm = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("[SocietyRequestForm] Form submission started.");

    try {
      const token = localStorage.getItem("token");
      console.log("[SocietyRequestForm] Sending society request:", {
        name,
        description,
        email,
        phone,
      });

      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/societies/request`,
        { name, description, email, phone },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("[SocietyRequestForm] Server response:", res.data);
      setMessage(res.data.message);

      setTimeout(() => {
        console.log("[SocietyRequestForm] Navigating to dashboard...");
        navigate("/dashboard");
      }, 1500);
    } catch (err) {
      console.error("[SocietyRequestForm] Error submitting request:", err);
      setMessage("Failed to send request");
    }
  };

  return (
    <>
      <Navbar />

      <div className="flex justify-center px-4 mt-16 mb-10">
        <div className="w-full max-w-lg bg-gradient-to-br from-black via-[#001a00] to-[#003300] backdrop-blur-xl border border-green-500/20 text-white rounded-2xl p-8 shadow-[0_0_30px_-10px_rgba(0,255,100,0.3)]">
          <h1 className="text-3xl font-semibold text-center mb-6 bg-gradient-to-r from-green-400 to-emerald-600 bg-clip-text text-transparent">
            Society Registration
          </h1>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="space-y-2">
              <label className="text-sm text-gray-300">Society Name</label>
              <input
                type="text"
                placeholder="Enter society name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg bg-black/60 border border-green-500/20 placeholder-gray-400 text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm text-gray-300">Description</label>
              <textarea
                placeholder="Describe your society..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 rounded-lg bg-black/60 border border-green-500/20 placeholder-gray-400 text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all resize-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm text-gray-300">Contact Email</label>
              <input
                type="email"
                placeholder="Enter contact email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg bg-black/60 border border-green-500/20 placeholder-gray-400 text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm text-gray-300">Phone Number</label>
              <input
                type="text"
                placeholder="Enter phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-black/60 border border-green-500/20 placeholder-gray-400 text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              />
            </div>

            <button
              type="submit"
              className="w-full mt-4 py-3 rounded-lg font-semibold text-white bg-gradient-to-r from-green-700 to-emerald-600 hover:from-green-600 hover:to-emerald-500 transition-all shadow-[0_0_20px_rgba(0,255,100,0.3)] hover:shadow-[0_0_30px_rgba(0,255,100,0.5)]"
            >
              Submit Request
            </button>
          </form>

          {message && (
            <p
              className={`mt-5 text-center font-medium ${
                message.includes("Failed") ? "text-red-400" : "text-green-400"
              }`}
            >
              {message}
            </p>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
};

export default SocietyRequestForm;
