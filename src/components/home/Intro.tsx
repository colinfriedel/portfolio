import { site } from "@/content/site";

export function Intro() {
  return (
    <p className="glass max-w-[34rem] rounded-2xl p-4 text-lg leading-relaxed text-ink md:p-5 md:text-xl">
      {site.intro}
    </p>
  );
}
