const activeKeys = new Set();
const listeners = new Set();

function notify() {
  const isWaking = activeKeys.size > 0;
  listeners.forEach((fn) => fn(isWaking));
}

export function subscribeWake(fn) {
  listeners.add(fn);
  fn(activeKeys.size > 0);
  return () => listeners.delete(fn);
}

export function startWake(key) {
  activeKeys.add(key);
  notify();
}

export function endWake(key) {
  activeKeys.delete(key);
  notify();
}
