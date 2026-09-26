import { useEffect } from "react";
import { absoluteUrl, OG_IMAGE, SITE_NAME } from "./siteConfig";

/** Every route shares the one card, so it shares one description of it. */
const IMAGE_ALT = `${SITE_NAME}, full stack engineer`;

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
  /** Article-only: ISO date of the last material revision. */
  modifiedTime?: string;
  /** Article-only: the post's category and tags. */
  section?: string;
  tags?: string[];
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
  modifiedTime,
  section,
  tags,
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
      <meta name="author" content={SITE_NAME} />
      {canonical ? <link rel="canonical" href={canonical} /> : null}

      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={title} />
      {description ? <meta property="og:description" content={description} /> : null}
      {canonical ? <meta property="og:url" content={canonical} /> : null}
      <meta property="og:image" content={cardImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={IMAGE_ALT} />
      <meta property="og:locale" content="en_US" />
      {ogType === "article" ? (
        <>
          <meta property="article:author" content={absoluteUrl("/about")} />
          {publishedTime ? <meta property="article:published_time" content={publishedTime} /> : null}
          {modifiedTime ? <meta property="article:modified_time" content={modifiedTime} /> : null}
          {section ? <meta property="article:section" content={section} /> : null}
          {tags?.map((t) => <meta key={t} property="article:tag" content={t} />)}
        </>
      ) : null}

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      {description ? <meta name="twitter:description" content={description} /> : null}
      <meta name="twitter:image" content={cardImage} />
      <meta name="twitter:image:alt" content={IMAGE_ALT} />

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
