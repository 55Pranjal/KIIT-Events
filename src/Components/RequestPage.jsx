import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "./Navbar";
import Footer from "./Footer";

const RequestsPage = () => {
  const [requests, setRequests] = useState([]);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchRequests = async () => {
      console.log("[RequestsPage] Fetching pending society requests...");
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/admin/society-requests`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log(`[RequestsPage] Requests fetched successfully:`, res.data);
        setRequests(res.data);
      } catch (err) {
        console.error("[RequestsPage] Failed to fetch requests:", err);
        setError("Failed to fetch requests");
      }
    };

    fetchRequests();
  }, []);

  const handleDecision = async (id, decision) => {
    console.log(
      `[RequestsPage] Processing ${decision.toUpperCase()} for request ID: ${id}`
    );
    try {
      await axios.post(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/admin/society-requests/${id}/decision`,
        { decision },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log(`[RequestsPage] Request ${id} successfully ${decision}`);
      setRequests((prev) => prev.filter((req) => req._id !== id));
    } catch (err) {
      console.error(`[RequestsPage] Failed to update request ${id}:`, err);
      setError("Failed to update request");
    }
  };

  if (error)
    return (
      <p className="text-red-500 text-center mt-10 px-4 sm:px-8">{error}</p>
    );

  return (
    <>
      <Navbar />
      <div className="px-4 sm:px-8 py-6 min-h-screen max-w-7xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-10 text-center sm:text-left">
          Pending Society Requests
        </h1>

        {requests.length === 0 ? (
          <p className="text-white text-center sm:text-left">
            No pending requests
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {requests.map((req) => (
              <div
                key={req._id}
                className="bg-emerald-950 p-4 rounded-xl text-white shadow-md hover:shadow-lg transition-shadow flex flex-col"
              >
                <p>
                  <strong>Society Name:</strong> {req.name}
                </p>
                <p className="mt-1">
                  <strong>Description:</strong> {req.description}
                </p>
                <p className="mt-1">
                  <strong>Email:</strong> {req.email}
                </p>
                <p className="mt-1">
                  <strong>Phone:</strong> {req.phone}
                </p>
                <p className="mt-1">
                  <strong>President:</strong> {req.president.name} (
                  {req.president.email})
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    className="bg-green-600 px-4 py-2 rounded w-full sm:w-auto hover:bg-green-700 transition-colors"
                    onClick={() => handleDecision(req._id, "approved")}
                  >
                    Approve
                  </button>
                  <button
                    className="bg-red-600 px-4 py-2 rounded w-full sm:w-auto hover:bg-red-700 transition-colors"
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
      <Footer />
    </>
  );
};

export default RequestsPage;
