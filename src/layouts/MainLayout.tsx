import { Outlet } from "react-router-dom";
import { useEffect, useMemo, useRef, useState } from "react";
import Header1 from "@/shared/header/Header1";
import Header2 from "@/shared/header/Header2";
import Footer1 from "@/shared/footer/Footer1";
import Footer2 from "@/shared/footer/Footer2";
import SideBar from "@/shared/sidebar/SideBar";
import { MobileMenuCloneProvider } from "@/shared/mobile-menu/MobileMenuCloneContext";
import GlobalEffects from "@/shared/effects/GlobalEffects";
import ThemeRouteSync from "@/shared/effects/ThemeRouteSync";
import BackToTop from "@/shared/elements/BackToTop";
import ContactDock from "@/shared/elements/ContactDock";
import FooterRevealEffect from "@/shared/effects/FooterRevealEffect";

type HeaderHandlers = {
  onToggleSidebar?: () => void;
  onOpenHamburgerMenu?: () => void;
  style?: string;
};

const HEADER_COMPONENTS: Record<number, React.ComponentType<HeaderHandlers>> = {
  1: Header1,
  2: Header2,
};

type FooterProps = { ref?: React.Ref<HTMLElement> };

const FOOTER_COMPONENTS: Record<number, React.ComponentType<FooterProps>> = {
  1: Footer1,
  2: Footer2,
};

export type MainLayoutProps = {
  headerStyle?: number;
  footerStyle?: number;
  noFooter?: boolean;
  mainClass?: string;
  headerProps?: { style?: string };
};

export default function MainLayout({
  headerStyle = 1,
  footerStyle = 1,
  noFooter = false,
  mainClass = "bg-neutral-0",
  headerProps,
}: MainLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [hamburgerMenuOpen, setHamburgerMenuOpen] = useState(false);
  const footerRef = useRef<HTMLElement | null>(null);

  const handlers = useMemo(
    () => ({
      toggleSidebar: () => setSidebarOpen((v) => !v),
      openSidebar: () => setSidebarOpen(true),
      closeSidebar: () => setSidebarOpen(false),
      openHamburgerMenu: () => setHamburgerMenuOpen(true),
      closeHamburgerMenu: () => setHamburgerMenuOpen(false),
      closeAllMenus: () => {
        setSidebarOpen(false);
        setHamburgerMenuOpen(false);
      },
    }),
    [],
  );

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSidebarOpen(false);
        setHamburgerMenuOpen(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  // Bridge DOM class triggers (used by Header4-15 ported from Next.js) to MainLayout state.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const t = e.target as Element | null;
      if (!t) return;
      if (t.closest(".at-header-sidebar-btn, .navbar-toggler, .at-menu-bar")) {
        e.preventDefault();
        setSidebarOpen(true);
        return;
      }
      if (t.closest(".at-header-menu-btn")) {
        e.preventDefault();
        const btn = (t.closest(".at-header-menu-btn") as HTMLElement) ?? null;
        const header = btn?.closest("header");
        if (header) {
          const isOpen = header.classList.contains("is-menu-open");
          header.classList.toggle("is-menu-open", !isOpen);
          btn?.setAttribute("aria-expanded", String(!isOpen));
        }
      }
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  // Flags the header once the page has scrolled, so it can lift off the content.
  useEffect(() => {
    const header = document.querySelector("header");
    if (!header) return;
    const onScroll = () => {
      header.classList.toggle("is-stuck", (window.scrollY ?? window.pageYOffset) >= 20);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const HeaderComponent = HEADER_COMPONENTS[headerStyle] ?? Header1;
  const FooterComponent = FOOTER_COMPONENTS[footerStyle] ?? Footer1;
  const isFooterFloating = footerStyle === 2;

  return (
    <MobileMenuCloneProvider>
      <div className="px-blur-bottom" />
      <FooterRevealEffect />
      <GlobalEffects />
      <ThemeRouteSync />
      <HeaderComponent
        {...(headerProps ?? {})}
        onToggleSidebar={handlers.toggleSidebar}
        onOpenHamburgerMenu={handlers.openHamburgerMenu}
      />
      <SideBar open={sidebarOpen} hamburgerOpen={hamburgerMenuOpen} onClose={handlers.closeAllMenus} />

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
    </MobileMenuCloneProvider>
  );
}
