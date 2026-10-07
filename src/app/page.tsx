import Link from "next/link";
import { FitBackground } from "@/components/FitBackground";
import { LegacyHashRedirect } from "@/components/LegacyHashRedirect";
import { SocialIcon } from "@/components/icons";
import { images, navItems, site, socialLinks } from "@/content/site";

export default function Home() {
  const { nameFirst, nameLast, portrait } = images;
  return (
    <div className="top">
      <header>
        <div className="id">
          <div className="who">
            <div className="namerow">
              <Link className="name" href="/" aria-label={site.name}>
                <img src={nameFirst.src} width={nameFirst.width} height={nameFirst.height} alt={nameFirst.alt} />
                <img src={nameLast.src} width={nameLast.width} height={nameLast.height} alt={nameLast.alt} />
              </Link>
            </div>
          </div>
          <p>{site.intro}</p>
          <nav aria-label="Main">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href}>
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="side">
          <img className="portrait" alt={portrait.alt} src={portrait.src} />
          <span className="social">
            {socialLinks.map((link) => (
              <a key={link.href} href={link.href} target="_blank" rel="noopener" aria-label={`Colin on ${link.label}`}>
                <SocialIcon icon={link.icon} />
              </a>
            ))}
          </span>
        </div>
      </header>
      <FitBackground />
      <LegacyHashRedirect />
    </div>
  );
}
