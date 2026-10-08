"use client";

import { useEffect, useRef, useState, useSyncExternalStore, type CSSProperties } from "react";
import { fmt, type MusicStats } from "./types";

export const ImgIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="3" y="4" width="18" height="16" rx="3" />
    <circle cx="9" cy="10" r="1.6" />
    <path d="M4 18l5-5 4 4 3-3 4 4" />
  </svg>
);
export const TREE_POINTS = "12,2 6.5,10 9.5,10 5.5,16 10,16 10,21.5 14,21.5 14,16 18.5,16 14.5,10 17.5,10";
export const TreeIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <polygon points={TREE_POINTS} />
  </svg>
);
export const ExpandIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M14 4h6v6M10 20H4v-6M20 4l-7 7M4 20l7-7" />
  </svg>
);

const RM = "(prefers-reduced-motion: reduce)";
export function usePrefersReducedMotion() {
  return useSyncExternalStore(
    (cb) => { const mq = window.matchMedia(RM); mq.addEventListener("change", cb); return () => mq.removeEventListener("change", cb); },
    () => window.matchMedia(RM).matches,
    () => false,
  );
}

/** True once the element has scrolled into view (cards fade in, numbers count up). */
export function useSeen<T extends Element>() {
  const ref = useRef<T>(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => { if (e.isIntersecting) { setSeen(true); io.disconnect(); } }),
      { threshold: 0.2 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return [ref, seen] as const;
}

/** Shows the final number, and counts up from 0 when `run` turns true (unless reduced motion). */
export function CountUp({ to, run }: { to: number; run: boolean }) {
  const reduce = usePrefersReducedMotion();
  const [n, setN] = useState<number | null>(null);
  useEffect(() => {
    if (!run || reduce) return;
    let raf = 0;
    const t0 = performance.now();
    const f = (t: number) => {
      const p = Math.min(1, (t - t0) / 1100);
      setN(p < 1 ? Math.round(to * (1 - Math.pow(1 - p, 3))) : null);
      if (p < 1) raf = requestAnimationFrame(f);
    };
    raf = requestAnimationFrame(f);
    return () => cancelAnimationFrame(raf);
  }, [run, reduce, to]);
  return <>{fmt(n ?? to)}</>;
}

/* ---------- photo slot: real image if a path is set, dashed placeholder otherwise ---------- */
const GRADS = [
  ["rgba(204,232,255,.9)", "rgba(240,184,150,.75)"],
  ["rgba(240,184,150,.8)", "rgba(180,83,31,.3)"],
  ["rgba(204,232,255,.95)", "rgba(20,35,58,.22)"],
  ["rgba(255,226,204,.95)", "rgba(204,232,255,.85)"],
];
export function Slot({ src, alt, label, i, className = "" }: { src: string | null; alt: string; label: string; i: number; className?: string }) {
  if (src) {
    return (
      <div className={`slot has-img ${className}`.trim()}>
        <img src={src} alt={alt} loading="lazy" decoding="async" />
      </div>
    );
  }
  const g = GRADS[i % GRADS.length];
  return (
    <div className={`slot ${className}`.trim()} title={alt} style={{ background: `linear-gradient(160deg,${g[0]},${g[1]})` }}>
      <span className="slot-ic"><ImgIcon /></span>
      <span className="slot-l">{label}</span>
    </div>
  );
}

const avatarBg = (i: number) => `linear-gradient(135deg,hsl(${(i * 37 + 18) % 360} 55% 72%),hsl(${(i * 37 + 40) % 360} 45% 52%))`;

export function ListenLists({ stats, rangeId, n }: { stats: MusicStats; rangeId: string; n: number }) {
  const r = stats.ranges.find((x) => x.id === rangeId) ?? stats.ranges[0];
  return (
    <div className="cols">
      <div>
        <p className="lbl">Top artists</p>
        <ol className="rank">
          {r.artists.slice(0, n).map((a, i) => (
            <li key={a.name}>
              <span className="n">{i + 1}</span>
              {a.image ? (
                <img className="av" src={a.image} alt="" />
              ) : (
                <span className="av" style={{ background: avatarBg(i) }}>{a.name.replace(/^The /, "")[0]}</span>
              )}
              <span className="tx"><b>{a.name}</b></span>
            </li>
          ))}
        </ol>
      </div>
      <div>
        <p className="lbl">Top tracks</p>
        <ol className="rank">
          {r.tracks.slice(0, n).map((t, i) => (
            <li key={`${t.title}-${t.artist}`}>
              <span className="n">{i + 1}</span>
              <span className="av sq" style={{ background: avatarBg(i + 3) }}>&#9834;</span>
              <span className="tx"><b>{t.title}</b><i>{t.artist}</i></span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

export function RangeChips({ stats, value, onChange }: { stats: MusicStats; value: string; onChange: (id: string) => void }) {
  return (
    <div className="filters" role="group" aria-label="Time range">
      {stats.ranges.map((r) => (
        <button key={r.id} type="button" className="chip" aria-pressed={r.id === value} onClick={() => onChange(r.id)}>
          {r.label}
        </button>
      ))}
    </div>
  );
}

export const SampleTag = ({ show, text = "Sample data" }: { show: boolean; text?: string }) =>
  show ? <span className="sample">{text}</span> : null;

const MONTH_LETTERS = "JFMAMJJASOND".split("");
export function Bars({ vals, h, run }: { vals: number[]; h: number; run: boolean }) {
  const max = Math.max(1, ...vals);
  return (
    <div className={`bars ${run ? "on" : ""}`} style={{ "--h": `${h}px` } as CSSProperties} aria-hidden="true">
      {MONTH_LETTERS.map((m, i) => {
        const v = vals[i] || 0;
        return (
          <div className="bar" key={i}>
            <div className="col"><i style={{ height: `${v ? Math.max(5, (v / max) * 100) : 0}%` }} /></div>
            <u>{m}</u>
          </div>
        );
      })}
    </div>
  );
}

export function GuitarGrid({ items, big, compact }: { items: { name: string; type: string; photo: string | null }[]; big?: boolean; compact?: boolean }) {
  return (
    <div className={`guitars ${big ? "big" : ""} ${compact ? "compact" : ""}`.trim()}>
      {items.map((g, i) => (
        <figure className="tile" key={g.name}>
          <Slot src={g.photo} alt={g.name} label="Photo of me playing it" i={i} />
          <figcaption><b>{g.name}</b><span>{g.type}</span></figcaption>
        </figure>
      ))}
    </div>
  );
}

export function StageGrid({ items, big, compact }: { items: { name: string; photo: string | null }[]; big?: boolean; compact?: boolean }) {
  return (
    <div className={`stagepics ${big ? "big" : ""} ${compact ? "compact" : ""}`.trim()}>
      {items.map((s, i) => (
        <figure className="tile" key={s.name}>
          <Slot src={s.photo} alt={s.name} label="Photo goes here" i={i + 2} />
          <figcaption><b>{s.name}</b></figcaption>
        </figure>
      ))}
    </div>
  );
}

export function CameraGrid({ items }: { items: { name: string; type: string; photo: string | null }[] }) {
  return (
    <div className="cams">
      {items.map((c, i) => (
        <figure className="tile" key={c.name}>
          <Slot src={c.photo} alt={c.name} label="Me holding it" i={i + 1} />
          <figcaption><b>{c.name}</b><span>{c.type}</span></figcaption>
        </figure>
      ))}
    </div>
  );
}
