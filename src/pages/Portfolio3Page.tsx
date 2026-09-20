import PageMeta from "@/seo/PageMeta";
import { ROUTE_META } from "@/seo/siteConfig";
import { breadcrumbSchema, graph, portfolioListSchema } from "@/seo/schema";
import HomeCta from "@/shared/sections/dev/HomeCta";
import PortfolioIndex from "@/shared/sections/dev/PortfolioIndex";

export default function Portfolio3Page() {
  return (
    <>
      <PageMeta
        title={ROUTE_META["/portfolio"].title}
        description={ROUTE_META["/portfolio"].description}
        path="/portfolio"
        jsonLd={graph(portfolioListSchema(), breadcrumbSchema([{ name: "Work", path: "/portfolio" }]))}
      />
      <PortfolioIndex />
      <HomeCta />
    </>
  );
}
