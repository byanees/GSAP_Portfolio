import PageMeta from "@/seo/PageMeta";
import { ROUTE_META } from "@/seo/siteConfig";
import { blogListSchema, breadcrumbSchema, graph } from "@/seo/schema";
import BlogCta from "@/shared/sections/dev/BlogCta";
import BlogIndex from "@/shared/sections/dev/BlogIndex";

export default function Archive4Page() {
  return (
    <>
      <PageMeta
        title={ROUTE_META["/blog"].title}
        description={ROUTE_META["/blog"].description}
        path="/blog"
        jsonLd={graph(blogListSchema(), breadcrumbSchema([{ name: "Notes", path: "/blog" }]))}
      />
      <BlogIndex />
      <BlogCta />
    </>
  );
}
