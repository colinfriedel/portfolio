"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { MapStage } from "./MapStage";
import { Bars, CameraGrid, CountUp, ExpandIcon, GuitarGrid, ListenLists, RangeChips, SampleTag, Slot, SourceTag, StageGrid, TreeIcon, useSeen } from "./parts";
import { type HobbiesData } from "./types";

type ModalKind = "music" | "outdoors" | "photo";
const KINDS: ModalKind[] = ["music", "outdoors", "photo"];

export function HobbiesView({ data }: { data: HobbiesData }) {
  /* deep links: /hobbies#music, #outdoors, #photo */
  const [open, setOpen] = useState<{ kind: ModalKind; cat?: string } | null>(() => {
    if (typeof window === "undefined") return null;
    const h = window.location.hash.slice(1) as ModalKind;
    return KINDS.includes(h) ? { kind: h } : null;
  });
  const lastFocus = useRef<HTMLElement | null>(null);

  const openModal = useCallback((kind: ModalKind, cat?: string) => {
    lastFocus.current = document.activeElement as HTMLElement | null;
    setOpen({ kind, cat });
    try { history.replaceState(null, "", `#${kind}`); } catch { /* ignore */ }
  }, []);
  const closeModal = useCallback(() => {
    setOpen(null);
    try { history.replaceState(null, "", location.pathname + location.search); } catch { /* ignore */ }
    lastFocus.current?.focus();
  }, []);

  return (
    <>
      <div className="grid">
        <MusicCard data={data} onOpen={() => openModal("music")} />
        <OutdoorsCard data={data} onOpen={() => openModal("outdoors")} />
        <PhotoCard data={data} onOpen={openModal} />
      </div>
      <Modal open={open} onClose={closeModal} data={data} />
    </>
  );
}

/* ---------------------------------- card shell ---------------------------------- */
function Card({ cls, id, kicker, title, expandLabel, onOpen, children }: {
  cls: string; id: string; kicker: string; title: ReactNode; expandLabel: string; onOpen: () => void; children: (seen: boolean) => ReactNode;
}) {
  const [ref, seen] = useSeen<HTMLElement>();
  return (
    <section ref={ref} className={`card ${cls} ${seen ? "in" : ""}`.trim()} aria-labelledby={id}>
      <div className="chead">
        <div><span className="kind">{kicker}</span><h3 className="t" id={id}>{title}</h3></div>
        <button type="button" className="xbtn" aria-label={expandLabel} onClick={onOpen}><ExpandIcon /></button>
      </div>
      {children(seen)}
    </section>
  );
}

/* ---------------------------------- music ---------------------------------- */
function MusicCard({ data, onOpen }: { data: HobbiesData; onOpen: () => void }) {
  const { content: C, music: M } = data;
  const [tab, setTab] = useState<"listen" | "play">("play");
  const [range, setRange] = useState(M.ranges[0].id);
  return (
    <Card cls="c-music" id="h-music" kicker={C.music.kicker} title="Music" expandLabel="Expand Music" onOpen={onOpen}>
      {() => (
        <div className="music-body">
          <div className="filters tabs" role="tablist" aria-label="Music view">
            <button type="button" className="chip" role="tab" aria-selected={tab === "play"} onClick={() => setTab("play")}>Playing</button>
            <button type="button" className="chip" role="tab" aria-selected={tab === "listen"} onClick={() => setTab("listen")}>Listening</button>
          </div>
          <div className="pane" hidden={tab !== "listen"}>
            <div className="rangebar"><RangeChips stats={M} value={range} onChange={setRange} /><SourceTag stats={M} /></div>
            <ListenLists stats={M} rangeId={range} n={5} />
          </div>
          <div className="pane" hidden={tab !== "play"}>
            <p className="lbl">Guitars</p>
            <GuitarGrid items={C.music.guitars} compact />
            <p className="lbl">On stage</p>
            <StageGrid items={C.music.stage} compact />
          </div>
        </div>
      )}
    </Card>
  );
}

