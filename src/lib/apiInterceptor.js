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
    return Promise.reject(error);
  }
);
