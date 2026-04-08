/* eslint-disable no-unused-vars */
import { useEffect, useState, useRef } from "react";
import { LazyMotion, m, domAnimation, AnimatePresence } from "framer-motion";
import { RefreshCw, LogOut } from "lucide-react";
import { getSessionTimeLeftMs } from "../../utils/sessionTimeout";

/* =====================
   HELPERS
===================== */

function formatTime(sec) {
  if (sec <= 0) return "0:00";
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

/* =====================
   COMPONENT
===================== */

export default function SessionExpiryModal({
  open = false,
  onExtend,
  onLogout,
}) {
  const [seconds, setSeconds] = useState(0);
  const totalRef = useRef(60);
  const intervalRef = useRef(null);
  const logoutTriggered = useRef(false);

  /* =====================
     SYNC TIME
  ===================== */

  const syncTime = () => {
    const ms = getSessionTimeLeftMs?.();
    const next = Math.max(0, Math.ceil((ms || 0) / 1000));
    return next;
  };

  /* =====================
     TIMER LOOP (simple + estable)
  ===================== */

  useEffect(() => {
    if (!open) return;

    const initial = syncTime();

    totalRef.current = initial || 60;
    setSeconds(initial);

    intervalRef.current = setInterval(() => {
      const next = syncTime();
      setSeconds(prev => (prev !== next ? next : prev));
    }, 1000);

    return () => clearInterval(intervalRef.current);
  }, [open]);

  /* =====================
     VISIBILITY SYNC
  ===================== */

  useEffect(() => {
    const onVisible = () => {
      if (document.visibilityState === "visible") {
        setSeconds(syncTime());
      }
    };

    document.addEventListener("visibilitychange", onVisible);
    return () => document.removeEventListener("visibilitychange", onVisible);
  }, []);

  /* =====================
     AUTO LOGOUT
  ===================== */

  useEffect(() => {
    if (!open) return;

    if (seconds <= 0 && !logoutTriggered.current) {
      logoutTriggered.current = true;
      onLogout?.();
    }
  }, [seconds, open, onLogout]);

  /* =====================
     HANDLERS
  ===================== */

  const handleExtend = () => {
    logoutTriggered.current = false;
    onExtend?.();

    const next = syncTime();
    totalRef.current = next || 60;
    setSeconds(next);
  };

  const handleLogout = () => {
    logoutTriggered.current = true;
    onLogout?.();
  };

  /* =====================
     PROGRESS
  ===================== */

  const progress =
    totalRef.current > 0
      ? Math.max(0, (seconds / totalRef.current) * 100)
      : 0;

  /* =====================
     UI
  ===================== */

  return (
    <LazyMotion features={domAnimation}>
      <AnimatePresence>
        {open && (
          <m.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <m.div
              className="w-full max-w-sm bg-white rounded-xl shadow-lg p-6 text-center"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
            >
              {/* TITLE */}
              <h2 className="text-base font-semibold text-slate-800">
                Sesión por expirar
              </h2>

              {/* TIMER */}
              <div className="mt-3 text-3xl font-semibold text-slate-900">
                {formatTime(seconds)}
              </div>

              {/* PROGRESS */}
              <div className="mt-4 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                <m.div
                  className="h-full bg-blue-900"
                  animate={{ width: `${progress}%` }}
                  transition={{ ease: "linear" }}
                />
              </div>

              {/* ACTIONS */}
              <div className="mt-5 flex gap-2">
                <button
                  onClick={handleLogout}
                  className="flex-1 px-3 py-2 text-sm rounded-md border border-slate-200 text-slate-600 hover:bg-slate-100 transition"
                >
                  <LogOut size={16} />
                </button>

                <button
                  onClick={handleExtend}
                  className="flex-1 px-3 py-2 text-sm rounded-md bg-blue-900 text-white hover:bg-blue-800 transition"
                >
                  <RefreshCw size={16} />
                </button>
              </div>
            </m.div>
          </m.div>
        )}
      </AnimatePresence>
    </LazyMotion>
  );
}