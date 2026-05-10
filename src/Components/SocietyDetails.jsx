import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Navbar from "./Navbar";
import Footer from "./Footer";
import Doodles from "./Doodles";
import ConfirmDialog from "./ConfirmDialog";
import EmptyState, { UsersIcon } from "./EmptyState";
import { useNavigate } from "react-router-dom";

const SocietyDetails = () => {
  const navigate = useNavigate();
  const [societies, setSocieties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const [deleteMode, setDeleteMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState(() => new Set());
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);

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
      const res = await axios.get(`${BACKEND}/api/adminSociety/societies`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const all = Array.isArray(res.data) ? res.data : [];
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

  const requestDelete = () => {
    if (selectedIds.size === 0) {
      setDeleteError("No societies selected for deletion.");
      return;
    }
    setConfirmOpen(true);
  };

  const confirmDelete = async () => {
    setDeleting(true);
    setDeleteError("");
    try {
      const token = localStorage.getItem("token");
      const ids = Array.from(selectedIds);

      const res = await axios.delete(`${BACKEND}/api/adminSociety/societies`, {
        headers: { Authorization: `Bearer ${token}` },
        data: { ids },
      });

      const deletedCount = res.data?.deletedCount ?? ids.length;
      setSocieties((prev) =>
        prev.filter((s) => !selectedIds.has(String(s._id)))
      );
      clearSelection();
      setDeleteMode(false);
      setConfirmOpen(false);
      console.info(`[SocietyDetails] deleted ${deletedCount} societies`, ids);
      toast.success(
        `Deleted ${deletedCount} ${deletedCount === 1 ? "society" : "societies"}.`
      );
    } catch (err) {
      console.error(
        "[SocietyDetails] bulk delete failed:",
        err?.response?.data || err.message
      );
      const msg =
        err?.response?.data?.message || "Failed to delete societies.";
      setDeleteError(msg);
      toast.error(msg);
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
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="relative flex-grow overflow-hidden flex flex-col">
        <Doodles variant="hero" />
        <div className="relative z-10 flex-grow max-w-6xl mx-auto w-full px-4 sm:px-6 py-10">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
          <div>
            <h1 className="font-display text-2xl md:text-3xl font-bold text-[#111] tracking-tightish">
              Approved{" "}
              <span className="bg-gradient-to-r from-emerald-600 via-emerald-500 to-emerald-400 bg-clip-text text-transparent">
                Societies
              </span>
            </h1>
            {!deleteMode && (
              <p className="text-sm text-gray-500 mt-1">
                View &amp; manage approved societies.
              </p>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {!deleteMode ? (
              <>
                <button
                  onClick={() => navigate("/RequestPage")}
                  className="text-sm bg-emerald-500 hover:bg-emerald-400 text-white font-medium rounded-lg px-4 py-2 shadow-sm transition-all"
                >
                  Requests
                </button>
                <button
                  onClick={enterDeleteMode}
                  className="text-sm border border-red-300 text-red-600 hover:bg-red-50 font-medium rounded-lg px-4 py-2 transition-all"
                  title="Delete societies"
                >
                  Delete
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => selectAllVisible(filtered)}
                  className="text-sm border border-[#e5e5e5] text-[#333] hover:bg-gray-50 rounded-lg px-3 py-2 transition-all"
                >
                  Select All Visible
                </button>
                <button
                  onClick={clearSelection}
                  className="text-sm border border-[#e5e5e5] text-[#333] hover:bg-gray-50 rounded-lg px-3 py-2 transition-all"
                >
                  Clear
                </button>
                <button
                  onClick={cancelDeleteMode}
                  className="text-sm border border-[#e5e5e5] text-[#333] hover:bg-gray-50 rounded-lg px-3 py-2 transition-all"
                >
                  Cancel
                </button>
              </>
            )}
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div className="flex items-center gap-2 flex-1">
            <input
              type="text"
              placeholder="Search societies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-2.5 rounded-lg bg-white border border-[#e5e5e5] text-[#111] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all w-full"
            />
            <button
              onClick={() => setSearchTerm("")}
              className="text-sm border border-[#e5e5e5] text-[#333] hover:bg-gray-50 rounded-lg px-3 py-2.5 transition-all"
            >
              Reset
            </button>
          </div>

          <div className="text-sm text-gray-500 mt-2 md:mt-0 flex-shrink-0">
            Total approved:{" "}
            <span className="font-semibold text-[#111]">
              {societies.length}
            </span>{" "}
            — Showing:{" "}
            <span className="font-semibold text-[#111]">
              {filtered.length}
            </span>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-500">
            Loading societies…
          </div>
        ) : error ? (
          <div className="text-center py-12 text-red-500">{error}</div>
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={<UsersIcon />}
            title={
              searchTerm
                ? "No societies match your search"
                : "No approved societies yet"
            }
            description={
              searchTerm
                ? "Try a different name or clear the search."
                : "Approved societies will appear here. Check the Requests tab for pending applications."
            }
            action={
              searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="px-5 py-2.5 border border-[#e5e5e5] hover:bg-gray-50 text-[#333] rounded-lg text-sm font-medium transition"
                >
                  Clear search
                </button>
              )
            }
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filtered.map((s) => (
              <div
                key={s._id}
                className="bg-white border border-[#e5e5e5] rounded-xl p-5 shadow-sm hover:shadow-md transition-all flex items-start gap-4"
              >
                {deleteMode && (
                  <input
                    type="checkbox"
                    checked={selectedIds.has(String(s._id))}
                    onChange={() => toggleSelect(String(s._id))}
                    className="mt-1.5 h-5 w-5 accent-emerald-500"
                    aria-label={`Select ${s.name} for deletion`}
                  />
                )}

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start gap-3">
                    <div className="min-w-0">
                      <h3 className="text-lg font-semibold text-[#111] break-words">
                        {s.name}
                      </h3>
                      {s.description && (
                        <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                          {s.description}
                        </p>
                      )}
                    </div>

                    <span className="px-2.5 py-1 rounded-md text-xs font-medium bg-emerald-100 text-emerald-700 flex-shrink-0">
                      approved
                    </span>
                  </div>

                  <div className="mt-3 pt-3 border-t border-[#eee] text-sm text-gray-600 space-y-1">
                    <div>
                      <span className="text-gray-400 font-medium">
                        President:
                      </span>{" "}
                      {s.president
                        ? `${s.president.name} (${s.president.email}${
                            s.president.phone
                              ? `, ${s.president.phone}`
                              : ""
                          })`
                        : "N/A"}
                    </div>
                    <div>
                      <span className="text-gray-400 font-medium">Email:</span>{" "}
                      {s.email}
                    </div>
                    {s.phone && (
                      <div>
                        <span className="text-gray-400 font-medium">
                          Phone:
                        </span>{" "}
                        {s.phone}
                      </div>
                    )}
                    <div className="text-xs text-gray-400 pt-1">
                      Created {new Date(s.createdAt).toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        </div>
      </div>

      {deleteMode && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-white border border-[#e5e5e5] rounded-xl px-4 py-3 flex items-center gap-3 shadow-2xl z-50">
          <div className="text-sm text-gray-600">
            Selected:{" "}
            <span className="font-semibold text-[#111]">{selectedCount}</span> /{" "}
            <span className="text-gray-400">{visibleCount}</span>
          </div>

          <button
            onClick={requestDelete}
            disabled={deleting || selectedCount === 0}
            className={`text-sm font-medium rounded-lg px-4 py-2 transition-all ${
              selectedCount === 0
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-red-500 text-white hover:bg-red-600 shadow-sm"
            }`}
          >
            {deleting ? "Deleting…" : `Delete (${selectedCount})`}
          </button>

          <button
            onClick={cancelDeleteMode}
            disabled={deleting}
            className="text-sm border border-[#e5e5e5] text-[#333] hover:bg-gray-50 rounded-lg px-3 py-2 transition-all"
          >
            Cancel
          </button>

          {deleteError && (
            <div className="text-sm text-red-500 ml-2">{deleteError}</div>
          )}
        </div>
      )}

      <ConfirmDialog
        open={confirmOpen}
        title={`Delete ${selectedCount} ${selectedCount === 1 ? "society" : "societies"}?`}
        description="This will permanently remove the selected societies and detach their associated data. This action cannot be undone."
        confirmLabel={`Delete ${selectedCount}`}
        destructive
        loading={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setConfirmOpen(false)}
      />

      <Footer />
    </div>
  );
};

export default SocietyDetails;
