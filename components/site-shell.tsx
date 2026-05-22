import Link from "next/link";
import { BookOpenText, Leaf } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

const navItems = [
  { href: "#ruth-preview", label: "Ruth" },
  { href: "#foundation", label: "Foundation" },
  { href: "#source", label: "Source" },
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
              <a key={item.href} href={item.href} className="site-nav__link">
                {item.label}
              </a>
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
            <span>Ruth-first, editorially approved, small on purpose.</span>
          </div>
          <p>
            Scripture text import and WEB attribution arrive in Phase 2. No
            public AI, generic search, or whole-Bible graph is active here.
          </p>
        </div>
      </footer>
    </div>
  );
}
