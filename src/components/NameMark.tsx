import Image from "next/image";
import { images } from "@/content/site";

/** The handwritten name image. Height is set by the caller; width follows the image's aspect ratio. */
export function NameMark({ className, preload }: { className: string; preload?: boolean }) {
  return (
    <Image
      src={images.name.src}
      alt={images.name.alt}
      width={images.name.width}
      height={images.name.height}
      preload={preload}
      className={`w-auto max-w-full object-contain object-left ${className}`}
    />
  );
}
