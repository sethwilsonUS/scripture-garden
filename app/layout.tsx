import type { Metadata } from "next";
import type { Viewport } from "next";
import { DM_Sans, Fraunces, JetBrains_Mono } from "next/font/google";
import { SiteShell } from "@/components/site-shell";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-display-source",
  subsets: ["latin"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-body-source",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono-source",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Scripture Garden",
    template: "%s | Scripture Garden",
  },
  description:
    "A Ruth-first semantic Scripture exploration environment built for calm, accessible traversal.",
  applicationName: "Scripture Garden",
  authors: [{ name: "Seth Wilson" }],
  metadataBase: new URL("https://scripture-garden-liard.vercel.app"),
};

export const viewport: Viewport = {
  colorScheme: "light dark",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f7f6f3" },
    { media: "(prefers-color-scheme: dark)", color: "#171717" },
  ],
};

const themeInitScript = `
(function() {
  try {
    var storageKey = "scripture-garden-theme";
    var stored = localStorage.getItem(storageKey);
    var prefersLight = window.matchMedia("(prefers-color-scheme: light)").matches;
    var theme = stored === "light" || stored === "dark" ? stored : prefersLight ? "light" : "dark";
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(theme);
    document.documentElement.style.colorScheme = theme;
  } catch (error) {
    document.documentElement.classList.add("dark");
    document.documentElement.style.colorScheme = "dark";
  }
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      suppressHydrationWarning
      className={`${fraunces.variable} ${dmSans.variable} ${jetbrainsMono.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body>
        <ThemeProvider>
          <SiteShell>{children}</SiteShell>
        </ThemeProvider>
      </body>
    </html>
  );
}
