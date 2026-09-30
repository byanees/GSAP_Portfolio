import { Outlet } from "react-router-dom";
import { useRef } from "react";
import SiteHeader from "@/shared/header/SiteHeader";
import Footer1 from "@/shared/footer/Footer1";
import Footer2 from "@/shared/footer/Footer2";
import GlobalEffects from "@/shared/effects/GlobalEffects";
import ThemeRouteSync from "@/shared/effects/ThemeRouteSync";
import BackToTop from "@/shared/elements/BackToTop";
import ContactDock from "@/shared/elements/ContactDock";
import FooterRevealEffect from "@/shared/effects/FooterRevealEffect";

type FooterProps = { ref?: React.Ref<HTMLElement> };

const FOOTER_COMPONENTS: Record<number, React.ComponentType<FooterProps>> = {
  1: Footer1,
  2: Footer2,
};

export type MainLayoutProps = {
  footerStyle?: number;
  noFooter?: boolean;
  mainClass?: string;
};

export default function MainLayout({ footerStyle = 1, noFooter = false, mainClass = "bg-neutral-0" }: MainLayoutProps) {
  const footerRef = useRef<HTMLElement | null>(null);
  const FooterComponent = FOOTER_COMPONENTS[footerStyle] ?? Footer1;
  const isFooterFloating = footerStyle === 2;

  return (
    <>
      <div className="px-blur-bottom" />
      <FooterRevealEffect />
      <GlobalEffects />
      <ThemeRouteSync />
      <SiteHeader />

      <div id="smooth-wrapper">
        <div id="smooth-content" className="z-index-3">
          <main id="main-content" tabIndex={-1} className={mainClass}>
            <Outlet />
          </main>
          {!noFooter && isFooterFloating ? <div className="footer-placeholder" aria-hidden="true" /> : null}
          {!noFooter && !isFooterFloating ? <FooterComponent /> : null}
        </div>
        {!noFooter && isFooterFloating ? <Footer2 ref={footerRef} /> : null}
      </div>

      <BackToTop />
      <ContactDock />
    </>
  );
}
