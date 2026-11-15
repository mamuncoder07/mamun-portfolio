import type { Metadata, Viewport } from "next";
import "@fontsource-variable/nunito";
import "@fontsource-variable/fredoka";
import "./globals.css";
import { SiteNav } from "@/components/site-nav";
import { Assistant } from "@/components/assistant";
import { portfolio } from "@/config/portfolio";
import { SocialFooter } from "@/components/social-footer";

const title = "Mamun Reja | AI/ML Engineer & Data Scientist";
const description = "Explore the projects, technical skills, and learning journey of Mamun Reja, an aspiring AI/ML Engineer and Data Science enthusiast.";
const metadataBase = portfolio.siteUrl ? new URL(portfolio.siteUrl) : undefined;

export const metadata: Metadata = {
  metadataBase,
  title: { default: title, template: "%s | Mamun Reja" },
  description,
  keywords: ["Mamun Reja", "artificial intelligence", "machine learning", "data science", "Python"],
  applicationName: "Mamun Reja Portfolio",
  openGraph: {
    type: "website",
    title,
    description,
    siteName: "Mamun Reja",
    ...(portfolio.siteUrl ? { url: portfolio.siteUrl, images: ["/og-image.svg"] } : {}),
  },
  twitter: {
    card: portfolio.siteUrl ? "summary_large_image" : "summary",
    title,
    description,
    ...(portfolio.siteUrl ? { images: ["/og-image.svg"] } : {}),
  },
  alternates: portfolio.siteUrl ? { canonical: portfolio.siteUrl } : undefined,
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
  robots: { index: Boolean(portfolio.siteUrl), follow: Boolean(portfolio.siteUrl) },
};

export const viewport: Viewport = { themeColor: "#ece7f8", colorScheme: "light", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <a className="skip-link" href="#main-content">Skip to content</a>
        <SiteNav />
        <main id="main-content">{children}</main>
        <footer className="site-footer">
          <SocialFooter />
          <div className="page-width footer-inner">
            <a className="footer-wordmark" href="#home" aria-label="Back to Mamun Reja's homepage"><span>MR<span>.</span></span></a>
            <span className="footer-credit">© {new Date().getFullYear()} Mamun Reja. All rights reserved.</span>
          </div>
        </footer>
        <Assistant />
      </body>
    </html>
  );
}
