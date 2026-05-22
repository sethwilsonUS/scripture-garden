import { readFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();

const checks = [
  {
    name: "layout sets document language",
    file: "app/layout.tsx",
    pattern: /lang="en"/,
  },
  {
    name: "layout suppresses theme hydration mismatch",
    file: "app/layout.tsx",
    pattern: /suppressHydrationWarning/,
  },
  {
    name: "shell has skip link",
    file: "components/site-shell.tsx",
    pattern: /className="skip-link"/,
  },
  {
    name: "shell has labeled navigation",
    file: "components/site-shell.tsx",
    pattern: /<nav[^>]+aria-label="Main navigation"/,
  },
  {
    name: "shell has main content target",
    file: "components/site-shell.tsx",
    pattern: /<main[^>]+id="main-content"[^>]+tabIndex=\{-1\}/,
  },
  {
    name: "theme toggle has accessible name",
    file: "components/theme-toggle.tsx",
    pattern: /aria-label="Toggle color theme"/,
  },
  {
    name: "status banner uses live roles",
    file: "components/ui/status-banner.tsx",
    pattern: /role=\{role\}/,
  },
  {
    name: "global CSS keeps visible focus",
    file: "app/globals.css",
    pattern: /:focus-visible\s*\{[\s\S]*outline:\s*3px solid var\(--accent\)/,
  },
  {
    name: "global CSS includes screen-reader utility",
    file: "app/globals.css",
    pattern: /\.sr-only\s*\{/,
  },
  {
    name: "global CSS honors reduced motion",
    file: "app/globals.css",
    pattern: /prefers-reduced-motion:\s*reduce/,
  },
];

const failures = [];

for (const check of checks) {
  const source = readFileSync(join(root, check.file), "utf8");
  const passed = check.pattern.test(source);
  console.log(`${passed ? "PASS" : "FAIL"} ${check.name}`);

  if (!passed) {
    failures.push(`${check.name} (${check.file})`);
  }
}

if (failures.length > 0) {
  console.error(`Accessibility smoke check failed:\n- ${failures.join("\n- ")}`);
  process.exit(1);
}
