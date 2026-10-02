import { socialLinks } from "@/content/site";
import { SocialIcon } from "./icons";

export function SocialLinks({ size = "md" }: { size?: "sm" | "md" }) {
  const box = size === "sm" ? "size-10" : "size-11 md:size-12";
  return (
    <ul className="flex gap-3">
      {socialLinks.map((link) => (
        <li key={link.href}>
          <a
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${link.label} (opens in a new tab)`}
            title={link.label}
            className={`${box} glass grid place-items-center rounded-full text-ink transition hover:bg-paper`}
          >
            <SocialIcon icon={link.icon} className="size-1/2" />
          </a>
        </li>
      ))}
    </ul>
  );
}
