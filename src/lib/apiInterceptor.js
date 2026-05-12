import axios from "axios";
import { startWake, endWake } from "./serverWake";

const SLOW_THRESHOLD_MS = 3000;
const MAX_RETRIES = 3;
const BASE_BACKOFF_MS = 1000;

let requestSeq = 0;

function isColdStartFailure(error) {
  if (!error.response) return true;
  return [502, 503, 504].includes(error.response.status);
}

// Endpoints that legitimately return 401 during normal flows (bad password,
// invalid Google credential). We must NOT log the user out when these fire —
// they're the user's own login attempts, not session expiry.
const AUTH_ATTEMPT_PATHS = [
  "/api/users/login",
  "/api/users/google",
];

function isAuthAttempt(url = "") {
  return AUTH_ATTEMPT_PATHS.some((p) => url.includes(p));
}

let sessionExpiredHandled = false;

function handleSessionExpired() {
  // Guard against the same session-expired event firing multiple times in a
  // single render cycle (e.g. parallel API calls all returning 401 at once).
  if (sessionExpiredHandled) return;
  sessionExpiredHandled = true;
  setTimeout(() => {
    sessionExpiredHandled = false;
  }, 2000);

  localStorage.removeItem("token");
  localStorage.removeItem("role");
  localStorage.removeItem("societyRequestStatus");
  // App.jsx listens for this and navigates to /Login. Done as an event so
  // this module doesn't need to import React Router.
  window.dispatchEvent(new Event("auth:expired"));
}

axios.interceptors.request.use((config) => {
  if (config.skipWakeOverlay) return config;

  if (!config.metadata) {
    config.metadata = {
      id: `req-${++requestSeq}`,
      retryCount: 0,
    };
  }
  const { id } = config.metadata;
  config.metadata.slowTimer = setTimeout(
    () => startWake(id),
    SLOW_THRESHOLD_MS
  );
  return config;
});

axios.interceptors.response.use(
  (response) => {
    const meta = response.config?.metadata;
    if (meta) {
      clearTimeout(meta.slowTimer);
      endWake(meta.id);
    }
    return response;
  },
  async (error) => {
    const config = error.config;
    const meta = config?.metadata;
    if (meta) clearTimeout(meta.slowTimer);

    if (
      config &&
      meta &&
      !config.skipWakeOverlay &&
      isColdStartFailure(error) &&
      meta.retryCount < MAX_RETRIES
    ) {
      startWake(meta.id);
      meta.retryCount += 1;
      const backoff = BASE_BACKOFF_MS * Math.pow(2, meta.retryCount - 1);
      await new Promise((r) => setTimeout(r, backoff));
      return axios(config);
    }

    if (meta) endWake(meta.id);

    // Session expiry: a 401 on any endpoint OTHER than the login/google
    // endpoints means the user's token is invalid or expired. Clear local
    // auth state and signal the app to redirect.
    if (
      error.response?.status === 401 &&
      !isAuthAttempt(config?.url) &&
      localStorage.getItem("token")
    ) {
      handleSessionExpired();
    }

    return Promise.reject(error);
  }
);
