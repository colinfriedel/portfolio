import { images } from "@/content/site";

/** Pinned background photo. Images and positioning are in site.css (.bg). */
export function Background() {
  return <div className="bg" role="img" aria-label={images.backgroundAlt} />;
}
