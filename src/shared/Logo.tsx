// Text wordmark used in headers, menus, and footers.

type LogoProps = {
  /** "dark" = dark text for light backgrounds, "light" = white text for dark backgrounds */
  tone?: "dark" | "light";
  size?: "md" | "lg";
  className?: string;
};

export default function Logo({ tone = "dark", size = "md", className = "" }: LogoProps) {
  return (
    <span className={`site-logo site-logo--${tone} site-logo--${size} ${className}`.trim()}>
      <span className="site-logo__mark" aria-hidden>
        MA
      </span>
      <span className="site-logo__name">Muhammad Anees</span>
    </span>
  );
}
