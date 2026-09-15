import PageMeta from "@/seo/PageMeta";
import Slideshow from "@/shared/slideshow/Slideshow";
import { SLIDESHOW_PROJECTS } from "@/shared/slideshow/projects";

export default function PortfolioZstackPage() {
  return (
    <>
      <PageMeta title="Muhammad Anees — Portfolio Zstack" />
            <Slideshow variant="zstack" projects={SLIDESHOW_PROJECTS} />
        
    </>
  );
}
