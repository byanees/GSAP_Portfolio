import PageMeta from "@/seo/PageMeta";
import { ROUTE_META } from "@/seo/siteConfig";
import { blogListSchema, breadcrumbSchema, graph } from "@/seo/schema";
import { crumbFor } from "@/data/navigation";
import BlogCta from "@/shared/sections/dev/BlogCta";
import BlogIndex from "@/shared/sections/dev/BlogIndex";

export default function Archive4Page() {
  return (
    <>
      <PageMeta
        title={ROUTE_META["/blog"].title}
        description={ROUTE_META["/blog"].description}
        path="/blog"
        jsonLd={graph(blogListSchema(), breadcrumbSchema([{ name: crumbFor("/blog"), path: "/blog" }]))}
      />
      <BlogIndex />
      <BlogCta />
    </>
  );
}
