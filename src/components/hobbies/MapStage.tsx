"use client";

import { useCallback, useEffect, useRef, useState, type PointerEvent as RPointerEvent } from "react";
import { geoDistance, geoGraticule10, geoOrthographic, geoPath, type GeoSphere } from "d3-geo";
import { TREE_POINTS, usePrefersReducedMotion } from "./parts";
import type { GeoUS, GeoWorld } from "./types";

type Tip = { x: number; y: number; name: string; sub: string } | null;
const FULL: [number, number, number, number] = [0, 0, 975, 610];

/** The map area: US map (SVG, with park pins) and globe (canvas) cross-fading in one box. */
export function MapStage({
  geoUS,
  view,
  parksOn,
  selected,
}: {
  geoUS: GeoUS;
  view: "us" | "world";
  parksOn: boolean;
  selected: number;
}) {
  const stageRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const reduce = usePrefersReducedMotion();
  const [tip, setTip] = useState<Tip>(null);
  const [prev, setPrev] = useState({ view, parksOn });
  if (prev.view !== view || prev.parksOn !== parksOn) { setPrev({ view, parksOn }); setTip(null); } // hide tooltip when the map changes

  const rel = useCallback((cx: number, cy: number) => {
    const r = stageRef.current!.getBoundingClientRect();
    return [cx - r.left, cy - r.top] as const;
  }, []);

  /* zoom to the West when parks are on so the Utah cluster is readable */
  const vbRef = useRef<number[]>([...FULL]);
  const first = useRef(true);
  useEffect(() => {
    if (first.current) { first.current = false; return; }
    const svg = svgRef.current;
    if (!svg) return;
    const to = parksOn ? geoUS.parkView : FULL;
    const set = (v: number[]) => { vbRef.current = v; svg.setAttribute("viewBox", v.map((n) => n.toFixed(1)).join(" ")); };
    if (reduce) { set([...to]); return; }
    const from = vbRef.current.slice(), t0 = performance.now();
    const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
    let raf = 0;
    const f = (t: number) => {
      const p = Math.min(1, (t - t0) / 900), e = ease(p);
      set(from.map((v, i) => v + (to[i] - v) * e));
      if (p < 1) raf = requestAnimationFrame(f);
    };
    raf = requestAnimationFrame(f);
    return () => cancelAnimationFrame(raf);
  }, [parksOn, geoUS.parkView, reduce]);

  const pinTip = (pin: Element) => {
    const dot = pin.querySelector(".dot");
    if (!dot) return;
    const r = dot.getBoundingClientRect();
    const [x, y] = rel(r.left + r.width / 2, r.top);
    setTip({ x, y: y - 4, name: pin.getAttribute("data-n") ?? "", sub: "National Park" });
  };

  return (
    <div className={`stage ${parksOn ? "show-parks" : ""}`.trim()} ref={stageRef} onPointerDown={(e) => { if (!(e.target as Element).closest(".pin")) setTip(null); }}>
      <div className={`view ${view === "us" ? "on" : ""}`}>
        <svg
          ref={svgRef}
          className="usmap"
          viewBox="0 0 975 610"
          role="img"
          aria-label="Map of the United States with visited states highlighted"
          onPointerMove={(e) => {
            const t = e.target as Element;
            if (t.closest(".pin")) return;
            const p = t.closest("path.st");
            if (!p) { setTip(null); return; }
            const [x, y] = rel(e.clientX, e.clientY);
            setTip({ x, y: y - 4, name: p.getAttribute("data-n") ?? "", sub: p.classList.contains("v") ? "Visited" : "Not yet" });
          }}
          onPointerLeave={() => setTip(null)}
          onPointerOver={(e) => { const pin = (e.target as Element).closest(".pin"); if (pin) pinTip(pin); }}
          onFocus={(e) => { const pin = (e.target as Element).closest(".pin"); if (pin) pinTip(pin); }}
          onBlur={() => setTip(null)}
        >
          <g className="states">
            {geoUS.states.map((s) => (
              <path key={s.n} className={`st${s.v ? " v" : ""}`} d={s.d} data-n={s.n} />
            ))}
          </g>
          <g className="pins">
            {geoUS.parks.map((p) => (
              <g key={p.n} className="pin" tabIndex={parksOn ? 0 : -1} role="button" aria-label={`${p.n} National Park`} data-n={p.n} transform={`translate(${p.x} ${p.y})`}>
                <circle className="hit" r={11} />
                <circle className="dot" r={7.6} />
                <polygon className="tree" points={TREE_POINTS} transform="translate(-5.4 -6.1) scale(.45)" />
              </g>
            ))}
          </g>
        </svg>
      </div>
      <Globe active={view === "world"} selected={selected} reduce={reduce} />
      <div className={`tip ${tip ? "on" : ""}`} style={tip ? { left: tip.x, top: tip.y } : undefined}>
        {tip?.name}
        <small>{tip?.sub}</small>
      </div>
    </div>
  );
}

