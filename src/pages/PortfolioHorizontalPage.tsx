import PageMeta from "@/seo/PageMeta";
import Slideshow from "@/shared/slideshow/Slideshow";
import { SLIDESHOW_PROJECTS } from "@/shared/slideshow/projects";

export default function PortfolioHorizontalPage() {
  return (
    <>
      <PageMeta title="Muhammad Anees — Portfolio Horizontal" />
            <Slideshow variant="horizontal" projects={SLIDESHOW_PROJECTS} />
        
    </>
  );
}
