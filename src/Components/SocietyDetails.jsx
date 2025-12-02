import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { useNavigate } from "react-router-dom";

const SocietyDetails = () => {
  const navigate = useNavigate();
  const [societies, setSocieties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // delete related state
  const [deleteMode, setDeleteMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState(() => new Set());
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const BACKEND = import.meta.env.VITE_BACKEND_URL?.replace(/\/$/, "") || "";

  useEffect(() => {
    fetchSocieties();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchSocieties = async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      // NOTE: backend admin route used earlier: /api/admin/societies
      const res = await axios.get(`${BACKEND}/api/adminSociety/societies`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const all = Array.isArray(res.data) ? res.data : [];
      // keep only approved societies (UI requirement)
      const approved = all.filter((s) => s.requestStatus === "approved");
      setSocieties(approved);
    } catch (err) {
      console.error(
        "[SocietyDetails] fetch failed:",
        err?.response?.data || err.message
      );
      setError(err?.response?.data?.message || "Failed to load societies.");
      setSocieties([]);
    } finally {
      setLoading(false);
    }
  };

  // selection helpers
  const toggleSelect = (id) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const clearSelection = () => setSelectedIds(new Set());

  const selectAllVisible = (visibleList) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      visibleList.forEach((s) => next.add(String(s._id)));
      return next;
    });
  };

  const enterDeleteMode = () => {
    setDeleteMode(true);
    setDeleteError("");
    clearSelection();
  };

  const cancelDeleteMode = () => {
    setDeleteMode(false);
    setDeleteError("");
    clearSelection();
  };

  const confirmDelete = async () => {
    if (selectedIds.size === 0) {
      setDeleteError("No societies selected for deletion.");
      return;
    }

    if (
      !window.confirm(
        `Delete ${selectedIds.size} societies? This action cannot be undone.`
      )
    ) {
      return;
    }

    setDeleting(true);
    setDeleteError("");
    try {
      const token = localStorage.getItem("token");
      const ids = Array.from(selectedIds);

      // axios.delete with `data` body
      const res = await axios.delete(`${BACKEND}/api/adminSociety/societies`, {
        headers: { Authorization: `Bearer ${token}` },
        data: { ids },
      });

      const deletedCount = res.data?.deletedCount ?? ids.length;
      // remove deleted societies from UI
      setSocieties((prev) =>
        prev.filter((s) => !selectedIds.has(String(s._id)))
      );
      clearSelection();
      setDeleteMode(false);
      console.info(`[SocietyDetails] deleted ${deletedCount} societies`, ids);
    } catch (err) {
      console.error(
        "[SocietyDetails] bulk delete failed:",
        err?.response?.data || err.message
      );
      setDeleteError(
        err?.response?.data?.message || "Failed to delete societies."
      );
    } finally {
      setDeleting(false);
    }
  };

  const filtered = societies.filter((s) => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return true;
    return (
      (s.name || "").toLowerCase().includes(q) ||
      (s.description || "").toLowerCase().includes(q) ||
      (s.email || "").toLowerCase().includes(q) ||
      (s.president?.name || "").toLowerCase().includes(q)
    );
  });

  const visibleCount = filtered.length;
  const selectedCount = selectedIds.size;

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-[#001a0f] to-[#003319] text-white">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-bold">Approved Societies</h1>
            {!deleteMode && (
              <p className="text-sm text-gray-400">
                View & manage approved societies
              </p>
            )}
          </div>

          <div className="flex items-center gap-3">
            {!deleteMode ? (
              <button
                onClick={() => {
                  console.log("🗂 Navigating to Requests Page");
                  navigate("/RequestPage");
                }}
                className="font-semibold text-sm bg-gradient-to-r from-green-600 to-green-800 hover:from-green-500 hover:to-green-700 transition-all text-white rounded-md px-4 py-2 shadow-md"
              >
                Requests
              </button>
            ) : (
              <>
                <button
                  onClick={() => selectAllVisible(filtered)}
                  className="px-3 py-2 bg-gray-700 text-white rounded hover:bg-gray-600"
                >
                  Select All Visible
                </button>
                <button
                  onClick={clearSelection}
                  className="px-3 py-2 bg-gray-700 text-white rounded hover:bg-gray-600"
                >
                  Clear
                </button>
                <button
                  onClick={cancelDeleteMode}
                  className="px-3 py-2 bg-transparent border border-green-700 text-green-300 rounded"
                >
                  Cancel
                </button>
              </>
            )}

            {!deleteMode && (
              <button
                onClick={enterDeleteMode}
                className="font-semibold text-sm bg-red-500 hover:bg-red-800 transition-all text-white rounded-md px-4 py-2 shadow-md"
                title="Delete societies"
              >
                Delete
              </button>
            )}
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div className="flex items-center gap-3 flex-1">
            <input
              type="text"
              placeholder="Search societies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="p-2 rounded bg-[#0d1b12] border border-green-700/40 text-white outline-none w-full"
            />
            <button
              onClick={() => setSearchTerm("")}
              className="px-3 py-2 bg-transparent border border-green-700 rounded"
            >
              Reset
            </button>
          </div>

          <div className="text-sm text-gray-300 mt-2 md:mt-0">
            Total approved:{" "}
            <span className="font-semibold">{societies.length}</span> — Showing:{" "}
            <span className="font-semibold">{filtered.length}</span>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-8 text-gray-300">
            Loading societies…
          </div>
        ) : error ? (
          <div className="text-center py-8 text-red-400">{error}</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            No approved societies found.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filtered.map((s) => (
              <div
                key={s._id}
                className="bg-black/50 border border-green-800 rounded-lg p-4 flex items-start gap-4"
              >
                {deleteMode && (
                  <input
                    type="checkbox"
                    checked={selectedIds.has(String(s._id))}
                    onChange={() => toggleSelect(String(s._id))}
                    className="mt-2 h-5 w-5"
                    aria-label={`Select ${s.name} for deletion`}
                  />
                )}

                <div className="flex-1">
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <h3 className="text-xl font-bold text-green-300">
                        {s.name}
                      </h3>
                      {s.description && (
                        <p className="text-sm text-gray-300 mt-1">
                          {s.description}
                        </p>
                      )}
                    </div>

                    <div className="text-sm text-gray-200 text-right">
                      <div>
                        <span className="font-medium">Created:</span>{" "}
                        {new Date(s.createdAt).toLocaleString()}
                      </div>
                      <div className="mt-2">
                        <span className="px-3 py-1 rounded-full text-xs font-medium border bg-green-700/20 border-green-600 text-green-200">
                          approved
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 text-sm text-gray-200">
                    <div>
                      <span className="font-medium">President:</span>{" "}
                      {s.president
                        ? `${s.president.name} (${s.president.email}${
                            s.president.phone ? `, ${s.president.phone}` : ""
                          })`
                        : "N/A"}
                    </div>
                    <div>
                      <span className="font-medium">Email:</span> {s.email}
                    </div>
                    {s.phone && (
                      <div>
                        <span className="font-medium">Phone:</span> {s.phone}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Sticky action bar - appears when in deleteMode */}
      {deleteMode && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-black/80 border border-red-700 rounded-xl px-4 py-3 flex items-center gap-4 shadow-lg z-50">
          <div className="text-sm text-gray-200">
            Selected: <span className="font-semibold">{selectedCount}</span> /{" "}
            <span className="text-gray-400">{visibleCount}</span>
          </div>

          <button
            onClick={confirmDelete}
            disabled={deleting || selectedCount === 0}
            className={`px-4 py-2 rounded ${
              selectedCount === 0
                ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                : "bg-red-600 text-white hover:bg-red-700"
            }`}
          >
            {deleting ? "Deleting…" : `Confirm Delete (${selectedCount})`}
          </button>

          <button
            onClick={cancelDeleteMode}
            disabled={deleting}
            className="px-3 py-2 rounded bg-transparent border border-green-700 text-green-300"
          >
            Cancel
          </button>

          {deleteError && (
            <div className="text-sm text-red-400 ml-3">{deleteError}</div>
          )}
        </div>
      )}

      <Footer />
    </div>
  );
};

export default SocietyDetails;
