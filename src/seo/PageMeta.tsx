import { useEffect } from "react";

type Props = {
  title: string;
  description?: string;
  favicon?: string;
  /** Keeps a page out of search results. For pages with no canonical address
   *  of their own, such as the 404. */
  noindex?: boolean;
};

export default function PageMeta({ title, description, favicon, noindex }: Props) {
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

  // index.html already carries a site-wide description, so rendering a second
  // one here would leave two in the head. Rewrite the existing tag instead,
  // and put the site-wide copy back when the page unmounts.
  useEffect(() => {
    if (!description) return;
    const meta = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    if (!meta) return;
    const prev = meta.content;
    meta.content = description;
    return () => {
      meta.content = prev;
    };
  }, [description]);

  return (
    <>
      <title>{title}</title>
      {noindex ? <meta name="robots" content="noindex, follow" /> : null}
    </>
  );
}
