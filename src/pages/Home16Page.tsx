import PageMeta from "@/seo/PageMeta";
import { ROUTE_META } from "@/seo/siteConfig";
import { graph, homePageSchema } from "@/seo/schema";
import HomeCaseStudies from "@/shared/sections/dev/HomeCaseStudies";
import HomeCta from "@/shared/sections/dev/HomeCta";
import HomeHero from "@/shared/sections/dev/HomeHero";
import HomeWhatIDo from "@/shared/sections/dev/HomeWhatIDo";
import Recommendations from "@/shared/sections/dev/Recommendations";

export default function Home16Page() {
  return (
    <>
      <PageMeta
        title={ROUTE_META["/"].title}
        description={ROUTE_META["/"].description}
        path="/"
        jsonLd={graph(homePageSchema(ROUTE_META["/"].description))}
      />
      <HomeHero />
      <HomeWhatIDo />
      <HomeCaseStudies />
      <Recommendations muted />
      <HomeCta />
    </>
  );
}
