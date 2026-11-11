import type { Metadata, Viewport } from "next";
import "./globals.css";
import { siteUrl, withBase } from "@/lib/seo";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Director Salary vs Dividend Planner 2026/27 — DrawDesk",
    template: "%s — DrawDesk",
  },
  description:
    "Find the best salary, dividend and pension mix for your limited company. 2025/26 and 2026/27 rates, a one-off extraction plan, and every rate sourced. Free, no signup.",
  applicationName: "DrawDesk",
  authors: [{ name: "DrawDesk" }],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: "DrawDesk",
    title: "Director Salary vs Dividend Planner 2026/27 — DrawDesk",
    description:
      "The best salary, dividend and pension mix for your profit — this year and the next few. Free, no signup.",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "DrawDesk — director pay planner" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Director Salary vs Dividend Planner 2026/27 — DrawDesk",
    description: "Find your best salary and dividend mix. Free, no signup.",
    images: ["/og.png"],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#0E5F52",
  width: "device-width",
  initialScale: 1,
};

const organization = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "DrawDesk",
  url: siteUrl,
  logo: `${siteUrl}/icon.svg`,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB">
      <body>
        <a className="skip" href="#main">
          Skip to content
        </a>
        <header className="site-header">
          <a className="brand" href={withBase("/")} aria-label="DrawDesk home">
            <svg className="brand-mark" viewBox="0 0 24 24" width="26" height="26" aria-hidden="true">
              <rect x="2" y="2" width="20" height="20" rx="5" fill="none" stroke="currentColor" strokeWidth="2.4" />
              <path d="M12 2h3.6A4.4 4.4 0 0 1 20 6.4V12h-8z" fill="var(--accent)" />
            </svg>
            <span className="brand-name">
              Draw<span>Desk</span>
            </span>
          </a>
          <nav aria-label="Main">
            <a href={withBase("/methodology/")}>Methodology</a>
            <a href="#faq">FAQ</a>
          </nav>
        </header>
        <main id="main">{children}</main>
        <footer className="site-footer">
          <div>
            <p className="footer-brand">DrawDesk</p>
            <p className="footer-note">
              General information, not tax advice. Rates checked 11 November 2026
              against GOV.UK. England, Wales and Northern Ireland only.
            </p>
          </div>
          <div className="footer-links">
            <a href={withBase("/methodology/")}>Methodology and sources</a>
            <a href={withBase("/take-home/")}>Take-home by profit</a>
            <a href="#faq">FAQ</a>
            <p>© 2026 DrawDesk</p>
          </div>
        </footer>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organization) }}
        />
      </body>
    </html>
  );
}
