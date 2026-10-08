import type { Metadata } from "next";
import { Panel } from "@/components/Panel";
import { HobbiesView } from "@/components/hobbies/HobbiesView";
import type { GeoUS, HobbiesContent, MusicStats, OutdoorsStats } from "@/components/hobbies/types";
import content from "@/content/hobbies/content.json";
import geoUS from "@/content/hobbies/geo-us.json";
import music from "@/content/hobbies/music-stats.json";
import outdoors from "@/content/hobbies/outdoors-stats.json";
import "./hobbies.css";

const c = content as unknown as HobbiesContent;

export const metadata: Metadata = { title: c.page.title };

/**
 * All text lives in src/content/hobbies/content.json, stats in music-stats.json / outdoors-stats.json,
 * and the map/globe shapes in geo-us.json + public/data/hobbies-geo-world.json (regenerate with `npm run build:geo`).
 */
export default function HobbiesPage() {
  return (
    <Panel
      label={c.page.title}
      pageClassName="hob-page"
      className="hob hob-panel"
      actions={
        <>
          <h2>{c.page.title}</h2>
          <p>{c.page.intro}</p>
        </>
      }
    >
      <HobbiesView
        data={{
          content: c,
          music: music as unknown as MusicStats,
          outdoors: outdoors as unknown as OutdoorsStats,
          geoUS: geoUS as unknown as GeoUS,
        }}
      />
    </Panel>
  );
}
