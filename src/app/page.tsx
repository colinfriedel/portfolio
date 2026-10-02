import { HomeHeader } from "@/components/home/HomeHeader";
import { HomeNav } from "@/components/home/HomeNav";
import { Intro } from "@/components/home/Intro";

/** Homepage sections, top to bottom. Add, remove, or reorder components here. */
const sections = [<Intro key="intro" />, <HomeNav key="nav" />];

export default function Home() {
  return (
    <main className="mx-auto min-h-svh max-w-6xl px-4 py-5 sm:px-6 md:px-10 md:py-10">
      <HomeHeader>
        {sections}
      </HomeHeader>
    </main>
  );
}
