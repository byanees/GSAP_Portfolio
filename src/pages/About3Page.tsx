import PageMeta from "@/seo/PageMeta";
import { ROUTE_META } from "@/seo/siteConfig";
import { breadcrumbSchema, graph, profilePageSchema } from "@/seo/schema";
import Section7 from "@/shared/sections/about-3/Section7";
import AboutCredentials from "@/shared/sections/dev/AboutCredentials";
import AboutExperience from "@/shared/sections/dev/AboutExperience";
import AboutHero from "@/shared/sections/dev/AboutHero";
import AboutStack from "@/shared/sections/dev/AboutStack";
import WorkWithMe from "@/shared/sections/dev/WorkWithMe";
import TechTicker from "@/shared/sections/services-2/Section2";

export default function About3Page() {
  return (
    <>
      <PageMeta
        title={ROUTE_META["/about"].title}
        description={ROUTE_META["/about"].description}
        path="/about"
        ogType="profile"
        jsonLd={graph(profilePageSchema(), breadcrumbSchema([{ name: "About", path: "/about" }]))}
      />
      <AboutHero />
      <TechTicker />
      <AboutExperience />
      <AboutStack />
      <AboutCredentials />
      <WorkWithMe />
      <Section7 />
    </>
  );
}
