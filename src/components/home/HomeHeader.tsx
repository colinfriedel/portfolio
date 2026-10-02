import Image from "next/image";
import { images } from "@/content/site";
import { NameMark } from "../NameMark";
import { SocialLinks } from "../SocialLinks";

/** Name (top left) and photo with social buttons (top right). The homepage sections render below the name. */
export function HomeHeader({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-x-4 gap-y-6 md:gap-x-10">
      <h1 className="col-start-1 row-start-1 self-center md:self-start">
        <NameMark preload className="h-14 sm:h-20 md:h-24 lg:h-28" />
      </h1>

      <aside className="col-start-2 row-start-1 flex flex-col items-center gap-3 md:row-span-2">
        <Image
          src={images.portrait.src}
          alt={images.portrait.alt}
          width={images.portrait.width}
          height={images.portrait.height}
          preload
          sizes="(min-width: 1024px) 288px, (min-width: 768px) 224px, 128px"
          className="aspect-square w-28 rounded-full border-[3px] border-paper object-cover shadow-xl sm:w-36 md:w-56 lg:w-72"
        />
        <SocialLinks />
      </aside>

      <div className="col-span-2 row-start-2 space-y-6 md:col-span-1 md:col-start-1">{children}</div>
    </div>
  );
}
