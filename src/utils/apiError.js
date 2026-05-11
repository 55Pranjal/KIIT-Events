/**
 * Read the human-friendly message from an axios error.
 *
 * The backend isn't fully consistent on error keys (some routes use `message`,
 * some `error`, some `msg`) — try them in order of preference and fall back to
 * a caller-supplied default. Going forward, new backend code should use
 * `message` and old code can be migrated as it's touched.
 */
export const getApiErrorMessage = (err, fallback = "Something went wrong.") => {
  const data = err?.response?.data;
  return data?.message || data?.error || data?.msg || err?.message || fallback;
};
