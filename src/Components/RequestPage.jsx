import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Navbar from "./Navbar";
import Footer from "./Footer";
import Doodles from "./Doodles";

const RequestsPage = () => {
  const [requests, setRequests] = useState([]);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/admin/society-requests`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setRequests(res.data);
      } catch (err) {
        console.error("[RequestsPage] Failed to fetch requests:", err);
        setError("Failed to fetch requests");
      }
    };

    fetchRequests();
  }, []);

  const handleDecision = async (id, decision) => {
    try {
      await axios.post(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/admin/society-requests/${id}/decision`,
        { decision },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setRequests((prev) => prev.filter((req) => req._id !== id));
      toast.success(
        decision === "approved"
          ? "Request approved."
          : "Request rejected."
      );
    } catch (err) {
      console.error(`[RequestsPage] Failed to update request ${id}:`, err);
      toast.error("Failed to update request.");
      setError("Failed to update request");
    }
  };

  if (error)
    return (
      <>
        <Navbar />
        <p className="text-red-500 text-center mt-10 px-4">{error}</p>
      </>
    );

  return (
    <>
      <Navbar />

      <div className="relative overflow-hidden flex flex-col">
        <Doodles variant="hero" />
        <div className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 py-10 min-h-[80vh]">
        <div className="mb-8">
          <h1 className="font-display text-2xl md:text-3xl font-bold text-[#111] tracking-tightish">
            Pending Society{" "}
            <span className="bg-gradient-to-r from-emerald-600 via-emerald-500 to-emerald-400 bg-clip-text text-transparent">
              Requests
            </span>
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Approve or reject incoming society applications.
          </p>
        </div>

        {requests.length === 0 ? (
          <div className="bg-white border border-dashed border-[#e5e5e5] rounded-xl p-10 text-center">
            <p className="text-gray-500">No pending requests.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {requests.map((req) => (
              <div
                key={req._id}
                className="bg-white border border-[#e5e5e5] rounded-xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col"
              >
                <div className="flex items-start justify-between gap-2 mb-3">
                  <h3 className="text-lg font-semibold text-[#111] line-clamp-2">
                    {req.name}
                  </h3>
                  <span className="px-2 py-1 rounded-md text-xs font-medium bg-yellow-100 text-yellow-700 flex-shrink-0">
                    pending
                  </span>
                </div>

                <p className="text-sm text-gray-600 mb-3 line-clamp-3">
                  {req.description}
                </p>

                <div className="text-sm text-gray-600 space-y-1 pt-3 border-t border-[#eee]">
                  <div>
                    <span className="text-gray-400 font-medium">Email:</span>{" "}
                    {req.email}
                  </div>
                  <div>
                    <span className="text-gray-400 font-medium">Phone:</span>{" "}
                    {req.phone}
                  </div>
                  <div>
                    <span className="text-gray-400 font-medium">President:</span>{" "}
                    {req.president.name} ({req.president.email})
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-[#eee] flex flex-wrap gap-2">
                  <button
                    className="flex-1 text-sm bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 text-white font-medium rounded-lg px-3 py-2 shadow-sm transition-all"
                    onClick={() => handleDecision(req._id, "approved")}
                  >
                    Approve
                  </button>
                  <button
                    className="flex-1 text-sm border border-red-300 text-red-600 hover:bg-red-50 hover:border-red-400 font-medium rounded-lg px-3 py-2 transition-all"
                    onClick={() => handleDecision(req._id, "rejected")}
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
        </div>
      </div>

      <Footer />
    </>
  );
};

export default RequestsPage;
