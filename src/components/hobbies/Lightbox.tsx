"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";

/** One photo in the full-screen viewer. caption/sub are optional text shown under it. */
export type LightboxItem = { src: string; alt: string; caption?: string; sub?: string };

type Open = (items: LightboxItem[], index: number) => void;
const LightboxContext = createContext<Open>(() => {});

/** Opens the full-screen photo viewer with a set of photos, starting at index. */
export const useLightbox = () => useContext(LightboxContext);

/**
 * Full-screen photo viewer ("lightbox"). Wrap the page in <LightboxProvider>; any photo can then
 * call useLightbox()(items, index). Arrows / swipe move through the set; Esc, the close button or a
 * click on the backdrop closes it, and focus returns to the photo that opened it. It sits above the
 * expanded views and handles keys first, so Esc closes only the viewer, not the view underneath.
 */
export function LightboxProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<{ items: LightboxItem[]; index: number } | null>(null);
  const opener = useRef<HTMLElement | null>(null);

  const open = useCallback<Open>((items, index) => {
    if (!items.length) return;
    opener.current = document.activeElement as HTMLElement | null;
    setState({ items, index: Math.max(0, Math.min(index, items.length - 1)) });
  }, []);
  const close = useCallback(() => {
    setState(null);
    opener.current?.focus();
  }, []);

  return (
    <LightboxContext.Provider value={open}>
      {children}
      {state && <Viewer items={state.items} index={state.index} onIndex={(i) => setState((s) => (s ? { ...s, index: i } : s))} onClose={close} />}
    </LightboxContext.Provider>
  );
}

function Viewer({ items, index, onIndex, onClose }: { items: LightboxItem[]; index: number; onIndex: (i: number) => void; onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const touch = useRef<{ x: number; y: number } | null>(null);
  const n = items.length;
  const item = items[index];
  const go = useCallback((d: number) => onIndex((index + d + n) % n), [index, n, onIndex]);

  useEffect(() => {
    closeRef.current?.focus();
    document.body.classList.add("hob-lb-lock");
    return () => document.body.classList.remove("hob-lb-lock");
  }, []);

  useEffect(() => {
    // Capture phase on window: runs before the expanded view's own key handler, which never sees these keys.
    const onKey = (e: KeyboardEvent) => {
      e.stopPropagation();
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight" && n > 1) go(1);
      else if (e.key === "ArrowLeft" && n > 1) go(-1);
      else if (e.key === "Tab" && ref.current) {
        const f = ref.current.querySelectorAll<HTMLElement>("button");
        const first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
  }, [go, n, onClose]);

  // Load the neighbors so flipping through is instant.
  useEffect(() => {
    if (n < 2) return;
    for (const i of [index + 1, index - 1]) new Image().src = items[(i + n) % n].src;
  }, [index, items, n]);

  return createPortal(
    <div className="hob">
      <div
        ref={ref}
        className="lb"
        role="dialog"
        aria-modal="true"
        aria-label={item.caption ?? item.alt}
        onClick={(e) => { if (e.target === e.currentTarget || (e.target as HTMLElement).classList.contains("lb-stage")) onClose(); }}
        onTouchStart={(e) => { touch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }; }}
        onTouchEnd={(e) => {
          const t = touch.current; touch.current = null;
          if (!t || n < 2) return;
          const dx = e.changedTouches[0].clientX - t.x, dy = e.changedTouches[0].clientY - t.y;
          if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) go(dx < 0 ? 1 : -1);
        }}
      >
        <button ref={closeRef} type="button" className="lb-btn lb-close" aria-label="Close photo" onClick={onClose}>&times;</button>
        {n > 1 && <span className="lb-count" aria-live="polite">{index + 1} / {n}</span>}
        <div className="lb-stage">
          <img key={item.src} className="lb-img" src={item.src} alt={item.alt} />
        </div>
        {(item.caption || item.sub) && (
          <p className="lb-cap">{item.caption && <b>{item.caption}</b>}{item.sub && <span>{item.sub}</span>}</p>
        )}
        {n > 1 && (
          <>
            <button type="button" className="lb-btn lb-prev" aria-label="Previous photo" onClick={() => go(-1)}>&#8249;</button>
            <button type="button" className="lb-btn lb-next" aria-label="Next photo" onClick={() => go(1)}>&#8250;</button>
          </>
        )}
      </div>
    </div>,
    document.body,
  );
}

/** A photo thumbnail that opens the viewer. Renders a real button around the image for keyboard users. */
export function Zoomable({ onOpen, label, className, children }: { onOpen: () => void; label: string; className?: string; children: ReactNode }) {
  return (
    <button type="button" className={`zoom ${className ?? ""}`.trim()} aria-label={`View larger: ${label}`} onClick={onOpen}>
      {children}
    </button>
  );
}