/* ---------------------------------- outdoors & travel ---------------------------------- */
function OutdoorsCard({ data, onOpen }: { data: HobbiesData; onOpen: () => void }) {
  const { content: C, outdoors: O, geoUS } = data;
  const o = C.outdoors;
  const [view, setView] = useState<"us" | "world">("us");
  const [parksOn, setParksOn] = useState(false);
  const [selected, setSelected] = useState(-1);
  const cap = (t: string) => <>{t}{O.sample && <> <em>(sample)</em></>}</>;
  return (
    <Card
      cls="c-ot" id="h-ot" kicker={`${o.states.length} states · ${o.parks.length} national parks · ${o.countries.length} countries`}
      title={<>Outdoors &amp; Travel</>} expandLabel="Expand Outdoors and Travel" onOpen={onOpen}
    >
      {(seen) => (
        <div className="ot-body">
          <div className="ot-layout">
            <div className="ot-side">
              <div className="stat">
                <div className="big"><CountUp to={O.milesThisYear} run={seen} /></div>
                <div className="cap">{cap(`mi hiked in ${O.year}`)}</div>
                <Bars vals={O.milesByMonth} h={26} run={seen} />
              </div>
              <div className="stat">
                <div className="big"><CountUp to={O.milesAllTime} run={seen} /></div>
                <div className="cap">{cap("mi hiked all time")}</div>
              </div>
              <div className="filters tabs" role="tablist" aria-label="Map view">
                <button type="button" className="chip" role="tab" aria-selected={view === "us"} onClick={() => setView("us")}>US</button>
                <button type="button" className="chip" role="tab" aria-selected={view === "world"} onClick={() => setView("world")}>World</button>
              </div>
              <div className="below" hidden={view === "world"}>
                <button type="button" className="chip tog" aria-pressed={parksOn} aria-label={`${parksOn ? "Hide" : "Show"} national parks on the map`} onClick={() => setParksOn((v) => !v)}>
                  <span className="ic"><TreeIcon /></span><span>National parks</span>
                </button>
                <span className="count"><b>{o.states.length}</b> of 50 states &middot; <b>{o.parks.length}</b> parks</span>
                <span className="legend"><i className="sw v" />Visited <i className="sw" />Not yet</span>
              </div>
              <div className="below below-world" hidden={view === "us"}>
                <div className="chips">
                  {o.countries.map((c, i) => (
                    <button key={c.name} type="button" className="chip sm" aria-pressed={selected === i} onClick={() => setSelected(i)}>{c.name}</button>
                  ))}
                </div>
              </div>
            </div>
            <MapStage geoUS={geoUS} view={view} parksOn={parksOn} selected={selected} />
          </div>
        </div>
      )}
    </Card>
  );
}

/* ---------------------------------- photography ---------------------------------- */
function PhotoCard({ data, onOpen }: { data: HobbiesData; onOpen: (k: ModalKind, cat?: string) => void }) {
  const P = data.content.photography;
  const favs = P.photos.filter((p) => p.favorite).slice(0, 6);
  return (
    <Card cls="c-photo" id="h-photo" kicker={P.kicker} title="Photography" expandLabel="Expand Photography" onOpen={() => onOpen("photo")}>
      {() => (
        <div className="photo-body">
          <div>
            <p className="lbl">Favorites</p>
            <div className="fav">
              {favs.map((p, i) => (
                <figure className="tile" key={p.title}><Slot src={p.src} alt={p.title} label={p.title} i={i} /></figure>
              ))}
            </div>
          </div>
          <div><p className="lbl">Cameras</p><CameraGrid items={P.cameras} /></div>
          <div className="cats">
            <p className="lbl">Explore by category</p>
            <div className="chips">
              {P.categories.map((c) => (
                <button key={c} type="button" className="chip sm" onClick={() => onOpen("photo", c)}>{c}</button>
              ))}
            </div>
            <button type="button" className="dl" onClick={() => onOpen("photo", "All")}>All photos &rarr;</button>
          </div>
        </div>
      )}
    </Card>
  );
}

