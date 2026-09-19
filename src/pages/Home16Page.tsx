import PageMeta from "@/seo/PageMeta";
import HomeCaseStudies from "@/shared/sections/dev/HomeCaseStudies";
import HomeCta from "@/shared/sections/dev/HomeCta";
import HomeHero from "@/shared/sections/dev/HomeHero";
import HomeWhatIDo from "@/shared/sections/dev/HomeWhatIDo";
import Recommendations from "@/shared/sections/dev/Recommendations";

export default function Home16Page() {
  return (
    <>
      <PageMeta title="Muhammad Anees - Full Stack Engineer" />
      <HomeHero />
      <HomeWhatIDo />
      <HomeCaseStudies />
      <Recommendations muted />
      <HomeCta />
    </>
  );
}
