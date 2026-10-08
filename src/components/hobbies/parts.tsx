"use client";

import { useEffect, useRef, useState, useSyncExternalStore, type CSSProperties, type ReactNode } from "react";
import { fmt, type HobbiesContent, type MusicStats } from "./types";

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
export function Slot({ src, alt, label, i, className = "", focus }: { src: string | null; alt: string; label: string; i: number; className?: string; focus?: string }) {
  if (src) {
    return (
      <div className={`slot has-img ${className}`.trim()}>
        <img src={src} alt={alt} loading="lazy" decoding="async" style={focus ? { objectPosition: focus } : undefined} />
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

/** Artist photo or album cover from Spotify. With no image the row has none (an empty slot keeps alignment). */
const Thumb = ({ src, square, show }: { src?: string; square?: boolean; show: boolean }) =>
  !show ? null : src ? (
    <img className={`av${square ? " sq" : ""}`} src={src} alt="" width={28} height={28} loading="lazy" referrerPolicy="no-referrer" />
  ) : (
    <span className={`av empty${square ? " sq" : ""}`} />
  );

/** Spotify asks that its artwork and metadata link back to Spotify. */
const Name = ({ url, children }: { url?: string; children: ReactNode }) =>
  url ? <a href={url} target="_blank" rel="noopener noreferrer">{children}</a> : <>{children}</>;

export function ListenLists({ stats, rangeId, n }: { stats: MusicStats; rangeId: string; n: number }) {
  const r = stats.ranges.find((x) => x.id === rangeId) ?? stats.ranges[0];
  const artists = r.artists.slice(0, n);
  const tracks = r.tracks.slice(0, n);
  const artistPics = artists.some((a) => a.image);
  const trackPics = tracks.some((t) => t.image);
  return (
    <div className="cols">
      <div>
        <p className="lbl">Top artists</p>
        <ol className="rank">
          {artists.map((a, i) => (
            <li key={a.name}>
              <span className="n">{i + 1}</span>
              <Thumb src={a.image} show={artistPics} />
              <span className="tx"><b><Name url={a.url}>{a.name}</Name></b></span>
            </li>
          ))}
        </ol>
      </div>
      <div>
        <p className="lbl">Top tracks</p>
        <ol className="rank">
          {tracks.map((t, i) => (
            <li key={`${t.title}-${t.artist}`}>
              <span className="n">{i + 1}</span>
              <Thumb src={t.image} square show={trackPics} />
              <span className="tx"><b><Name url={t.url}>{t.title}</Name></b><i>{t.artist}</i></span>
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

/** "Sample data" until the stats are real, then a small "via Spotify" credit. */
export const SourceTag = ({ stats }: { stats: MusicStats }) =>
  stats.sample ? <SampleTag show /> : stats.source === "spotify" ? <span className="sample">via Spotify</span> : null;

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

export function PerformanceGrid({ items, big }: { items: HobbiesContent["music"]["performances"]; big?: boolean }) {
  return (
    <div className={`perf ${big ? "big" : ""}`.trim()}>
      {items.map((p) => (
        <img key={p.src} src={p.src} alt={p.alt} loading="lazy" decoding="async" style={big ? undefined : { objectPosition: p.focus }} />
      ))}
    </div>
  );
}

export function Recording({ rec, big }: { rec: HobbiesContent["music"]["recording"]; big?: boolean }) {
  if (!rec.title) return <Slot src={null} alt="Recording project" label="Recording project goes here" i={1} className="rec-slot" />;
  return (
    <div className={`rec ${big ? "big" : ""}`.trim()}>
      {rec.cover && <img className="rec-cover" src={rec.cover} alt="" loading="lazy" />}
      <div className="rec-tx">
        <b>{rec.title}</b>
        {rec.note && <span>{rec.note}</span>}
        {rec.link && (
          <a className="chip sm" href={rec.link} target="_blank" rel="noopener noreferrer">
            {rec.linkLabel ?? "Listen"} &rarr;
          </a>
        )}
      </div>
    </div>
  );
}

export function CameraGrid({ items }: { items: HobbiesContent["photography"]["cameras"] }) {
  return (
    <div className="cams">
      {items.map((c, i) => (
        <figure className="tile" key={c.name}>
          <Slot src={c.photo} alt={c.photo ? `Holding the ${c.name}` : c.name} label="Me holding it" i={i + 1} focus={c.focus} />
          <figcaption><b>{c.name}</b><span>{c.type}</span></figcaption>
        </figure>
      ))}
    </div>
  );
}
