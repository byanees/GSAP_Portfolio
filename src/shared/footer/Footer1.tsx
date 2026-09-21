import { Link } from "react-router-dom";
import RevealText from "@/shared/effects/RevealText";
import Logo from "@/shared/Logo";
import { ELSEWHERE, PROFILE } from "@/data/profile";

const SOCIAL_ARROW = (
  <svg xmlns="http://www.w3.org/2000/svg" width="9" height="10" viewBox="0 0 9 10" fill="none" aria-hidden="true">
    <path
      d="M5.62494 9.99994L0.562517 10L0.5625 8.75003L4.49994 8.74996L4.5 2.39273L2.27828 4.86124L1.48278 3.97739L5.0625 0L8.64225 3.97739L7.84676 4.86124L5.625 2.3927L5.62494 9.99994Z"
      fill="currentColor"
    />
  </svg>
);

const SOCIAL_LINKS = [
  { label: "LinkedIn", href: PROFILE.linkedin },
] as const;



const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
] as const;


export default function Footer1() {
  return (
    <footer className="container-2200">
      <div className="at-footer-area mp-footer-style pt-60 bg-neutral-950 rounded-5 mx-lg-3 mx-2 changeless">
        <div className="container">
          <div className="row g-5">
            <div className="col-xxl-4 col-lg-6">
              <div className="d-flex flex-wrap align-items-start gap-4">
                <Link to="/" className="mt-5 text-decoration-none">
                  <Logo tone="light" size="lg" />
                </Link>
                <div>
                  <h3 className="h4 text-white reveal-text">
                    <RevealText>
                      Let&apos;s Build <br />
                      What Scales
                    </RevealText>
                  </h3>
                  <p className="footer-tagline mb-0">
                    Full stack engineering, fintech solutions, <br />
                    and scalable systems built with modern tools.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-xxl-3 col-lg-5 col-md-8 ms-lg-auto text-lg-end">
              <div className="at-footer-title-wrap">
                <p className="h6 text-white mb-0">
                  <a href="tel:+923390004208" className="text-white">+92 339 000 4208</a>
                </p>
                <p className="h4 text-white text-decoration-underline footer-email mb-0">
                  <a href={`mailto:${PROFILE.email}`} className="text-white text-decoration-underline">
                    {PROFILE.email}
                  </a>
                </p>
                <div className="at-footer-widget at-footer-link pt-50">
                  <div className="at-hero-social justify-content-lg-end">
                    {SOCIAL_LINKS.map(({ label, href }) => (
                      <a
                        key={label}
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {label}
                        {SOCIAL_ARROW}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="at-about pt-100 pb-60 p-relative">
            <div className="row align-items-end g-5">
              <div className="col-xxl-3 col-lg-4 col-md-6">
                <div className="at-footer-widget alt-footer-link-item-wrap row">
                  <span className="d-block fz-font-label neutral-0 opacity-50 text-uppercase mb-3">Navigation</span>
                  <div className="alt-footer-link-item col-6">
                    <ul>
                      {NAV_LINKS.map(({ label, href }) => (
                        <li key={label} className="mb-15">
                          <Link to={href}>{label}</Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="alt-footer-link-item col-6">
                    <ul>
                      {ELSEWHERE.map(({ label, href, download }) => (
                        <li key={label} className="mb-15">
                          <a href={href} {...(download ? { download: true } : { target: "_blank", rel: "noopener noreferrer" })}>
                            {label}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
              <div className="col-xxl-9 col-lg-8 col-12 text-lg-end">
                <p className="fz-160 common-white mb-0 text-scale-anim" aria-hidden="true">
                  Muhammad Anees
                </p>
              </div>
            </div>
          </div>

          <div className="at-footer-copyright-area at-about-border pt-40 pb-40">
            <div className="row align-items-center g-3">
              <div className="col-lg-6">
                <div className="at-footer-copyright-wrap text">
                  <span className="at-footer-copyright">Muhammad Anees © 2026</span>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="at-footer-copyright-wrap text-lg-end">
                  <span className="at-footer-copyright">Building since 2023</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-neutral-0 pt-10" />
    </footer>
  );
}

