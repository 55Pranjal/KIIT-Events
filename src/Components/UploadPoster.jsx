// UploadPoster.jsx
import React, { useState } from "react";
import axios from "axios";

export default function UploadPoster({
  onUploaded = () => {},
  initialPreviewUrl = "",
}) {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(initialPreviewUrl || "");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const BACKEND = import.meta.env.VITE_BACKEND_URL || ""; // ensure this is set in .env

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    // basic client-side checks
    const maxSize = 8 * 1024 * 1024;
    if (f.size > maxSize) {
      setError("File too large (max 8MB).");
      return;
    }
    setError("");
    setFile(f);
    setPreviewUrl(URL.createObjectURL(f));
  };

  const handleUpload = async (ev) => {
    ev?.preventDefault();
    if (!file) {
      setError("Please select a file first.");
      return;
    }
    setUploading(true);
    setError("");
    try {
      const form = new FormData();
      form.append("poster", file);

      console.info("[UploadPoster] uploading to:", `${BACKEND}/api/upload`);
      // send to BACKEND (make sure env var set) — fallback to relative if missing
      const uploadUrl = BACKEND
        ? `${BACKEND.replace(/\/$/, "")}/api/upload`
        : "/api/upload";

      const res = await axios.post(uploadUrl, form, {
        headers: { "Content-Type": "multipart/form-data" },
        timeout: 60000,
      });

      console.info("[UploadPoster] upload response:", res?.data);
      const url = res?.data?.url;

      if (!url || typeof url !== "string" || url.trim() === "") {
        setError("Upload succeeded but server returned no URL.");
        console.error("[UploadPoster] returned url empty:", res?.data);
        setUploading(false);
        return;
      }

      // make absolute if server returned relative path
      let finalUrl = url;
      if (url.startsWith("/")) {
        // try to build an absolute URL using BACKEND or current origin
        if (BACKEND) {
          finalUrl = `${BACKEND.replace(/\/$/, "")}${url}`;
        } else {
          finalUrl = `${window.location.protocol}//${window.location.host}${url}`;
        }
      }

      console.info("[UploadPoster] finalUrl:", finalUrl);
      setPreviewUrl(finalUrl);
      onUploaded(finalUrl);
      setMessageTemporary("Uploaded successfully");
    } catch (err) {
      console.error(
        "[UploadPoster] upload error:",
        err?.response?.data || err.message
      );
      setError(err?.response?.data?.error || "Upload failed. See console.");
    } finally {
      setUploading(false);
    }
  };

  // small helper to set a brief success message
  const [tempMsg, setTempMsg] = useState("");
  const setMessageTemporary = (m) => {
    setTempMsg(m);
    setTimeout(() => setTempMsg(""), 2500);
  };

  return (
    <div>
      {previewUrl && (
        <div style={{ marginBottom: 8 }}>
          <img
            src={previewUrl}
            alt="preview"
            style={{
              maxWidth: 240,
              maxHeight: 240,
              objectFit: "cover",
              borderRadius: 8,
            }}
            onError={(e) => (e.currentTarget.src = "")}
          />
        </div>
      )}

      <input type="file" accept="image/*" onChange={handleFileChange} />
      <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
        <button
          onClick={handleUpload}
          disabled={uploading}
          className="rounded px-3 py-1 bg-green-600 hover:bg-green-500 text-white"
        >
          {uploading ? "Uploading..." : "Upload"}
        </button>
        {tempMsg && <span style={{ color: "#9AE6B4" }}>{tempMsg}</span>}
      </div>

      {error && <p style={{ color: "#F56565", marginTop: 8 }}>{error}</p>}
      <hr style={{ marginTop: 12, opacity: 0.08 }} />
      <p style={{ fontSize: 12, color: "#BEE3F8", marginTop: 6 }}>
        Note: uploader posts to our database.
      </p>
    </div>
  );
}
