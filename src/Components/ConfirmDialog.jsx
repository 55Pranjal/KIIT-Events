import { useEffect } from "react";
import Spinner from "./Spinner";

// Branded confirm dialog. Replaces window.confirm() so the messaging matches
// the rest of the design system. Renders nothing when `open` is false.
//
// Usage:
//   const [confirmOpen, setConfirmOpen] = useState(false);
//   <ConfirmDialog
//     open={confirmOpen}
//     title="Remove this event?"
//     description="This action cannot be undone."
//     confirmLabel="Remove"
//     destructive
//     loading={removing}
//     onConfirm={handleRemove}
//     onCancel={() => setConfirmOpen(false)}
//   />

export default function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  destructive = false,
  loading = false,
  onConfirm,
  onCancel,
}) {
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (e.key === "Escape" && !loading) onCancel?.();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, loading, onCancel]);

  // Lock body scroll while open
  useEffect(() => {
    if (!open) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [open]);

  if (!open) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm animate-fadeIn"
        onClick={loading ? undefined : onCancel}
        aria-hidden="true"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        className="fixed inset-0 z-[100] flex items-center justify-center px-4 pointer-events-none"
      >
        <div className="pointer-events-auto bg-white rounded-2xl shadow-2xl border border-[#e5e5e5] max-w-md w-full p-6 animate-fadeUp">
          <div className="flex items-start gap-3">
            {destructive && (
              <span className="flex-shrink-0 inline-flex items-center justify-center w-10 h-10 rounded-full bg-red-50 text-red-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                  <line x1="12" y1="9" x2="12" y2="13" />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
              </span>
            )}
            <div className="flex-1 min-w-0">
              <h3
                id="confirm-dialog-title"
                className="font-display text-lg sm:text-xl font-bold text-[#111] tracking-tightish"
              >
                {title}
              </h3>
              {description && (
                <p className="text-sm text-gray-500 mt-1.5 leading-relaxed">
                  {description}
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <button
              type="button"
              onClick={onCancel}
              disabled={loading}
              className="px-4 py-2 rounded-lg text-sm font-medium border border-[#e5e5e5] text-[#333] hover:bg-gray-50 disabled:opacity-60 disabled:cursor-not-allowed transition"
            >
              {cancelLabel}
            </button>
            <button
              type="button"
              onClick={onConfirm}
              disabled={loading}
              className={`px-4 py-2 rounded-lg text-sm font-semibold text-white shadow-sm transition flex items-center gap-2 disabled:cursor-not-allowed ${
                destructive
                  ? "bg-red-500 hover:bg-red-600 disabled:bg-red-300"
                  : "bg-emerald-500 hover:bg-emerald-400 disabled:bg-emerald-300"
              }`}
            >
              {loading && <Spinner className="w-4 h-4" />}
              {confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