/* ---------------------------- globe (canvas, d3 orthographic) ---------------------------- */
const SPHERE: GeoSphere = { type: "Sphere" };

function Globe({ active, selected, reduce }: { active: boolean; selected: number; reduce: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [world, setWorld] = useState<GeoWorld | null>(null);
  const [failed, setFailed] = useState(false);
  const started = useRef(false);
  const spin = useRef<[number, number]>([100, -25]);
  const anim = useRef<{ t0: number; from: [number, number]; to: [number, number]; ms: number } | null>(null);
  const drag = useRef<{ x: number; y: number; s: [number, number] } | null>(null);
  const idleUntil = useRef(0);
  const sel = useRef(-1);
  const redraw = useRef<(() => void) | null>(null);
  const scaleRef = useRef(1);

  /* the world shapes are ~400 KB, so they load the first time the globe is opened */
  useEffect(() => {
    if (!active || started.current) return;
    started.current = true;
    fetch("/data/hobbies-geo-world.json")
      .then((r) => { if (!r.ok) throw new Error(String(r.status)); return r.json() as Promise<GeoWorld>; })
      .then(setWorld)
      .catch(() => setFailed(true));
  }, [active]);

  /* chips rotate the globe to the chosen country */
  useEffect(() => {
    sel.current = selected;
    if (!world || selected < 0) return;
    const c = world.countries[selected].c;
    const to: [number, number] = [-c[0], -c[1]], from = spin.current.slice() as [number, number];
    const d = ((to[0] - from[0] + 540) % 360) - 180;
    anim.current = { t0: performance.now(), from, to: [from[0] + d, to[1]], ms: reduce ? 1 : 1000 };
    if (reduce) { spin.current = anim.current.to; anim.current = null; redraw.current?.(); }
  }, [selected, world, reduce]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!active || !world || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const w0 = world;
    const proj = geoOrthographic().clipAngle(90);
    const gpath = geoPath(proj, ctx);
    const grat = geoGraticule10();
    let w = 0, h = 0, dpr = 1, raf = 0, running = true;

    function draw() {
      if (w < 2) return;
      proj.rotate([spin.current[0], spin.current[1]]);
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx!.clearRect(0, 0, w, h);
      const r = proj.scale(), [cx, cy] = proj.translate();
      let g = ctx!.createRadialGradient(cx, cy, r * 0.96, cx, cy, r * 1.12);
      g.addColorStop(0, "rgba(240,184,150,.55)"); g.addColorStop(1, "rgba(240,184,150,0)");
      ctx!.fillStyle = g; ctx!.beginPath(); ctx!.arc(cx, cy, r * 1.12, 0, 6.2832); ctx!.fill();
      g = ctx!.createRadialGradient(cx - r * 0.35, cy - r * 0.4, r * 0.1, cx, cy, r);
      g.addColorStop(0, "#3a5782"); g.addColorStop(1, "#14233a");
      ctx!.beginPath(); gpath(SPHERE); ctx!.fillStyle = g; ctx!.fill();
      ctx!.beginPath(); gpath(grat); ctx!.strokeStyle = "rgba(255,248,240,.14)"; ctx!.lineWidth = 0.6; ctx!.stroke();
      ctx!.beginPath(); gpath(w0.land); ctx!.fillStyle = "rgba(255,248,240,.34)"; ctx!.fill();
      ctx!.beginPath(); gpath(w0.visited); ctx!.fillStyle = "#e0773a"; ctx!.fill(); ctx!.strokeStyle = "rgba(255,248,240,.75)"; ctx!.lineWidth = 0.6; ctx!.stroke();
      const s = sel.current;
      if (s > -1 && w0.visited.features[s]) {
        ctx!.beginPath(); gpath(w0.visited.features[s]); ctx!.fillStyle = "#ffd9b8"; ctx!.fill(); ctx!.strokeStyle = "#fff8f0"; ctx!.lineWidth = 1.6; ctx!.stroke();
      }
      w0.countries.forEach((k) => { // tiny countries (marker: true in content) get a dot so they are visible
        if (!k.dot || geoDistance([-spin.current[0], -spin.current[1]], k.dot) > 1.45) return;
        const p = proj(k.dot);
        if (!p) return;
        ctx!.beginPath(); ctx!.arc(p[0], p[1], 3.4, 0, 6.2832); ctx!.fillStyle = "#ffd9b8"; ctx!.fill(); ctx!.strokeStyle = "#fff8f0"; ctx!.lineWidth = 1.2; ctx!.stroke();
      });
    }
    function size() {
      const r = canvas!.parentElement!.getBoundingClientRect();
      w = r.width; h = r.height; dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas!.width = Math.round(w * dpr); canvas!.height = Math.round(h * dpr);
      proj.scale(Math.max(10, Math.min(w, h) / 2 - 8)).translate([w / 2, h / 2]);
      scaleRef.current = proj.scale();
      draw();
    }
    function loop(now: number) {
      if (!running) return;
      let dirty = false;
      const a = anim.current;
      if (a) {
        const p = Math.min(1, (now - a.t0) / a.ms), e = 1 - Math.pow(1 - p, 3);
        spin.current = [a.from[0] + (a.to[0] - a.from[0]) * e, a.from[1] + (a.to[1] - a.from[1]) * e];
        if (p >= 1) anim.current = null;
        dirty = true; idleUntil.current = now + 4500;
      } else if (!drag.current && !reduce && now > idleUntil.current) { // slow auto-spin until the user interacts
        spin.current = [spin.current[0] + 0.1, spin.current[1]]; dirty = true;
      }
      if (dirty) draw();
      raf = requestAnimationFrame(loop);
    }
    redraw.current = draw;
    size();
    raf = requestAnimationFrame(loop);
    const ro = new ResizeObserver(() => size());
    ro.observe(canvas.parentElement!);
    return () => { running = false; cancelAnimationFrame(raf); ro.disconnect(); redraw.current = null; };
  }, [active, world, reduce]);

  const onDown = (e: RPointerEvent<HTMLCanvasElement>) => {
    drag.current = { x: e.clientX, y: e.clientY, s: [...spin.current] };
    anim.current = null;
    e.currentTarget.setPointerCapture(e.pointerId);
    e.currentTarget.classList.add("grab");
  };
  const onMove = (e: RPointerEvent<HTMLCanvasElement>) => {
    const d = drag.current;
    if (!d) return;
    const k = 57.3 / scaleRef.current;
    spin.current = [d.s[0] + (e.clientX - d.x) * k, Math.max(-80, Math.min(80, d.s[1] - (e.clientY - d.y) * k))];
    redraw.current?.();
  };
  const onUp = (e: RPointerEvent<HTMLCanvasElement>) => {
    drag.current = null; idleUntil.current = performance.now() + 3500;
    e.currentTarget.classList.remove("grab");
  };

  return (
    <div className={`view ${active ? "on" : ""}`}>
      <canvas ref={canvasRef} className="globe" aria-label="Globe with visited countries highlighted" onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onUp} />
      <span className="mini">{failed ? "Could not load the globe." : !world ? "Loading globe…" : "Drag to spin"}</span>
    </div>
  );
}
