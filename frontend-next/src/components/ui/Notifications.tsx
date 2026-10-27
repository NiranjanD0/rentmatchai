"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";

/* ------------------------------------------------------------------ *
 *  Stacked toast notifications
 *  - new toasts slide up from below while fading in
 *  - older toasts scale back and peek out above the newest one
 *  - hovering (or focusing) the stack fans it out into full-size cards
 *  - dismissing fades a toast out and the rest slide into place
 * ------------------------------------------------------------------ */

const GAP = 8; // space between cards when expanded
const PEEK = 10; // how far each stacked card peeks out when collapsed
const SCALE_STEP = 0.05; // shrink per level of depth when collapsed
const EXIT_MS = 300;

export interface ToastAction {
  label: string;
  onClick?: () => void;
  muted?: boolean;
}

export type ToastIcon = "alert" | "update" | "success" | "info" | "error" | React.ReactNode;

export interface ToastOptions {
  id?: number;
  icon?: ToastIcon;
  title?: string;
  description?: string;
  duration?: number;
  actions?: ToastAction[];
}

export interface ToastItem extends ToastOptions {
  id: number;
  leaving?: boolean;
}

export interface ToastApi {
  notify: (options: ToastOptions) => number;
  dismiss: (id: number) => void;
}

const ToastContext = createContext<ToastApi | null>(null);

export function useToast(): ToastApi {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside <ToastProvider>");
  return ctx;
}

let nextId = 1;

export interface ToastProviderProps {
  children: React.ReactNode;
  position?: "bottom-right" | "bottom-left" | "bottom-center";
  visible?: number;
}

