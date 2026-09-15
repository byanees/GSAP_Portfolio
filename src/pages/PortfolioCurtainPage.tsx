import PageMeta from "@/seo/PageMeta";
import Slideshow from "@/shared/slideshow/Slideshow";
import { SLIDESHOW_PROJECTS } from "@/shared/slideshow/projects";

export default function PortfolioCurtainPage() {
  return (
    <>
      <PageMeta title="Muhammad Anees — Portfolio Curtain" />
            <Slideshow variant="curtain" projects={SLIDESHOW_PROJECTS} />
        
    </>
  );
}
