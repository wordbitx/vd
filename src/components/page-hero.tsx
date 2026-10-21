import Link from "next/link";
import type { ReactNode } from "react";

/**
 * The reference opens every interior page with a full-bleed band:
 * a breadcrumb, an optional pill eyebrow, a serif headline and one line of
 * supporting copy, all centred. Three surface variants are used across the
 * site — the teal gradient (Services, Team), the pale sage block (About) and
 * the deep ink block (Contact).
 */
export type HeroVariant = "gradient" | "sage" | "dark" | "plain";

export function PageHero({
  title,
  subtitle,
  eyebrow,
  crumb,
  variant = "gradient",
  children,
}: {
  title: ReactNode;
  subtitle?: ReactNode;
  eyebrow?: ReactNode;
  crumb?: string;
  variant?: HeroVariant;
  children?: ReactNode;
}) {
  return (
    <section className={`r-pagehero r-pagehero--${variant}`}>
      <div className="r-wrap">
        <div className="r-pagehero-inner r-pagehero-single">
          {crumb ? (
            <nav className="r-crumbs" aria-label="Breadcrumb">
              <Link href="/">Home</Link>
              <span aria-hidden="true">/</span>
              <b>{crumb}</b>
            </nav>
          ) : null}
          <div className="r-pagehero-copy">
            {eyebrow ? <span className="r-eyebrow">{eyebrow}</span> : null}
            <h1>{title}</h1>
            {subtitle ? <p>{subtitle}</p> : null}
            {children}
          </div>
        </div>
      </div>
    </section>
  );
}