/* ---------------------------------- expanded views ---------------------------------- */
function Modal({ open, onClose, data }: { open: { kind: ModalKind; cat?: string } | null; onClose: () => void; data: HobbiesData }) {
  const mounted = useSyncExternalStore(() => () => {}, () => true, () => false); // portal needs document.body
  const [shown, setShown] = useState<{ kind: ModalKind; cat?: string } | null>(open); // keeps content while fading out
  if (open && open !== shown) setShown(open);
  const closeRef = useRef<HTMLButtonElement>(null);
  const modalRef = useRef<HTMLElement>(null);

  useEffect(() => {
    document.body.classList.toggle("hob-lock", !!open);
    if (!open) return;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { onClose(); return; }
      if (e.key !== "Tab" || !modalRef.current) return;
      const f = modalRef.current.querySelectorAll<HTMLElement>("button,a[href],[tabindex]:not([tabindex='-1'])");
      if (!f.length) return;
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("keydown", onKey); document.body.classList.remove("hob-lock"); };
  }, [open, onClose]);

  if (!mounted) return null;
  const C = data.content;
  const title = shown?.kind === "music" ? "Music" : shown?.kind === "outdoors" ? "Outdoors & Travel" : shown?.kind === "photo" ? "Photography" : "";
  const blurb = shown?.kind === "music" ? C.music.blurb : shown?.kind === "outdoors" ? C.outdoors.blurb : shown?.kind === "photo" ? C.photography.blurb : "";
  return createPortal(
    <div className="hob">
      <div className={`scrim ${open ? "on" : ""}`} onClick={onClose} />
      <section ref={modalRef} className={`modal ${open ? "on" : ""}`} role="dialog" aria-modal="true" aria-labelledby="hob-m-title" aria-hidden={!open}>
        <header>
          <div><h2 id="hob-m-title">{title}</h2><p className="blurb">{blurb}</p></div>
          <button ref={closeRef} type="button" className="back" onClick={onClose}>Close</button>
        </header>
        <div className="mbody" key={shown ? `${shown.kind}-${shown.cat ?? ""}` : "none"}>
          {shown?.kind === "music" && <MusicModal data={data} />}
          {shown?.kind === "outdoors" && <OutdoorsModal data={data} run={!!open} />}
          {shown?.kind === "photo" && <PhotoModal data={data} initialCat={shown.cat ?? "All"} />}
        </div>
      </section>
    </div>,
    document.body,
  );
}

function MusicModal({ data }: { data: HobbiesData }) {
  const { content: C, music: M } = data;
  const [range, setRange] = useState(M.ranges[0].id);
  return (
    <>
      <h3 className="sec">Guitars</h3>
      <GuitarGrid items={C.music.guitars} big />
      <h3 className="sec">On stage</h3>
      <StageGrid items={C.music.stage} big />
      <h3 className="sec">Listening</h3>
      <div className="rangebar"><RangeChips stats={M} value={range} onChange={setRange} /><SourceTag stats={M} /></div>
      <ListenLists stats={M} rangeId={range} n={10} />
    </>
  );
}

function OutdoorsModal({ data, run }: { data: HobbiesData; run: boolean }) {
  const { content: { outdoors: o }, outdoors: O } = data;
  const [grown, setGrown] = useState(false);
  useEffect(() => { const r = requestAnimationFrame(() => setGrown(true)); return () => cancelAnimationFrame(r); }, []);
  const stat = (n: number, label: string) => (
    <div className="stat"><div className="big"><CountUp to={n} run={run} /></div><div className="cap">{label}</div></div>
  );
  return (
    <>
      <div className="tiles5">
        {stat(O.milesThisYear, "mi this year")}{stat(O.milesAllTime, "mi all time")}{stat(o.states.length, "states")}{stat(o.parks.length, "national parks")}{stat(o.countries.length, "countries")}
      </div>
      <h3 className="sec">Miles by month <SampleTag show={O.sample} text="Sample numbers" /></h3>
      <Bars vals={O.milesByMonth} h={120} run={grown} />
      <h3 className="sec">States ({o.states.length})</h3>
      <div className="chips">{o.states.slice().sort().map((s) => <span className="tagc" key={s}>{s}</span>)}</div>
      <h3 className="sec">National parks ({o.parks.length})</h3>
      <div className="chips">{o.parks.map((p) => <span className="tagc" key={p.name}><span className="ic"><TreeIcon /></span>{p.name}</span>)}</div>
      <h3 className="sec">Countries ({o.countries.length})</h3>
      <div className="chips">{o.countries.map((c) => <span className="tagc" key={c.name}>{c.name}</span>)}</div>
    </>
  );
}

function PhotoModal({ data, initialCat }: { data: HobbiesData; initialCat: string }) {
  const P = data.content.photography;
  const [cat, setCat] = useState(initialCat);
  return (
    <>
      <div className="filters" role="group" aria-label="Category">
        {["All", ...P.categories].map((c) => (
          <button key={c} type="button" className="chip" aria-pressed={c === cat} onClick={() => setCat(c)}>{c}</button>
        ))}
      </div>
      <div className="gallery">
        {P.photos.map((p, i) => (
          <figure className="tile pop" key={p.title} hidden={cat !== "All" && p.category !== cat}>
            <Slot src={p.src} alt={p.title} label={p.title} i={i} />
            <figcaption><b>{p.title}</b><span>{p.category}</span></figcaption>
          </figure>
        ))}
      </div>
      <h3 className="sec">Cameras</h3>
      <CameraGrid items={P.cameras} />
    </>
  );
}


