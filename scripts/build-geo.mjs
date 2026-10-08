// Regenerates the map + globe shape files from src/content/hobbies/content.json.
// Run from the repo root after editing outdoors.states / parks / countries:
//
//   npm run build:geo
//
// Writes src/content/hobbies/geo-us.json (bundled with the page) and
// public/data/hobbies-geo-world.json (loaded the first time someone opens the globe).
import fs from 'fs';
import { geoPath, geoAlbersUsa, geoCentroid } from 'd3-geo';
import { feature } from 'topojson-client';

const read = (p) => JSON.parse(fs.readFileSync(p, 'utf8'));
const content = read('src/content/hobbies/content.json').outdoors;
const round = (c) => (typeof c[0] === 'number' ? c.map((v) => +v.toFixed(2)) : c.map(round));

/* ---- US: pre-projected (Albers USA, Alaska and Hawaii as insets), viewBox 0 0 975 610 ---- */
const us = read('node_modules/us-atlas/states-albers-10m.json');
const path = geoPath().digits(1);
const all = feature(us, us.objects.states).features.map((f) => ({ n: f.properties.name, d: path(f) }));
const bad = content.states.filter((s) => !all.find((x) => x.n === s));
if (bad.length) throw new Error('Unknown state name(s) in src/content/hobbies/content.json: ' + bad.join(', '));
const states = all.map((s) => ({ ...s, v: content.states.includes(s.n) }));

const proj = geoAlbersUsa().scale(1300).translate([487.5, 305]); // same projection us-atlas uses
const parks = content.parks.map((p) => {
  const xy = proj([p.lon, p.lat]);
  if (!xy) throw new Error('Park is outside the map area: ' + p.name);
  return { n: p.name, x: +xy[0].toFixed(1), y: +xy[1].toFixed(1) };
});
// zoomed viewBox framing all parks, at the stage aspect ratio 975:610
let minX = Math.min(...parks.map((p) => p.x)) - 45, maxX = Math.max(...parks.map((p) => p.x)) + 45;
let minY = Math.min(...parks.map((p) => p.y)) - 40, maxY = Math.max(...parks.map((p) => p.y)) + 40;
const aspect = 975 / 610; let w = maxX - minX, h = maxY - minY;
if (w / h > aspect) { const nh = w / aspect; minY -= (nh - h) / 2; h = nh; } else { const nw = h * aspect; minX -= (nw - w) / 2; w = nw; }
if (minX < -10) minX = -10;
const parkView = [minX, minY, w, h].map((v) => +v.toFixed(1));
fs.writeFileSync('src/content/hobbies/geo-us.json', JSON.stringify({ states, parks, parkView }));

/* ---- World: simple land for context + detailed shapes for the visited countries ---- */
const w110 = read('node_modules/world-atlas/countries-110m.json');
const landF = feature(w110, w110.objects.land);
const land = landF.type === 'FeatureCollection' ? landF.features[0] : landF;
land.geometry.coordinates = round(land.geometry.coordinates);
const w50 = read('node_modules/world-atlas/countries-50m.json');
const all50 = feature(w50, w50.objects.countries).features;
const visited = { type: 'FeatureCollection', features: [] }, countries = [];
for (const c of content.countries) {
  const f = all50.find((x) => x.properties.name === c.geoName);
  if (!f) throw new Error(`Country "${c.geoName}" not found. Natural Earth names include: ` + all50.map((x) => x.properties.name).filter((n) => n[0] === c.geoName[0]).join(', '));
  f.geometry.coordinates = round(f.geometry.coordinates);
  visited.features.push({ type: 'Feature', properties: { name: c.name }, geometry: f.geometry });
  const ctr = c.focus || geoCentroid(f);
  countries.push({ n: c.name, c: [+ctr[0].toFixed(2), +ctr[1].toFixed(2)], dot: c.marker ? [+ctr[0].toFixed(2), +ctr[1].toFixed(2)] : null });
}
fs.writeFileSync('public/data/hobbies-geo-world.json', JSON.stringify({ land, visited, countries }));
console.log(`states ${states.filter((s) => s.v).length}/${states.length} visited, ${parks.length} parks, ${countries.length} countries`);
