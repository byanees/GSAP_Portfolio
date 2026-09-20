import { forwardRef } from "react";
import { Link } from "react-router-dom";
import Logo from "@/shared/Logo";
import { ELSEWHERE } from "@/data/profile";

const SOCIAL_ARROW = (
  <svg xmlns="http://www.w3.org/2000/svg" width="9" height="10" viewBox="0 0 9 10" fill="none" aria-hidden="true">
    <path
      d="M5.62494 9.99994L0.562517 10L0.5625 8.75003L4.49994 8.74996L4.5 2.39273L2.27828 4.86124L1.48278 3.97739L5.0625 0L8.64225 3.97739L7.84676 4.86124L5.625 2.3927L5.62494 9.99994Z"
      fill="currentColor"
    />
  </svg>
);

const Footer2 = forwardRef<HTMLElement, object>(function Footer2(_, ref) {
  return (
    <footer ref={ref} className="footer-fixed-bottom bg-neutral-950 changeless">
      <div className="at-footer-area mp-footer-style mp-footer-style-2 pt-120 pb-0">
        <div className="container">
          <div className="row g-5 pb-md-5 pb-2">
            <div className="col-lg-4">
              <div className="d-flex flex-wrap align-items-start gap-5">
                <div className="at-header-logo">
                  <Link to="/" className="text-decoration-none d-inline-flex align-items-center">
                    <Logo tone="light" />
                  </Link>
                </div>
                <div className="d-flex flex-column gap-3">
                  <p className="h6 text-white mb-2 fw-medium">
                    <a href="tel:+923390004208" className="text-white text-decoration-none">+92 339 000 4208</a>
                  </p>
                  <p className="h6 text-white mb-2 footer-email">
                    <a href="mailto:aneese421@gmail.com" className="text-white text-decoration-none">
                      aneese421@gmail.com
                    </a>
                  </p>
                  <p className="h6 text-white mb-0">Islamabad, Pakistan</p>
                </div>
              </div>
            </div>

            <div className="col-lg-4 col-md-6 mx-auto">
              <div className="at-footer-widget alt-footer-link-item-wrap row">
                <div className="alt-footer-link-item col-6">
                  <ul>
                    <li className="mb-15">
                      <Link to="/">Home</Link>
                    </li>
                    <li className="mb-15">
                      <Link to="/about">About</Link>
                    </li>
                    <li className="mb-15">
                      <Link to="/portfolio">Portfolio</Link>
                    </li>
                    <li className="mb-15">
                      <Link to="/blog">Blog</Link>
                    </li>
                    <li className="mb-15">
                      <Link to="/contact">Contact</Link>
                    </li>
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

            <div className="col-lg-3 col-md-6 flex-column justify-content-lg-end d-none d-md-flex">
              <p className="footer-2-follow-label text-white opacity-50 text-uppercase small mb-3">Status</p>
              <p className="footer-status mb-3">
                <span className="contact-status__dot" aria-hidden />
                Open to full stack &amp; backend roles
              </p>
              <div className="at-footer-widget at-footer-link">
                <div className="at-hero-social">
                  <Link to="/contact">
                    Start a conversation {SOCIAL_ARROW}
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="footer-2-border pt-40 pb-40">
            <div className="row align-items-end g-4">
              <div className="col-lg-10 col-md-8">
                <span className="at-footer-copyright">Muhammad Anees © 2026</span>
                <div className="at-title-anim overflow-hidden">
                  <h2 className="footer-2-connect-title text-white mb-0 at-title-text text-scale-anim">Let&apos;s Connect</h2>
                </div>
              </div>
              <div className="col-lg-2 col-md-4 text-end">
                <div className="d-flex flex-wrap align-items-end gap-4 gap-md-5 mb-3">
                  <div className="footer-2-hours text-white">
                    <span className="d-block fz-font-md opacity-50">Since</span>
                    <h5 className="fw-400 common-white">2023</h5>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
});

export default Footer2;

