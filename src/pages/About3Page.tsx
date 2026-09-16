import PageMeta from "@/seo/PageMeta";
import Section4 from "@/shared/sections/about-3/Section4";
import Section7 from "@/shared/sections/about-3/Section7";
import AboutExperience from "@/shared/sections/dev/AboutExperience";
import AboutHero from "@/shared/sections/dev/AboutHero";
import AboutStack from "@/shared/sections/dev/AboutStack";
import WorkWithMe from "@/shared/sections/dev/WorkWithMe";
import TechTicker from "@/shared/sections/services-2/Section2";

export default function About3Page() {
  return (
    <>
      <PageMeta title="Muhammad Anees — About" />
      <AboutHero />
      <TechTicker />
      <Section4 />
      <AboutExperience />
      <AboutStack />
      <WorkWithMe />
      <Section7 />
    </>
  );
}
