import Image from "next/image";
import { images } from "@/content/site";

/**
 * Full-bleed photo pinned behind every page. Uses a fixed layer instead of
 * background-attachment: fixed, which iOS Safari ignores.
 */
export function Background() {
  return (
    <div aria-hidden="true" className="fixed inset-0 -z-10 bg-ink">
      <Image
        src={images.hero.src}
        alt=""
        fill
        preload
        sizes="100vw"
        className="object-cover object-[50%_30%]"
      />
      {/* Light scrim at the top for the name/intro, darker toward the bottom. */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-black/30" />
    </div>
  );
}