export function ToastProvider({
  children,
  position = "bottom-right",
  visible = 4,
}: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [heights, setHeights] = useState<Record<number, number>>({});
  const [hovered, setHovered] = useState(false);

  const dismiss = useCallback((id: number) => {
    setToasts((list) => list.map((t) => (t.id === id ? { ...t, leaving: true } : t)));
    setTimeout(() => {
      setHeights((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
    }, EXIT_MS);
  }, []);

  const notify = useCallback((options: ToastOptions) => {
    const id = options.id ?? nextId++;
    setToasts((list) => [
      { icon: "info", duration: 4500, ...options, id },
      ...list.filter((t) => t.id !== id),
    ]);
    return id;
  }, []);

  const setHeight = useCallback(
    (id: number, h: number) => setHeights((prev) => (prev[id] === h ? prev : { ...prev, [id]: h })),
    []
  );

  useEffect(() => {
    if (!toasts.length) setHovered(false);
  }, [toasts.length]);

  const api = useMemo(() => ({ notify, dismiss }), [notify, dismiss]);

  const active = toasts.filter((t) => !t.leaving);
  const expanded = hovered && active.length > 1;
  const frontHeight = heights[active[0]?.id] ?? 0;
  const shown = active.slice(0, visible);
  const listHeight = expanded
    ? shown.reduce((sum, t, i) => sum + (heights[t.id] ?? 0) + (i ? GAP : 0), 0)
    : frontHeight;

  return (
    <ToastContext.Provider value={api}>
      <style>{CSS}</style>
      {children}
      <ol
        className="ntf-list"
        data-position={position}
        aria-label="Notifications"
        style={{ height: listHeight }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onFocus={() => setHovered(true)}
        onBlur={() => setHovered(false)}
      >
        {toasts.map((toast, i) => {
          const newer = toasts.slice(0, i).filter((t) => !t.leaving);
          return (
            <Toast
              key={toast.id}
              toast={toast}
              index={newer.length}
              offset={newer.reduce((sum, t) => sum + (heights[t.id] ?? 0) + GAP, 0)}
              expanded={expanded}
              frontHeight={frontHeight}
              visible={visible}
              paused={hovered}
              onHeight={setHeight}
              onDismiss={dismiss}
            />
          );
        })}
      </ol>
    </ToastContext.Provider>
  );
}

interface ToastProps {
  toast: ToastItem;
  index: number;
  offset: number;
  expanded: boolean;
  frontHeight: number;
  visible: number;
  paused: boolean;
  onHeight: (id: number, height: number) => void;
  onDismiss: (id: number) => void;
}

function Toast({
  toast,
  index,
  offset,
  expanded,
  frontHeight,
  visible,
  paused,
  onHeight,
  onDismiss,
}: ToastProps) {
  const body = useRef<HTMLDivElement>(null);
  const [own, setOwn] = useState(0);
  const [entered, setEntered] = useState(false);
  const remaining = useRef(toast.duration ?? 4500);

  // Measure our natural height
  useLayoutEffect(() => {
    const el = body.current;
    if (!el) return;
    const measure = () => {
      setOwn(el.offsetHeight);
      onHeight(toast.id, el.offsetHeight);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [toast.id, onHeight]);

  // Trigger the slide-up after the first painted frame
  useEffect(() => {
    let inner: number;
    const outer = requestAnimationFrame(() => {
      inner = requestAnimationFrame(() => setEntered(true));
    });
    return () => {
      cancelAnimationFrame(outer);
      cancelAnimationFrame(inner);
    };
  }, []);

  // Auto-dismiss; pauses while the stack is hovered
  useEffect(() => {
    if (paused || toast.leaving || !Number.isFinite(remaining.current)) return;
    const start = Date.now();
    const timer = setTimeout(() => onDismiss(toast.id), remaining.current);
    return () => {
      clearTimeout(timer);
      remaining.current -= Date.now() - start;
    };
  }, [paused, toast.leaving, toast.id, onDismiss]);

  const behind = !expanded && index > 0;
  const hidden = index >= visible;
  const baseScale = expanded ? 1 : 1 - Math.min(index, visible) * SCALE_STEP;

  let y = expanded ? -offset : -index * PEEK;
  let scale = baseScale;
  let opacity = hidden ? 0 : 1;
  if (!entered) {
    y = own + 16;
    scale = 1;
    opacity = 0;
  }
  if (toast.leaving) {
    opacity = 0;
    scale = baseScale * 0.96;
  }

  const isAlert = toast.icon === "alert" || toast.icon === "error";

  return (
    <li
      className="ntf-toast"
      role={isAlert ? "alert" : "status"}
      style={{
        height: (behind ? frontHeight || own : own) || undefined,
        opacity,
        transform: `translateY(${y}px) scale(${scale})`,
        zIndex: 100 - index,
        pointerEvents: hidden || toast.leaving ? "none" : "auto",
      }}
    >
      <div ref={body} className="ntf-body" style={{ opacity: behind ? 0 : 1 }}>
        <div className="ntf-icon">{renderIcon(toast.icon)}</div>
        <div className="ntf-main">
          {toast.title && <p className="ntf-title">{toast.title}</p>}
          {toast.description && <p className="ntf-desc">{toast.description}</p>}
          {toast.actions && toast.actions.length > 0 && (
            <div className="ntf-actions">
              {toast.actions.map((a) => (
                <button
                  key={a.label}
                  className="ntf-action"
                  data-muted={a.muted || undefined}
                  onClick={() => {
                    a.onClick?.();
                    onDismiss(toast.id);
                  }}
                >
                  {a.label}
                </button>
              ))}
            </div>
          )}
        </div>
        <button
          className="ntf-close"
          aria-label="Dismiss notification"
          onClick={() => onDismiss(toast.id)}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <path d="M3 3l8 8M11 3l-8 8" />
          </svg>
        </button>
      </div>
    </li>
  );
}

/* ------------------------------ icons ------------------------------ */

function renderIcon(icon?: ToastIcon) {
  if (icon === "alert" || icon === "error") {
    return (
      <span className="ntf-alert">
        <i />
        <i />
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
          <circle cx="14" cy="14" r="8.5" />
          <path d="M14 10.4v4.1" />
          <circle cx="14" cy="17.7" r=".6" fill="currentColor" />
        </svg>
      </span>
    );
  }
  if (icon === "success") {
    return (
      <span className="ntf-success">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </span>
    );
  }
  if (icon === "info") {
    return (
      <span className="ntf-info">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="16" x2="12" y2="12" />
          <line x1="12" y1="8" x2="12.01" y2="8" />
        </svg>
      </span>
    );
  }
  if (icon === "update") {
    return (
      <span className="ntf-tile">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round">
          <path d="M12 3l8 4.5v9L12 21l-8-4.5v-9z" />
          <path d="M12 12l8-4.5M12 12v9M12 12L4 7.5" />
        </svg>
      </span>
    );
  }
  return icon ?? null;
}

/* ------------------------------ styles ----------------------------- */

const CSS = `
.ntf-list {
  --ntf-bg: #1c252e;
  --ntf-ring: rgba(255,255,255,.09);
  --ntf-text: #f4f6f8;
  --ntf-muted: #94a3b8;
  --ntf-red: #ef4444;
  --ntf-green: #10b981;
  --ntf-blue: #38bdf8;
  position: fixed; bottom: 20px; z-index: 99999;
  width: min(400px, calc(100vw - 32px));
  margin: 0; padding: 0; list-style: none;
  transition: height .3s cubic-bezier(.22,1,.36,1);
  font-family: inherit;
  pointer-events: none;
}
.ntf-list[data-position="bottom-right"]  { right: 20px; }
.ntf-list[data-position="bottom-left"]   { left: 20px; }
.ntf-list[data-position="bottom-center"] { left: 50%; transform: translateX(-50%); }

.ntf-toast {
  position: absolute; left: 0; right: 0; bottom: 0;
  overflow: hidden; border-radius: 14px;
  background: var(--ntf-bg);
  box-shadow: inset 0 0 0 1px var(--ntf-ring), 0 16px 36px rgba(0,0,0,.35);
  transform-origin: top center;
  transition:
    transform .45s cubic-bezier(.22,1,.36,1),
    opacity .3s ease,
    height .3s cubic-bezier(.22,1,.36,1);
  pointer-events: auto;
}
.ntf-body {
  display: flex; gap: 12px; align-items: flex-start;
  padding: 14px 16px 14px 14px;
  transition: opacity .25s ease;
}
.ntf-icon { flex: none; display: grid; place-items: center; width: 28px; height: 28px; }
.ntf-main { flex: 1; min-width: 0; padding-top: 1px; }
.ntf-title { margin: 0; font-size: 14px; line-height: 20px; font-weight: 600; color: var(--ntf-text); }
.ntf-desc  { margin: 2px 0 0; font-size: 13px; line-height: 19px; color: var(--ntf-muted); }
.ntf-actions { display: flex; gap: 12px; margin-top: 10px; }
.ntf-action {
  padding: 0; border: 0; background: none; cursor: pointer;
  font: inherit; font-size: 13px; line-height: 18px; font-weight: 600;
  color: #38bdf8; transition: color .15s ease;
}
.ntf-action:hover { color: #7dd3fc; }
.ntf-action[data-muted] { color: #94a3b8; }
.ntf-action[data-muted]:hover { color: #cbd5e1; }
.ntf-close {
  flex: none; display: grid; place-items: center; width: 24px; height: 24px;
  margin-top: 1px; padding: 0; border: 0; border-radius: 6px;
  background: none; color: #94a3b8; cursor: pointer; transition: color .15s ease, background .15s ease;
}
.ntf-close:hover { color: #f8fafc; background: rgba(255,255,255,.08); }
.ntf-close:focus-visible, .ntf-action:focus-visible { outline: 2px solid #34d399; outline-offset: 2px; border-radius: 6px; }

/* alert icon with pulsing rings */
.ntf-alert { position: relative; display: grid; place-items: center; width: 28px; height: 28px; color: var(--ntf-red); }
.ntf-alert svg { position: relative; }
.ntf-alert i {
  position: absolute; inset: 2px; border-radius: 50%;
  border: 1px solid currentColor; opacity: 0;
  animation: ntf-ring 2.4s ease-out infinite;
}
.ntf-alert i:nth-child(2) { animation-delay: 1.2s; }
@keyframes ntf-ring {
  0%   { transform: scale(.75); opacity: .55; }
  100% { transform: scale(1.35); opacity: 0; }
}

/* success icon */
.ntf-success {
  display: grid; place-items: center; width: 28px; height: 28px;
  border-radius: 50%; background: rgba(16, 185, 129, 0.15); color: var(--ntf-green);
  box-shadow: inset 0 0 0 1px rgba(16, 185, 129, 0.25);
}

/* info icon */
.ntf-info {
  display: grid; place-items: center; width: 28px; height: 28px;
  border-radius: 50%; background: rgba(56, 189, 248, 0.15); color: var(--ntf-blue);
  box-shadow: inset 0 0 0 1px rgba(56, 189, 248, 0.25);
}

/* app-style icon tile */
.ntf-tile {
  display: grid; place-items: center; width: 28px; height: 28px;
  border-radius: 8px; background: #0f172a; color: #e2e8f0;
  box-shadow: inset 0 0 0 1px rgba(255,255,255,.1);
}

@media (prefers-reduced-motion: reduce) {
  .ntf-list, .ntf-toast, .ntf-body { transition-duration: .01ms !important; }
  .ntf-alert i { animation: none; }
}
`;

export default ToastProvider;
