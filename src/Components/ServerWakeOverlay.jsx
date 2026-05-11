import { useEffect, useState } from "react";
import { subscribeWake } from "../lib/serverWake";

export default function ServerWakeOverlay() {
  const [visible, setVisible] = useState(false);
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => subscribeWake(setVisible), []);

  useEffect(() => {
    if (!visible) {
      setElapsed(0);
      return;
    }
    const start = Date.now();
    const id = setInterval(() => {
      setElapsed(Math.floor((Date.now() - start) / 1000));
    }, 1000);
    return () => clearInterval(id);
  }, [visible]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-[#f5f5f2]/95 backdrop-blur-sm flex items-center justify-center px-6">
      <div className="text-center">
        <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 flex items-center justify-center shadow-md">
          <p className="text-xl font-bold text-emerald-600 tracking-wide">
            KIIT
          </p>
        </div>
        <h2 className="mt-5 text-lg md:text-xl font-semibold text-[#111]">
          Reconnecting to server…
        </h2>
        <p className="mt-2 text-gray-500 text-sm leading-relaxed max-w-xs mx-auto">
          The server was idle. Waking it up may take 20–60 seconds.
        </p>
        <div className="mt-5 flex justify-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-bounce" />
          <span
            className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-bounce"
            style={{ animationDelay: "0.15s" }}
          />
          <span
            className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-bounce"
            style={{ animationDelay: "0.3s" }}
          />
        </div>
        {elapsed >= 5 && (
          <p className="mt-4 text-xs text-gray-400">{elapsed}s elapsed</p>
        )}
      </div>
    </div>
  );
}
