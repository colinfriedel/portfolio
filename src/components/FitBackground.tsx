"use client";

import { useEffect } from "react";

/**
 * On phones, slides the background photo down just enough that the intro text
 * sits fully above the ridgeline. Ported from the original site's script.
 * Rendered on the homepage only; other pages keep the photo unshifted.
 */
export function FitBackground() {
  useEffect(() => {
    const bg = document.querySelector<HTMLElement>(".bg");
    const p = document.querySelector<HTMLElement>(".id p");
    if (!bg || !p) return;

    const mq = window.matchMedia("(max-aspect-ratio:4/5), (max-width:700px)");
    const RIDGE = 0.43, AR = 0.5625, GAP = 18;
    const ridgeAt = (s: number, W: number, H: number) => {
      const area = H - s, h = Math.max(area, W / AR);
      return s + (area - h) / 2 + RIDGE * h;
    };
    const fit = () => {
      let s = 0;
      if (mq.matches) {
        const W = window.innerWidth, H = window.innerHeight;
        const target = p.getBoundingClientRect().bottom + window.pageYOffset + GAP;
        if (ridgeAt(0, W, H) < target) {
          let lo = 0, hi = H * 0.45;
          for (let i = 0; i < 24; i++) {
            const mid = (lo + hi) / 2;
            if (ridgeAt(mid, W, H) >= target) hi = mid;
            else lo = mid;
          }
          s = hi;
        }
      }
      bg.style.setProperty("--shift", Math.round(s) + "px");
    };

    fit();
    window.addEventListener("resize", fit);
    window.addEventListener("orientationchange", fit);
    window.addEventListener("load", fit);
    document.fonts?.ready.then(fit);
    return () => {
      window.removeEventListener("resize", fit);
      window.removeEventListener("orientationchange", fit);
      window.removeEventListener("load", fit);
      bg.style.setProperty("--shift", "0px");
    };
  }, []);

  return null;
}
