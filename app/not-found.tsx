import type { Metadata } from "next";
import { ArrowLeft, CircleAlert } from "lucide-react";

export const metadata: Metadata = { title: "Page not found", robots: { index: false, follow: false } };
export default function NotFound() {
  return <section className="not-found page-width"><span className="eyebrow"><span className="eyebrow-dot" />Error 404</span><CircleAlert size={38} strokeWidth={1.2} /><h1>This page<br /><em>isn't here.</em></h1><p>The page you’re looking for doesn’t exist. Head back to the portfolio and continue exploring.</p><a className="button button-primary" href="/">Return to the portfolio <ArrowLeft size={16} /></a></section>;
}
