"use client";

import { LightboxProvider, useLightbox, type LightboxItem } from "@/components/hobbies/Lightbox";

/** Photos on a project page: the first one full width, the rest in a grid. Click one to see it full screen. */
export function ProjectGallery({ photos }: { photos: { src: string; alt: string }[] }) {
  return (
    <LightboxProvider>
      <Photos photos={photos} />
    </LightboxProvider>
  );
}

function Photos({ photos }: { photos: { src: string; alt: string }[] }) {
  const openViewer = useLightbox();
  const items: LightboxItem[] = photos.map((p) => ({ src: p.src, alt: p.alt }));
  return (
    <div className={`pgal ${photos.length === 1 ? "one" : ""}`.trim()}>
      {photos.map((p, i) => (
        <button key={p.src} type="button" className="pgal-item" aria-label={`View larger: ${p.alt}`} onClick={() => openViewer(items, i)}>
          <img src={p.src} alt={p.alt} loading={i === 0 ? "eager" : "lazy"} decoding="async" />
        </button>
      ))}
    </div>
  );
}
