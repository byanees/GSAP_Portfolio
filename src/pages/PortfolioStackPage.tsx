import PageMeta from "@/seo/PageMeta";
import Slideshow from "@/shared/slideshow/Slideshow";
import { SLIDESHOW_PROJECTS } from "@/shared/slideshow/projects";

export default function PortfolioStackPage() {
  return (
    <>
      <PageMeta title="Muhammad Anees — Portfolio Stack" />
            <Slideshow variant="stack" projects={SLIDESHOW_PROJECTS} />
        
    </>
  );
}
