import { useLocation } from "react-router-dom";
import { useDataBackground } from "@/shared/hooks/useDataBackground";
import useCollapse from "@/shared/hooks/useCollapse";
import useImageHoverEffects from "@/shared/utils/ImageHoverEffects";
import RevealTextEffect from "@/shared/effects/RevealTextEffect";
import ScrollMoveUpEffect from "@/shared/effects/ScrollMoveUpEffect";
import FadeAnimEffect from "@/shared/effects/FadeAnimEffect";
import ScaleImageScrollEffect from "@/shared/effects/ScaleImageScrollEffect";
import CarouselTickerEffect from "@/shared/effects/CarouselTickerEffect";
import RevealOnScroll from "@/shared/effects/RevealOnScroll";

/**
 * Scroll effects, remounted per route so freshly rendered DOM gets initialized.
 *
 * Only effects whose selectors actually appear on one of this site's five pages
 * are mounted. The theme shipped 27; the other 22 targeted demo markup that no
 * longer exists and were registering ScrollTriggers against nothing on every
 * navigation.
 */
export default function GlobalEffects() {
  const key = useLocation().pathname;

  useDataBackground();
  useCollapse();
  useImageHoverEffects();

  return (
    <>
      <RevealTextEffect key={`reveal-${key}`} />
      <ScrollMoveUpEffect key={`move-${key}`} />
      <FadeAnimEffect key={`fade-${key}`} />
      <ScaleImageScrollEffect key={`scale-img-${key}`} />
      <CarouselTickerEffect key={`carousel-ticker-${key}`} />
      <RevealOnScroll key={`reveal-scroll-${key}`} />
    </>
  );
}
