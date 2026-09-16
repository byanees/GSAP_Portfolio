import PageMeta from "@/seo/PageMeta";
import Section3 from "@/shared/sections/index-4/Section3";
import HomeCaseStudies from "@/shared/sections/dev/HomeCaseStudies";
import HomeCta from "@/shared/sections/dev/HomeCta";
import HomeHero from "@/shared/sections/dev/HomeHero";
import HomeWhatIDo from "@/shared/sections/dev/HomeWhatIDo";
import Recommendations from "@/shared/sections/dev/Recommendations";

export default function Home16Page() {
  return (
    <>
      <PageMeta title="Muhammad Anees — Full Stack Engineer" />
      <HomeHero />
      <HomeWhatIDo />
      <Section3 />
      <HomeCaseStudies />
      <Recommendations muted />
      <HomeCta />
    </>
  );
}
