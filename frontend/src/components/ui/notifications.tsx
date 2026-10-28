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
import { AlertCircle, CheckCircle2, Info, Bell, X } from "lucide-react";

const GAP = 8;
const PEEK = 10;
const SCALE_STEP = 0.05;
const EXIT_MS = 300;

export interface ToastAction {
  label: string;
  onClick?: () => void;
  muted?: boolean;
}

export interface ToastOptions {
  id?: number | string;
  icon?: "alert" | "update" | "success" | "info" | React.ReactNode;
  title?: string;
  description?: string;
  duration?: number;
  actions?: ToastAction[];
}

interface ToastItem extends ToastOptions {
  id: number | string;
  leaving?: boolean;
}

export type NotifyFunction = ((options: ToastOptions) => number | string) & {
  success: (message: string, title?: string, options?: Partial<ToastOptions>) => number | string;
  error: (message: string, title?: string, options?: Partial<ToastOptions>) => number | string;
  info: (message: string, title?: string, options?: Partial<ToastOptions>) => number | string;
  alert: (message: string, title?: string, options?: Partial<ToastOptions>) => number | string;
};

export interface ToastContextValue {
  notify: NotifyFunction;
  dismiss: (id: number | string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside <ToastProvider>");
  return ctx;
}

export const useNotifications = useToast;

let nextId = 1;

export interface ToastProviderProps {
  children: React.ReactNode;
  position?: "bottom-right" | "bottom-left" | "bottom-center" | "top-right";
  visible?: number;
}

export function ToastProvider({
  children,
  position = "bottom-right",
  visible = 3,
}: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [heights, setHeights] = useState<Record<string | number, number>>({});
  const [hovered, setHovered] = useState(false);

  const dismiss = useCallback((id: number | string) => {
    setToasts((list) => list.map((t) => (t.id === id ? { ...t, leaving: true } : t)));
    setTimeout(() => {
      setToasts((list) => list.filter((t) => t.id !== id));
      setHeights((prev) => {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      });
    }, EXIT_MS);
  }, []);

  const baseNotify = useCallback((options: ToastOptions) => {
    const id = options.id ?? nextId++;
    setToasts((list) => [
      { icon: "info", duration: 4500, ...options, id },
      ...list.filter((t) => t.id !== id),
    ]);
    return id;
  }, []);

  const notify = useMemo(() => {
    const fn = ((options: ToastOptions) => baseNotify(options)) as NotifyFunction;
    fn.success = (message: string, title: string = "Success", options?: Partial<ToastOptions>) =>
      baseNotify({ ...options, title, description: message, icon: "success" });
    fn.error = (message: string, title: string = "Error", options?: Partial<ToastOptions>) =>
      baseNotify({ ...options, title, description: message, icon: "alert", duration: 5500 });
    fn.info = (message: string, title: string = "Notice", options?: Partial<ToastOptions>) =>
      baseNotify({ ...options, title, description: message, icon: "info" });
    fn.alert = (message: string, title: string = "Alert", options?: Partial<ToastOptions>) =>
      baseNotify({ ...options, title, description: message, icon: "alert", duration: 5500 });
    return fn;
  }, [baseNotify]);

  const setHeight = useCallback((id: number | string, h: number) => {
    setHeights((prev) => (prev[id] === h ? prev : { ...prev, [id]: h }));
  }, []);

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
        style={{ height: listHeight || undefined }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onFocus={() => setHovered(true)}
        onBlur={() => setHovered(false)}
      >
        {toasts.map((toast, i) => {
          const newer = toasts.slice(0, i).filter((t) => !t.leaving);
          return (
            <ToastCard
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

interface ToastCardProps {
  toast: ToastItem;
  index: number;
  offset: number;
  expanded: boolean;
  frontHeight: number;
  visible: number;
  paused: boolean;
  onHeight: (id: number | string, height: number) => void;
  onDismiss: (id: number | string) => void;
}

function ToastCard({
  toast,
  index,
  offset,
  expanded,
  frontHeight,
  visible,
  paused,
  onHeight,
  onDismiss,
}: ToastCardProps) {
  const body = useRef<HTMLDivElement>(null);
  const [own, setOwn] = useState(0);
  const [entered, setEntered] = useState(false);
  const remaining = useRef(toast.duration ?? 4000);

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

  useEffect(() => {
    if (paused || toast.leaving || !Number.isFinite(remaining.current) || remaining.current <= 0) return;
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

  return (
    <li
      className="ntf-toast"
      role={toast.icon === "alert" ? "alert" : "status"}
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
          <X size={14} />
        </button>
      </div>
    </li>
  );
}

function renderIcon(icon: ToastOptions["icon"]) {
  if (icon === "alert") {
    return (
      <span className="ntf-alert">
        <i />
        <i />
        <AlertCircle size={20} />
      </span>
    );
  }
  if (icon === "success") {
    return (
      <span className="ntf-success-icon">
        <CheckCircle2 size={20} color="#10b981" />
      </span>
    );
  }
  if (icon === "update") {
    return (
      <span className="ntf-tile">
        <Bell size={16} />
      </span>
    );
  }
  if (icon === "info") {
    return (
      <span className="ntf-info-icon">
        <Info size={19} color="#3b82f6" />
      </span>
    );
  }
  return icon ?? <Info size={19} />;
}

const CSS = `
.ntf-list {
  --ntf-bg: #ffffff;
  --ntf-ring: rgba(0,0,0,.08);
  --ntf-text: #09090b;
  --ntf-muted: #71717a;
  --ntf-red: #ef4444;
  position: fixed; bottom: 20px; z-index: 9999;
  width: min(400px, calc(100vw - 32px));
  margin: 0; padding: 0; list-style: none;
  transition: height .3s cubic-bezier(.22,1,.36,1);
  font-family: inherit;
}
.dark .ntf-list,
:root.dark .ntf-list {
  --ntf-bg: #09090b;
  --ntf-ring: rgba(255,255,255,.12);
  --ntf-text: #fafafa;
  --ntf-muted: #a1a1aa;
  --ntf-red: #f87171;
}
.ntf-list[data-position="bottom-right"]  { right: 20px; }
.ntf-list[data-position="bottom-left"]   { left: 20px; }
.ntf-list[data-position="bottom-center"] { left: 50%; transform: translateX(-50%); }
.ntf-list[data-position="top-right"]     { top: 20px; bottom: auto; }

.ntf-toast {
  position: absolute; left: 0; right: 0; bottom: 0;
  overflow: hidden; border-radius: 14px;
  background: var(--ntf-bg);
  box-shadow: inset 0 0 0 1px var(--ntf-ring), 0 12px 32px rgba(0,0,0,.35);
  transform-origin: top center;
  transition:
    transform .45s cubic-bezier(.22,1,.36,1),
    opacity .3s ease,
    height .3s cubic-bezier(.22,1,.36,1);
}
.ntf-body {
  display: flex; gap: 12px; align-items: flex-start;
  padding: 14px 14px 14px 14px;
  transition: opacity .25s ease;
}
.ntf-icon { flex: none; display: grid; place-items: center; width: 28px; height: 28px; }
.ntf-main { flex: 1; min-width: 0; padding-top: 1px; }
.ntf-title { margin: 0; font-size: 13.5px; line-height: 19px; font-weight: 700; color: var(--ntf-text); }
.ntf-desc  { margin: 2px 0 0; font-size: 12.5px; line-height: 18px; color: var(--ntf-muted); }
.ntf-actions { display: flex; gap: 12px; margin-top: 10px; }
.ntf-action {
  padding: 0; border: 0; background: none; cursor: pointer;
  font: inherit; font-size: 13px; line-height: 18px; font-weight: 600;
  color: #38bdf8; transition: color .15s ease;
}
.ntf-action:hover { color: #7dd3fc; }
.ntf-action[data-muted] { color: #64748b; }
.ntf-action[data-muted]:hover { color: #94a3b8; }
.ntf-close {
  flex: none; display: grid; place-items: center; width: 24px; height: 24px;
  margin-top: 1px; padding: 0; border: 0; border-radius: 6px;
  background: none; color: #64748b; cursor: pointer; transition: color .15s ease, background .15s ease;
}
.ntf-close:hover { color: #f1f5f9; background: rgba(255,255,255,.08); }

.ntf-alert { position: relative; display: grid; place-items: center; width: 28px; height: 28px; color: var(--ntf-red); }
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

.ntf-tile {
  display: grid; place-items: center; width: 28px; height: 28px;
  border-radius: 8px; background: rgba(255,255,255,.08); color: #e2e8f0;
}
.ntf-success-icon, .ntf-info-icon {
  display: grid; place-items: center; width: 28px; height: 28px;
}
`;
