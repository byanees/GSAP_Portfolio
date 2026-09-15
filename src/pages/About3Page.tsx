import PageMeta from "@/seo/PageMeta";
import Section4 from "@/shared/sections/about-3/Section4";
import Section7 from "@/shared/sections/about-3/Section7";
import AboutExperience from "@/shared/sections/dev/AboutExperience";
import AboutHero from "@/shared/sections/dev/AboutHero";
import AboutNow from "@/shared/sections/dev/AboutNow";
import AboutStack from "@/shared/sections/dev/AboutStack";

export default function About3Page() {
  return (
    <>
      <PageMeta title="Muhammad Anees — About" />
      <AboutHero />
      <Section4 />
      <AboutExperience />
      <AboutStack />
      <AboutNow />
      <Section7 />
    </>
  );
}
