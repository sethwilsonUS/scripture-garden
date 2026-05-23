import Link from "next/link";
import { BookOpenText, Leaf } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

const navItems = [
  { href: "/ruth", label: "Ruth" },
  { href: "/ruth/1", label: "Read" },
  { href: "/admin", label: "Gardeners" },
];

export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="site-shell">
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>

      <header className="site-header">
        <div className="site-header__inner">
          <Link href="/" className="brand-lockup" aria-label="Scripture Garden home">
            <span className="brand-lockup__mark" aria-hidden="true">
              <Leaf className="size-4" />
            </span>
            <span className="brand-lockup__text">Scripture Garden</span>
          </Link>

          <nav className="site-nav" aria-label="Main navigation">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} className="site-nav__link">
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="site-actions" aria-label="Display controls">
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main id="main-content" className="site-main" tabIndex={-1}>
        {children}
      </main>

      <footer className="site-footer">
        <div className="site-footer__inner">
          <div className="site-footer__brand">
            <BookOpenText aria-hidden="true" className="size-4" />
            <span>A quiet place to read Ruth slowly.</span>
          </div>
          <p>
            Scripture text is from the World English Bible, public domain,
            imported from eBible.org.
          </p>
        </div>
      </footer>
    </div>
  );
}
