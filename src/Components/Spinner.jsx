// Tiny spinner for loading buttons. Inherits color from parent via `border-current`.
//
// Usage:
//   <button disabled={loading}>
//     {loading && <Spinner className="w-4 h-4 mr-2" />}
//     {loading ? "Saving…" : "Save"}
//   </button>

export default function Spinner({ className = "w-4 h-4" }) {
  return (
    <span
      className={`inline-block animate-spin rounded-full border-2 border-current border-t-transparent align-[-2px] ${className}`}
      aria-hidden="true"
    />
  );
}
