import { useEffect } from "react";
import { absoluteUrl, OG_IMAGE, SITE_NAME } from "./siteConfig";

type Props = {
  title: string;
  description?: string;
  /** Path this page should be indexed under, e.g. "/blog/some-slug". */
  path?: string;
  /** Absolute or root-relative image for the share card. */
  image?: string;
  /** "website" for pages, "article" for posts and case studies. */
  ogType?: "website" | "article" | "profile";
  favicon?: string;
  /** Keeps a page out of search results. For pages with no canonical address
   *  of their own, such as the 404. */
  noindex?: boolean;
  /** One or more JSON-LD graphs to emit for this page. */
  jsonLd?: object | object[];
  /** Article-only: ISO date, surfaced to crawlers as the publish time. */
  publishedTime?: string;
};

export default function PageMeta({
  title,
  description,
  path,
  image,
  ogType = "website",
  favicon,
  noindex,
  jsonLd,
  publishedTime,
}: Props) {
  // The favicon is a live swap on an existing tag rather than a rendered one,
  // because index.html ships a default that must be restored on unmount.
  useEffect(() => {
    if (!favicon) return;
    const link: HTMLLinkElement =
      document.querySelector('link[rel="shortcut icon"]') ??
      document.querySelector('link[rel="icon"]') ??
      (() => {
        const el = document.createElement("link");
        el.rel = "shortcut icon";
        document.head.appendChild(el);
        return el;
      })();
    const prev = link.href;
    link.type = "image/png";
    link.href = favicon;
    return () => {
      link.href = prev;
    };
  }, [favicon]);

  const canonical = path ? absoluteUrl(path) : undefined;
  const cardImage = absoluteUrl(image ?? OG_IMAGE);
  const graphs = jsonLd ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd]) : [];

  // React 19 hoists title, meta, and link into <head> on its own, on the client
  // and when rendered to a string, so these render inline and still land in the
  // right place. index.html carries no description or canonical of its own,
  // which keeps this from ever producing a duplicate tag.
  return (
    <>
      <title>{title}</title>
      {noindex ? (
        <meta name="robots" content="noindex, follow" />
      ) : (
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1" />
      )}
      {description ? <meta name="description" content={description} /> : null}
      {canonical ? <link rel="canonical" href={canonical} /> : null}

      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={title} />
      {description ? <meta property="og:description" content={description} /> : null}
      {canonical ? <meta property="og:url" content={canonical} /> : null}
      <meta property="og:image" content={cardImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:locale" content="en_US" />
      {publishedTime ? <meta property="article:published_time" content={publishedTime} /> : null}

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      {description ? <meta name="twitter:description" content={description} /> : null}
      <meta name="twitter:image" content={cardImage} />

      {graphs.map((g, i) => (
        <script
          key={i}
          type="application/ld+json"
          // Serialised here rather than as a child, which React would escape.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(g) }}
        />
      ))}
    </>
  );
}
