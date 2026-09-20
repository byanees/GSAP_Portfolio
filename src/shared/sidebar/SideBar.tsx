import { Link } from "react-router-dom";
import Logo from "@/shared/Logo";
import { PROFILE } from "@/data/profile";
import { OffcanvasMenuMount } from "@/shared/mobile-menu/MobileMenuCloneContext";
import MenuClone from "@/shared/mobile-menu/MenuClone";

interface SideBarProps {
  open: boolean;
  hamburgerOpen: boolean;
  onClose: () => void;
}

function CloseIconSvg() {
  return (
    <svg width="37" height="38" viewBox="0 0 37 38" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path
        d="M9.19141 9.80762L27.5762 28.1924"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.19141 28.1924L27.5762 9.80761"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

type SocialLink = { label: string; href: string; ariaLabel: string; path: string; h?: number; viewBox?: string };

const socialLinks: SocialLink[] = [
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/ianees/",
    ariaLabel: "LinkedIn",
    path: "M16.2 0H1.8C0.81 0 0 0.81 0 1.8V16.2C0 17.19 0.81 18 1.8 18H16.2C17.19 18 18 17.19 18 16.2V1.8C18 0.81 17.19 0 16.2 0ZM5.4 15.3H2.7V7.2H5.4V15.3ZM4.05 5.85C3.15 5.85 2.43 5.13 2.43 4.23C2.43 3.33 3.15 2.61 4.05 2.61C4.95 2.61 5.67 3.33 5.67 4.23C5.67 5.13 4.95 5.85 4.05 5.85ZM15.3 15.3H12.6V11.07C12.6 9.99 12.58 8.61 11.1 8.61C9.6 8.61 9.38 9.77 9.38 10.99V15.3H6.68V7.2H9.26V8.46H9.3C9.66 7.74 10.6 6.98 12 6.98C14.73 6.98 15.3 8.79 15.3 11.16V15.3Z",
  },
  {
    label: "GitHub",
    href: PROFILE.github,
    ariaLabel: "GitHub",
    path: "M9 0C4.0275 0 0 4.13211 0 9.22838C0 13.3065 2.5785 16.7648 6.1545 17.9841C6.6045 18.0709 6.7695 17.7853 6.7695 17.5403C6.7695 17.3212 6.761 16.7405 6.7565 15.9712C4.254 16.5277 3.726 14.7344 3.726 14.7344C3.3165 13.6707 2.727 13.3871 2.727 13.3871C1.9089 12.8128 2.7885 12.8243 2.7885 12.8243C3.6915 12.8898 4.1665 13.7737 4.1665 13.7737C4.969 15.1847 6.273 14.7771 6.7875 14.5414C6.8685 13.9439 7.1005 13.5363 7.3575 13.3065C5.3595 13.0767 3.258 12.2844 3.258 8.74701C3.258 7.73862 3.609 6.91395 4.1845 6.26588C4.0905 6.03388 3.7725 5.09562 4.2735 3.83068C4.2735 3.83068 5.028 3.58455 6.7475 4.77449C7.4715 4.57032 8.2395 4.46859 9.0035 4.46492C9.7635 4.46859 10.5315 4.57032 11.2595 4.77449C12.975 3.58455 13.7265 3.83068 13.7265 3.83068C14.2305 5.09562 13.9125 6.03388 13.8185 6.26588C14.397 6.91395 14.7435 7.73862 14.7435 8.74701C14.7435 12.2936 12.639 13.0722 10.6335 13.2989C10.9545 13.5824 11.2425 14.1438 11.2425 14.9998C11.2425 16.2267 11.2305 17.2134 11.2305 17.5403C11.2305 17.7876 11.3925 18.0755 11.8505 17.9826C15.4237 16.7612 18 13.3042 18 9.22838C18 4.13211 13.9703 0 9 0Z",
  },
] satisfies { label: string; href: string; ariaLabel: string; path: string; viewBox?: string; h?: number }[];

function SocialGrid() {
  return (
    <ul className="at-offcanvas-social__grid">
      {socialLinks.map((item) => (
        <li key={item.label}>
          <a
            href={item.href}
            className="at-offcanvas-social__link"
            aria-label={item.ariaLabel}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height={item.h ?? 18}
              viewBox={item.viewBox ?? "0 0 18 18"}
              fill="none"
              aria-hidden="true"
            >
              <path fillRule="evenodd" clipRule="evenodd" d={item.path} fill="currentColor" />
            </svg>
            <span>{item.label}</span>
          </a>
        </li>
      ))}
    </ul>
  );
}

export default function SideBar({ open, hamburgerOpen, onClose }: SideBarProps) {
  const isAnyOpen = open || hamburgerOpen;

  return (
    <OffcanvasMenuMount>
      <MenuClone />
      {/* Overlay */}
      <div
        className={`body-overlay sidebar-overlay ${isAnyOpen ? "apply" : ""}`}
        aria-hidden={!isAnyOpen}
        inert={!isAnyOpen}
        onClick={onClose}
        onKeyDown={(e) => e.key === "Escape" && onClose()}
        role="button"
        tabIndex={0}
        aria-label="Close sidebar"
      />

      {/* at-offcanvas-area */}
      <div className="at-offcanvas-area" aria-hidden={!open} inert={!open}>
        <div className={`at-offcanvas ${open ? "opened" : ""}`}>
          <div className="at-offcanvas-top d-flex align-items-center justify-content-between">
            <div className="at-offcanvas-logo">
              <Link to="/" className="text-decoration-none d-inline-flex align-items-center">
                <Logo />
              </Link>
            </div>
            <div className="at-offcanvas-close-btn">
              <button type="button" className="close-btn close-sidebar" aria-label="Close" onClick={onClose}>
                <CloseIconSvg />
              </button>
            </div>
          </div>

          <div className="at-offcanvas-content d-none d-xl-block">
            <h3 className="at-offcanvas-title">Hey there!</h3>
            <p className="fz-font-lg">
              I build full stack applications, fintech solutions, and scalable systems - helping businesses operate faster and grow with confidence.
            </p>
          </div>

          <div className="at-offcanvas-menu d-xl-none pb-50">
            <nav />
          </div>

          <div className="at-offcanvas-contact">
            <h5 className="at-offcanvas-title sm">Get in touch</h5>
            <ul>
              <li>
                <a className="fz-font-lg" href="tel:+923390004208">
                  +923390004208
                </a>
              </li>
              <li>
                <a className="fz-font-lg" href={`mailto:${PROFILE.email}`}>
                  {PROFILE.email}
                </a>
              </li>
              <li>
                <a className="fz-font-lg" href="#" onClick={(e) => e.preventDefault()}>
                  Islamabad, <br />
                  Pakistan
                </a>
              </li>
              <li>
                <a className="fz-font-lg text-decoration-underline" href="/assets/cv/Muhammad-Anees-Full-Stack-Engineer-CV.pdf" download>
                  Download CV
                </a>
              </li>
            </ul>
          </div>

          <div className="at-offcanvas-social">
            <h3 className="at-offcanvas-title sm">Follow Me</h3>
            <SocialGrid />
          </div>
        </div>
      </div>

      {/* at-offcanvas-2-area */}
      <div className={`at-offcanvas-2-area ${hamburgerOpen ? "menu-open" : ""}`} aria-hidden={!hamburgerOpen} inert={!hamburgerOpen}>
        <div className="offcanvas-bg" />
        <div className="at-offcanvas-2-wrapper offcanvas-menu sidebar-left">
          <div className="at-offcanvas-2-left">
            <div className="at-header-logo d-flex justify-content-between align-items-center mb-50">
              <Link to="/" className="text-decoration-none d-inline-flex align-items-center">
                <Logo />
              </Link>
              <span className="hamburger-close-btn close-sidebar" role="button" tabIndex={0} aria-label="Close" onClick={onClose}>
                <CloseIconSvg />
              </span>
            </div>

            <div className="at-offcanvas-menu counter-row">
              <nav />
            </div>

            <div className="at-offcanvas-social">
              <SocialGrid />
            </div>

            <span
              className="hamburger-close-btn hamburger-mobile-close-btn close-sidebar d-md-none"
              role="button"
              tabIndex={0}
              aria-label="Close"
              onClick={onClose}
            >
              CLOSE
            </span>
          </div>
        </div>
      </div>
    </OffcanvasMenuMount>
  );
}

